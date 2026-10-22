# xeres

xeres is a React Native personal-finance and cryptocurrency app for a Ghana-cedi balance, live market prices, and everyday money screens in one place. Signed-in users land on a home balance in GHS, a crypto list quoted in cedis, an interactive price chart, and Invest, Transfers, and Lifestyle tabs. Sign-up and sign-in use phone-number verification through Clerk. The same Expo project targets iOS, Android, and web.

## Features

- **Phone authentication.** Sign-up and sign-in take a country code (default `+233`) and a 6-digit Clerk code. Sessions are cached with Expo SecureStore, and the root layout routes a signed-in user into the authenticated tabs. The login screen also renders email, Google, and Apple buttons; those handlers currently log the chosen method.
- **Home balance.** The GHS figure is the sum of transactions stored on the device. Deposit appends a locally generated transaction, and the Exchange action clears them. Amounts render with `Intl` in GHS. A Zeego menu lists Statement, Converter, Background, and Add new account.
- **Reorderable widgets.** A two-column grid (spent, cashback, recent transaction, cards) can be dragged into a new order. The recent tile reads the transaction store; the other tiles use fixed sample content.
- **Live crypto list.** The Crypto tab loads listings and coin metadata through in-app API routes, shows the GHS price and 24-hour change, and opens a per-coin screen.
- **Interactive price chart.** The coin screen draws a line chart with Victory Native and Skia. Pressing the chart updates the price and date through Reanimated and fires a selection haptic. Category chips (Overview, Markets, Transactions, Holders, Social) switch the active chip; the body shows the chart and the coin overview.
- **Invest.** A portfolio layout with Stats, Portfolio, and Risk tabs, performance cards, and a swipeable holdings list (all-time and monthly) with small inline charts. Holdings on this screen are sample data in the component.
- **Transfers.** Live GHS rates from the listings route, a send form that converts an amount to cedis and confirms in an alert, plus sample favorite contacts and recent transfer rows.
- **Lifestyle.** Monthly spending, category breakdowns, savings goals, recent activity, and short tips. Figures on this screen are sample data in the component.
- **App lock.** When the app resumes after more than three seconds in the background, a lock screen asks for a passcode or device biometrics (Face ID or fingerprint through `expo-local-authentication`). The passcode checked in the app is `123456`.
- **Account and app icon.** The account sheet reads the Clerk user, updates first and last name and the profile photo, and switches the home-screen icon among Default, Dark, and Vivid.

The Help route is a placeholder modal.

## Tech stack

| Area | Choice |
| --- | --- |
| App | Expo SDK 50, React Native 0.73, React 18, TypeScript (`strict`) |
| Navigation | Expo Router 3 with typed routes, React Navigation |
| Auth | Clerk (`@clerk/clerk-expo`), Expo SecureStore |
| Server data | TanStack Query, Expo Router API routes |
| Market data | CoinMarketCap Pro (`convert=GHS` on listings, info by id) |
| Client state | Zustand `persist`, backed by `react-native-mmkv` |
| Motion and UI | Reanimated, Gesture Handler, Expo Blur, Expo Haptics, Zeego |
| Charts | Victory Native, Shopify React Native Skia |
| Device | Expo AV, Expo Image Picker, Expo Local Authentication, `expo-dynamic-app-icon` |
| Build | EAS (`eas.json`), `expo-dev-client` |

## Architecture

xeres is a single Expo app. Expo Router owns the screens and a small server API. `app.json` sets the iOS bundle id and Android package to `com.simiel.xeres`, portrait orientation, iOS tablet support, Face ID and Android biometric usage strings, and three app icons. The configured Expo Router origin is `https://simiel.github.io`. Web uses the Metro bundler with `output: "server"`, which is what serves the API routes.

```
app/
  _layout.tsx                 Clerk, React Query, inactivity lock, gesture root
  index.tsx                   Welcome screen with a looping intro video
  login.tsx  signup.tsx       Phone entry
  verify/[phone].tsx          6-digit code
  help.tsx                    Placeholder help modal
  api/
    listings+api.ts           CoinMarketCap listings, quoted in GHS
    info+api.ts               CoinMarketCap metadata (logo, description)
    tickers+api.ts            Static daily series used by the chart
  (authenticated)/
    (tabs)/                   home, crypto, invest, transfers, lifestyle
    (modals)/                 account, lock
    crypto/[id].tsx           Coin detail and chart
components/                   Header, round buttons, Zeego dropdown, sortable widgets
constants/                    Colors and shared styles
context/userInactivity.tsx   Background timestamp in MMKV, then the lock route
interfaces/crypto.ts          Listing and ticker types
store/balanceStore.ts         Transactions and derived balance
storage/mmkv-storage.ts       Zustand StateStorage adapter over MMKV
assets/                       Icons (default, dark, vivid), splash, intro video, Space Mono
```

- **Route groups.** `(authenticated)` is shown when Clerk reports a session. `account`, `lock`, and `help` use Expo Router presentation options, including a transparent account sheet.
- **API routes as a proxy.** `listings` and `info` call CoinMarketCap with `CRYPTO_API_KEY` on the server and return JSON to the client. Listings take a `limit` query (default 5) and request `convert=GHS`. The chart route returns a fixed daily series from 1 January 2024 through 12 March 2024. A CoinPaprika historical fetch is left commented out in that file.
- **Dependent queries.** The Crypto tab loads listings, then requests metadata for those ids once the id list exists.
- **Derived, persisted balance.** `balance()` reduces the transaction array. Zustand persists that array under the key `balance` through MMKV, so deposits survive a reload on device.
- **Worklet layout.** The sortable grid keeps positions in a shared value, maps an index to x/y in worklets (`getPosition`, `getOrder`), and reports the new order when a drag ends.
- **Inactivity lock.** On background, the provider stores a timestamp in its own MMKV instance. On resume it opens the lock modal. Unlock is the local passcode above, or a successful `LocalAuthentication.authenticateAsync()` call.

`ios/` and `android/` are gitignored and produced by the native run commands.

## Getting started

### Prerequisites

- Node.js and npm. `package.json` also declares Yarn 1.22.22 (`packageManager`).
- A Clerk application with phone-code verification, and a CoinMarketCap Pro API key.
- For a native binary: Xcode (iOS) or Android Studio (Android). Native modules in this app include MMKV, Skia, Reanimated, local authentication, and dynamic icons, and the project depends on `expo-dev-client`.

### Install

`package-lock.json` is the lockfile in the repo.

```bash
npm install
```

With Yarn:

```bash
yarn install
```

### Environment variables

Put these in a `.env` file at the repository root. Names only; do not commit secret values.

| Name | Used by |
| --- | --- |
| `EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY` | `ClerkProvider` in `app/_layout.tsx` |
| `CRYPTO_API_KEY` | `app/api/listings+api.ts` and `app/api/info+api.ts` (`X-CMC_PRO_API_KEY`) |

### Run

```bash
npm start          # expo start
npm run web        # expo start --web
npm run ios        # expo run:ios
npm run android    # expo run:android
```

On the lock screen, enter `123456`, or use the biometric button when the device supports it.

### Build

`eas.json` defines `preview` (Android APK), `preview2` (Android release assemble), `preview3` (development client), `preview4` (internal distribution), and `production`. `eas-cli` is a dependency, and `app.json` includes an EAS project id. Build a profile with:

```bash
npx eas build --profile preview
```

Use `preview2`, `preview3`, `preview4`, or `production` the same way.

### Test

```bash
npm test
```

The script runs `jest --watchAll` with the `jest-expo` preset. The repository does not currently include test files.

## Project status

Personal product prototype by Samuel Mensah ([@simiel](https://github.com/simiel)). History starts with the initial commit on 9 April 2024. Later commits, through July 2025, add the lock screen, charts, dynamic icons, Invest and Lifestyle layouts, the Transfers flow, biometric permission strings, and EAS configuration. The repository does not record a deployment, a user count, or evaluation metrics. Invest holdings, Lifestyle spending, transfer contacts and history, the chart series, and parts of the home widgets are data defined in source so those screens render without extra backends.

## What this demonstrates

xeres is a multi-screen Expo product with navigation, authentication, on-device persistence, and a market-data boundary in one codebase. The Clerk path covers phone OTP, a SecureStore token cache, and session-based routing into a tab navigator with modals. CoinMarketCap is reached through Expo Router server routes, so the API key stays on the server and listing quotes are requested in GHS, then joined on the client with TanStack Query. Home balance is a Zustand store reduced from its transactions and persisted with a small MMKV adapter. The widget grid is a gesture layout: shared values, worklet geometry, and spring transitions. The coin chart combines Victory Native, Skia, Reanimated press state, and haptics on one screen. Invest, Transfers, and Lifestyle extend that into a five-tab interface, with pagers, inline charts, and a send form, and they keep sample data in the components that own it. EAS profiles and a development client are already set up for installing that native stack on a device.
