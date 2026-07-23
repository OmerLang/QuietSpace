# 📍 QuietSpace

> **Find your focus.** A Progressive Web App (PWA) designed to help students and remote workers discover ideal, low-distraction environments for productivity.

[![Next.js](https://img.shields.io/badge/Next.js-14%2B-black?style=flat-square&logo=next.js)](https://nextjs.org/)
[![PWA Ready](https://img.shields.io/badge/PWA-Supported-blue?style=flat-square&logo=pwa)](https://web.dev/progressive-web-apps/)
[![CSS Modules](https://img.shields.io/badge/CSS_Modules-Scoped_Styles-000000?style=flat-square&logo=css3&logoColor=white)](https://github.com/css-modules/css-modules)
[![Supabase](https://img.shields.io/badge/Supabase-Database-3ECF8E?style=flat-square&logo=supabase)](https://supabase.com/)

---

## 🎯 Overview & Problem Statement

Standard navigation platforms (like Google Maps or Yelp) prioritize business operating hours, food reviews, and driving directions. However, remote workers and students evaluate spaces based on entirely different criteria: **noise levels, outlet availability, Wi-Fi reliability, and seating comfort.**

**QuietSpace** addresses this gap by crowdsourcing user-verified environmental metrics, ranking local cafes, libraries, and public spaces specifically for productivity.

---

## ✨ Core Features & System Capabilities

- **📊 Productivity-First Data Model:** Users filter and view study locations using real-world productivity variables rather than general consumer ratings.
- **📱 Progressive Web App (PWA):** Built for cross-platform accessibility with installability, instant loading, and mobile-optimized touch navigation.
- **🗺️ Interactive Spatial Mapping:** Integrates real-time geo-location queries to surface nearby spots based on the user's immediate workflow needs.
- **👥 Crowd-Sourced Verification:** Features a submission and verification mechanism that aggregates community feedback to keep location metrics accurate.



<img width="379" height="836" alt="image" src="https://github.com/user-attachments/assets/c47536a4-caa9-424f-950b-9867487f2df4" />

<img width="143" height="192" alt="Screenshot 2026-07-23 180936" src="https://github.com/user-attachments/assets/d4fa6268-0fa1-4893-a759-3ddd037f3e32" />

<img width="381" height="833" alt="image" src="https://github.com/user-attachments/assets/f37d3d31-52e7-42ce-8a24-782f38d0729a" />


---

## 🏗️ Technical Architecture

| Layer | Technology | Key Responsibility |
| :--- | :--- | :--- |
| **Frontend Framework** | **Next.js (App Router)** | Server-side rendering, routing, and UI component architecture |
| **Styling & UI** | **CSS Modules** | Component-scoped styling, modular design system, and global style safety |
| **Mobile Integration** | **PWA Service Workers** | Cache management, offline readiness, and web manifest configuration |
| **Backend & Database** | **Supabase (PostgreSQL)** | Relational data storage, authentication, and spatial queries |
| **Mapping Engine** | **Google Maps API** | Spatial rendering, interactive markers, and location data |

---

## 📐 Key Design & Engineering Considerations

1. **Environmental Data Schema:** Designed a structured relational schema in Supabase to track variable environmental attributes (e.g., quietness score, Wi-Fi strength) per location.
2. **Modular Styling Strategy:** Implemented CSS Modules to maintain strict component-scoped styling, preventing selector collision while ensuring a lightweight, maintainable UI architecture.
3. **Performance & PWA Strategy:** Configured service workers and caching logic to ensure low latency and smooth navigation across both desktop and mobile devices.
4. **User-Centric UX:** Tailored the interactive map controls specifically to allow multi-metric filtering without cluttering the spatial view.

---

## 📄 License & Credits

Developed as a university final project. All rights reserved.
