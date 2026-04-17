# Nearby Social Web App

A full React + Firebase social web app with:
- Email/password auth
- Nearby discovery using **opt-in geolocation presence**
- Friend requests and friends list
- 1:1 and group chat
- Stories that expire after 24 hours
- Daily reset of nearby encounters
- Firebase Cloud Functions for cleanup and derived data

## Important note about "15 meter detection"
A browser-based React web app cannot reliably detect arbitrary nearby phones by Bluetooth in the background. This project implements the realistic web version:
- both users install the app
- both users opt in to visibility
- both users share location while using the app
- the backend computes approximate nearby users and shows them in the Nearby screen

That makes it deployable as a real web app.

## Tech stack
- Vite
- React + TypeScript
- React Router
- Firebase Auth
- Firestore
- Firebase Storage
- Firebase Cloud Functions
- Tailwind CSS

## Project structure
```text
nearby-social-app/
  client/                React frontend
  functions/             Firebase Cloud Functions
  firestore.rules
  firestore.indexes.json
  storage.rules
```

## Getting started

### 1) Create Firebase project
Enable:
- Authentication -> Email/Password
- Firestore Database
- Storage
- Functions

### 2) Frontend setup
Copy `client/.env.example` to `client/.env` and fill your Firebase values.

```bash
cd client
npm install
npm run dev
```

### 3) Functions setup
```bash
cd functions
npm install
npm run build
```

### 4) Firestore rules and indexes
Deploy:
```bash
firebase deploy --only firestore:rules,firestore:indexes,storage
```

### 5) Deploy functions
```bash
firebase deploy --only functions
```

## Recommended next production steps
- Add push notifications with Firebase Cloud Messaging
- Add image compression for stories/uploads
- Add unread counters with a dedicated aggregator function
- Add moderation/reporting/blocking flows
- Add stronger geo privacy rules and location obfuscation
