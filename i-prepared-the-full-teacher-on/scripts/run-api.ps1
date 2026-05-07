$ErrorActionPreference = "Stop"

$root = Split-Path -Parent $PSScriptRoot
Set-Location $root

dotnet run --project .\src\TeacherOnCall.Api --urls http://127.0.0.1:5087
