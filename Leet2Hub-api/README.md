<div align="center">
  <img src="assets/logo.png" alt="Leet2Hub Logo" width="150"/>

  # Leet2Hub API ⚡
  
  **The dedicated backend server for Leet2Hub. Handles secure GitHub repository proxying, AI prompt engineering via Gemini, and rate limiting.**
</div>

---

## 🏗️ Technical Stack
- **Framework**: Express.js (Node.js)
- **Language**: TypeScript
- **AI Integration**: Google Gemini API
- **Caching & Security**: `node-cache`, `express-rate-limit`
- **Deployment**: Vercel

## 🚀 Getting Started

### 1. Environment Setup
Create a `.env` file in this root directory with your keys:
```env
PORT=3000
GEMINI_API_KEY=your_google_gemini_key
```

### 2. Run Locally
```bash
npm install
npm run dev
```

### 3. Deploy
This API is configured to be seamlessly deployed on Vercel.
```bash
npm install -g vercel
vercel deploy --prod
```
