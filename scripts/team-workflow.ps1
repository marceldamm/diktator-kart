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
    Write-Host 'Codex: diese vier Dateien als App-Tabs oeffnen und lesen; Status, Naechstes und kurze Pruefergebnisse nur hier pflegen.'
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
        if (-not $isNew -or $branch -ne 'main') { throw 'Zwischenstaende werden auf dem gemeinsamen Babylon-main gesichert. Erst Projektstart ausfuehren; Archive/andere Branches bleiben unveraendert.' }
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
        Write-Host "ZWISCHENSTAND GESICHERT: main = $savedHead"
        exit 0
    }
    if ($dirty) { throw 'Local changes exist. Codex must preserve/review/commit them first. Nothing was overwritten. See .tools/team-status.json.' }
    if ($Action -eq 'Start') {
        if ($dirty) { throw 'Ungesicherte Dateien vorhanden. Codex muss sie einzeln erhalten und pruefen, bevor der Branch gewechselt wird.' }
        if (-not $isNew) { throw 'Der lokale Stand ist nicht von der aktiven Babylon-Basis abgeleitet. Er bleibt erhalten; Migration zuerst pruefen.' }
        if ($branch -match '^(archive/|legacy-)') { throw 'Ein Archiv-/Legacy-Branch bleibt historisch und wird nicht migriert.' }
        if ($branch -ne 'main') {
            if (-not (Ancestor 'HEAD' 'origin/main') -and -not (Ancestor 'origin/main' 'HEAD')) { throw 'Lokaler Branch und origin/main sind auseinander gelaufen. Beide Staende bleiben erhalten; Codex muss sie fachlich zusammenfuehren.' }
            $localMain = GitResult @('show-ref', '--verify', '--quiet', 'refs/heads/main')
            if ($localMain.Code -eq 0) {
                $null = Git @('switch', 'main')
            } else {
                $null = Git @('switch', '-c', 'main', 'origin/main')
            }
            if (-not (Ancestor 'HEAD' 'origin/main')) { throw 'Lokales main ist origin/main voraus oder abgezweigt; keine automatische Ruecksetzung. Codex muss den Stand sichern.' }
            if ((Git @('rev-parse', 'HEAD')) -ne $remote) { $null = Git @('merge', '--ff-only', 'origin/main') }
            if (Ancestor 'origin/main' $branch) { $null = Git @('merge', '--ff-only', $branch) }
        }
        $session = [ordered]@{ owner = $Owner; branch = 'main'; startingHead = (Git @('rev-parse', 'HEAD')); remoteAtStart = $remote; startedUtc = [DateTime]::UtcNow.ToString('o') }
        $session | ConvertTo-Json | Set-Content -LiteralPath '.tools/team-session.json' -Encoding UTF8
        ShowWorkLists
        Write-Host 'Bereit auf main. Nur die vier Hauptdateien als laufende Aufgaben-/Fortschrittssteuerung lesen und pflegen.'
        exit 0
    }
    if (-not $isNew -or $branch -ne 'main') { throw 'Sicherung erfordert den aktiven Babylon-main. Andere Branches bleiben unveraendert und muessen zuerst sicher integriert werden.' }
    if (-not (Ancestor 'origin/main' 'HEAD')) {
        $merge = GitResult @('merge', '--no-edit', 'origin/main')
        if ($merge.Code -ne 0) { throw "Concurrent work needs Codex conflict resolution; no main push. $($merge.Text)" }
    }
    ShowWorkLists
    if (Git @('status', '--porcelain')) { throw 'Nach dem lokalen Abschluss sind noch ungesicherte Dateien vorhanden; pruefen und committen.' }
    $null = Git @('fetch', 'origin', '--prune')
    if ((Git @('rev-parse', 'origin/main')) -ne $remote) { throw 'main advanced during verification. Run Projektabschluss again to merge and recheck. No main push.' }
    $null = Git @('push', 'origin', 'main')
    $null = Git @('fetch', 'origin', '--prune')
    $savedHead = Git @('rev-parse', 'HEAD')
    if ((Git @('rev-parse', 'origin/main')) -ne $savedHead) { throw 'Der Commit wurde auf origin/main nicht bytegenau bestaetigt; lokaler Stand bleibt erhalten.' }
    Write-Host "STAND AUF GITHUB GESICHERT: main = $savedHead"
} catch {
    Write-Host "TEAM-WORKFLOW: $($_.Exception.Message)" -ForegroundColor Red
    exit 1
}
