param([string]$OutputDirectory = "$PSScriptRoot\..\client\public\audio\announcer")

Add-Type -AssemblyName System.Speech
New-Item -ItemType Directory -Force -Path $OutputDirectory | Out-Null
$lines = [ordered]@{
    start = 'Das Ergebnis steht fest. Das Rennen darf beginnen.'
    lap2 = 'Runde zwei. Die erste Runde wurde erfolgreich wiederholt.'
    finalLap = 'Letzte Runde. Ab jetzt zählen nur noch bestätigte Tatsachen.'
    finish = 'Zieleinlauf. Die Auswertung wird passend gemacht.'
    lead = 'Die Führung entspricht endlich der amtlichen Planung.'
    losePlace = 'Ein strategischer Rückzug an die Spitze von hinten.'
    lastPlace = 'Erster Platz in der rückwärtigen Führungsgruppe.'
    comeback = 'Der Aufschwung ist sichtbar. Bitte nicht nachmessen.'
    pickup = 'Versorgungsgut wurde ordnungsgemäß angeeignet.'
    rocket = 'Der Dienstweg wurde überraschend beschleunigt.'
    immunity = 'Diplomatie ist Physik mit besserem Stempel.'
    shielded = 'Der Angriff war formell nicht zuständig.'
    hit = 'Die Maßnahme wirkt. Leider auch hier.'
    plan = 'Die Planvorgabe wurde überholt.'
    planPenalty = 'Vorübergehender Überschuss an Stillstand.'
    shortcut = 'Ihr Antrag auf Zeitgewinn wurde abgelehnt.'
    propaganda = 'Die Sicht ist ausgezeichnet. Laut Bericht.'
    censor = 'Was nicht sichtbar ist, war nie auf der Strecke.'
    statue = 'Ein Denkmal behindert nur unangemeldete Verkehrsteilnehmer.'
    police = 'Eine freiwillige Begleitung wurde angeordnet.'
    closeFinish = 'Das Ergebnis stand fest. Bis gerade eben.'
    collision = 'Kontakt mit der Realität wurde erfolgreich begrenzt.'
    drift = 'Kontrollverlust ist jetzt eine offizielle Fahrtechnik.'
    reverse = 'Die Zukunft liegt heute bemerkenswert weit hinten.'
}

foreach ($entry in $lines.GetEnumerator()) {
    $speaker = New-Object System.Speech.Synthesis.SpeechSynthesizer
    $speaker.Rate = 1
    $speaker.Volume = 92
    $path = Join-Path $OutputDirectory ($entry.Key + '.wav')
    $speaker.SetOutputToWaveFile($path)
    $speaker.Speak($entry.Value)
    $speaker.Dispose()
}
