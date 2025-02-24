# Nexus (Project Directory Structure)

## Overview
This app intends to helps gamers find teams by matching them based on game preferences, playstyle, playtime, and region. It features chat for coordination and a reputation system to reward positive interactions and report issues.

# Coding Guidelines:
Write modular code by breaking functionality into reusable components, services, and utility functions. For example, in React, keep UI components independent (Button.js, Modal.js) and separate business logic into hooks (useAuth.js, useFetch.js). In a Golang backend, structure code into packages (handlers, services, models) to maintain clear separation of concerns. When working in Git, always create feature-specific branches (e.g., feature/chat-system) and ensure each module is independently testable before merging (make sure it won't break).

## Directory Structure (Follow Structuring)
Our roles are pretty distrinct and aren't fully dependent on each other, if you require data, generate dummy/mock data to progress.
- Web/Desktop: Evan
- Mobile: Jonathan
- Database: Ryan
- Cloud: Shahzaib
- AI: Danny
```
/src
│── frontend
│   ├── web (React + Tauri or Electron)
│   │   ├── src
│   │   │   ├── components
│   │   │   ├── pages
│   │   │   ├── hooks
│   │   │   ├── assets
│   │   │   ├── utils
│   │   │   ├── styles
│   │   │   └── App.tsx
│   │   ├── public
│   │   ├── desktop porting (tauri/electron)
│   │   ├── package.json
│   │   ├── webpack.config.js
│   │   └── tsconfig.json
│   ├── mobile (React Native)
│   │   ├── src
│   │   │   ├── components
│   │   │   ├── screens
│   │   │   ├── hooks
│   │   │   ├── assets
│   │   │   ├── navigation
│   │   │   ├── utils
│   │   │   └── App.tsx
│   │   ├── android
│   │   ├── ios
│   │   ├── package.json
│   │   ├── metro.config.js
│   │   └── tsconfig.json
│
├── backend (Golang, MongoDB, PostgreSQL)
│   ├── cmd
│   ├── internal
│   │   ├── handlers
│   │   ├── models
│   │   ├── database
│   │   │   ├── mongo
│   │   │   ├── postgres
│   │   ├── services
│   │   ├── utils
│   ├── main.go
│   ├── go.mod
│   └── go.sum
│
├── cloud (AWS Infrastructure & Deployment)
│   ├── terraform
│   ├── kubernetes
│   ├── lambdas
│   ├── s3
│   ├── cloudfront
│   ├── ci-cd
│   └── README.md
│
├── ai-ml (AI/ML Integration)
│   ├── recommendation
│   ├── models
│   ├── data-processing
│   ├── training
│   ├── inference
│   └── README.md
│
├── docs (Documentation & API Reference)
│   ├── API.md
│   ├── Architecture.md
│   ├── Setup.md
│   ├── Deployment.md
│   └── README.md
│
└── README.md
```

## Description
### Frontend
- **Web/Desktop (React + Electron)**: Handles UI for web and desktop applications.
- **Mobile (React Native)**: Dedicated UI for mobile applications.

### Backend
- **Golang**: Handles API services, business logic, real-time, and database interactions.
- **MongoDB & PostgreSQL**: Used for storing structured and unstructured data.

### Cloud Services
- **AWS**: Used for hosting, storage (S3), and deployment (CloudFront, Lambda, Kubernetes, etc.).

### AI/ML
- **Recommendation Systems**: Personalized content suggestions.
- **Training & Inference Pipelines**: Model processing. (Future: Non-essential)

