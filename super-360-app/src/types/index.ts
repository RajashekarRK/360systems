// ========================================
// GREAT LAKES 360 SUPER APP - COMPREHENSIVE TYPE SYSTEM
// Combines ALL features from Nexus 360 + OKComputer 360
// ========================================

// Core Enums
export enum DegreeType {
  DEGREE_360 = '360',
  DEGREE_240 = '240',
  DEGREE_180 = '180',
  DEGREE_90 = '90',
}

export enum RaterType {
  SELF = 'self',
  MANAGER = 'manager',
  PEER = 'peer',
  DIRECT_REPORT = 'direct_report',
  EXTERNAL = 'external',
  SKIP_LEVEL = 'skip_level',
  COACH = 'coach',
  VENDOR = 'vendor'
}

export enum ClientStatus {
  ACTIVE = 'active',
  SUSPENDED = 'suspended',
  EXPIRED = 'expired'
}

export enum CommunicationChannel {
  EMAIL = 'email',
  SMS = 'sms',
  WHATSAPP = 'whatsapp',
  SLACK = 'slack',
  TEAMS = 'teams',
  IN_APP = 'in_app'
}

export enum IntegrationType {
  LDAP = 'ldap',
  SSO_SAML = 'sso_saml',
  SSO_OAUTH = 'sso_oauth',
  OKTA = 'okta',
  AZURE_AD = 'azure_ad',
  GOOGLE_WORKSPACE = 'google_workspace'
}

// Supported Languages
export type SupportedLanguage =
  | 'en' | 'hi' | 'ta' | 'te' | 'kn' | 'bn'
  | 'fr' | 'de' | 'zh' | 'es' | 'pt';

// Auth & User Types
export type UserRole =
  | 'super_admin'
  | 'client_admin'
  | 'faculty'
  | 'manager'
  | 'employee'
  | 'vendor'
  | 'hr_admin'
  | 'system_admin';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatarUrl?: string;
  clientId?: string;
  bio?: string;
  title?: string;
  department?: string;
  preferredLanguage?: SupportedLanguage;
  timezone?: string;
  phoneNumber?: string;
  twoFactorEnabled?: boolean;
  lastLogin?: string;
  createdAt?: string;
  permissions?: string[];
}

export interface AuthResponse {
  user: User;
  token: string;
  refreshToken?: string;
  requires2FA?: boolean;
  expiresIn?: number;
}

export interface TwoFactorAuth {
  userId: string;
  method: 'sms' | 'email' | 'authenticator';
  code: string;
  expiresAt: string;
  verified: boolean;
}

export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: 'info' | 'warning' | 'success' | 'error';
  read: boolean;
  date: string;
  actionUrl?: string;
  channel?: CommunicationChannel;
}

// Business Layer
export interface Client {
  id: string;
  name: string;
  creditsPurchased: number;
  creditsUsed: number;
  status: ClientStatus;
  logoUrl?: string;
  contractStart: string;
  contractEnd: string;
  subdomain?: string;
  branding?: BrandingConfig;
  integrations?: IntegrationConfig[];
  contactPerson?: string;
  contactEmail?: string;
  industry?: string;
  employeeCount?: number;
}

export interface BrandingConfig {
  primaryColor: string;
  secondaryColor?: string;
  logoUrl: string;
  companyName: string;
  welcomeMessage?: string;
  emailSignature?: string;
  customCSS?: string;
}

export interface IntegrationConfig {
  id: string;
  clientId: string;
  type: IntegrationType;
  enabled: boolean;
  settings: Record<string, any>;
  lastSyncedAt?: string;
}

// Organization Layer
export interface Department {
  id: string;
  clientId: string;
  name: string;
  headOfDepartment?: string;
  memberCount: number;
  parentDepartmentId?: string;
  budget?: number;
}

export interface Location {
  id: string;
  name: string;
  address?: string;
  city?: string;
  state?: string;
  country: string;
  clientId: string;
  timezone?: string;
  headCount?: number;
}

export interface JobRole {
  id: string;
  clientId: string;
  title: string;
  level: string;
  description?: string;
  mappedTemplateId?: string;
  competencyIds?: string[];
  salaryRange?: { min: number; max: number };
}

export interface OrgNode {
  id: string;
  name: string;
  role: string;
  email?: string;
  managerId?: string;
  children?: OrgNode[];
}

export interface Vendor {
  id: string;
  name: string;
  serviceType: string;
  contactEmail: string;
  contactPhone?: string;
  status: 'Active' | 'Inactive';
  rating?: number;
}

// Education/Program Layer
export interface Program {
  id: string;
  clientId: string;
  name: string;
  startDate: string;
  endDate: string;
  status: 'Planning' | 'Active' | 'Completed' | 'Calculating' | 'Finalized';
  participantCount?: number;
  reportsReady?: number;
  facultyLead?: string;
  raterWeights?: RaterWeightConfig;
  workflow?: ProgramWorkflow;
  gradingScaleId?: string;
  type: 'Annual' | 'Probation' | 'Project' | 'Custom';
  anonymityThreshold?: number;
}

export interface ProgramWorkflow {
  autoApproveInternal: boolean;
  allowExternalRaters: boolean;
  minRatersRequired: number;
  maxRatersAllowed?: number;
  reminderFrequencyDays: number;
  autoReminderEnabled: boolean;
  escalationEnabled: boolean;
}

export interface RaterWeightConfig {
  [RaterType.SELF]: number;
  [RaterType.MANAGER]: number;
  [RaterType.PEER]: number;
  [RaterType.DIRECT_REPORT]: number;
  [RaterType.EXTERNAL]: number;
  [RaterType.SKIP_LEVEL]?: number;
}

export interface EvaluationMatrixRow {
  participantId: string;
  participantName: string;
  raters: {
    raterId: string;
    raterName: string;
    raterEmail: string;
    raterType: RaterType;
    status: 'Pending' | 'Started' | 'Completed';
    lastActivity?: string;
  }[];
  completionRate: number;
  dueDate?: string;
}

export interface ProgramTemplate {
  id: string;
  name: string;
  type: 'Annual' | 'Probation' | 'Project' | 'Custom';
  defaultModules: string[];
  durationWeeks: number;
  description?: string;
}

export interface Module {
  id: string;
  programId: string;
  name: string;
  type: DegreeType;
  status: 'Draft' | 'Nomination' | 'Survey' | 'Reporting';
  progress?: number;
  competencies?: Competency[];
  anonymityThreshold?: number;
  startDate?: string;
  endDate?: string;
}

export interface AssessmentTemplate {
  id: string;
  name: string;
  description: string;
  competencies: Competency[];
  industryType?: string;
  recommended?: boolean;
}

export interface CalendarEvent {
  id: string;
  title: string;
  date: string;
  type: 'Deadline' | 'Meeting' | 'Reminder' | 'Launch';
  description?: string;
  participants?: string[];
  recurrence?: 'none' | 'daily' | 'weekly' | 'monthly';
}

// Competency & Assessment
export interface CompetencyLibrary {
  id: string;
  name: string;
  ownerType: 'institute' | 'client';
  ownerId: string;
  description?: string;
  competencies: Competency[];
  isPublic?: boolean;
  createdAt?: string;
}

export interface Competency {
  id: string;
  name: string;
  description: string;
  questions: Question[];
  weight?: number;
  category?: string;
  behavioralIndicators?: string[];
}

export interface Question {
  id: string;
  text: string;
  isSelected?: boolean;
  rubric?: Record<number, string>;
  type?: 'Rating' | 'Text' | 'YesNo' | 'Video' | 'MultiChoice';
  required?: boolean;
  options?: string[];
}

// Participant & Team
export interface Participant {
  id: string;
  name: string;
  role: string;
  email: string;
  programId: string;
  departmentId?: string;
  jobRoleId?: string;
  locationId?: string;
  managerId?: string;
  avatarUrl: string;
  status?: 'Nominated' | 'In Progress' | 'Pending Review' | 'Completed' | 'Calibrated';
  progress?: number;
  bio?: string;
  points?: number;
  badges?: Badge[];
  finalScore?: number;
  finalGrade?: string;
  workloadScore?: 'High' | 'Normal' | 'Low';
  calibratedRating?: string;
  hireDate?: string;
  performanceHistory?: PerformanceRecord[];
}

export interface PerformanceRecord {
  date: string;
  score: number;
  rating: string;
  programId: string;
}

export interface Badge {
  id: string;
  name: string;
  icon: string;
  description?: string;
  dateEarned: string;
  rarity?: 'Common' | 'Rare' | 'Epic' | 'Legendary';
}

export interface TeamMember extends Participant {
  lastActivity: string;
  nominationStatus: 'pending' | 'approved' | 'rejected' | 'not_started';
  reportReady: boolean;
  feedbackGivenCount?: number;
  alignmentData?: { selfScore: number; managerScore: number };
  riskLevel?: 'Low' | 'Medium' | 'High';
}

export interface FeedbackResponse {
  raterType: RaterType;
  raterId: string;
  scores: Record<string, number>;
  comments: Record<string, string>;
  submittedAt: string;
  duration?: number;
  videoResponses?: Record<string, string>;
}

export interface RaterNomination {
  id: string;
  participantId: string;
  subjectName: string;
  raterName: string;
  raterEmail: string;
  relation: RaterType;
  status: 'pending' | 'approved' | 'rejected';
  requestedAt: string;
  reviewedAt?: string;
  reviewedBy?: string;
  rejectionReason?: string;
}

// Survey Execution
export interface EvaluationTarget {
  id: string;
  name: string;
  role: string;
  relation: RaterType;
  progress: number;
  status: 'pending' | 'started' | 'completed';
  responses: Record<string, number | string>;
  comments: Record<string, string>;
  flags?: CriticalFlag[];
  videoResponses?: Record<string, string>;
  timeSpent?: number;
  lastSaved?: string;
}

export interface EvaluationHistory {
  id: string;
  programName: string;
  date: string;
  overallScore: number;
  status: 'Completed' | 'Archived';
  reportUrl?: string;
}

// Reporting & Analytics
export interface ReportData {
  participantId: string;
  overallScore: number;
  cohortAverage: number;
  industryBenchmark?: number;
  competencyScores: CompetencyScore[];
  qualitativeSummary?: string;
  verificationHash?: string;
  contractAddress?: string;
  comments: FeedbackComment[];
  criticalFlags?: CriticalFlag[];
  facilitatorNotes?: string;
  strengths?: string[];
  developmentAreas?: string[];
  recommendations?: string[];
  generatedAt: string;
}

export interface CompetencyScore {
  competencyId: string;
  competencyName: string;
  selfScore: number;
  managerScore: number;
  peerScore: number;
  directReportScore?: number;
  externalScore?: number;
  cohortAvg: number;
  industryAvg?: number;
  gap: number;
  category: 'Blind Spot' | 'Hidden Strength' | 'Aligned' | 'Unknown';
  trend?: 'Improving' | 'Declining' | 'Stable';
}

export interface FeedbackComment {
  id: string;
  competencyName: string;
  text: string;
  raterType: string;
  sentiment?: 'Positive' | 'Neutral' | 'Negative';
  themes?: string[];
}

// Goal Management & MBO
export interface ActionGoal {
  id: string;
  userId: string;
  title: string;
  description: string;
  status: 'Not Started' | 'In Progress' | 'Completed' | 'On Hold';
  dueDate: string;
  progress: number;
  weight?: number;
  successCriteria?: string;
  cascadingSourceId?: string;
  midTermDiagnostic?: string;
  smartAnalysis?: SmartAnalysis;
  category?: string;
  priority?: 'Low' | 'Medium' | 'High';
  attachments?: string[];
}

export interface SmartAnalysis {
  isSpecific: boolean;
  isMeasurable: boolean;
  isAchievable: boolean;
  isRelevant: boolean;
  isTimeBound: boolean;
  score: number;
  feedback: string;
}

export interface TeamGoal {
  id: string;
  managerId: string;
  title: string;
  description: string;
  dueDate: string;
  status: 'Active' | 'Completed' | 'Cancelled';
  contributingMembers?: string[];
}

export interface GoalComment {
  id: string;
  goalId: string;
  authorId: string;
  authorName: string;
  text: string;
  date: string;
  type: 'Negotiation' | 'Update' | 'Feedback';
}

export interface InterviewNote {
  id: string;
  participantId: string;
  authorId: string;
  stage: 'Plan' | 'Do' | 'See';
  text: string;
  date: string;
  tags?: string[];
}

// Engagement & Wellbeing
export interface PulseResponse {
  id: string;
  userId: string;
  date: string;
  moodScore: number;
  energyLevel?: number;
  blockers?: string;
  accomplishments?: string;
  needsSupport?: boolean;
}

export interface Kudos {
  id: string;
  fromId: string;
  fromName: string;
  toId: string;
  toName: string;
  message: string;
  category: 'Teamwork' | 'Leadership' | 'Innovation' | 'Grit' | 'Customer Focus';
  date: string;
  isPublic: boolean;
}

export interface WellbeingMetric {
  department: string;
  burnoutRisk: number;
  engagement: number;
  sentiment: 'Positive' | 'Neutral' | 'Negative';
  responseRate: number;
  trendDirection: 'Up' | 'Down' | 'Stable';
}

// Communication & Campaigns
export interface Campaign {
  id: string;
  name: string;
  type: 'Launch' | 'Reminder' | 'Report Release' | 'Custom';
  status: 'Draft' | 'Scheduled' | 'Sent' | 'Failed';
  channel: CommunicationChannel;
  sentCount: number;
  openRate: number;
  clickRate?: number;
  scheduledFor?: string;
  template?: string;
  recipientFilter?: Record<string, any>;
}

export interface EmailTemplate {
  id: string;
  name: string;
  subject: string;
  body: string;
  variables: string[];
  category: string;
}

export interface CommunicationLog {
  id: string;
  recipientId: string;
  recipientEmail: string;
  channel: CommunicationChannel;
  status: 'Sent' | 'Delivered' | 'Failed' | 'Bounced';
  sentAt: string;
  openedAt?: string;
  clickedAt?: string;
}

// Suggestions & Recommendations
export interface SuggestedPeer {
  id: string;
  name: string;
  email: string;
  reason: string;
  department?: string;
  collaborationScore?: number;
}

// Audit & Compliance
export interface AuditLog {
  id: string;
  action: string;
  actor: string;
  actorId: string;
  target: string;
  targetId?: string;
  timestamp: string;
  hash: string;
  details: string;
  ipAddress?: string;
  userAgent?: string;
}

export interface ComplianceReport {
  id: string;
  type: 'GDPR' | 'SOC2' | 'HIPAA' | 'ISO27001';
  generatedAt: string;
  status: 'Compliant' | 'Issues Found';
  findings?: string[];
}

// Skills & Endorsements
export interface SkillEndorsement {
  id: string;
  userId: string;
  skill: string;
  endorsedBy: string[];
  count: number;
  category?: string;
}

export interface Milestone {
  id: string;
  description: string;
  status: 'Pending' | 'In Progress' | 'Completed';
  evidenceHash?: string;
  completedDate?: string;
}

export interface DevelopmentPlan {
  id: string;
  userId: string;
  title: string;
  contractAddress: string;
  status: 'Active' | 'Fulfilled' | 'Terminated';
  startDate: string;
  endDate: string;
  milestones: Milestone[];
  budget?: number;
  approvedBy?: string;
}

// Coordinators & Facilitators
export interface Coordinator {
  id: string;
  name: string;
  department: string;
  reputation: number;
  verified: boolean;
  walletAddress: string;
  assignedPrograms?: string[];
}

export interface ClarificationRequest {
  commentId: string;
  requesterId: string;
  message: string;
  status: 'Sent' | 'Replied';
  response?: string;
  respondedAt?: string;
}

// Risk & Alerts
export interface RiskAlert {
  id: string;
  type: 'Bias' | 'Anomaly' | 'Fraud' | 'Sentiment' | 'Turnover' | 'Performance';
  severity: 'High' | 'Medium' | 'Low';
  description: string;
  detectedAt: string;
  participantId?: string;
  participantName?: string;
  recommendedAction?: string;
  status: 'New' | 'Acknowledged' | 'Resolved';
}

export interface TalentPosition {
  userId: string;
  userName: string;
  performance: number;
  potential: number;
  category: string;
  quadrant: '9-Box Position';
  riskOfLeaving?: number;
}

// Critical Flags
export interface CriticalFlag {
  id: string;
  participantId: string;
  raterType: RaterType;
  type: 'Professionalism' | 'Ethics' | 'Safety' | 'Attendance' | 'Performance';
  severity: 'Yellow' | 'Red';
  description: string;
  date: string;
  reportedBy?: string;
  actionTaken?: string;
}

export interface ReflectionEntry {
  id: string;
  userId: string;
  date: string;
  content: string;
  programId: string;
  mood?: string;
  tags?: string[];
}

// Continuous Feedback
export interface AdHocFeedback {
  id: string;
  recipientId: string;
  senderName: string;
  senderEmail?: string;
  message: string;
  rating: number;
  tags: string[];
  date: string;
  privateNote?: string;
  isAnonymous: boolean;
}

// Organization Surveys
export interface OrgSurvey {
  id: string;
  title: string;
  description?: string;
  status: 'Draft' | 'Active' | 'Closed';
  questions: Question[];
  responses: number;
  targetAudience?: string;
  startDate: string;
  endDate: string;
}

export interface Suggestion {
  id: string;
  authorId?: string;
  text: string;
  date: string;
  category: 'Culture' | 'Process' | 'Facilities' | 'Benefits' | 'Other';
  status: 'New' | 'Reviewed' | 'Actioned' | 'Rejected';
  votes?: number;
}

export interface NPSRecord {
  date: string;
  score: number;
  promoters: number;
  passives: number;
  detractors: number;
  responseRate: number;
}

// KPIs & Metrics
export interface KPI {
  id: string;
  name: string;
  description: string;
  unit: string;
  target: number;
  current: number;
  type: 'Quantitative' | 'Qualitative';
  category: string;
  trend: 'Up' | 'Down' | 'Stable';
}

export interface GradeRange {
  label: string;
  minScore: number;
  maxScore: number;
  color: string;
  description?: string;
}

export interface GradingScale {
  id: string;
  programId: string;
  name: string;
  ranges: GradeRange[];
  isDefault?: boolean;
}

// Projects
export interface Project {
  id: string;
  userId: string;
  name: string;
  description: string;
  role: string;
  completionDate: string;
  feedbackCount: number;
  status: 'Active' | 'Completed';
  teamMembers?: string[];
}

export interface ProjectFeedbackRequest {
  id: string;
  projectId: string;
  requesterId: string;
  targetEmail: string;
  status: 'Pending' | 'Completed' | 'Expired';
  feedbackText?: string;
  rating?: number;
}

// Registration
export interface RegistrationRequest {
  id: string;
  name: string;
  email: string;
  role: string;
  department?: string;
  requestedAt: string;
  status: 'Pending' | 'Approved' | 'Rejected';
  reviewedBy?: string;
  reviewedAt?: string;
}

// Workflow Automation
export interface WorkflowRule {
  id: string;
  name: string;
  description?: string;
  trigger: 'Evaluation Completed' | 'Goal Created' | 'Score < Threshold' | 'Flight Risk Detected' | 'Feedback Overdue';
  condition?: string;
  action: 'Send Email' | 'Slack Notification' | 'Alert HR' | 'Add to Coaching Plan' | 'Create Task';
  recipient?: 'Manager' | 'HR' | 'Employee' | 'Custom';
  isActive: boolean;
  executionCount?: number;
}

// Calibration
export interface CalibrationBucket {
  id: string;
  label: string;
  color: string;
  employees: TeamMember[];
  targetPercentage?: number;
  description?: string;
}

export interface CalibrationSession {
  id: string;
  programId: string;
  date: string;
  facilitator: string;
  participants: string[];
  status: 'Scheduled' | 'In Progress' | 'Completed';
  notes?: string;
}

// System Health
export interface SystemHealth {
  apiLatency: number;
  errorRate: number;
  activeUsers: number;
  dbStatus: 'Healthy' | 'Degraded' | 'Down';
  uptime: number;
  lastChecked: string;
}

// Gamification
export interface LeaderboardEntry {
  rank: number;
  userId: string;
  name: string;
  points: number;
  avatarUrl: string;
  badges?: number;
  level?: number;
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  pointsRequired: number;
  rarity: 'Common' | 'Rare' | 'Epic' | 'Legendary';
}

// Data Import/Export
export interface ImportJob {
  id: string;
  type: 'Users' | 'Participants' | 'Competencies' | 'Org Structure';
  status: 'Pending' | 'Processing' | 'Completed' | 'Failed';
  fileName: string;
  uploadedBy: string;
  uploadedAt: string;
  processedRecords?: number;
  errors?: string[];
}

export interface ExportJob {
  id: string;
  type: 'Reports' | 'Analytics' | 'Audit Log' | 'Raw Data';
  format: 'CSV' | 'XLSX' | 'PDF' | 'JSON';
  status: 'Pending' | 'Processing' | 'Completed' | 'Failed';
  requestedBy: string;
  requestedAt: string;
  downloadUrl?: string;
}

// Analytics Dashboard
export interface DashboardWidget {
  id: string;
  type: 'Chart' | 'Metric' | 'Table' | 'List';
  title: string;
  position: { x: number; y: number; w: number; h: number };
  config: Record<string, any>;
  refreshInterval?: number;
}

export interface AnalyticsFilter {
  dateRange?: { start: string; end: string };
  departments?: string[];
  programs?: string[];
  locations?: string[];
  roles?: string[];
}

// AI & Insights
export interface AIInsight {
  id: string;
  type: 'Trend' | 'Anomaly' | 'Recommendation' | 'Prediction';
  title: string;
  description: string;
  confidence: number;
  generatedAt: string;
  relatedEntities?: string[];
  actionable: boolean;
}

export interface SentimentAnalysis {
  overall: 'Positive' | 'Neutral' | 'Negative';
  score: number;
  themes: Array<{ theme: string; sentiment: string; frequency: number }>;
  keyPhrases: string[];
}

// UI State Management
export interface AppState {
  currentUser: User | null;
  activeClient: Client | null;
  selectedProgram: Program | null;
  notifications: Notification[];
  language: SupportedLanguage;
  theme: 'light' | 'dark';
  sidebarCollapsed: boolean;
}

export interface TableState {
  page: number;
  pageSize: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  filters: Record<string, any>;
  searchQuery?: string;
}

// Bulk Operations
export interface BulkOperation {
  id: string;
  type: 'Delete' | 'Update' | 'Export' | 'Notify';
  targetType: 'Participants' | 'Programs' | 'Evaluations';
  targetIds: string[];
  status: 'Pending' | 'Processing' | 'Completed' | 'Failed';
  progress: number;
  initiatedBy: string;
  initiatedAt: string;
}
