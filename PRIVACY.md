# Privacy Policy for Leet2Hub

**Last Updated:** 2026-06-29

Leet2Hub ("we", "our", or "us") is committed to protecting your privacy. This Privacy Policy explains how our Chrome Extension, Leet2Hub, collects, uses, and safeguards your information.

## 1. Information We Collect

Leet2Hub is designed to operate primarily on your local device. We collect and process the following information strictly to provide the extension's core functionality:
- **Authentication Information**: Your GitHub Personal Access Token and Google Gemini API Key. These are stored locally in your browser's sync storage (`chrome.storage`) and are never sent to our servers.
- **Website Content**: The extension reads the code you submit on `leetcode.com` in order to push it to your GitHub repository and (if enabled) send it to the Gemini API for generating an explanation.

## 2. How We Use Your Information

The information collected is used exclusively for the following purposes:
- **GitHub API Integration**: Your GitHub Personal Access Token is used to authenticate requests to the GitHub REST API to create folders, push code, and commit README files to your configured repository.
- **AI Explanations (Gemini API)**: If enabled, your LeetCode solution and Gemini API Key are sent directly to the Google Gemini API to generate the AI explanations for your READMEs.

**We do not collect, store, or transmit your data to any external servers other than GitHub and Google Gemini.**

## 3. Data Sharing and Disclosure

We do not sell, trade, or otherwise transfer your personal information or data to third parties. Your data is only transmitted to the necessary third-party APIs (GitHub and Google) required for the extension to function.

## 4. Data Security

Your authentication tokens and configuration settings are stored securely within your browser's local storage utilizing the Chrome Extensions API. We recommend keeping your API keys safe and configuring your GitHub token with the minimum necessary scopes (e.g., `repo` only).

## 5. Changes to This Privacy Policy

We may update our Privacy Policy from time to time. We will notify you of any changes by updating the "Last Updated" date at the top of this Privacy Policy.

## 6. Contact Us

If you have any questions or concerns about this Privacy Policy, please contact us at:
**anujkumar142000@gmail.com**
Or via our GitHub repository: [https://github.com/Anuj-er/leet2hub](https://github.com/Anuj-er/leet2hub)
