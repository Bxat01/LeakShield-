# 🛡️ LeakHunter

**LeakHunter** is a lightweight, high-performance, and **100% offline** security scanner designed to detect sensitive credentials hidden inside local project files.

Stop secrets from reaching production or version control.  
LeakHunter is your **final local defense line**, ensuring API keys, bot tokens, and environment files stay exactly where they belong — **on your machine**.

![License](https://img.shields.io/badge/license-MIT-red.svg)
![Python](https://img.shields.io/badge/python-3.6%2B-blue.svg)
![Security](https://img.shields.io/badge/security-defensive-green.svg)
![Offline](https://img.shields.io/badge/100%25-Offline-green.svg)

---

## 🚀 Project Overview

LeakHunter is built for **developers, DevOps engineers, and security students** who want a fast and private way to audit repositories.

### Why LeakHunter?
- 🔒 **Privacy First** — No cloud processing, no API calls, no internet required
- 🔍 **Deep Scanning** — Recursive directory scanning for hidden leaks
- 🧠 **Heuristic Regex** — Detects high-entropy strings and known token formats
- 🛡️ **Defensive Only** — Designed for internal audits and education
- 🤖 **AI-Powered Fixes** — Intelligent analysis with remediation suggestions

---

## 🎯 Key Features

### 🤖 Smart Security Analysis
- AI-powered detection for **15+ vulnerability types**
- Risk scoring (**0–100**) with priority recommendations
- Automated and step-by-step security fixes
- Context-aware detection beyond simple regex

### 🚀 High Performance
- Batch processing for **10,000+ files**
- Supports **50+ programming languages**
- Memory-optimized to avoid browser crashes
- Smart filtering of non-sensitive files

### 🔒 Privacy & Security
- 100% offline — zero network requests
- Local processing only
- No data collection
- Fully open-source and transparent

---

## 🖼️ Screenshots

### 📊 Dashboard Overview
![Dashboard Overview](https://res.cloudinary.com/ddqedxovk/image/upload/v1769588043/uag2mpkky6wzm5gaw7ns.png)

---

### 📂 File Scanning Interface
![File Scanner](https://res.cloudinary.com/ddqedxovk/image/upload/v1769588043/fmwhokycv0pqwlqaqkkr.png)

---

### 🔐 Security Findings with AI Fixes
![Security Findings](https://res.cloudinary.com/ddqedxovk/image/upload/v1769588042/wehabh5o2so4p2euupnt.png)

### 🧪 Code Analysis Results

![Code Analysis Results](https://res.cloudinary.com/ddqedxovk/image/upload/v1769588042/z6mhqqjxzni18uvegriv.png)

A clear side-by-side comparison showing **insecure code patterns** alongside **secure AI-generated fixes**, helping developers quickly understand and remediate security risks.

---

## 🛠️ How It Works

1. **Intelligent Discovery** — Identifies high-risk files  
2. **Recursive Crawling** — Skips irrelevant directories  
3. **Multi-Layer Analysis**
   - Regex pattern matching
   - Semantic context analysis
   - AI-based risk scoring
4. **AI-Powered Reporting**
   - Vulnerable code snippets
   - Secure code examples
   - Automated fixes
   - Step-by-step remediation guides

---

## 📊 Detection Capabilities

| Vulnerability Type | Severity | Auto-Fix | AI Analysis |
|--------------------|----------|----------|-------------|
| Discord Bot Tokens | 🔴 Critical | ✅ Yes | ✅ Advanced |
| GitHub PATs | 🔴 Critical | ✅ Yes | ✅ Advanced |
| API Keys | 🟠 High | ✅ Yes | ✅ Advanced |
| .env Files | 🟠 High | ✅ Yes | ✅ Basic |
| Hardcoded Credentials | 🔴 Critical | ❌ Manual | ✅ Advanced |
| JWT Secrets | 🔴 Critical | ✅ Yes | ✅ Advanced |
| Sensitive Files | 🟠 High | ✅ Yes | ✅ Basic |

---

## 🚀 Quick Start

### 🌐 Web Interface (Recommended)

```bash
git clone https://github.com/yourusername/leakhunter.git
cd leakhunter
npm install
npm run dev
Open: http://localhost:3000

🐍 Python CLI Tool
python leakhunter.py --path ./your-project
💻 Usage Examples
Scan Entire Project
Open http://localhost:3000

Click Scan Entire Project

Select your project folder

View AI-powered security analysis

Quick File Scan
Choose Select Files to Scan

Upload files or folders

Get instant feedback

Apply AI-recommended fixes

Severity Filters
🔴 Critical

🟠 High

🟡 Medium

🟢 Low

🏗️ Project Structure
leakhunter/
├── src/
│   ├── components/
│   │   ├── Dashboard.tsx
│   │   ├── FileScanner.tsx
│   │   ├── Header.tsx
│   │   └── CodeOutput.tsx
│   ├── utils/
│   │   └── securityModel.ts
│   ├── types.ts
│   └── constants.ts
├── public/
├── leakhunter.py
├── package.json
└── README.md
🧱 Tech Stack
Frontend

React 19

TypeScript 5.8

Vite 6

Tailwind CSS

Lucide React Icons

Recharts

Backend / CLI

Python 3.6+

No external dependencies

AI Engine

Custom offline security knowledge base

🤝 Contributing
Contributions are welcome ❤️

Fork the repository

Create a feature branch

Make your changes

Add tests if applicable

Submit a pull request

📄 License
MIT License — see the LICENSE file for details.

⚖️ Security & Privacy Disclaimer
LeakHunter is for educational and defensive security use only.

Scan only directories you own or have permission to audit

Detection is not guaranteed to be 100%

Not a replacement for professional audits or penetration testing

The authors assume no responsibility for misuse.

Built with 🛡️ for a safer web.
Happy (and secure) coding!
