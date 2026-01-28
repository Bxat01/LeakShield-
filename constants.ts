
import { SecretType, ScannerPattern } from './types';

export const PATTERNS: ScannerPattern[] = [
  {
    name: SecretType.DISCORD,
    // Modern Discord tokens are often [24-26].[6].[27+] chars
    regex: /[a-zA-Z0-9_-]{23,28}\.[a-zA-Z0-9_-]{6,7}\.[a-zA-Z0-9_-]{27,}/g,
    severity: 'critical'
  },
  {
    name: SecretType.TELEGRAM,
    regex: /\d{8,12}:[0-9A-Za-z_-]{35}/g,
    severity: 'high'
  },
  {
    name: SecretType.GITHUB,
    // GitHub tokens are now more consistently formatted with prefixes
    regex: /gh[pous]_[a-zA-Z0-9]{36,255}/g,
    severity: 'critical'
  },
  {
    name: SecretType.GENERIC_API,
    // Improved to catch keys even without quotes, and supports more separators
    regex: /(?:key|api|token|secret|password|passwd|auth|credential)[-|_]*[a-z]*\s*[:=>]\s*['"]?([a-zA-Z0-9]{16,})['"]?/gi,
    severity: 'medium'
  },
  {
    name: SecretType.ENV_VAR,
    // Catch high entropy strings in .env style files (32+ chars of hex/base64)
    regex: /[A-Z0-9_]+=[a-zA-Z0-9\/\+=]{32,}/g,
    severity: 'high'
  }
];

export const SENSITIVE_FILES = [
  '.env',
  '.env.local',
  '.env.dev',
  'config.json',
  'credentials',
  'credentials.json',
  'backup.zip',
  'database.sql',
  'key.pem',
  'id_rsa',
  'id_ed25519',
  '.aws/credentials'
];

export const PYTHON_TEMPLATE = `
import os
import re
import sys
import argparse
from typing import List, Dict, Optional

# --- Optimized Detection Patterns ---
PATTERNS = {
    'Discord Bot Token': r'[a-zA-Z0-9_-]{23,28}\\.[a-zA-Z0-9_-]{6,7}\\.[a-zA-Z0-9_-]{27,}',
    'Telegram Bot Token': r'\\d{8,12}:[0-9A-Za-z_-]{35}',
    'GitHub Token': r'gh[pous]_[a-zA-Z0-9]{36,255}',
    'Generic API Key': r'(?:key|api|token|secret|password|auth)[-|_]*[a-z]*\\s*[:=>]\\s*[\'"]?([a-zA-Z0-9]{16,})[\'"]?',
    'Private Key Header': r'-----BEGIN [A-Z ]+ PRIVATE KEY-----'
}

SENSITIVE_FILES = [
    '.env', '.env.local', 'config.json', 'credentials', 'backup.zip', 
    'database.sql', 'key.pem', 'id_rsa', 'id_ed25519', 'secret.txt'
]

TEXT_EXTENSIONS = {
    '.py', '.js', '.ts', '.env', '.json', '.yml', '.yaml', 
    '.txt', '.md', '.sql', '.sh', '.log', '.conf', '.cfg'
}

class LeakHunter:
    def __init__(self, target_dir: str):
        self.target_dir = os.path.abspath(target_dir)
        self.results = []

    def scan(self):
        if not os.path.exists(self.target_dir):
            print(f"[!] Error: Path '{self.target_dir}' does not exist.")
            return
        
        if not os.path.isdir(self.target_dir):
            print(f"[!] Error: '{self.target_dir}' is a file, not a directory.")
            return

        print(f"[*] Starting LeakHunter scan on: {self.target_dir}")
        print("[!] Mode: Offline Local Scan")
        print("-" * 40)
        
        for root, dirs, files in os.walk(self.target_dir):
            # Skip hidden git directory
            if '.git' in dirs:
                dirs.remove('.git')
                
            for file in files:
                file_path = os.path.join(root, file)
                self._check_file_type(file, file_path)
                self._scan_file_content(file_path)

        self.report()

    def _check_file_type(self, filename: str, path: str):
        if filename.lower() in [f.lower() for f in SENSITIVE_FILES] or '.env' in filename.lower():
            self.results.append({
                'type': 'Sensitive File Detected',
                'path': path,
                'line': 'N/A'
            })

    def _scan_file_content(self, path: str):
        _, ext = os.path.splitext(path)
        # Scan if it's a known text extension OR if it's a known sensitive file
        if ext.lower() not in TEXT_EXTENSIONS and os.path.basename(path) not in SENSITIVE_FILES:
            return

        try:
            with open(path, 'r', encoding='utf-8', errors='ignore') as f:
                for i, line in enumerate(f, 1):
                    stripped_line = line.strip()
                    if not stripped_line:
                        continue
                        
                    for name, pattern in PATTERNS.items():
                        if re.search(pattern, stripped_line):
                            self.results.append({
                                'type': name,
                                'path': path,
                                'line': i
                            })
        except Exception as e:
            # Silently skip files that can't be read (e.g. permission issues)
            pass

    def report(self):
        print("\\n" + "="*60)
        print(" LEAKHUNTER SCAN REPORT ")
        print("="*60 + "\\n")
        
        if not self.results:
            print("[+] No leaks detected! Your project appears clean.")
        else:
            print(f"[!] Found {len(self.results)} potential security issues:\\n")
            # Group by file for cleaner output
            current_file = None
            for r in sorted(self.results, key=lambda x: x['path']):
                if r['path'] != current_file:
                    print(f"FILE: {r['path']}")
                    current_file = r['path']
                print(f"  --> [{r['type']}] at Line {r['line']}")
        
        print("\\n" + "="*60)
        print("Disclaimer: This tool is for internal security audits only.")

if __name__ == "__main__":
    parser = argparse.ArgumentParser(
        description="LeakHunter - Offline Secret Scanner",
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog="Example: python leakhunter.py --path ./my_project"
    )
    parser.add_argument("--path", "-p", default=".", help="Directory path to scan (default: current directory)")
    args = parser.parse_args()
    
    hunter = LeakHunter(args.path)
    hunter.scan()
`;
