<script setup lang="ts">
import { ref } from 'vue'
import AnalysisNavSidebar from './AnalysisNavSidebar.vue'
import InsightsView from './InsightsView.vue'
import RiskAnalysisView from './RiskAnalysisView.vue'
import ComplianceView from './ComplianceView.vue'
import type { 
  AnalysisView, 
  ContractDocument, 
  AIInsight, 
  RiskItem, 
  ComplianceItem 
} from './types'

// Current view state
const activeView = ref<AnalysisView>('insights')
const navCollapsed = ref(false)

// Sample contract document data
const document = ref<ContractDocument>({
  id: 'tech-acquisition-2024',
  title: 'Tech Acquisition Agreement Q4 2024',
  type: 'acquisition',
  effectiveDate: '2024-01-15',
  parties: {
    buyer: 'TechCorp Inc.',
    seller: 'InnovateSoft LLC',
    names: ['TechCorp Inc.', 'InnovateSoft LLC']
  },
  value: 25000000,
  currency: 'USD',
  sections: [
    {
      id: 'terms',
      title: '1. Terms & Conditions',
      page: 1,
      content: 'This Technology Acquisition Agreement (the "Agreement") is entered into as of January 15, 2024 (the "Effective Date") by and between TechCorp Inc., a Delaware corporation ("Buyer"), and InnovateSoft LLC, a California limited liability company ("Seller").\n\nWHEREAS, Seller owns certain intellectual property, technology assets, and business operations related to legal document processing software; and WHEREAS, Buyer desires to acquire such assets and operations from Seller on the terms and conditions set forth herein.'
    },
    {
      id: 'payment',
      title: '2. Payment Terms',
      page: 2,
      content: 'The aggregate purchase price for the acquired assets shall be Twenty-Five Million Dollars ($25,000,000), payable as follows: (a) $15,000,000 at closing; (b) $7,500,000 in twelve monthly installments; and (c) $2,500,000 contingent upon achievement of performance milestones.'
    },
    {
      id: 'ip-rights',
      title: '3. IP Rights',
      page: 4,
      content: 'Seller hereby assigns, transfers, and conveys to Buyer all right, title, and interest in and to the Acquired IP, including without limitation all patents, trademarks, copyrights, trade secrets, and other proprietary rights related to the legal AI processing technology.'
    },
    {
      id: 'warranties',
      title: '4. Warranties',
      page: 6,
      content: 'Seller represents and warrants that: (a) it has full power and authority to enter into this Agreement; (b) the Acquired IP does not infringe upon the rights of any third party; (c) there is no pending or threatened litigation relating to the Acquired IP; and (d) all employees have signed appropriate assignment agreements.'
    },
    {
      id: 'termination',
      title: '5. Termination',
      page: 9,
      content: 'This Agreement may be terminated: (a) by mutual written consent of the parties; (b) by either party if closing has not occurred within 90 days; (c) by either party if the other materially breaches this Agreement and fails to cure within 30 days of notice.'
    },
    {
      id: 'governing-law',
      title: '6. Governing Law',
      page: 11,
      content: 'This Agreement shall be governed by and construed in accordance with the laws of the State of Delaware, without regard to its conflict of laws principles. Any disputes arising hereunder shall be resolved in the state or federal courts located in Delaware.'
    },
  ]
})

// AI Insights data
const insights = ref<AIInsight[]>([
  {
    id: 'missing-force-majeure',
    type: 'risk',
    severity: 'high',
    title: 'Missing Force Majeure',
    description: 'No force majeure clause found. Consider adding protection for unforeseen circumstances.',
    recommendation: 'Add a standard force majeure clause to protect both parties from unforeseeable events.',
    tag: 'risk',
    status: 'open'
  },
  {
    id: 'gdpr-compliant',
    type: 'compliance',
    severity: 'low',
    title: 'GDPR Compliant',
    description: 'Data processing terms meet GDPR requirements.',
    tag: 'compliance',
    status: 'resolved'
  },
  {
    id: 'liability-cap',
    type: 'suggestion',
    severity: 'medium',
    title: 'Liability Cap Low',
    description: 'Liability limitation of $50K may be insufficient for this transaction size.',
    recommendation: 'Consider increasing liability cap to at least 10% of contract value ($2.5M).',
    tag: 'suggestion',
    status: 'open'
  },
])

// Risk Analysis data
const risks = ref<RiskItem[]>([
  {
    id: 'risk-1',
    category: 'legal',
    title: 'Missing Force Majeure Clause',
    description: 'Contract lacks protection against unforeseeable events that could prevent performance.',
    severity: 'high',
    likelihood: 'possible',
    impact: 'Could result in breach liability during force majeure events',
    mitigation: 'Add standard force majeure language covering natural disasters, pandemics, government actions',
    sectionRef: 'termination',
    status: 'identified'
  },
  {
    id: 'risk-2',
    category: 'financial',
    title: 'Low Liability Cap',
    description: 'Liability limitation of $50K is insufficient for a $25M transaction.',
    severity: 'medium',
    likelihood: 'likely',
    impact: 'Inadequate recovery in case of breach or negligence',
    mitigation: 'Negotiate liability cap to at least $2.5M (10% of deal value)',
    sectionRef: 'warranties',
    status: 'mitigating'
  },
  {
    id: 'risk-3',
    category: 'operational',
    title: 'Unclear IP Transfer Timeline',
    description: 'No specific timeline for IP rights transfer and registration.',
    severity: 'medium',
    likelihood: 'possible',
    impact: 'Delays in acquiring full IP ownership and protection',
    mitigation: 'Add specific deadlines for IP transfer documentation and registration',
    sectionRef: 'ip-rights',
    status: 'identified'
  },
  {
    id: 'risk-4',
    category: 'legal',
    title: 'Limited Indemnification Scope',
    description: 'Indemnification does not cover third-party IP claims adequately.',
    severity: 'high',
    likelihood: 'possible',
    impact: 'Buyer may be exposed to third-party IP infringement claims',
    mitigation: 'Expand indemnification to explicitly cover IP infringement by prior owners',
    sectionRef: 'warranties',
    status: 'identified'
  },
  {
    id: 'risk-5',
    category: 'reputational',
    title: 'No Non-Disparagement Clause',
    description: 'No protection against negative statements by seller post-acquisition.',
    severity: 'low',
    likelihood: 'unlikely',
    impact: 'Potential reputation damage from seller statements',
    mitigation: 'Add mutual non-disparagement provisions',
    status: 'accepted'
  },
])

// Compliance data
const compliance = ref<ComplianceItem[]>([
  {
    id: 'gdpr-1',
    standard: 'GDPR',
    requirement: 'Data Processing Agreement included',
    status: 'compliant',
    evidence: 'Section 4.2 includes DPA terms',
    sectionRef: 'warranties'
  },
  {
    id: 'gdpr-2',
    standard: 'GDPR',
    requirement: 'Data subject rights addressed',
    status: 'compliant',
    evidence: 'Section 4.3 covers data subject rights',
    sectionRef: 'warranties'
  },
  {
    id: 'gdpr-3',
    standard: 'GDPR',
    requirement: 'Cross-border transfer mechanisms',
    status: 'partial',
    notes: 'SCCs referenced but not attached',
    sectionRef: 'governing-law'
  },
  {
    id: 'soc2-1',
    standard: 'SOC 2',
    requirement: 'Security controls documentation',
    status: 'compliant',
    evidence: 'Exhibit C contains security requirements'
  },
  {
    id: 'soc2-2',
    standard: 'SOC 2',
    requirement: 'Incident response procedures',
    status: 'non-compliant',
    notes: 'No breach notification timeline specified'
  },
  {
    id: 'hipaa-1',
    standard: 'HIPAA',
    requirement: 'Business Associate Agreement',
    status: 'not-applicable',
    notes: 'Contract does not involve PHI'
  },
  {
    id: 'ccpa-1',
    standard: 'CCPA',
    requirement: 'Consumer data rights',
    status: 'compliant',
    evidence: 'Privacy terms align with CCPA requirements'
  },
  {
    id: 'ccpa-2',
    standard: 'CCPA',
    requirement: 'Sale of data opt-out',
    status: 'partial',
    notes: 'General terms present, specific opt-out mechanism unclear'
  },
])

// Event handlers
const handleDownload = () => {
  console.log('Download document')
}

const handleShare = () => {
  console.log('Share document')
}

const handleSelectInsight = (insightId: string) => {
  console.log('Selected insight:', insightId)
}

const handleSelectRisk = (riskId: string) => {
  console.log('Selected risk:', riskId)
}

const handleSelectCompliance = (complianceId: string) => {
  console.log('Selected compliance:', complianceId)
}
</script>

<template>
  <div class="flex h-full w-full">
    <!-- Left Navigation Sidebar -->
    <AnalysisNavSidebar
      v-model:active-view="activeView"
      v-model:collapsed="navCollapsed"
    />
    
    <!-- Main Content Area - Dynamic based on active view -->
    <div class="flex-1 min-w-0">
      <InsightsView
        v-if="activeView === 'insights'"
        :document="document"
        :insights="insights"
        @download="handleDownload"
        @share="handleShare"
        @select-insight="handleSelectInsight"
      />
      
      <RiskAnalysisView
        v-else-if="activeView === 'risk-analysis'"
        :document="document"
        :risks="risks"
        @select-risk="handleSelectRisk"
      />
      
      <ComplianceView
        v-else-if="activeView === 'compliance'"
        :document="document"
        :compliance="compliance"
        @select-compliance="handleSelectCompliance"
      />
    </div>
  </div>
</template>
