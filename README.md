🛡️ LeakHunter
LeakHunter is a lightweight, high-performance, and 100% offline security scanner designed to find sensitive credentials buried in your local project files.

Stop secrets from reaching production or version control. LeakHunter serves as your final local defense line, ensuring that API keys, bot tokens, and environment files stay exactly where they belong: on your machine.

https://img.shields.io/badge/license-MIT-red.svg
https://img.shields.io/badge/python-3.6%252B-blue.svg
https://img.shields.io/badge/security-defensive-green.svg
https://img.shields.io/badge/React-19-blue
https://img.shields.io/badge/TypeScript-5.8-blue
https://img.shields.io/badge/100%2525-Offline-green

🚀 Project Overview
LeakHunter is built for developers, DevOps engineers, and security students who want a fast, private way to audit their repositories.

Privacy First: No cloud processing. No API calls. No internet required.

Deep Scanning: Recursively searches through directories to find hidden leaks.

Heuristic Regex: Uses advanced patterns to identify high-entropy strings and known token formats.

Defensive Only: This is a security tool meant for internal audits and educational awareness.

AI-Powered Fixes: Intelligent security analysis with automated solutions.

🎯 Key Features
🤖 Smart Security Analysis
AI-Powered Detection: Intelligent pattern recognition for 15+ vulnerability types

Risk Scoring: Calculates security risk (0-100) with priority recommendations

Automated Fixes: Step-by-step solutions for common security issues

Context Awareness: Understands code patterns beyond simple regex matching

🚀 High Performance
Batch Processing: Handles 10,000+ files efficiently

50+ Languages: Supports Python, JavaScript, Java, Go, Rust, TypeScript, and more

Memory Optimized: Processes files in batches to prevent browser crashes

Smart Filtering: Automatically skips non-sensitive files and directories

🔒 Privacy & Security
100% Offline: Zero network requests, total privacy

Local Processing: All analysis happens in your browser

No Data Collection: Files never leave your machine

Open Source: Transparent code with no hidden tracking

🖼️ Screenshots
Dashboard Overview
https://res.cloudinary.com/ddqedxovk/image/upload/v1769588043/uag2mpkky6wzm5gaw7ns.png
AI-powered dashboard showing security metrics and risk analysis

File Scanning Interface
https://res.cloudinary.com/ddqedxovk/image/upload/v1769588043/fmwhokycv0pqwlqaqkkr.png
Advanced file scanner supporting folder uploads and batch processing

Security Findings with AI Fixes
https://res.cloudinary.com/ddqedxovk/image/upload/v1769588042/wehabh5o2so4p2euupnt.png
Detailed security findings with intelligent AI-powered fixes

Code Analysis Results
https://res.cloudinary.com/ddqedxovk/image/upload/v1769588042/z6mhqqjxzni18uvegriv.png
Side-by-side comparison of vulnerable code vs secure solutions

🛠️ How It Works
LeakHunter combines traditional scanning with AI-powered analysis:

Intelligent Discovery: AI-powered directory analysis to identify high-risk files

Recursive Crawling: Smart traversal with automatic exclusion of non-sensitive directories

Multi-Layer Analysis:

Pattern Matching: Advanced regex for known token formats

Context Analysis: Semantic understanding of code patterns

Risk Assessment: AI-powered risk scoring and prioritization

Smart Filtering: Intelligent file type detection with 50+ language support

AI-Powered Reporting:

Vulnerable Code: Shows exact problematic code snippets

Secure Solutions: Provides corrected code examples

Automated Fixes: Some issues can be fixed automatically

Step-by-Step Guides: Detailed remediation instructions

📊 Detection Capabilities
Vulnerability Type	Severity	Auto-Fix	AI Analysis
Discord Bot Tokens	🔴 Critical	✅ Yes	✅ Advanced
GitHub PATs	🔴 Critical	✅ Yes	✅ Advanced
API Keys	🟠 High	✅ Yes	✅ Advanced
.env Files	🟠 High	✅ Yes	✅ Basic
Hardcoded Credentials	🔴 Critical	❌ Manual	✅ Advanced
JWT Secrets	🔴 Critical	✅ Yes	✅ Advanced
Backdoor Endpoints	🔴 Critical	❌ Manual	✅ Advanced
Sensitive Files	🟠 High	✅ Yes	✅ Basic
Database Credentials	🟠 High	✅ Partial	✅ Advanced
🚀 Quick Start
Web Interface (Recommended)
bash
# Clone the repository
git clone https://github.com/yourusername/leakhunter.git
cd leakhunter

# Install dependencies
npm install

# Start the development server
npm run dev

# Open http://localhost:3000 in your browser
Python CLI Tool
bash
# Run the standalone scanner (included in repository)
python leakhunter.py --path ./your-project

# Or use the web interface for AI-powered analysis
💻 Usage Examples
Scan Entire Project Folder
bash
# Using the web interface (recommended for AI analysis)
1. Open http://localhost:3000
2. Click "Scan Entire Project"
3. Select your project folder
4. View AI-powered security analysis
Quick File Scan
bash
# Scan specific files with detailed analysis
1. Select "Choose Files to Scan"
2. Upload files or folders
3. Get instant security feedback
4. Apply AI-recommended fixes
Advanced Options
bash
# Toggle between analysis modes
- Quick Scan: Fast detection of API keys and tokens
- Deep Scan: Full AI analysis including context patterns

# Filter results by severity
- Critical: Immediate action required
- High: Fix within 24 hours
- Medium: Schedule for fixing
- Low: Review when possible
🏗️ Project Structure
text
leakhunter/
├── src/
│   ├── components/          # React UI components
│   │   ├── Dashboard.tsx    # Main dashboard
│   │   ├── FileScanner.tsx  # AI-powered file scanner
│   │   ├── Header.tsx       # Navigation header
│   │   └── CodeOutput.tsx   # Python CLI source display
│   ├── utils/
│   │   └── securityModel.ts # AI security knowledge base
│   ├── types.ts            # TypeScript definitions
│   └── constants.ts        # Patterns and configurations
├── public/                 # Static assets
├── leakhunter.py          # Python CLI tool
├── package.json           # Dependencies
└── README.md             # This file
🔧 Technology Stack
Frontend: React 19, TypeScript 5.8, Vite 6

Styling: Tailwind CSS, Lucide React Icons

Charts: Recharts for data visualization

AI Engine: Custom security knowledge base

CLI: Python 3.6+ (no external dependencies)

Build: Vite for fast development and production builds

🤝 Contributing
We welcome contributions! Please see our Contributing Guidelines for details.

Fork the repository

Create a feature branch

Make your changes

Add tests if applicable

Submit a pull request

📄 License
This project is licensed under the MIT License - see the LICENSE file for details.

⚖️ Security & Privacy Disclaimer
LeakHunter is for educational and defensive security use only.

Important Notes:
🔒 100% Offline: No internet connection required during scanning

🛡️ Local Processing: All file analysis happens in your browser

📁 No Uploads: Files never leave your computer

🎯 Defensive Tool: Designed to help developers secure their own code

⚠️ Permission Required: Only scan directories you own or have explicit permission to audit

🔍 Not Comprehensive: Does not guarantee 100% detection rate

Professional Use:
While LeakHunter is powerful, it is not a replacement for:

Professional security audits

Enterprise-grade secret management solutions

Compliance validation tools

Penetration testing services

Responsibility:
The authors assume no responsibility for any misuse of this tool. Users are responsible for ensuring they comply with all applicable laws and regulations when using LeakHunter.

Built with 🛡️ for a safer web. Happy (and secure) coding!