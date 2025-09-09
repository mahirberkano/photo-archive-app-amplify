# 📸 Photo Archive App (Next.js + AWS Amplify Gen 2)

[![Next.js](https://img.shields.io/badge/Next.js-14-black?logo=next.js)](https://nextjs.org/)  
[![AWS Amplify](https://img.shields.io/badge/AWS-Amplify-orange?logo=awsamplify)](https://aws.amazon.com/amplify/)  
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)  
[![Deployment](https://img.shields.io/badge/Deployed%20on-AWS%20Amplify-blue?logo=amazonaws)](https://console.amplify.aws/)  

A  photo archive web application built with **Next.js** and powered by **AWS Amplify Gen 2** for scalable backend services.  
Easily upload, manage, and view your photo collection in the cloud.  

---

## 🌐 Demo

[![Live Demo](https://img.shields.io/badge/Live%20Demo-Open-brightgreen)](https://main.d2y1dpbyx183v6.amplifyapp.com/)

 

---

## 🚀 Features

- ✅ Next.js frontend (React 18, App Router)  
- ✅ AWS Amplify Gen 2 backend (authentication, storage, API)  
- ✅ Image upload & archive  
- ✅ Scalable & secure cloud deployment  

---

## 🛠️ Tech Stack

- [Next.js](https://nextjs.org/) – React framework  
- [AWS Amplify Gen 2](https://docs.amplify.aws/) – Cloud backend (Auth, Storage, Functions, etc.)  
- [TailwindCSS](https://tailwindcss.com/) – Styling  

---

## ⚙️ Getting Started

### 1️⃣ Clone the Repository
```bash
git clone https://github.com/mahirberkano/photo-archive-app-amplify.git
cd photo-archive-app-amplify
```

### 2️⃣ Install Dependencies
```bash
npm install
# or
yarn install
```

### 3️⃣ Run Locally
```bash
npm run dev
```
App will be available at 👉 [http://localhost:3000](http://localhost:3000)

---

## ☁️ Setting Up AWS Amplify (Gen 2)

This project uses **Amplify Gen 2**, which is infrastructure-as-code driven.  
Follow these steps to connect your backend:

### 1. Initialize Amplify in your project
```bash
npx ampx sandbox
```
This spins up a temporary backend for local development.
After this step you will see backend outpus in amplify_outputs.json

### 2. Configure Auth / Storage / API
Edit your backend configuration files inside the `amplify/` folder. Example:
```
amplify/
 ┣ auth/
 ┣ storage/
 ┗ api/
```

### 3. Deploy to the Cloud
When you’re ready to push changes:
```bash
npx ampx push
```

### 4. Connect Frontend with Amplify
Make sure you import Amplify into your frontend:
```ts
import { Amplify } from 'aws-amplify';
import outputs from '../amplify_outputs.json';

Amplify.configure(outputs);
```

---

## 🚀 Deployment

1. Push your repo to **GitHub**.  
2. In the [Amplify Console](https://console.amplify.aws/), connect your GitHub repository.  
3. Select **Amplify Gen 2** → choose your `main` branch.  
4. Amplify will automatically build & deploy on each commit.  

---

## 📂 Project Structure
```
photo-archive-app-amplify/
 ┣ amplify/          # Backend configs (Auth, API, Storage, etc.)
 ┣ app/              # Next.js App Router pages
 ┣ components/       # UI components
 ┣ public/           # Static assets
 ┣ styles/           # Tailwind / CSS
 ┣ package.json
 ┗ README.md
```

---

## 🎨 Screenshots (Optional)
> Add some screenshots or GIFs of your app here once deployed.

---

## 📜 License
MIT License © 2025 [Mahir Berkan Oğuz](https://github.com/mahirberkano)
