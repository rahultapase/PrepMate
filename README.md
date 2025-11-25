# PrepMate – AI-Powered Mock Interview Platform

PrepMate is a next-generation interview preparation platform that uses advanced artificial intelligence to simulate realistic interview scenarios, provide instant feedback, and help you build confidence for your next big opportunity.

## 🚀 Features

- **AI-Powered Mock Interviews:** Practice with adaptive AI that asks and evaluates real interview questions.
- **Multiple Interview Types:** Behavioral, technical, case study, and more.
- **Real-Time Feedback:** Get instant, actionable feedback on your answers and communication.
- **Personalized Training:** Tailored sessions based on your industry, role, and experience.
- **Session Analytics:** Review your performance and track your progress.
- **Modern UI:** Clean, responsive design (laptop/desktop only).

## 🛠️ Tech Stack

- **Frontend:** React 18 + TypeScript
- **Styling:** Tailwind CSS
- **Build Tool:** Vite
- **Authentication & Backend:** Firebase
- **Animation:** Lottie
- **Deployment:** Vercel

## ⚠️ Device Support

> **Note:** This platform is designed for use on laptops and desktops only. Mobile and tablet devices are not supported.

## 📦 Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/rahultapase/PrepMate.git
   cd PrepMate
   ```

2. **Install dependencies:**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Set up Firebase:**
   - Create a Firebase project at [Firebase Console](https://console.firebase.google.com/)
   - Enable Authentication (Email/Password and Google)
   - Get your Firebase config and add it to a `.env` file in the root:
     ```
     VITE_FIREBASE_API_KEY=your_api_key
     VITE_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
     VITE_FIREBASE_PROJECT_ID=your_project_id
     VITE_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
     VITE_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
     VITE_FIREBASE_APP_ID=your_app_id
     ```

4. **Start the development server:**
   ```bash
   npm run dev
   # or
   yarn dev
   ```

5. **Open your browser:**  
   Visit [site](https://PrepMate.vercel.app/)

## 🌐 Deployment (Vercel)

### Quick Deploy ⚡

1. **Push your code to GitHub**
   ```bash
   git add .
   git commit -m "Ready for deployment"
   git push origin main
   ```

2. **Import to Vercel:**
   - Go to [Vercel](https://vercel.com/new)
   - Click "Import Project"
   - Select your GitHub repository
   - Vercel auto-detects Vite configuration

3. **Add Environment Variables:**
   - In Vercel dashboard, go to Settings → Environment Variables
   - Add all variables from your `.env` file:
     ```
     VITE_FIREBASE_API_KEY=your_api_key
     VITE_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
     VITE_FIREBASE_PROJECT_ID=your_project_id
     VITE_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
     VITE_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
     VITE_FIREBASE_APP_ID=your_app_id
     VITE_GEMINI_API_KEY=your_gemini_key
     ```
   - Select: Production, Preview, and Development

4. **Deploy!**
   - Click "Deploy"
   - Wait 2-3 minutes for build to complete
   - Your app is live! 🎉

5. **Post-Deployment:**
   - Add your Vercel URL to Firebase Authorized Domains
   - Firebase Console → Authentication → Settings → Authorized domains
   - Add: `your-app-name.vercel.app`


## 👨‍💻 Creator
**Rahul Tapase**



