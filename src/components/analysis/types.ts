// Contract Analysis Types

export interface ContractDocument {
  id: string
  title: string
  type: 'acquisition' | 'employment' | 'nda' | 'service' | 'license' | 'other'
  effectiveDate: string
  parties: {
    buyer?: string
    seller?: string
    names: string[]
  }
  value?: number
  currency?: string
  sections: DocumentSection[]
}

export interface DocumentSection {
  id: string
  title: string
  page: number
  content: string
  subsections?: DocumentSection[]
}

export interface AIInsight {
  id: string
  type: 'risk' | 'compliance' | 'suggestion' | 'info'
  severity: 'high' | 'medium' | 'low'
  title: string
  description: string
  recommendation?: string
  sectionRef?: string
  tag?: string
  status?: 'open' | 'acknowledged' | 'resolved'
}

export interface RiskItem {
  id: string
  category: 'financial' | 'legal' | 'operational' | 'reputational'
  title: string
  description: string
  severity: 'critical' | 'high' | 'medium' | 'low'
  likelihood: 'likely' | 'possible' | 'unlikely'
  impact: string
  mitigation?: string
  sectionRef?: string
  status: 'identified' | 'mitigating' | 'accepted' | 'resolved'
}

export interface ComplianceItem {
  id: string
  standard: string // GDPR, SOC2, HIPAA, etc.
  requirement: string
  status: 'compliant' | 'non-compliant' | 'partial' | 'not-applicable'
  evidence?: string
  notes?: string
  sectionRef?: string
}

export interface AnalysisResult {
  document: ContractDocument
  insights: AIInsight[]
  risks: RiskItem[]
  compliance: ComplianceItem[]
  summary: {
    totalIssues: number
    criticalRisks: number
    complianceScore: number
    lastAnalyzed: string
  }
}

export type AnalysisView = 'insights' | 'risk-analysis' | 'compliance'
