# Chrome Web Store Listing — Leet2Hub

> Last Updated: 2026-06-29

## Store Listing

**Extension Name** [REQUIRED]
Leet2Hub

**Short Description** [REQUIRED]
Effortlessly capture and push LeetCode solutions to your GitHub repository.


**Detailed Description** [REQUIRED]
A powerful, AI-integrated Chrome extension to automatically push your LeetCode solutions directly to GitHub with beautifully generated AI READMEs and performance metrics.

Key features:
- AI-Generated Solutions powered by Google Gemini API
- DSA Folder Auto-Categorization based on LeetCode tags
- Smart Packaging into dedicated sub-folders
- One-Click Push from LeetCode to GitHub
- Performance Metrics included in GitHub commit messages

How to use it:
1. Open any LeetCode problem and configure your GitHub repository and Personal Access Token in the popup.
2. (Optional) Enter your Google Gemini API Key to enable AI explanations.
3. Solve a problem on LeetCode.
4. Wait for the green "Accepted" text, and click the golden Push button to push directly to GitHub.

Privacy Note:
Your data (code and credentials) is stored locally on your device and only sent directly to the GitHub API and optionally the Gemini API. We do not collect or sell your personal data.


**Category** [REQUIRED]
Developer Tools

**Single Purpose** [REQUIRED]
Automatically pushes LeetCode solutions to GitHub and generates AI explanations.

**Primary Language** [REQUIRED]
English

## Graphics & Assets

| Asset | Dimensions | Status | Filename |
|-------|-----------|--------|----------|
| Store Icon [REQUIRED] | 128×128 PNG | ✅ Ready | `store_assets/store_icon_128x128.png` |
| Screenshot 1 [REQUIRED] | 1280×800 or 640×400 | ✅ Ready | `screenshots/screenshot1.png` |
| Screenshot 2 [RECOMMENDED] | 1280×800 or 640×400 | ✅ Ready | `screenshots/screenshot2.png` |
| Screenshot 3 [RECOMMENDED] | 1280×800 or 640×400 | ✅ Ready | `screenshots/screenshot3.png` |
| Screenshot 4 | 1280×800 or 640×400 | ⬜ Not created | |
| Screenshot 5 | 1280×800 or 640×400 | ⬜ Not created | |
| Small Promo Tile [RECOMMENDED] | 440×280 | ✅ Ready | `store_assets/small_promo.png` |
| Marquee Promo Tile | 1400×560 | ✅ Ready | `store_assets/marquee_promo.png` |

### Screenshot Notes
- Screenshot 1: Show the LeetCode interface with a successful submission and the golden "Push" button injected by the extension.
- Screenshot 2: Show the popup configuration modal (glassmorphism UI) where users enter their GitHub and Gemini tokens.
- Screenshot 3: Show the resulting GitHub repository structure and AI-generated README for a pushed solution.


## Permissions Justification

| Permission | Type | Justification |
|------------|------|---------------|
| storage | permissions | Required to securely save the user's GitHub repository URL, Personal Access Token, and Gemini API key locally on their device so they do not have to enter them for every submission. |
| https://*.leetcode.com/* | host_permissions | Required to inject the "Push" button onto LeetCode problem pages, read the accepted solution code, and fetch problem tags using the LeetCode GraphQL API for automatic folder categorization. |
| https://api.github.com/* | host_permissions | Required to authenticate with GitHub and commit the user's solution code and generated README directly to their designated GitHub repository via the GitHub REST API. |
| https://generativelanguage.googleapis.com/* | host_permissions | Required to generate AI explanations for the LeetCode solutions using the Google Gemini API. |
| https://api.groq.com/* | host_permissions | Required as a fallback to generate AI explanations for the LeetCode solutions using the Groq API. |
| https://leet2hub.vercel.app/* | host_permissions | Required to fetch user performance stats and streak calendar data from the custom Leet2Hub backend for display in the popup. |

## Privacy & Data Use

### Data Collection

**Does the extension collect user data?** Yes

| Data Type | Collected? | Transmitted Off-Device? | Purpose | Shared with Third Parties? |
|-----------|-----------|------------------------|---------|---------------------------|
| Personally identifiable info | No | No | | No |
| Health info | No | No | | No |
| Financial info | No | No | | No |
| Authentication info | Yes | Yes | Used to authenticate API calls to GitHub, Gemini, and Groq. Transmitted ONLY to github.com, Google, and Groq APIs directly. | No |
| Personal communications | No | No | | No |
| Location | No | No | | No |
| Web history | No | No | | No |
| User activity | No | No | | No |
| Website content | Yes | Yes | Reads LeetCode solutions to push them to GitHub and optionally sends code to Gemini or Groq API to generate an explanation. Also fetches user stats from Leet2Hub backend. | No |

### Data Use Certification
- [x] Data is NOT sold to third parties
- [x] Data is NOT used for purposes unrelated to the extension's core functionality
- [x] Data is NOT used for creditworthiness or lending purposes


## Privacy Policy

**Privacy Policy URL** [REQUIRED]
https://github.com/Anuj-er/leet2hub/blob/main/PRIVACY.md


## Distribution

**Visibility**: Public
**Regions**: All regions
**Pricing**: Free


## Developer Info

**Publisher Name** [REQUIRED]
Anuj Kumar

**Contact Email** [REQUIRED]
anujkumar142000@gmail.com

**Support URL / Email** [RECOMMENDED]
https://github.com/Anuj-er/leet2hub/issues

**Homepage URL** [RECOMMENDED]
https://github.com/Anuj-er/leet2hub


## Version History

| Version | Date | Changes | Status |
|---------|------|---------|--------|
| 1.0.0 | 2026-06-29 | Initial release featuring one-click GitHub push and Gemini AI explanations. | Draft |


## Review Notes

### Known Issues / Limitations
None at the moment.
