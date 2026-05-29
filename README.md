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

* React Native CLI + TypeScript
* Redux Toolkit for auth and notes state
* Redux Persist + AsyncStorage for local persistence
* React Navigation for auth flow, tabs, and note details
* react-native-geolocation-service + react-native-permissions for GPS
* react-native-webview + Leaflet + OpenStreetMap for maps without a Google Maps API key

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
