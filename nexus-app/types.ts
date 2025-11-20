
// Enums based on specification
export enum DegreeType {
  DEGREE_360 = '360',
  DEGREE_240 = '240', // Self, Manager, Peers (No DR, No Ext)
  DEGREE_180 = '180', // Self, Manager, Peers (No DR, No Ext) - Simplified for demo
  DEGREE_90 = '90',   // Self, Manager
}

export enum RaterType {
  SELF = 'self',
  MANAGER = 'manager',
  PEER = 'peer',
  DIRECT_REPORT = 'direct_report',
  EXTERNAL = 'external',
  SKIP_LEVEL = 'skip_level', // NEW: Skip Level Manager
  COACH = 'coach',
  VENDOR = 'vendor' // PPSP Feature
}

export enum ClientStatus {
  ACTIVE = 'active',
  SUSPENDED = 'suspended',
  EXPIRED = 'expired'
}

// Auth & User Types
export type UserRole = 'super_admin' | 'client_admin' | 'faculty' | 'manager' | 'employee' | 'vendor';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatarUrl?: string;
  clientId?: string; // For multi-tenancy
  bio?: string;
  title?: string;
}

export interface AuthResponse {
  user: User;
  token: string;
  requires2FA?: boolean; // NEW: 2FA Flag
}

export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: 'info' | 'warning' | 'success';
  read: boolean;
  date: string;
}

// Business Layer
export interface Client {
  id: string;
  name: string;
  creditsPurchased: number;
  creditsUsed: number;
  status: ClientStatus;
  logoUrl?: string;
  contractEnd: string;
  subdomain?: string; // Added for spec
  branding?: BrandingConfig; // RAINACHO Feature
}

// RAINACHO FEATURE: Branding
export interface BrandingConfig {
    primaryColor: string;
    logoUrl: string;
    companyName: string;
    welcomeMessage?: string;
}

// Organization Layer
export interface Department {
  id: string;
  clientId: string;
  name: string;
  headOfDepartment?: string;
  memberCount: number;
}

// RAINACHO FEATURE: Location Management
export interface Location {
    id: string;
    name: string; // e.g. "New York HQ"
    address?: string;
    country: string;
    clientId: string;
}

// RAINACHO FEATURE: Job Role / Position Management
export interface JobRole {
    id: string;
    clientId: string;
    title: string; // e.g. "Senior Software Engineer"
    level: string; // e.g. "L4", "Senior"
    description?: string;
    mappedTemplateId?: string; // Link to Competency Template
}

// PPSP Feature: Org Hierarchy
export interface OrgNode {
    id: string;
    name: string;
    role: string;
    children?: OrgNode[];
}

export interface Vendor {
    id: string;
    name: string;
    serviceType: string; // e.g. "Training Provider", "External Auditor"
    contactEmail: string;
    status: 'Active' | 'Inactive';
}

// Education Layer
export interface Program {
  id: string;
  clientId: string;
  name: string;
  startDate: string;
  status: 'Planning' | 'Active' | 'Completed' | 'Calculating' | 'Finalized';
  participantCount?: number; // For dashboard stats
  reportsReady?: number;     // For dashboard stats
  facultyLead?: string;      // For dashboard
  raterWeights?: RaterWeightConfig; // MYFJDTHINK Feature
  workflow?: ProgramWorkflow; // RAINACHO Feature
  gradingScaleId?: string; // KEVIN-0502 Feature
}

// RAINACHO FEATURE: Workflow Rules
export interface ProgramWorkflow {
    autoApproveInternal: boolean; // Auto approve peers/reports
    allowExternalRaters: boolean;
    minRatersRequired: number;
    reminderFrequencyDays: number;
}

// MYFJDTHINK Feature: Rater Weights
export interface RaterWeightConfig {
    [RaterType.SELF]: number;
    [RaterType.MANAGER]: number;
    [RaterType.PEER]: number;
    [RaterType.DIRECT_REPORT]: number;
    [RaterType.EXTERNAL]: number;
    [RaterType.SKIP_LEVEL]?: number;
}

// MYFJDTHINK Feature: Evaluation Matrix
export interface EvaluationMatrixRow {
    participantId: string;
    participantName: string;
    raters: {
        raterName: string;
        raterType: RaterType;
        status: 'Pending' | 'Completed';
    }[];
    completionRate: number;
}

// RAINACHO FEATURE: Program Templates
export interface ProgramTemplate {
    id: string;
    name: string;
    type: 'Annual' | 'Probation' | 'Project' | 'Custom';
    defaultModules: string[];
    durationWeeks: number;
}

export interface Module {
  id: string;
  programId: string;
  name: string;
  type: DegreeType;
  status: 'Draft' | 'Nomination' | 'Survey' | 'Reporting';
  progress?: number; // Percentage
  competencies?: Competency[]; // Configured competencies for this assessment
  anonymityThreshold?: number;
}

export interface AssessmentTemplate {
    id: string;
    name: string;
    description: string;
    competencies: Competency[];
}

// RAINACHO FEATURE: Calendar Events
export interface CalendarEvent {
    id: string;
    title: string;
    date: string; // YYYY-MM-DD
    type: 'Deadline' | 'Meeting' | 'Reminder' | 'Launch';
    description?: string;
}

// Core 360 Entities
export interface CompetencyLibrary {
  id: string;
  name: string;
  ownerType: 'institute' | 'client';
  description?: string;
  competencies: Competency[];
}

export interface Competency {
  id: string;
  name: string;
  description: string;
  questions: Question[];
  weight?: number; // Percentage weight (0-100)
}

export interface Question {
  id: string;
  text: string;
  isSelected?: boolean; // UI state for selection builder
  rubric?: Record<number, string>; // PPSP Feature: Detailed description for scores 1-5
  type?: 'Rating' | 'Text' | 'YesNo' | 'Video'; // Updated with Video
}

export interface Participant {
  id: string;
  name: string;
  role: string;
  email: string;
  programId: string;
  departmentId?: string; // Linked to Department
  jobRoleId?: string; // Linked to JobRole
  locationId?: string; // Linked to Location
  avatarUrl: string;
  status?: 'Nominated' | 'In Progress' | 'Pending Review' | 'Completed' | 'Calibrated'; // Updated for Calibration
  progress?: number; // % complete
  bio?: string;
  points?: number; // Gamification / Incentive Token
  finalScore?: number; // MYFJDTHINK Feature: Calculated Score
  finalGrade?: string; // KEVIN-0502 Feature: "A", "B"
  workloadScore?: 'High' | 'Normal' | 'Low'; // ORGANIZATION EVALUATION: Workload
  calibratedRating?: string; // 'Exceeds', 'Meets', 'Below'
  badges?: Badge[]; // Gamification
}

export interface Badge {
    id: string;
    name: string; // e.g. "Goal Crusher"
    icon: string; 
    dateEarned: string;
}

// Manager View
export interface TeamMember extends Participant {
  lastActivity: string;
  nominationStatus: 'pending' | 'approved' | 'rejected' | 'not_started';
  reportReady: boolean;
  feedbackGivenCount?: number; // For Leaderboard
  alignmentData?: { selfScore: number; managerScore: number }; // NEW: For Scatter Plot
}

export interface FeedbackResponse {
  raterType: RaterType;
  scores: Record<string, number>; // competencyId -> score
  comments: Record<string, string>; // competencyId -> comment
}

export interface RaterNomination {
  id: string;
  subjectName: string;
  raterName: string;
  raterEmail: string;
  relation: RaterType;
  status: 'pending' | 'approved' | 'rejected';
  requestedAt: string;
}

// Survey Execution Types
export interface EvaluationTarget {
  id: string; // The participant ID you are rating
  name: string;
  role: string;
  relation: RaterType;
  progress: number; // 0-100
  status: 'pending' | 'started' | 'completed';
  responses: Record<string, number | string>; // questionId -> score (1-5) or text
  comments: Record<string, string>; // competencyId -> text
  flags?: CriticalFlag[]; // PPSP Feature: Critical Incidents
  videoResponses?: Record<string, string>; // questionId -> base64/url
}

export interface EvaluationHistory {
    id: string;
    programName: string;
    date: string;
    overallScore: number;
    status: 'Completed' | 'Archived';
}

// Report Data
export interface ReportData {
  participantId: string;
  overallScore: number;
  cohortAverage: number;
  competencyScores: {
    competencyId: string;
    competencyName: string;
    selfScore: number;
    managerScore: number;
    peerScore: number;
    cohortAvg: number;
    gap: number; // Self - Average(Others)
    category: 'Blind Spot' | 'Hidden Strength' | 'Aligned' | 'Unknown';
  }[];
  qualitativeSummary?: string;
  verificationHash?: string; // Blockchain verification
  contractAddress?: string; // Smart Contract Address
  comments: {
      id: string;
      competencyName: string;
      text: string;
      raterType: string; // 'Peer', 'Manager', etc.
  }[];
  criticalFlags?: CriticalFlag[];
  facilitatorNotes?: string;
}

// Admin Types
export type ParticipantStatus = 'Invited' | 'Started' | 'Completed';

// PEERPULSE & ORGANIZATION-EVALUATION (MBO) FEATURES
export interface ActionGoal {
  id: string;
  userId: string;
  title: string;
  description: string;
  status: 'Not Started' | 'In Progress' | 'Completed';
  dueDate: string;
  progress: number; // 0-100
  // MBO / Plan-Do-See Extensions
  weight?: number; // % contribution
  successCriteria?: string; // "How success is measured"
  cascadingSourceId?: string; // Linked to team/dept goal
  midTermDiagnostic?: string; // "Do" stage diagnostic
  smartAnalysis?: {
      isSpecific: boolean;
      isMeasurable: boolean;
      isAchievable: boolean;
      isRelevant: boolean;
      isTimeBound: boolean;
      score: number; // 0-100
      feedback: string;
  };
}

export interface TeamGoal {
    id: string;
    managerId: string;
    title: string;
    description: string;
    dueDate: string;
    status: 'Active' | 'Completed';
}

export interface GoalComment {
    id: string;
    goalId: string;
    authorName: string;
    text: string;
    date: string;
    type: 'Negotiation' | 'Update' | 'Feedback';
}

export interface InterviewNote {
    id: string;
    participantId: string;
    authorId: string; // Manager
    stage: 'Plan' | 'Do' | 'See';
    text: string;
    date: string;
}

export interface PulseResponse {
  id: string;
  userId: string;
  date: string;
  moodScore: number; // 1-5
  blockers?: string;
}

export interface Kudos {
  id: string;
  fromName: string;
  toName: string;
  message: string;
  category: 'Teamwork' | 'Leadership' | 'Innovation' | 'Grit';
  date: string;
}

export interface Campaign {
    id: string;
    name: string;
    type: 'Launch' | 'Reminder' | 'Report Release';
    status: 'Draft' | 'Scheduled' | 'Sent';
    sentCount: number;
    openRate: number;
    scheduledFor?: string;
}

export interface SuggestedPeer {
    id: string;
    name: string;
    email: string;
    reason: string; // e.g., "Same Department"
}

// --- DECENTRALIZED / BLOCKCHAIN-INSPIRED FEATURES ---

export interface AuditLog {
    id: string;
    action: string;
    actor: string;
    target: string;
    timestamp: string;
    hash: string; // Simulate immutable hash
    details: string;
}

export interface SkillEndorsement {
    id: string;
    skill: string;
    endorsedBy: string[]; // Names of peers who endorsed
    count: number;
}

export interface Milestone {
    id: string;
    description: string;
    status: 'Pending' | 'In Progress' | 'Completed';
    evidenceHash?: string; // Hash of proof of work
}

export interface DevelopmentPlan {
    id: string;
    userId: string;
    title: string;
    contractAddress: string; // Simulated Smart Contract Address
    status: 'Active' | 'Fulfilled' | 'Terminated';
    startDate: string;
    endDate: string;
    milestones: Milestone[];
}

export interface Coordinator {
    id: string;
    name: string;
    department: string;
    reputation: number; // 0-100
    verified: boolean;
    walletAddress: string; // Simulated wallet
}

export interface ClarificationRequest {
    commentId: string;
    message: string;
    status: 'Sent' | 'Replied';
}

// --- Q360 / ADVANCED AI & STRATEGY FEATURES ---

export interface RiskAlert {
    id: string;
    type: 'Bias' | 'Anomaly' | 'Fraud' | 'Sentiment';
    severity: 'High' | 'Medium' | 'Low';
    description: string;
    detectedAt: string;
    participantName?: string;
}

export interface TalentPosition {
    userId: string;
    userName: string;
    performance: number; // 1-5 (X-axis)
    potential: number; // 1-5 (Y-axis)
    category: string; // e.g. "Top Talent", "Enigma"
}

export interface WellbeingMetric {
    department: string;
    burnoutRisk: number; // 0-100 (High is bad)
    engagement: number; // 0-100 (High is good)
    sentiment: 'Positive' | 'Neutral' | 'Negative';
}

// --- PPSP FEATURES (Academic / Professionalism) ---

export interface CriticalFlag {
    id: string;
    participantId: string;
    raterType: RaterType;
    type: 'Professionalism' | 'Ethics' | 'Safety' | 'Attendance';
    severity: 'Yellow' | 'Red';
    description: string;
    date: string;
}

export interface ReflectionEntry {
    id: string;
    userId: string;
    date: string;
    content: string;
    programId: string;
}

// --- RAINACHO / CONTINUOUS FEEDBACK FEATURES ---

export interface AdHocFeedback {
    id: string;
    recipientId: string;
    senderName: string; // Optional/Anonymous
    senderEmail?: string;
    message: string;
    rating: number; // 1-5
    tags: string[]; // e.g., #Leadership, #Communication
    date: string;
    privateNote?: string; // Recipient's self-reflection
}

// --- ORGANIZATION EVALUATION FEATURES (clang-engineer) ---

export interface OrgSurvey {
    id: string;
    title: string;
    status: 'Active' | 'Closed';
    questions: Question[];
    responses: number;
}

export interface Suggestion {
    id: string;
    text: string;
    date: string;
    category: 'Culture' | 'Process' | 'Facilities' | 'Other';
    status: 'New' | 'Reviewed' | 'Actioned';
}

export interface NPSRecord {
    date: string;
    score: number; // -100 to 100
    promoters: number;
    passives: number;
    detractors: number;
}

// --- KEVIN-0502 / KPI FEATURES ---

export interface KPI {
    id: string;
    name: string;
    description: string;
    unit: string; // e.g., "%", "USD", "#"
    target: number;
    type: 'Quantitative' | 'Qualitative';
}

export interface GradeRange {
    label: string; // e.g. "A", "Excellent"
    minScore: number;
    maxScore: number;
    color: string;
}

export interface GradingScale {
    id: string;
    programId: string;
    ranges: GradeRange[];
}

// --- PRAVALLIKAB98 / PROJECT FEEDBACK & REGISTRATION ---

export interface Project {
    id: string;
    userId: string;
    name: string;
    description: string;
    role: string;
    completionDate: string;
    feedbackCount: number;
}

export interface ProjectFeedbackRequest {
    id: string;
    projectId: string;
    requesterId: string;
    targetEmail: string;
    status: 'Pending' | 'Completed';
    feedbackText?: string;
}

export interface RegistrationRequest {
    id: string;
    name: string;
    email: string;
    role: string;
    requestedAt: string;
    status: 'Pending' | 'Approved' | 'Rejected';
}

// --- WORKFLOW AUTOMATION ---
export interface WorkflowRule {
    id: string;
    name: string;
    trigger: 'Evaluation Completed' | 'Goal Created' | 'Score < Threshold' | 'Flight Risk Detected';
    condition?: string; // e.g., "Score < 3"
    action: 'Send Email' | 'Slack Notification' | 'Alert HR' | 'Add to Coaching Plan';
    recipient?: 'Manager' | 'HR' | 'Employee';
    isActive: boolean;
}

// --- CALIBRATION ---
export interface CalibrationBucket {
    id: string;
    label: string; // Exceeds, Meets, Below
    color: string;
    employees: TeamMember[]; // Members in this bucket
}

// --- SYSTEM HEALTH MONITORING ---
export interface SystemHealth {
    apiLatency: number; // ms
    errorRate: number; // %
    activeUsers: number;
    dbStatus: 'Healthy' | 'Degraded' | 'Down';
    uptime: number; // %
}

// --- GAMIFICATION LEADERBOARD ---
export interface LeaderboardEntry {
    rank: number;
    name: string;
    points: number;
    avatarUrl: string;
}
