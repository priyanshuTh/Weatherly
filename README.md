# Weatherly 🌦️

**Version:1.50**

**Smart Weather Forecast at your fingertips**

Weatherly is a modern, responsive weather web‑app that delivers real‑time forecasts, interactive maps, and personalised insights — all wrapped in an elegant UI that adapts to season and theme.

![Weatherly hero screenshot](assets/screenshots/hero.png)

## Table of Contents

- [Features](#features)
- [Live Demo](#live-demo)
- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
- [Project Structure](#project-structure)
- [Contributing](#contributing)
- [Roadmap](#roadmap)
- [License](#license)

## Features

- 🔍 **Global Search** – find the forecast for any location worldwide.
- 📍 **Geolocation** – optionally fetch weather for your current position.
- 🗺️ **Interactive Weather Maps** with temperature, wind & precipitation overlay (Leaflet + OWM tiles).
- 🌡️ **Comprehensive Metrics** – temperature, feels‑like, humidity, wind, pressure, clouds, sunrise & sunset.
- 🌗 **Light / Dark mode** toggle stored in localStorage.
- 🎨 **Season‑aware backgrounds** that change automatically.
- 🕑 **Preloader & Toasts** for smooth UX feedback.
- 📜 **Recent Searches** persisted between sessions.
- 🔒 **Auth Pages** – login & sign‑up stubs for future integration.
- 🎥 **Video Forecast** demo component.
- 🍪 **Cookie notice** with persistent dismissal.
- 📱 **Mobile‑first responsive design** (Bootstrap 5).

## Live Demo

> https://priyanshuth.github.io/Weatherly/index.html

## Tech Stack

| Category     | Libraries / APIs                                                                                                                                                                            |
| ------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| UI & Layout  | [Bootstrap 5](https://getbootstrap.com), [Tailwind CSS](https://tailwindcss.com) (Sign‑Up page), [Bootstrap Icons](https://icons.getbootstrap.com), [Font Awesome](https://fontawesome.com) |
| Maps         | [Leaflet](https://leafletjs.com) + OpenWeatherMap tile layers                                                                                                                               |
| Data         | [OpenWeatherMap API](https://openweathermap.org/api)                                                                                                                                        |
| JS Utilities | jQuery, vanilla ES6                                                                                                                                                                         |
| Tooling      | No build step required – runs entirely in the browser                                                                                                                                       |

## Getting Started

### Prerequisites

- A free **OpenWeatherMap API key**.

### Installation

```bash
# 1. Clone the repo
git clone https://github.com/priyanshuTh/Weatherly.git
cd weatherly

# 2. Add your API key
cp env.sample .env             # optional helper
# or: open js/script.js and replace the value of API_KEY
```

> ⚠️ **Security note:** Because Weatherly is a purely client‑side application, your API key will be exposed in the browser. Create a restricted key and/or consider adding a small proxy if you need to keep it secret.

### Running Locally

Open `index.html` in your favourite browser _or_ serve the folder:

```bash
# using the excellent live‑server
npx live-server .
```

Navigate to `http://localhost:8080` and start exploring!

### Environment Variables

| Name               | Description                                                            |
| ------------------ | ---------------------------------------------------------------------- |
| `VITE_OWM_API_KEY` | Your OpenWeatherMap key (used if you wire Weatherly into a build step) |

## Project Structure

```
weatherly/
├── assets/              # Images, video, icons
│   ├── images/
│   └── videos/
├── css/
│   ├── style.css
│   ├── about.css
│   ├── contact.css
│   ├── login.css
│   └── signup.css
├── js/
│   ├── script.js        # Main logic
│   ├── about.js
│   ├── contact.js
│   ├── login.js
│   └── signup.js
├── pages/
│   ├── about.html
│   ├── contact.html
│   ├── login.html
│   └── signup.html
├── index.html
└── README.md
```

## Contributing

1. Fork the project
2. Create your feature branch (`git checkout -b feat/amazing-feature`)
3. Commit your changes (`git commit -m 'feat: add amazing feature'`)
4. Push to the branch (`git push origin feat/amazing-feature`)
5. Open a pull request 🚀

Please follow the [Conventional Commits](https://www.conventionalcommits.org) style and keep your pull requests focused.

## Roadmap

- ⚡ **Service‑Worker** powered offline support / PWA
- 🌐 Multi‑language i18n
- 📱 Native mobile apps (React Native/Ionic)
- 🗓️ 10‑day and hourly forecasts
- 🗣️ Voice command assistant
- 🔑 Real authentication & user preferences
- 📈 Charts for historical trends
- CI/CD pipeline for automated testing and deployment

## License

Distributed under the **MIT License**. See [`LICENSE`](LICENSE) for more information.

## Acknowledgements

- [OpenWeatherMap](https://openweathermap.org) for the free weather data & map tiles.
- [OpenStreetMap contributors](https://www.openstreetmap.org/copyright) for base map layers.
- [Bootstrap](https://getbootstrap.com) & [Tailwind CSS](https://tailwindcss.com) for styling excellence.
- [Leaflet](https://leafletjs.com) for the awesome mapping library.

---

> Made with ❤️ & ☀️ by

- **Priyanshu Thakur**
- **Seema Tiruwa**
- **Masudul Alam**

---
