import { SecretType, ScanResult } from './types';

export interface SecurityFix {
  title: string;
  steps: string[];
  codeExamples: {
    bad: string;
    good: string;
  };
  automation?: {
    command: string;
    script: string;
  };
  priority: 'immediate' | 'high' | 'medium' | 'low';
}

const SECURITY_KNOWLEDGE_BASE: Record<string, {
  patterns: (string | RegExp)[];
  analyze: (filePath: string, snippet?: string) => SecurityFix;
}> = {
  // تصحيح: أضف هذه القيم المفقودة
  'Generic API Key': {
    patterns: [/(?:key|api|token|secret)[\s:=]['"][a-zA-Z0-9]{16,}['"]/i],
    analyze: (filePath: string, snippet?: string): SecurityFix => {
      return {
        title: 'Secure API Key',
        priority: 'high',
        steps: [
          'Rotate the exposed API key immediately',
          'Use environment variables',
          'Implement a secrets manager',
          'Review key permissions and scopes',
          'Monitor for unauthorized usage'
        ],
        codeExamples: {
          bad: snippet || 'API_KEY="sk_live_1234567890"',
          good: 'const apiKey = process.env.API_KEY'
        },
        automation: {
          command: 'Move to environment variable',
          script: 'echo "API_KEY=your_new_key_here" >> .env'
        }
      };
    }
  },

  'Sensitive File Detected': {
    patterns: ['.env', '.env.local', '.env.prod'],
    analyze: (filePath: string, snippet?: string): SecurityFix => {
      const fileName = filePath.split('/').pop() || '';
      
      return {
        title: `Secure ${fileName} File`,
        priority: 'immediate',
        steps: [
          `Add "${fileName}" to .gitignore`,
          'Create .env.example template',
          'Move actual values to environment variables',
          'Document required environment variables',
          'Use dotenv or similar package to load'
        ],
        codeExamples: {
          bad: `${fileName}:\nDB_PASSWORD=SuperSecret123!\nAPI_KEY=sk_live_1234567890`,
          good: `.env.example:\nDB_PASSWORD=your_db_password_here\nAPI_KEY=your_api_key_here\n\n.gitignore:\n${fileName}`
        },
        automation: {
          command: `Add to .gitignore and create template`,
          script: `echo "${fileName}" >> .gitignore && cp ${fileName} ${fileName}.example && sed -i 's/=.*/=/' ${fileName}.example`
        }
      };
    }
  },

  'Discord Bot Token': {
    patterns: [/[a-zA-Z0-9_-]{23,28}\.[a-zA-Z0-9_-]{6,7}\.[a-zA-Z0-9_-]{27,}/],
    analyze: (filePath: string, snippet?: string): SecurityFix => {
      return {
        title: 'Rotate Discord Bot Token',
        priority: 'immediate',
        steps: [
          'Go to Discord Developer Portal',
          'Generate new bot token',
          'Update environment variable',
          'Revoke old token immediately',
          'Test bot functionality'
        ],
        codeExamples: {
          bad: `const token = 'MTEyMzQ1Njc4OTAxMTIzNDU2Nzg5MDExMjM0NTY3ODkwMQ.AbCdEf.GhIjKlMnOpQrStUvWxYz'`,
          good: `const token = process.env.DISCORD_BOT_TOKEN`
        },
        automation: {
          command: 'Replace with environment variable',
          script: `sed -i "s/'[A-Za-z0-9._-]*'\\s*[:=]/process.env.DISCORD_BOT_TOKEN/g" "${filePath}"`
        }
      };
    }
  },

  'GitHub Personal Access Token': {
    patterns: [/gh[pous]_[a-zA-Z0-9]{36,255}/],
    analyze: (filePath: string, snippet?: string): SecurityFix => {
      return {
        title: 'Secure GitHub Token',
        priority: 'critical', 
        steps: [
          'Go to GitHub Settings → Developer settings',
          'Generate new fine-grained token',
          'Set minimal required permissions',
          'Add to repository secrets (for CI/CD)',
          'Set expiration date (max 1 year)'
        ],
        codeExamples: {
          bad: `const githubToken = 'ghp_1234567890abcdef'`,
          good: `const githubToken = process.env.GITHUB_TOKEN`
        },
        automation: {
          command: 'Move to environment variable',
          script: `echo "GITHUB_TOKEN=your_new_token_here" >> .env`
        }
      };
    }
  },

  'Hardcoded Admin Credentials': {
    patterns: [/email.*['"][^'"]+@[^'"]+['"]/, /password.*['"][^'"]{6,}['"]/],
    analyze: (filePath: string, snippet?: string): SecurityFix => {
      return {
        title: 'Remove Hardcoded Credentials',
        priority: 'critical',
        steps: [
          'Extract to environment variables',
          'Implement proper authentication',
          'Use password hashing (bcrypt, argon2)',
          'Add rate limiting',
          'Enable multi-factor authentication'
        ],
        codeExamples: {
          bad: `const admin = { email: 'admin@example.com', password: '123456' }`,
          good: `const admin = { \n  email: process.env.ADMIN_EMAIL,\n  password: await hash(process.env.ADMIN_PASSWORD)\n}`
        },
        automation: null
      };
    }
  },

  'Backdoor API Endpoint': {
    patterns: [/force-reset|backdoor|recovery|admin-reset/],
    analyze: (filePath: string, snippet?: string): SecurityFix => {
      return {
        title: 'Secure Admin Endpoint',
        priority: 'high',
        steps: [
          'Add proper authentication middleware',
          'Implement audit logging',
          'Add IP whitelisting',
          'Set rate limiting',
          'Require multi-factor authentication',
          'Consider removing if not needed'
        ],
        codeExamples: {
          bad: `app.get('/force-reset-admin', forceReset)`,
          good: `app.get('/admin/reset', \n  authenticateAdmin,\n  requireMFA,\n  auditLog('admin_reset'),\n  rateLimit({ window: 900000, max: 1 }),\n  resetHandler\n)`
        },
        automation: null
      };
    }
  },

  'Hardcoded JWT Secret': {
    patterns: [/JWT_SECRET.*['"][^'"]{10,}['"]/],
    analyze: (filePath: string, snippet?: string): SecurityFix => {
      return {
        title: 'Secure JWT Configuration',
        priority: 'critical',
        steps: [
          'Generate strong random secret (32+ chars)',
          'Use environment variable',
          'Consider asymmetric keys (RS256)',
          'Set appropriate expiration time',
          'Implement token refresh mechanism'
        ],
        codeExamples: {
          bad: `const jwtSecret = 'my-weak-secret-key'`,
          good: `const jwtSecret = process.env.JWT_SECRET || crypto.randomBytes(32).toString('hex')`
        },
        automation: {
          command: 'Generate secure JWT secret',
          script: `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`
        }
      };
    }
  },

  'Mass Data Deletion': {
    patterns: [/deleteMany|dropDatabase|remove\(\{\}\)/],
    analyze: (filePath: string, snippet?: string): SecurityFix => {
      return {
        title: 'Secure Data Deletion',
        priority: 'high',
        steps: [
          'Add confirmation dialogs',
          'Implement audit logging',
          'Restrict to admin users only',
          'Add soft delete instead of hard delete',
          'Set up data backup before deletion'
        ],
        codeExamples: {
          bad: `await User.deleteMany({})`,
          good: `// Add confirmation, logging, and admin check\nif (isAdmin && confirmDelete) {\n  await logDeletion();\n  await User.updateMany({}, { deleted: true });\n}`
        },
        automation: null
      };
    }
  },

  'Suspicious Comment': {
    patterns: [/TODO.*password|FIXME.*credential|HACK.*admin/i],
    analyze: (filePath: string, snippet?: string): SecurityFix => {
      return {
        title: 'Review Suspicious Comment',
        priority: 'medium',
        steps: [
          'Review the comment for security risks',
          'Remove or fix the commented code',
          'Document proper security practices',
          'Consider using issue tracker instead of comments',
          'Ensure no sensitive data in comments'
        ],
        codeExamples: {
          bad: `// TODO: Change password before production\n// HACK: Admin bypass for testing`,
          good: `// Implement proper authentication\n// Use environment variables for credentials`
        },
        automation: null
      };
    }
  }
};

export class SecurityAI {
  static analyzeProblem(result: ScanResult): SecurityFix {
    const { type, filePath, snippet } = result;
    
    const knowledge = SECURITY_KNOWLEDGE_BASE[type as keyof typeof SECURITY_KNOWLEDGE_BASE];
    
    if (knowledge) {
      return knowledge.analyze(filePath, snippet);
    }

    return this.generalFix(result);
  }

  private static generalFix(result: ScanResult): SecurityFix {
    const severityMap: Record<string, 'immediate' | 'high' | 'medium' | 'low'> = {
      critical: 'immediate',
      high: 'high',
      medium: 'medium',
      low: 'low'
    };

    return {
      title: `Fix ${result.type}`,
      priority: severityMap[result.severity] || 'medium',
      steps: [
        'Review the code for sensitive information',
        'Remove hardcoded values',
        'Use environment variables',
        'Add to .gitignore if applicable',
        'Document the changes',
        'Test the fix thoroughly'
      ],
      codeExamples: {
        bad: result.snippet || 'Sensitive data found in code',
        good: '// Use environment variables:\nconst value = process.env.YOUR_VARIABLE;\n\n// Add to .gitignore if file-based'
      },
      automation: null
    };
  }

  static generateFixCommand(result: ScanResult): string | null {
    const fix = this.analyzeProblem(result);
    
    if (fix.automation) {
      return `# ${fix.automation.command}\n${fix.automation.script}`;
    }
    
    return null;
  }

  static calculateRiskScore(result: ScanResult): number {
    const severityScores = {
      critical: 100,
      high: 75,
      medium: 40,
      low: 15
    };

    let score = severityScores[result.severity] || 20;
    
    if (result.type.includes('Hardcoded')) score += 20;
    if (result.type.includes('Token')) score += 15;
    if (result.type.includes('Password')) score += 25;
    if (result.type.includes('Secret')) score += 30;
    if (result.filePath.includes('.env')) score += 35;
    if (result.type.includes('Critical') || result.severity === 'critical') score += 40;
    
    return Math.min(score, 100);
  }

  static canAutoFix(result: ScanResult): boolean {
    const autoFixableTypes = [
      'Sensitive File Detected',
      'Discord Bot Token',
      'GitHub Personal Access Token',
      'Generic API Key',
      'Hardcoded JWT Secret'
    ];
    
    return autoFixableTypes.includes(result.type);
  }

  static estimateFixTime(result: ScanResult): string {
    const riskScore = this.calculateRiskScore(result);
    
    if (riskScore >= 80) return 'Immediate (within 1 hour)';
    if (riskScore >= 60) return 'Urgent (within 4 hours)';
    if (riskScore >= 40) return 'High priority (within 24 hours)';
    if (riskScore >= 20) return 'Medium priority (within 3 days)';
    return 'Low priority (within 1 week)';
  }
}

export default SecurityAI;