$ErrorActionPreference = "Stop"

$root = Split-Path -Parent $PSScriptRoot
$flutter = Join-Path $root ".tools\flutter\bin\flutter.bat"

Set-Location $root
dotnet build .\TeacherOnCall.sln --no-restore

Set-Location (Join-Path $root "web")
npm run build

Set-Location (Join-Path $root "mobile")
& $flutter analyze
& $flutter test
& $flutter build web
