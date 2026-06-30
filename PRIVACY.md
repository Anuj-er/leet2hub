# Privacy Policy for Leet2Hub

**Last Updated:** 2026-06-29

Leet2Hub ("we", "our", or "us") is committed to protecting your privacy. This Privacy Policy explains how our Chrome Extension, Leet2Hub, collects, uses, and safeguards your information.

## 1. Information We Collect

Leet2Hub is designed to operate primarily on your local device. We collect and process the following information strictly to provide the extension's core functionality:
- **Authentication Information**: Your GitHub Personal Access Token, Google Gemini API Key, and Groq API Key. These are stored locally in your browser's sync storage (`chrome.storage`) and are never sent to our servers.
- **Website Content**: The extension reads the code you submit on `leetcode.com` in order to push it to your GitHub repository and (if enabled) send it to the Gemini or Groq API for generating an explanation.
- **User Stats**: The extension fetches your LeetCode statistics and streak calendar from the Leet2Hub backend API to display in the extension popup.

## 2. How We Use Your Information

The information collected is used exclusively for the following purposes:
- **GitHub API Integration**: Your GitHub Personal Access Token is used to authenticate requests to the GitHub REST API to create folders, push code, and commit README files to your configured repository.
- **AI Explanations (Gemini / Groq API)**: If enabled, your LeetCode solution and your API Key are sent directly to the Google Gemini or Groq API to generate the AI explanations for your READMEs.
- **User Statistics (Leet2Hub Backend)**: Your LeetCode username is sent to our custom Leet2Hub backend hosted on Vercel to fetch your daily problem stats and submission streak.

**We do not collect, store, or transmit your data to any external servers other than GitHub, Google Gemini, Groq, and the Leet2Hub backend.**

## 3. Data Sharing and Disclosure

We do not sell, trade, or otherwise transfer your personal information or data to third parties. Your data is only transmitted to the necessary third-party APIs (GitHub, Google, Groq, and Leet2Hub backend) required for the extension to function.

## 4. Data Security

Your authentication tokens and configuration settings are stored securely within your browser's local storage utilizing the Chrome Extensions API. We recommend keeping your API keys safe and configuring your GitHub token with the minimum necessary scopes (e.g., `repo` only).

## 5. Changes to This Privacy Policy

We may update our Privacy Policy from time to time. We will notify you of any changes by updating the "Last Updated" date at the top of this Privacy Policy.

## 6. Contact Us

If you have any questions or concerns about this Privacy Policy, please contact us at:
**anujkumar142000@gmail.com**
Or via our GitHub repository: [https://github.com/Anuj-er/leet2hub](https://github.com/Anuj-er/leet2hub)
