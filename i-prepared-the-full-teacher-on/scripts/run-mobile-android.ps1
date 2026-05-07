$ErrorActionPreference = "Stop"

$root = Split-Path -Parent $PSScriptRoot
$flutter = Join-Path $root ".tools\flutter\bin\flutter.bat"
$sdk = Join-Path $env:LOCALAPPDATA "Android\Sdk"
$avd = "Medium_Phone_API_36.0"

if (-not (Test-Path $flutter)) {
    throw "Flutter was not found at $flutter."
}

if (-not (Test-Path $sdk)) {
    throw "Android SDK was not found at $sdk."
}

$env:ANDROID_HOME = $sdk
$env:ANDROID_SDK_ROOT = $sdk
$env:Path = "$sdk\platform-tools;$sdk\emulator;$env:Path"

$adb = Join-Path $sdk "platform-tools\adb.exe"
$emulator = Join-Path $sdk "emulator\emulator.exe"

if (-not (& $adb devices | Select-String "device$")) {
    Start-Process -FilePath $emulator -ArgumentList @("-avd", $avd) -WorkingDirectory (Join-Path $sdk "emulator") | Out-Null
    do {
        Start-Sleep -Seconds 5
        $boot = (& $adb shell getprop sys.boot_completed 2>$null)
    } until (($boot -join "").Trim() -eq "1")
}

Set-Location (Join-Path $root "mobile")
& $flutter run -d emulator-5554
