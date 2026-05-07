$ErrorActionPreference = "Stop"

$root = Split-Path -Parent $PSScriptRoot
$flutter = Join-Path $root ".tools\flutter\bin\flutter.bat"

if (-not (Test-Path $flutter)) {
    throw "Flutter was not found at $flutter. Run the environment setup again or install Flutter there."
}

Set-Location (Join-Path $root "mobile")
& $flutter run -d chrome --web-hostname 127.0.0.1 --web-port 5174
