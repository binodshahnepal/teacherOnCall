# Windows Setup

This workspace is prepared for Windows with global .NET and Node, plus a local Flutter SDK at `.tools/flutter`.

## Verified Tooling

- .NET SDK 9.0.312 is installed and can build the API.
- Node.js 22.20.0 and npm 10.9.3 are installed and can build the Vite web app.
- Flutter 3.41.9 is installed locally at `.tools/flutter`.
- Flutter web is available through Chrome/Edge.
- Android Studio and the Android SDK are available at `$env:LOCALAPPDATA\Android\Sdk`.
- The Android emulator `Medium_Phone_API_36.0` has been verified with the Flutter debug APK.

## Run

Open separate PowerShell terminals from the project root:

```powershell
.\scripts\run-api.ps1
```

```powershell
.\scripts\run-web.ps1
```

```powershell
.\scripts\run-mobile-web.ps1
```

```powershell
.\scripts\run-mobile-android.ps1
```

Default URLs:

- API: `http://127.0.0.1:5087`
- Web app: Vite prints the local URL, usually `http://127.0.0.1:5173`
- Flutter mobile web preview: `http://127.0.0.1:5174`

## Verify

```powershell
.\scripts\verify-env.ps1
```

## Current Windows Notes

- If `ANDROID_HOME` points to `PASTE_YOUR_SDK_PATH_HERE`, override it for the current shell with `$env:ANDROID_HOME="$env:LOCALAPPDATA\Android\Sdk"`.
- Flutter doctor still reports missing Android command-line tools/license status, but the existing Android Studio SDK can build and run the debug app on `Medium_Phone_API_36.0`.
- Native Windows Flutter desktop builds require the Visual Studio "Desktop development with C++" workload.
- The Flutter app can run in Chrome with `.\scripts\run-mobile-web.ps1` or in the Android emulator with `.\scripts\run-mobile-android.ps1`.
