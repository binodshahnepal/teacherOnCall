# Teacher on Call MVP

Marketplace-first MVP for tutor discovery, booking requests, session records with external meeting links, messages, manual payments, tutor earnings, and admin verification.

## Local Tools

This workspace contains local development tools under `.tools/`:

- `.tools/dotnet/dotnet` - .NET SDK 9.0.313
- `.tools/node-v24.14.0-darwin-x64/bin/npm` - Node/npm for the React web app
- `.tools/flutter/bin/flutter` - Flutter 3.41.9 / Dart 3.11.5
- `.tools/jdk/Contents/Home/bin/java` - Temurin JDK 21.0.11
- `$HOME/Library/Android/sdk` - Android SDK 36 with platform tools, emulator, and Android 36 Google APIs x86_64 image
- `$HOME/Applications/Android Studio.app` - Android Studio Panda 4 Patch 1
- `/Applications/Xcode.app` - Xcode 26.3 with iOS 26.3 simulator runtime
- `$HOME/.gem/ruby/2.6.0/bin/pod` - CocoaPods 1.11.3

Homebrew was not installed because the machine requires administrator access for it.

## Run The Backend

Start local PostgreSQL first:

```sh
docker compose up -d postgres
```

Database health check:

```sh
curl http://127.0.0.1:5087/api/health/database
```

```sh
DOTNET_CLI_HOME=.dotnet-home DOTNET_SKIP_FIRST_TIME_EXPERIENCE=1 .tools/dotnet/dotnet run --project src/TeacherOnCall.Api --urls http://127.0.0.1:5087
```

Useful endpoints:

- `GET /api/tutors`
- `POST /api/tutors/register`
- `POST /api/students/register`
- `POST /api/bookings`
- `POST /api/bookings/{id}/accept`
- `POST /api/payments/manual`
- `GET /api/admin/dashboard`

## Run The Web App

```sh
cd web
../.tools/node-v24.14.0-darwin-x64/bin/npm run dev
```

## Run The Mobile App

```sh
cd mobile
../.tools/flutter/bin/flutter run
```

Android emulator:

```sh
ANDROID_SDK_ROOT="$HOME/Library/Android/sdk" "$HOME/Library/Android/sdk/emulator/emulator" -avd TeacherOnCall_API_36
```

Android debug APK:

```sh
cd mobile
../.tools/flutter/bin/flutter build apk --debug
```

iOS simulator/device build:

```sh
cd mobile
PATH="$HOME/.gem/ruby/2.6.0/bin:$PATH" ../.tools/flutter/bin/flutter build ios --no-codesign
```

Boot the verified iOS simulator:

```sh
xcrun simctl boot 0EC02BB6-4AEE-46A8-A9EB-BBB3C8ACD5C3
open -a Simulator
cd mobile
../.tools/flutter/bin/flutter run -d 0EC02BB6-4AEE-46A8-A9EB-BBB3C8ACD5C3
```

The unsigned iOS build produces `mobile/build/ios/iphoneos/Runner.app`. A real device or App Store build still needs Apple Developer signing configured in Xcode.

If Xcode is reinstalled or moved, run:

```sh
sudo xcode-select --switch /Applications/Xcode.app/Contents/Developer
sudo xcodebuild -runFirstLaunch
xcodebuild -downloadPlatform iOS
```

## Verified

```sh
DOTNET_CLI_HOME=.dotnet-home DOTNET_SKIP_FIRST_TIME_EXPERIENCE=1 .tools/dotnet/dotnet build TeacherOnCall.sln --no-restore
cd web && ../.tools/node-v24.14.0-darwin-x64/bin/npm run build
cd mobile && ../.tools/flutter/bin/flutter analyze
cd mobile && ../.tools/flutter/bin/flutter test
cd mobile && ../.tools/flutter/bin/flutter build apk --debug
cd mobile && PATH="$HOME/.gem/ruby/2.6.0/bin:$PATH" ../.tools/flutter/bin/flutter build ios --no-codesign
```
