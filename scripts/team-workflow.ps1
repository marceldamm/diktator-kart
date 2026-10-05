param(
    [ValidateSet('Status', 'Start', 'Checkpoint', 'Finish')][string]$Action = 'Status',
    [string]$Owner = '',
    [string]$ProjectRoot = '',
    [switch]$AsJson
)
$ErrorActionPreference = 'Stop'
if (-not $ProjectRoot) { $ProjectRoot = Split-Path -Parent $PSScriptRoot }
$projectPath = (Resolve-Path -LiteralPath $ProjectRoot).Path
Set-Location -LiteralPath $projectPath

function GitResult([string[]]$GitArgs) {
    $previousPreference = $ErrorActionPreference
    $ErrorActionPreference = 'Continue'
    try {
        $lines = @(& git.exe -C $projectPath @GitArgs 2>&1)
        $code = $LASTEXITCODE
    } finally { $ErrorActionPreference = $previousPreference }
    return [pscustomobject]@{ Code = $code; Text = ($lines | ForEach-Object { $_.ToString() }) -join "`n" }
}
function Git([string[]]$GitArgs) {
    $result = GitResult $GitArgs
    if ($result.Code -ne 0) { throw "git $($GitArgs[0]) failed: $($result.Text)" }
    return $result.Text
}
function Ancestor([string]$Before, [string]$After) {
    $result = GitResult @('merge-base', '--is-ancestor', $Before, $After)
    if ($result.Code -gt 1) { throw $result.Text }
    return $result.Code -eq 0
}
function ReadState([string]$Ref) {
    $result = GitResult @('show', ($Ref + ':project-state.json'))
    if ($result.Code -ne 0) { return $null }
    return $result.Text | ConvertFrom-Json
}
function NewArchive([string]$Ref, [string]$Reason) {
    $name = "archive/local-$Reason-$ownerSlug-$stamp"
    $null = Git @('branch', $name, $Ref)
    Write-Host "Lokale Sicherung: $name"
    return $name
}
function EnsureDependencies {
    if (-not (Test-Path -LiteralPath 'package-lock.json')) { return }
    $hash = (Get-FileHash -LiteralPath 'package-lock.json' -Algorithm SHA256).Hash
    $saved = if (Test-Path -LiteralPath '.tools/dependency-lock.sha256') { (Get-Content '.tools/dependency-lock.sha256' -Raw).Trim() } else { '' }
    if (-not (Test-Path -LiteralPath 'node_modules') -or $saved -ne $hash) {
        & npm.cmd ci
        if ($LASTEXITCODE -ne 0) { throw 'npm ci failed; no publication.' }
        $null = New-Item -ItemType Directory -Force -Path '.tools'
        Set-Content -LiteralPath '.tools/dependency-lock.sha256' -Value $hash -Encoding ASCII
    }
}
function ShowWorkLists {
    $activeState = ReadState 'HEAD'
    if (-not $activeState.teamLists) { return } # Older marker/isolated fixtures remain compatible.
    $required = @('CURRENT-WORKLIST.md', 'LONG-TERM-GOALS.md', 'TEAM-CHANGES.md', 'TEAM-NOTES.md')
    foreach ($file in $required) {
        if ($activeState.teamLists -notcontains $file -or -not (Test-Path -LiteralPath $file -PathType Leaf)) {
            throw "Gemeinsame Arbeitsdatei fehlt: $file. Codex muss die aktuelle Wissensbasis wiederherstellen; kein Abschluss."
        }
    }
    Write-Host 'Gemeinsame Arbeitsdateien: CURRENT-WORKLIST.md / LONG-TERM-GOALS.md / TEAM-CHANGES.md / TEAM-NOTES.md.'
    Write-Host 'Codex: diese vier Dateien als App-Tabs oeffnen und lesen, Status/Naechstes aktualisieren; technische Belege nur in PROGRESS-LOG.md.'
}

try {
    $top = Git @('rev-parse', '--show-toplevel')
    if ([IO.Path]::GetFullPath($top).TrimEnd('\', '/') -ne $projectPath.TrimEnd('\', '/')) { throw 'Open the repository root, not an archive/subdirectory.' }
    foreach ($operation in @('MERGE_HEAD', 'rebase-merge', 'rebase-apply', 'CHERRY_PICK_HEAD')) {
        $operationPath = Git @('rev-parse', '--git-path', $operation)
        if (Test-Path -LiteralPath $operationPath) { throw "An unfinished Git operation exists ($operation). Ask Codex to finish it first." }
    }
    $null = Git @('fetch', 'origin', '--prune')
    $remoteState = ReadState 'origin/main'
    if (-not $remoteState -or $remoteState.projectId -ne 'diktator-kart-babylon' -or $remoteState.engine -ne 'babylonjs') {
        throw 'origin/main is not the new Babylon project. No migration/publication performed.'
    }
    if ((Git @('remote', 'get-url', 'origin')) -ne $remoteState.repositoryUrl) { throw 'origin differs from the documented repository. Ask Codex to verify the target.' }
    if (-not (Ancestor $remoteState.minimumSourceCommit 'origin/main')) { throw 'Remote main is missing the required Claude/Babylon foundation.' }
    $branch = Git @('branch', '--show-current')
    $head = Git @('rev-parse', 'HEAD')
    $remote = Git @('rev-parse', 'origin/main')
    $dirty = Git @('status', '--porcelain')
    $localState = ReadState 'HEAD'
    $isNew = $localState -and $localState.projectId -eq $remoteState.projectId -and $localState.engine -eq 'babylonjs' -and (Ancestor $remoteState.minimumSourceCommit 'HEAD')
    $baseResult = GitResult @('merge-base', 'HEAD', 'origin/main')
    $base = if ($baseResult.Code -eq 0) { $baseResult.Text } else { '' }
    $localFiles = @(); $remoteFiles = @(); $overlap = @()
    if ($base) {
        $localFiles = @((Git @('diff', '--name-only', "$base..HEAD")) -split "`n" | Where-Object { $_ })
        $localFiles = @($localFiles + @((Git @('diff', '--name-only', 'HEAD')) -split "`n" | Where-Object { $_ }) + @((Git @('ls-files', '--others', '--exclude-standard')) -split "`n" | Where-Object { $_ }) | Select-Object -Unique)
        $remoteFiles = @((Git @('diff', '--name-only', "$base..origin/main")) -split "`n" | Where-Object { $_ })
        $overlap = @($localFiles | Where-Object { $remoteFiles -contains $_ })
    }
    $report = [ordered]@{ action = $Action; root = $projectPath; branch = $branch; head = $head; remoteMain = $remote; currentBabylon = [bool]$isNew; dirty = [bool]$dirty; localFiles = $localFiles; remoteFiles = $remoteFiles; overlappingFiles = $overlap }
    $null = New-Item -ItemType Directory -Force -Path '.tools'
    $report | ConvertTo-Json -Depth 5 | Set-Content -LiteralPath '.tools/team-status.json' -Encoding UTF8
    if ($AsJson) { $report | ConvertTo-Json -Depth 5 } else {
        Write-Host "Branch: $branch | Lokal: $($head.Substring(0,7)) | GitHub main: $($remote.Substring(0,7))"
        Write-Host "Neue Babylon-Basis: $([bool]$isNew) | Ungesichert: $([bool]$dirty) | Ueberschneidungen: $($overlap.Count)"
        if ($overlap.Count) { Write-Host ($overlap -join "`n") }
    }
    if ($Action -eq 'Status') { exit 0 }
    if (-not $branch) { throw 'Detached HEAD: ask Codex to secure the work on a named branch first.' }
    if (-not $Owner) { $Owner = Git @('config', 'user.name') }
    $ownerSlug = ($Owner.ToLowerInvariant() -replace '[^a-z0-9]+', '-').Trim('-')
    if (-not $ownerSlug) { $ownerSlug = 'team' }
    $stamp = [DateTime]::UtcNow.ToString('yyyyMMdd-HHmmss-fff')
    if ($Action -eq 'Checkpoint') {
        if (-not $isNew -or $branch -eq 'main' -or $branch -match '^(archive/|legacy-)') { throw 'Zwischenstände werden nur auf einem aktiven Babylon-Arbeitsbranch gesichert. main und Archive bleiben unangetastet.' }
        if (-not $branch.StartsWith("codex/team-$ownerSlug-")) { throw "Zwischenstände werden nur im eigenen Arbeitsbranch codex/team-$ownerSlug-* gesichert; aktueller Branch: $branch" }
        if ($dirty) {
            $changedPaths = Git @('status', '--porcelain') -split "`n"
            $sensitiveNames = @($changedPaths | Where-Object { $_ -match '(?i)(\.env|secret|credential|token|\.pem|\.pfx|\.p12|\.key)' })
            if ($sensitiveNames.Count) { throw "Dateinamen sehen nach Zugangsdaten/Geheimnissen aus; bitte erst einzeln prüfen und ausschließen: $($sensitiveNames -join '; ')" }
            $null = Git @('add', '-A')
            $message = "Zwischenstand: $Owner $([DateTime]::UtcNow.ToString('yyyy-MM-dd HH:mm')) UTC"
            $null = Git @('commit', '-m', $message)
        }
        $null = Git @('push', '-u', 'origin', "HEAD:refs/heads/$branch")
        $null = Git @('fetch', 'origin', '--prune')
        $savedHead = Git @('rev-parse', 'HEAD')
        $remoteBranchHead = Git @('rev-parse', "refs/remotes/origin/$branch")
        if ($remoteBranchHead -ne $savedHead) { throw 'Der Arbeitsbranch wurde nicht bytegenau auf GitHub bestätigt; lokaler Commit bleibt erhalten.' }
        if (Git @('status', '--porcelain')) { throw 'Nach dem Zwischenstand sind noch ungesicherte Dateien vorhanden; der Branch bleibt erhalten.' }
        Write-Host "ZWISCHENSTAND GESICHERT: $branch = $savedHead. GitHub main wurde nicht veraendert."
        exit 0
    }
    if ($dirty) { throw 'Local changes exist. Codex must preserve/review/commit them first. Nothing was overwritten. See .tools/team-status.json.' }
    if ($Action -eq 'Start') {
        if (-not $isNew) {
            $archive = NewArchive 'HEAD' 'before-babylon'
            Write-Host 'Alter Stand gesichert; alter Engine-Code wird NICHT migriert.'
        }
        if (-not $isNew -or (Ancestor 'HEAD' 'origin/main') -or $branch -match '^(archive/|legacy-)') {
            $workBranch = "codex/team-$ownerSlug-$stamp"
            $null = Git @('switch', '-c', $workBranch, 'origin/main')
        } else {
            if (-not $branch.StartsWith("codex/team-$ownerSlug-")) {
                $workBranch = "codex/team-$ownerSlug-$stamp"
                $null = Git @('switch', '-c', $workBranch)
            }
            if (-not (Ancestor 'origin/main' 'HEAD')) {
                $null = Git @('branch', "archive/before-sync-$ownerSlug-$stamp", 'HEAD')
                $merge = GitResult @('merge', '--no-edit', 'origin/main')
                if ($merge.Code -ne 0) { throw "Merge requires Codex help. Both sides preserved; do not choose one globally. $($merge.Text)" }
            }
        }
        $session = [ordered]@{ owner = $Owner; branch = (Git @('branch', '--show-current')); startingHead = (Git @('rev-parse', 'HEAD')); remoteAtStart = $remote; startedUtc = [DateTime]::UtcNow.ToString('o') }
        $session | ConvertTo-Json | Set-Content -LiteralPath '.tools/team-session.json' -Encoding UTF8
        ShowWorkLists
        Write-Host "Bereit: $($session.branch). Read START-HERE.md, CURRENT-WORKLIST.md, LONG-TERM-GOALS.md, TEAM-CHANGES.md, TEAM-NOTES.md and the latest progress entry. Develop only this Babylon project."
        exit 0
    }
    if (-not $isNew -or $branch -eq 'main' -or $branch -match '^(archive/|legacy-)') { throw 'Publication requires a new Babylon work branch. Old/main/archive work is refused.' }
    $null = Git @('branch', "archive/before-publish-$ownerSlug-$stamp", 'HEAD')
    if (-not (Ancestor 'origin/main' 'HEAD')) {
        $merge = GitResult @('merge', '--no-edit', 'origin/main')
        if ($merge.Code -ne 0) { throw "Concurrent work needs Codex conflict resolution; no main push. $($merge.Text)" }
    }
    $logChanged = Git @('diff', '--name-only', 'origin/main..HEAD', '--', 'PROGRESS-LOG.md')
    if (-not $logChanged) { throw 'Add a verified handoff entry to PROGRESS-LOG.md and commit before publishing.' }
    ShowWorkLists
    EnsureDependencies
    & npm.cmd test
    if ($LASTEXITCODE -ne 0) { throw 'Tests failed; main unchanged.' }
    & npm.cmd run build
    if ($LASTEXITCODE -ne 0) { throw 'Build failed; main unchanged.' }
    if (Git @('status', '--porcelain')) { throw 'Tests/build left tracked/untracked changes; review and commit them before publication.' }
    $null = Git @('fetch', 'origin', '--prune')
    if ((Git @('rev-parse', 'origin/main')) -ne $remote) { throw 'main advanced during verification. Run Projektabschluss again to merge and recheck. No main push.' }
    $null = Git @('push', '-u', 'origin', "HEAD:refs/heads/$branch")
    $publish = GitResult @('push', 'origin', 'HEAD:refs/heads/main')
    if ($publish.Code -ne 0) { throw "Main push rejected (for example concurrent update/protected branch). Work branch uploaded; ask Codex to integrate or create a PR. $($publish.Text)" }
    $null = Git @('fetch', 'origin', '--prune')
    $published = Git @('rev-parse', 'HEAD')
    if ((Git @('rev-parse', 'origin/main')) -ne $published) { throw 'Remote changed after publication. Your commit was uploaded; inspect the newer main before proceeding.' }
    Write-Host "VEROEFFENTLICHT: main = $published. Work branch preserved. No force push."
    Write-Host 'Use Projektstart before the next task.'
    exit 0
} catch {
    Write-Host "TEAM-WORKFLOW: $($_.Exception.Message)" -ForegroundColor Red
    exit 1
}
