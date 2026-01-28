export enum SecretType {
  DISCORD = 'Discord Bot Token',
  TELEGRAM = 'Telegram Bot Token',
  GITHUB = 'GitHub Personal Access Token',
  GENERIC_API = 'Generic API Key',
  SENSITIVE_FILE = 'Sensitive File Detected',
  ENV_VAR = 'Environment Configuration',
  HARDCODED_CREDENTIALS = 'Hardcoded Admin Credentials',
  BACKDOOR_ENDPOINT = 'Backdoor API Endpoint',
  JWT_SECRET = 'Hardcoded JWT Secret',
  MASS_DELETION = 'Mass Data Deletion',
  SUSPICIOUS_COMMENT = 'Suspicious Comment'
}

export interface ScanResult {
  type: SecretType;
  filePath: string;
  lineNumber?: number;
  snippet?: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  aiFix?: {
    title: string;
    steps: string[];
    riskScore: number;
    canAutoFix: boolean;
  };
}

export interface ScannerPattern {
  name: SecretType;
  regex: RegExp;
  severity: 'low' | 'medium' | 'high' | 'critical';
  aiCategory?: 'credentials' | 'tokens' | 'files' | 'endpoints';
  autoFixable?: boolean;
}

export interface AISecurityFix {
  title: string;
  description: string;
  steps: string[];
  codeExamples: {
    vulnerable: string;
    secure: string;
  };
  commands: {
    linux: string;
    windows: string;
    git: string;
  };
  riskLevel: 'critical' | 'high' | 'medium' | 'low';
  autoFixAvailable: boolean;
}

export interface SecurityRisk {
  type: SecretType;
  score: number;
  impact: string;
  likelihood: string;
  remediationTime: 'minutes' | 'hours' | 'days';
}
