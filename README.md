# LocationNotesApp

React Native CLI app for creating notes with GPS location.

## Features

* Register, login, logout
* Create notes with title, content, time, and GPS coordinates
* View notes newest first
* Delete notes
* View one note or all notes on an interactive map
* Persist users, session, and notes between app launches

## Tech Stack

- **React Native CLI + TypeScript** — used because the assignment required React Native CLI, and TypeScript helps keep the code safer and easier to maintain.
- **Redux Toolkit** — used to manage global auth and notes state in a clean and predictable way.
- **Redux Persist + AsyncStorage** — used to keep users, session, and notes saved between app launches.
- **React Navigation** — used for the auth flow, bottom tabs, and note details navigation.
- **react-native-geolocation-service + react-native-permissions** — used to request location permission and get the current GPS coordinates when creating a note.
- **react-native-webview + Leaflet + OpenStreetMap** — used to show interactive maps without requiring a Google Maps API key or billing setup.

## Setup

```bash
npm install
```

### Android

```bash
npm start
npm run android
```

### iOS

```bash
cd ios && pod install && cd ..
npm start
npm run ios
```

## Permissions

Android permissions are in `android/app/src/main/AndroidManifest.xml`:

```xml
<uses-permission android:name="android.permission.ACCESS_FINE_LOCATION" />
<uses-permission android:name="android.permission.ACCESS_COARSE_LOCATION" />
<uses-permission android:name="android.permission.INTERNET" />
```

iOS location text is in `ios/LocationNotesApp/Info.plist`:

```xml
<key>NSLocationWhenInUseUsageDescription</key>
<string>Location is used to attach GPS coordinates to notes you create.</string>
```

## Architecture

The app uses Redux for auth and notes.
`AppRoot.tsx` decides whether to show login/register or the main app based on `currentUserId`.

Notes are stored with `userId`, so each user only sees their own notes.
Maps are built with WebView, Leaflet, and OpenStreetMap to avoid Google Maps API setup.

## Assumptions

* Auth is local only because no backend was required.
* Notes are stored locally on the device.
* Title is required, content is optional.
* Location is captured when saving a note.

## Known Limitations

* Passwords are stored locally for assignment purposes only.
* No backend sync.
* Maps require internet connection.
* Test coverage is minimal.

## Checks

```bash
npm run lint
npx tsc --noEmit
npm test
```
