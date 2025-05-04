# RealMon GO 🦋 (Frontend)

A mobile app that connects people with nearby species through a playful and reflective experience, built using **React Native**.

> RealMon = Real-time + Pokémon-like nature moments 🐛  
> Reconnect with the real world, one creature at a time 🌿

---

## 🌟 Features

- 📍 Location-based nature exploration
- 📸 Take and upload photos of real-world species
- 🧠 Get instant AI species recognition (powered by backend)
- 🗺️ Interactive map with nearby RealMon
- 🏆 Gamified user progress and reflection prompts

---

## 🧱 Tech Stack

- **React Native** (Expo)
- **TypeScript**
- **React Navigation**
- **Axios** – API communication
- **React Native Maps** – interactive maps
- **Firebase FCM** – optional push notifications
- **Backend**: Spring Boot + MySQL (via REST APIs)

---

## 🚀 Getting Started

### 1. Prerequisites

- Node.js & npm
- Expo CLI
- Android Studio or Xcode (optional for device simulators)

```bash
npm install -g expo-cli
```

---

### 2. Install dependencies

```bash
npm install
```

---

### 3. Start the development server

```bash
npx expo start
```

Use the QR code to launch the app on your mobile with the **Expo Go** app.

---

## 🔗 Connect to Backend

Update your `API_BASE_URL` in your environment file (e.g., `.env`):

```env
API_BASE_URL=http://localhost:8080/api  # or your backend IP if on device
```

---

## 📁 Folder Structure

```
/realmon-frontend
├── assets/                # Images, fonts
├── components/            # Reusable UI
├── screens/               # Page-level components
├── services/              # API logic (e.g., axios)
├── utils/                 # Helper functions
├── App.tsx                # Entry point
```

---

## ✅ TODO

- [ ] Authentication
- [ ] Save captured species to profile
- [ ] Multiplayer/Community features
- [ ] Offline mode

---

## 🤝 Contributions

PRs welcome! Let's reconnect the world with nature together 🌍🧡

---

## 📜 License

MIT License
