# Africart Mobile App

A fast-delivery mobile application built with React Native for iOS and Android.

## Features
- Beautiful splash screen with animations
- User authentication
- Product browsing and filtering
- Real-time order tracking
- Push notifications
- Dark mode support

## Tech Stack
- React Native (Expo)
- Redux for state management
- React Navigation
- Lottie animations
- Socket.io for real-time updates

## Installation

### Prerequisites
- Node.js v16+
- Expo CLI: `npm install -g expo-cli`

### Setup
```bash
npm install
expo start
```

### Run on Device
- iOS: Press `i`
- Android: Press `a`

## Project Structure
```
src/
├── screens/
│   ├── SplashScreen.js
│   ├── HomeScreen.js
│   ├── ProductsScreen.js
│   └── TrackingScreen.js
├── components/
│   ├── AnimatedLogo.js
│   ├── ProductCard.js
│   └── TrackingMap.js
├── navigation/
│   └── RootNavigator.js
├── redux/
│   ├── store.js
│   └── slices/
├── animations/
│   └── lottie/
└── utils/
    └── api.js
```

## License
MIT
