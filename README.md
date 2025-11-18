# HealLine

A telehealth app built in 24 hours for the VCET hackathon that enables quick doctor–patient diagnosis via video calls, basic reports, and real‑time interaction.

Repository: https://github.com/annuraggg/HealLine

---

## Table of contents

- [About](#about)
- [Features](#features)
- [Repository layout](#repository-layout)
- [Tech stack](#tech-stack)
- [Getting started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Install](#install)
  - [Run](#run)
- [Usage](#usage)
- [Development notes](#development-notes)
- [Contributing](#contributing)
- [Acknowledgements](#acknowledgements)
- [License](#license)
- [Contact](#contact)

---

## About

HealLine is a lightweight telehealth prototype intended to enable rapid remote consultations. It focuses on core functionality suitable for a hackathon demo: real-time video consultations between doctor and patient, simple report viewing/creation, and low-latency interaction.

This project was created in 24‑hour at a hackathon build (VCET).

---

## Features

- Real-time video calls for doctor–patient consultations
- Basic patient reports and simple report management
- Real-time interactions and messaging (where implemented)
- Client and server separated into dedicated folders for clarity

---

## Repository layout

- `.gitignore` — standard ignore rules
- `client/` — frontend code (JavaScript)
- `server/` — backend code (JavaScript)

> Note: The repository contains a `client` and `server` directory. Inspect these folders for framework-specific README or start scripts.

---

## Tech stack

- JavaScript (client + server)
- Likely used libraries (typical for telehealth demos):
  - Frontend: React / WebRTC (for video)
  - Backend: Node.js / Express
  - Real-time: WebSocket or Socket.IO
  - Video: WebRTC (peer-to-peer or server-assisted)
  
(Exact frameworks and dependencies are defined inside the `client` and `server` package manifests — check `package.json` files in those directories.)

---

## Getting started

### Prerequisites

- Node.js (v14+ recommended)
- npm or yarn
- A modern browser with WebRTC support for video calls

### Install

1. Clone the repo
   ```
   git clone https://github.com/annuraggg/HealLine.git
   cd HealLine
   ```

2. Install dependencies for server and client (run in two terminals or sequentially):

   Server:
   ```
   cd server
   npm install
   ```

   Client:
   ```
   cd ../client
   npm install
   ```

### Run

- Start the server:
  ```
  cd server
  npm start
  ```
  or
  ```
  npm run dev
  ```

- Start the client:
  ```
  cd client
  npm start
  ```

Open your browser to the client app (commonly `http://localhost:3000`) and ensure the backend is running (`http://localhost:5000` or as configured).

---

## Development notes

- This project was developed quickly as a hackathon prototype. Expect minimal error handling and demo‑oriented code.

---

## Acknowledgements

- Built during the VCET hackathon — big thanks to organizers and teammates.
- Demos  rely on WebRTC + Socket signaling for fast prototypes.



If you need help running the project or want to collaborate, open an issue in the repository or contact the owner directly via their GitHub profile.
```
