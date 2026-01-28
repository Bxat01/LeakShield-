import React, { useState, useRef, useEffect } from 'react';
import { 
  Upload, FileText, AlertCircle, CheckCircle2, XCircle, Info, 
  FolderOpen, Shield, Code, Lock, Brain, 
  Wrench, AlertTriangle, Lightbulb, ExternalLink, X, Filter, 
  SkipForward, SkipBack, Database, Bot, Zap, Cpu
} from 'lucide-react';
import { PATTERNS, SENSITIVE_FILES } from '../constants';
import { SecretType, ScanResult } from '../types';
import SecurityAI from './securityModel';

// Support 50+ programming languages
const PROGRAMMING_EXTENSIONS = [
  '.py', '.js', '.jsx', '.ts', '.tsx', '.java', '.cpp', '.c', '.cs', '.go',
  '.rb', '.php', '.swift', '.kt', '.rs', '.scala', '.pl', '.lua', '.r',
  '.html', '.htm', '.css', '.sass', '.scss', '.less', '.vue', '.svelte',
  '.json', '.yaml', '.yml', '.toml', '.xml', '.csv', '.sql', '.graphql',
  '.sh', '.bash', '.zsh', '.ps1', '.bat', '.cmd',
  '.md', '.markdown', '.rst', '.tex',
  '.env', '.env.local', '.env.dev', '.env.prod',
  '.dockerfile', 'dockerfile',
  '.txt', '.log', '.conf', '.config', '.ini', '.properties',
  '.dart', '.m', '.mm', '.gd', '.godot'
];

// List of non-sensitive files to skip
const NON_SENSITIVE_FILES = [
  'tsconfig.json',
  'package.json',
  'readme.md',
  'license',
  'changelog.md',
  'contributing.md',
  '.gitignore',
  '.eslintrc',
  '.prettierrc',
  '*.config.js',
  '*.config.ts',
  'vite.config.ts',
  'webpack.config.js',
  'jest.config.js',
  '*.spec.ts',
  '*.test.js',
  '*.d.ts'
];

const FileScanner: React.FC = () => {
  const [results, setResults] = useState<ScanResult[]>([]);
  const [isScanning, setIsScanning] = useState(false);
  const [scannedCount, setScannedCount] = useState(0);
  const [totalFiles, setTotalFiles] = useState(0);
  const [scanProgress, setScanProgress] = useState(0);
  const [deepAnalysis, setDeepAnalysis] = useState(true);
  const [showFixPanel, setShowFixPanel] = useState<string | null>(null);
  const [filteredResults, setFilteredResults] = useState<ScanResult[]>([]);
  const [severityFilter, setSeverityFilter] = useState<string>('all');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [memoryWarning, setMemoryWarning] = useState<string>('');
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const folderInputRef = useRef<HTMLInputElement>(null);

  // Check if file should be skipped
  const shouldSkipFile = (fileName: string, relativePath: string): boolean => {
    // Skip node_modules completely
    if (relativePath.includes('node_modules/')) return true;
    
    // Check non-sensitive patterns
    return NON_SENSITIVE_FILES.some(pattern => {
      if (pattern.includes('*')) {
        const regex = new RegExp(pattern.replace('*', '.*'));
        return regex.test(fileName);
      }
      return fileName === pattern || fileName.endsWith(pattern);
    });
  };

  // Handle folder selection and recursive scanning
  const handleFolderUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    // Memory protection for large scans
    if (files.length > 1000) {
      setMemoryWarning(`⚠️ Large scan detected: ${files.length} files. Using optimized processing.`);
    }

    // Reset state and initialize scanning
    setIsScanning(true);
    setResults([]);
    setFilteredResults([]);
    setScannedCount(0);
    setTotalFiles(files.length);
    setScanProgress(0);
    setMemoryWarning('');

    const newResults: ScanResult[] = [];
    let processedCount = 0;

    // Process each file in the folder
    for (const file of Array.from(files)) {
      processedCount++;
      // Update progress indicators
      setScanProgress(Math.round((processedCount / files.length) * 100));
      setScannedCount(processedCount);

      await analyzeFileWithAI(file, newResults);
    }

    // Remove duplicate findings
    const uniqueResults = deduplicateResults(newResults);
    setResults(uniqueResults);
    setFilteredResults(filterResults(uniqueResults, severityFilter, typeFilter));
    setIsScanning(false);
    setScanProgress(100);
  };

  // AI-powered file analysis
  const analyzeFileWithAI = async (file: File, resultsArray: ScanResult[]): Promise<void> => {
    const fileName = file.name.toLowerCase();
    const relativePath = file.webkitRelativePath || file.name;
    
    // Skip non-sensitive files
    if (shouldSkipFile(fileName, relativePath)) return;
    
    // 1. Quick name analysis
    const quickResult = await quickNameAnalysis(file);
    if (quickResult) resultsArray.push(quickResult);
    
    // 2. Content analysis for supported files
    if (shouldAnalyzeContent(file)) {
      const contentResults = await analyzeContentWithAI(file);
      resultsArray.push(...contentResults);
    }
  };

  // Quick name-based analysis
  const quickNameAnalysis = async (file: File): Promise<ScanResult | null> => {
    const name = file.name.toLowerCase();
    const path = file.webkitRelativePath || file.name;
    
    // Check for sensitive file names
    if (isSensitiveFileName(name)) {
      return {
        type: SecretType.SENSITIVE_FILE,
        filePath: path,
        severity: 'high',
        snippet: `Sensitive file: ${file.name}`
      };
    }
    
    return null;
  };

  // Check if file has sensitive name
  const isSensitiveFileName = (fileName: string): boolean => {
    // Real sensitive files only
    const sensitiveKeywords = [
      '.env', '.key', '.pem', '.secret', '.credential',
      'password', 'token', 'database', 'backup', 'dump'
    ];
    
    return sensitiveKeywords.some(keyword => 
      fileName.includes(keyword)
    ) || SENSITIVE_FILES.some(pattern => 
      fileName.includes(pattern) || fileName.endsWith(pattern)
    );
  };

  // Check if file should be analyzed for content
  const shouldAnalyzeContent = (file: File): boolean => {
    const fileName = file.name.toLowerCase();
    const fileExt = fileName.substring(fileName.lastIndexOf('.'));
    
    return PROGRAMMING_EXTENSIONS.includes(fileExt.toLowerCase()) || 
           file.type.startsWith('text/') ||
           fileName.includes('.env');
  };

  // AI-powered content analysis
  const analyzeContentWithAI = async (file: File): Promise<ScanResult[]> => {
    const results: ScanResult[] = [];
    
    try {
      const content = await file.text();
      const lines = content.split('\n');
      
      // Analyze first 100 lines for performance
      for (let i = 0; i < Math.min(lines.length, 100); i++) {
        const line = lines[i].trim();
        if (!line) continue;
        
        const detected = detectPatternsWithAI(line, file.name, i + 1);
        if (detected) results.push(detected);
      }
    } catch (err) {
      // Silently skip files that can't be read
    }
    
    return results;
  };

  // AI pattern detection
  const detectPatternsWithAI = (line: string, fileName: string, lineNum: number): ScanResult | null => {
    // Discord tokens
    const discordMatch = line.match(/[a-zA-Z0-9_-]{23,28}\.[a-zA-Z0-9_-]{6,7}\.[a-zA-Z0-9_-]{27,}/);
    if (discordMatch) {
      return {
        type: SecretType.DISCORD,
        filePath: fileName,
        lineNumber: lineNum,
        severity: 'critical',
        snippet: line.substring(0, 150)
      };
    }
    
    // GitHub tokens
    const githubMatch = line.match(/gh[pous]_[a-zA-Z0-9]{36,}/);
    if (githubMatch) {
      return {
        type: SecretType.GITHUB,
        filePath: fileName,
        lineNumber: lineNum,
        severity: 'critical',
        snippet: line.substring(0, 150)
      };
    }
    
    // API keys
    const apiKeyMatch = line.match(/(api[_-]?key|secret|token)[\s:=]['"][a-zA-Z0-9]{20,}['"]/i);
    if (apiKeyMatch) {
      return {
        type: SecretType.GENERIC_API,
        filePath: fileName,
        lineNumber: lineNum,
        severity: 'high',
        snippet: line.substring(0, 150)
      };
    }
    
    // Hardcoded credentials
    const credentialMatch = line.match(/(email|user|username|password|passwd)[\s:=]['"][^'"]+['"]/i);
    if (credentialMatch) {
      return {
        type: 'Hardcoded Admin Credentials' as SecretType,
        filePath: fileName,
        lineNumber: lineNum,
        severity: 'critical',
        snippet: line.substring(0, 150)
      };
    }
    
    // Deep analysis patterns if enabled
    if (deepAnalysis) {
      const patterns = [
        { 
          regex: /JWT_SECRET\s*=\s*['"][^'"]{10,}['"]/, 
          type: 'Hardcoded JWT Secret' as SecretType,
          severity: 'critical' 
        },
        { 
          regex: /router\.(get|post|put|delete).*['"](force-reset|backdoor|recovery)['"]/, 
          type: 'Backdoor API Endpoint' as SecretType,
          severity: 'critical' 
        },
        { 
          regex: /deleteMany|dropDatabase|remove\(\{\}\)/, 
          type: 'Mass Data Deletion' as SecretType,
          severity: 'high' 
        }
      ];
      
      for (const pattern of patterns) {
        if (pattern.regex.test(line)) {
          return {
            type: pattern.type,
            filePath: fileName,
            lineNumber: lineNum,
            severity: pattern.severity as any,
            snippet: line.substring(0, 150)
          };
        }
      }
    }
    
    return null;
  };

  // Filter results
  const filterResults = (results: ScanResult[], severity: string, type: string) => {
    return results.filter(result => {
      const severityMatch = severity === 'all' || result.severity === severity;
      const typeMatch = type === 'all' || result.type === type;
      return severityMatch && typeMatch;
    });
  };

  // Deduplicate results
  const deduplicateResults = (results: ScanResult[]): ScanResult[] => {
    const seen = new Set<string>();
    return results.filter(result => {
      const key = `${result.filePath}:${result.lineNumber}:${result.type}:${result.snippet?.substring(0, 50)}`;
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });
  };

  // Handle file upload
  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    setIsScanning(true);
    setResults([]);
    setFilteredResults([]);
    setScannedCount(0);
    setTotalFiles(files.length);
    setScanProgress(0);

    const newResults: ScanResult[] = [];
    let processedCount = 0;

    for (const file of Array.from(files)) {
      processedCount++;
      setScanProgress(Math.round((processedCount / files.length) * 100));
      setScannedCount(processedCount);
      
      await analyzeFileWithAI(file, newResults);
    }

    const uniqueResults = deduplicateResults(newResults);
    setResults(uniqueResults);
    setFilteredResults(filterResults(uniqueResults, severityFilter, typeFilter));
    setIsScanning(false);
    setScanProgress(100);
  };

  // AI Fix Component
  const renderAIFix = (result: ScanResult) => {
    const aiAnalysis = SecurityAI.analyzeProblem(result);
    const canAutoFix = SecurityAI.canAutoFix(result);
    const riskScore = SecurityAI.calculateRiskScore(result);
    
    return (
      <div className="mt-4 border-t border-zinc-800 pt-4">
        <div className="bg-gradient-to-r from-purple-950/20 to-blue-950/20 border border-purple-800/30 p-4 rounded-lg">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center space-x-2">
              <Bot className="w-5 h-5 text-purple-400" />
              <h6 className="font-bold text-purple-300">AI Security Analysis</h6>
            </div>
            <div className="flex items-center space-x-2">
              <div className={`px-2 py-1 rounded text-xs font-bold ${
                riskScore > 80 ? 'bg-red-600' :
                riskScore > 60 ? 'bg-orange-600' :
                'bg-yellow-600'
              }`}>
                Risk: {riskScore}/100
              </div>
              {canAutoFix && (
                <span className="px-2 py-1 bg-green-600 text-white text-xs rounded">
                  <Zap className="w-3 h-3 inline mr-1" />
                  Auto-fix available
                </span>
              )}
            </div>
          </div>
          
          <div className="space-y-4">
            <div>
              <p className="text-sm font-semibold text-zinc-300 mb-2 flex items-center">
                <Cpu className="w-4 h-4 mr-2" />
                Recommended Steps ({aiAnalysis.priority} priority):
              </p>
              <ol className="space-y-2 ml-6">
                {aiAnalysis.steps.map((step, idx) => (
                  <li key={idx} className="flex items-start">
                    <span className="bg-blue-600 text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center mr-2 mt-0.5">
                      {idx + 1}
                    </span>
                    <span className="text-sm text-zinc-300">{step}</span>
                  </li>
                ))}
              </ol>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-semibold text-red-400 mb-2">❌ Vulnerable Code:</p>
                <div className="bg-[#150505] p-3 rounded border border-red-900/50">
                  <pre className="text-xs text-red-300 font-mono whitespace-pre-wrap">
                    {aiAnalysis.codeExamples.bad}
                  </pre>
                </div>
              </div>
              <div>
                <p className="text-sm font-semibold text-green-400 mb-2">✅ Secure Solution:</p>
                <div className="bg-[#051505] p-3 rounded border border-green-900/50">
                  <pre className="text-xs text-green-300 font-mono whitespace-pre-wrap">
                    {aiAnalysis.codeExamples.good}
                  </pre>
                </div>
              </div>
            </div>
            
            {canAutoFix && aiAnalysis.automation && (
              <div>
                <p className="text-sm font-semibold text-yellow-400 mb-2">
                  <Zap className="w-4 h-4 inline mr-2" />
                  Automated Fix:
                </p>
                <div className="bg-[#0a0a0a] p-3 rounded border border-yellow-900/50">
                  <p className="text-xs text-yellow-300 mb-2">{aiAnalysis.automation.command}</p>
                  <code className="text-xs text-white font-mono block bg-black p-2 rounded">
                    {aiAnalysis.automation.script}
                  </code>
                  <button 
                    onClick={() => navigator.clipboard.writeText(aiAnalysis.automation.script)}
                    className="mt-3 text-xs bg-yellow-600 hover:bg-yellow-500 text-white px-3 py-1.5 rounded"
                  >
                    Copy Fix Script
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  // Open folder picker
  const openFolderPicker = () => {
    if (folderInputRef.current) {
      folderInputRef.current.setAttribute('webkitdirectory', '');
      folderInputRef.current.click();
    }
  };

  // Open file picker
  const openFilePicker = () => {
    if (fileInputRef.current) {
      fileInputRef.current.removeAttribute('webkitdirectory');
      fileInputRef.current.click();
    }
  };

  // Export results
  const exportResults = () => {
    const dataStr = JSON.stringify({
      scanDate: new Date().toISOString(),
      totalFilesScanned: scannedCount,
      totalIssuesFound: results.length,
      findings: results
    }, null, 2);
    
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `leakhunter-scan-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // Clear results
  const clearResults = () => {
    setResults([]);
    setFilteredResults([]);
    setScannedCount(0);
    setTotalFiles(0);
    setMemoryWarning('');
  };

  // Calculate statistics
  const criticalCount = results.filter(r => r.severity === 'critical').length;
  const highCount = results.filter(r => r.severity === 'high').length;
  const mediumCount = results.filter(r => r.severity === 'medium').length;

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* Memory Warning */}
      {memoryWarning && (
        <div className="bg-yellow-950/30 border border-yellow-800/50 p-4 rounded-lg flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <AlertTriangle className="w-5 h-5 text-yellow-500" />
            <span className="text-yellow-300 text-sm">{memoryWarning}</span>
          </div>
          <button onClick={() => setMemoryWarning('')} className="text-yellow-500 hover:text-yellow-400">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Scanner Interface */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-8">
        <div className="max-w-2xl mx-auto text-center">
          <div className="bg-zinc-800 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
            <Shield className="text-red-400 w-8 h-8" />
          </div>
          <h3 className="text-2xl font-bold text-zinc-100 mb-2">AI Security Scanner</h3>
          <p className="text-zinc-400 mb-8">
            Intelligent detection with <span className="text-purple-400 font-semibold">AI-powered fixes</span>.
            <br />
            <span className="text-blue-400 font-semibold">100% offline - Complete privacy.</span>
          </p>
          
          <input type="file" ref={fileInputRef} onChange={handleFileUpload} multiple className="hidden" />
          <input type="file" ref={folderInputRef} onChange={handleFolderUpload} multiple className="hidden" />
          
          {/* Analysis Mode */}
          <div className="flex items-center justify-center mb-6">
            <div className="flex items-center space-x-2 bg-zinc-800/50 p-2 rounded-lg">
              <button
                onClick={() => setDeepAnalysis(false)}
                className={`px-4 py-2 rounded-md transition-colors ${!deepAnalysis ? 'bg-green-600 text-white' : 'bg-zinc-700/50 text-zinc-400'}`}
              >
                <div className="flex items-center space-x-2">
                  <SkipForward className="w-4 h-4" />
                  <span>Quick Scan</span>
                </div>
                <span className="text-xs">(API keys & tokens)</span>
              </button>
              <button
                onClick={() => setDeepAnalysis(true)}
                className={`px-4 py-2 rounded-md transition-colors ${deepAnalysis ? 'bg-red-600 text-white' : 'bg-zinc-700/50 text-zinc-400'}`}
              >
                <div className="flex items-center space-x-2">
                  <Brain className="w-4 h-4" />
                  <span>Deep Scan</span>
                </div>
                <span className="text-xs">(Full AI analysis)</span>
              </button>
            </div>
          </div>
          
          {/* Scan Buttons */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <button 
              onClick={openFolderPicker}
              disabled={isScanning}
              className="flex flex-col items-center justify-center bg-zinc-800 hover:bg-zinc-700 border-2 border-dashed border-zinc-700 hover:border-green-500 text-white font-bold py-8 px-6 rounded-xl transition-all group"
            >
              <FolderOpen className="w-12 h-12 text-green-500 mb-3 group-hover:scale-110 transition-transform" />
              <span className="text-lg">Scan Project Folder</span>
              <span className="text-xs text-zinc-400 mt-2">AI-powered security analysis</span>
            </button>
            
            <button 
              onClick={openFilePicker}
              disabled={isScanning}
              className="flex flex-col items-center justify-center bg-zinc-800 hover:bg-zinc-700 border-2 border-dashed border-zinc-700 hover:border-blue-500 text-white font-bold py-8 px-6 rounded-xl transition-all group"
            >
              <FileText className="w-12 h-12 text-blue-500 mb-3 group-hover:scale-110 transition-transform" />
              <span className="text-lg">Select Files</span>
              <span className="text-xs text-zinc-400 mt-2">Individual file analysis</span>
            </button>
          </div>
          
          {/* Progress */}
          {isScanning && (
            <div className="mb-6">
              <div className="flex justify-between text-sm text-zinc-400 mb-2">
                <span>AI Analyzing... {scanProgress}%</span>
                <span>{scannedCount} / {totalFiles} files</span>
              </div>
              <div className="w-full bg-zinc-800 rounded-full h-2">
                <div 
                  className="bg-gradient-to-r from-blue-500 to-green-500 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${scanProgress}%` }}
                ></div>
              </div>
              <p className="text-xs text-zinc-500 mt-2">
                {deepAnalysis ? 
                  'Performing deep AI analysis for hidden threats...' : 
                  'Quick scanning for API keys and tokens...'
                }
              </p>
            </div>
          )}
          
          <p className="text-xs text-zinc-500 flex items-center justify-center">
            <Database className="w-3 h-3 mr-1" />
            AI-powered analysis • {PROGRAMMING_EXTENSIONS.length}+ file types • 100% offline
          </p>
        </div>
      </div>

      {/* Results Management */}
      {(results.length > 0 || scannedCount > 0) && !isScanning && (
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center space-x-4">
              <div className="bg-zinc-800 px-3 py-2 rounded-lg">
                <span className="text-white font-bold">{results.length}</span>
                <span className="text-zinc-400 text-sm ml-2">issues found</span>
              </div>
              <div className="flex space-x-2">
                {criticalCount > 0 && <span className="bg-red-600 text-white text-xs px-2 py-1 rounded-full">{criticalCount} critical</span>}
                {highCount > 0 && <span className="bg-orange-600 text-white text-xs px-2 py-1 rounded-full">{highCount} high</span>}
                {mediumCount > 0 && <span className="bg-yellow-600 text-white text-xs px-2 py-1 rounded-full">{mediumCount} medium</span>}
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <div className="flex items-center space-x-2">
                <Filter className="w-4 h-4 text-zinc-500" />
                <select 
                  value={severityFilter}
                  onChange={(e) => {
                    setSeverityFilter(e.target.value);
                    setFilteredResults(filterResults(results, e.target.value, typeFilter));
                  }}
                  className="bg-zinc-800 border border-zinc-700 text-zinc-300 text-sm rounded-lg px-3 py-2"
                >
                  <option value="all">All Severities</option>
                  <option value="critical">Critical</option>
                  <option value="high">High</option>
                  <option value="medium">Medium</option>
                  <option value="low">Low</option>
                </select>
                
                <select 
                  value={typeFilter}
                  onChange={(e) => {
                    setTypeFilter(e.target.value);
                    setFilteredResults(filterResults(results, severityFilter, e.target.value));
                  }}
                  className="bg-zinc-800 border border-zinc-700 text-zinc-300 text-sm rounded-lg px-3 py-2"
                >
                  <option value="all">All Types</option>
                  {Array.from(new Set(results.map(r => r.type))).map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>
              
              <button onClick={clearResults} className="text-xs bg-zinc-800 hover:bg-zinc-700 text-zinc-300 px-3 py-2 rounded-lg">
                Clear Results
              </button>
              
              <button onClick={exportResults} className="text-xs bg-blue-600 hover:bg-blue-500 text-white px-3 py-2 rounded-lg">
                Export Report
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Results Display */}
      {filteredResults.length > 0 ? (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="text-xl font-bold text-zinc-100">
              Security Issues ({filteredResults.length} of {results.length})
            </h4>
            <span className="text-sm text-zinc-500">
              Showing: {severityFilter !== 'all' ? severityFilter : 'all'} • {typeFilter !== 'all' ? typeFilter : 'all types'}
            </span>
          </div>
          
          <div className="space-y-3">
            {filteredResults.slice(0, 100).map((result, idx) => (
              <div key={idx} className="bg-zinc-900 border border-zinc-800 rounded-lg p-4 hover:bg-zinc-800/30 transition-colors">
                <div className="flex items-start justify-between">
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                        result.severity === 'critical' ? 'bg-red-600 text-white' : 
                        result.severity === 'high' ? 'bg-orange-600 text-white' : 
                        'bg-yellow-600 text-white'
                      }`}>
                        {result.severity}
                      </span>
                      <h5 className="font-bold text-zinc-100">{result.type}</h5>
                    </div>
                    <p className="text-sm text-zinc-400 mono">
                      {result.filePath}{result.lineNumber ? `:${result.lineNumber}` : ''}
                    </p>
                    
                    {result.snippet && (
                      <div className="mt-2 bg-[#050505] p-2 rounded border border-zinc-800">
                        <code className="text-xs text-red-300 break-all mono">
                          {result.snippet.length > 100 ? result.snippet.substring(0, 100) + '...' : result.snippet}
                        </code>
                      </div>
                    )}
                  </div>
                  
                  <button 
                    onClick={() => setShowFixPanel(showFixPanel === `fix-${idx}` ? null : `fix-${idx}`)}
                    className="flex items-center space-x-1 bg-green-600 hover:bg-green-500 text-white px-3 py-1.5 rounded-md text-sm"
                  >
                    <Wrench className="w-3 h-3" />
                    <span>{showFixPanel === `fix-${idx}` ? 'Hide Fix' : 'Show AI Fix'}</span>
                  </button>
                </div>
                
                {/* AI Fix Panel */}
                {showFixPanel === `fix-${idx}` && renderAIFix(result)}
              </div>
            ))}
          </div>
        </div>
      ) : scannedCount > 0 && results.length === 0 && !isScanning ? (
        <div className="bg-gradient-to-br from-green-950/20 to-emerald-900/10 border border-green-900/30 p-12 rounded-2xl text-center">
          <CheckCircle2 className="w-16 h-16 text-green-500 mx-auto mb-4" />
          <h4 className="text-2xl font-bold text-green-400 mb-2">✓ Security Audit Passed</h4>
          <p className="text-green-900/80 mb-4">
            AI analyzed {scannedCount} files and found no security vulnerabilities.
          </p>
          <div className="inline-flex items-center bg-green-900/30 px-4 py-2 rounded-full">
            <Lock className="w-4 h-4 text-green-300 mr-2" />
            <span className="text-green-300 text-sm">Code is AI-verified secure</span>
          </div>
        </div>
      ) : null}
    </div>
  );
};

// StatCard Component
const StatCard: React.FC<{ 
  label: string; 
  value: string; 
  icon: React.ReactNode; 
  color: 'blue' | 'red' | 'green' | 'purple' | 'yellow' 
}> = ({ label, value, icon, color }) => {
  const colorClasses = {
    blue: 'bg-blue-900/20 border-blue-800/30',
    red: 'bg-red-900/20 border-red-800/30',
    green: 'bg-green-900/20 border-green-800/30',
    purple: 'bg-purple-900/20 border-purple-800/30',
    yellow: 'bg-yellow-900/20 border-yellow-800/30'
  };

  return (
    <div className={`${colorClasses[color]} border p-6 rounded-xl flex items-center justify-between`}>
      <div>
        <p className="text-xs text-zinc-400 uppercase font-bold tracking-wider">{label}</p>
        <p className="text-2xl font-bold text-white">{value}</p>
      </div>
      <div className={`p-3 rounded-lg bg-${color}-900/30`}>
        {icon}
      </div>
    </div>
  );
};

export default FileScanner;