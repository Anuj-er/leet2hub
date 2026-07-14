<div align="center">
  <img src="assets/logo.png" alt="Leet2Hub Logo" width="150"/>

  # Leet2Hub API ⚡
  
  **The dedicated backend proxy server for Leet2Hub. Handles bypassing strict CORS policies to fetch LeetCode GraphQL data for the extension's visual dashboard, equipped with high-performance caching and rate limiting.**
</div>

---

## 🏗️ Technical Stack
- **Framework**: Express.js (Node.js)
- **Language**: TypeScript
- **Caching**: `node-cache` (Memory caching to minimize LeetCode GraphQL requests)
- **Security**: `express-rate-limit` (Prevents API abuse)
- **Deployment**: Vercel Serverless Functions

## 📡 API Endpoints (v2)

This API acts as a secure, fast proxy to fetch data for the Leet2Hub interactive dashboard:

*   `GET /api/v2/daily` - Fetches the current Daily Challenge (Cached for 1 Hour).
*   `GET /api/v2/:userId` - Fetches the user's profile stats & difficulty breakdown (Cached for 5 minutes).
*   `GET /api/v2/userProfileCalendar/:username` - Fetches the user's contribution graph and active streaks (Cached for 5 minutes).

## 🚀 Getting Started

### 1. Environment Setup
Create a `.env` file in the root directory:
```env
PORT=3000
```

### 2. Run Locally
```bash
npm install
npm run dev
```

### 3. Deploy
This API is configured to be seamlessly deployed as serverless functions on Vercel.
```bash
npm install -g vercel
vercel deploy --prod
```
