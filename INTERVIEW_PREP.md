# PrepMate - Final Year Project Interview Guide

## 1. Project Overview
**Name:** PrepMate
**One-Liner:** An AI-powered mock interview platform that conducts real-time video interviews and provides detailed feedback on communication and technical skills.
**Core Idea:** Solving the problem of "lack of personalized feedback" in traditional interview prep by using Generative AI (Gemini) to act as a human interviewer.

---

## 2. Technology Stack (The "What did you use?" Question)

### Frontend (Client-Side)
-   **React.js (TypeScript):** For building a robust, type-safe single-page application.
-   **Vite:** Build tool (faster than Create React App).
-   **Tailwind CSS:** For styling (responsive, dark mode support).
-   **Framer Motion:** For animations (smooth transitions between questions).

### Backend & AI
-   **Google Gemini API (Model: `gemini-2.5-flash`):**
    -   *Why?* It's optimized for speed (low latency) and cost-efficiency, which is crucial for a real-time chat application.
    -   *Usage:* Generates context-aware questions based on user resume & role; analyzes user answers for feedback.
-   **Vercel Serverless Functions (`api/gemini.js`):**
    -   *Why?* To secure the Gemini API key. The frontend calls this backend endpoint, and the backend calls Google. This prevents the API key from being leaked in the browser.

### Database & Auth
-   **Firebase Authentication:** Handles user login (Email/Password & Google Sign-In).
-   **Firebase Firestore (NoSQL):**
    -   *Why?* Flexible schema. Perfect for storing JSON objects like interview feedback, user profiles, and history which can vary in structure.
    -   *Data Stored:* User details, Past Interview Sessions, Detailed Feedback Reports.

### Key Browser APIs
-   **Web Speech API:**
    -   `SpeechSynthesis` (Text-to-Speech): For the AI to "speak" the questions.
    -   `SpeechRecognition` (Speech-to-Text): To transcribe your spoken answers into text for the AI to analyze.
-   **MediaDevices API:** To access the webcam for the video feed.

---

## 3. Top Interview Questions & Answers

### A. Technical & Project-Specific
**Q1: How does the application work end-to-end? (Architecture)**
*Answer:* "The user logs in via Firebase Auth. They input their resume and target role. The React frontend sends this data to our Vercel serverless backend. The backend constructs a prompt for the Gemini 2.5 Flash model to generate relevant questions. These questions are sent back to the frontend, where the Web Speech API reads them aloud. The user answers via microphone (converted to text). Finally, the transcript is sent back to Gemini to generate detailed feedback (scores, grammar, technical accuracy), which is stored in Firestore."

**Q2: Why did you choose Gemini over OpenAI (GPT)?**
*Answer:* "Gemini 2.5 Flash offers an excellent balance of speed and intelligence, which is critical for a 'live' conversation feel. It also has a generous free tier for developers, making it scalable for a student project compared to OpenAI's stricter rate limits."

**Q3: How do you handle API Rate Limits (Quota Exceeded)?**
*Answer:* "We implemented a few strategies:
1.  **Model Selection:** Switched to `gemini-2.5-flash` which has higher rate limits than the Pro models.
2.  **Retry Logic:** The backend (`api/gemini.js`) has a retry mechanism. If it receives a 429 (Too Many Requests) or 503 error, it waits exponentially (2s, 4s, 8s) and tries again.
3.  **V1 Beta Endpoint:** Used the `v1beta` endpoint to access the latest cost-optimized models."

**Q4: How is the data secured?**
*Answer:* "Authentication is handled by Firebase, so we don't store passwords ourselves. Sensitive actions like database writes are protected by Firestore Security Rules (ensuring users can only read/write their own data). API keys are stored in server-side environment variables, never exposed to the client."

**Q5: What was the hardest bug you fixed?**
*Answer (Suggestion):* "Syncing the browser's Text-to-Speech with the application state was tricky. If a user clicked 'Next' too fast, the audio from the previous question might still be playing. I had to use `window.speechSynthesis.cancel()` in `useEffect` cleanup functions to ensure audio stops immediately when the component unmounts or the question changes."

### B. Future Scope (Improvements)
**Q: How would you scale this for 10,000 users?**
-   "I would implement caching (Redis) for common interview questions to reduce API calls."
-   "I would move the feedback generation to a background job (using a queue) so the user doesn't have to wait on the loading screen."
-   "I would add a real-time WebSocket connection for even lower latency."

### C. Situational
**Q: If the AI generates a wrong or hallucinated question, how do you handle it?**
*Answer:* "We prompt the AI with a strict system instruction to 'act as a professional interviewer' and limit it to the context of the user's resume. This reduces hallucinations. We also provide a 'Generate More' or 'Skip' button so the user is never stuck on a bad question."

---

## 4. Key terminology to drop
-   **"Serverless Architecture"** (Vercel)
-   **"Prompt Engineering"** (Designing the specific instructions for Gemini)
-   **"State Management"** (Using React Hooks like `useState`, `useEffect`, `useRef`)
-   **"Asynchronous Operations"** (Handling API promises with async/await)
