
import { Client, ClientStatus, Program, Module, DegreeType, Participant, Competency, ReportData, RaterType, CompetencyLibrary, RaterNomination, Question, EvaluationTarget, User, AuthResponse, TeamMember, AssessmentTemplate, Department, Notification, EvaluationHistory, ActionGoal, PulseResponse, Kudos, Campaign, SuggestedPeer, AuditLog, SkillEndorsement, DevelopmentPlan, Coordinator, ClarificationRequest, RiskAlert, TalentPosition, WellbeingMetric, CriticalFlag, ReflectionEntry, Vendor, OrgNode, AdHocFeedback, JobRole, CalendarEvent, Location, ProgramTemplate, RaterWeightConfig, EvaluationMatrixRow, BrandingConfig, ProgramWorkflow, OrgSurvey, Suggestion, NPSRecord, InterviewNote, GoalComment, KPI, GradingScale, Project, ProjectFeedbackRequest, RegistrationRequest, TeamGoal, WorkflowRule, CalibrationBucket, SystemHealth, LeaderboardEntry, Badge } from '../types';

// --- Mock Data Storage (In-Memory) ---

let MOCK_USERS: User[] = [
    { id: 'u_admin', name: 'Admin User', email: 'admin@nexus.edu', role: 'super_admin' },
    { id: 'u_hr', name: 'HR Director', email: 'hr@acme.com', role: 'client_admin', clientId: 'c1' },
    { id: 'u_fac', name: 'Dr. Sarah Chen', email: 'dr.chen@nexus.edu', role: 'faculty' },
    { id: 'u_mgr', name: 'Sarah Chen (VP)', email: 'sarah@acme.com', role: 'manager', clientId: 'c1' },
    { id: 'u1', name: 'John Anderson', email: 'john@acme.com', role: 'employee', clientId: 'c1', bio: 'Experienced sales leader with 15 years in the industry.', title: 'VP of Sales' },
    { id: 'u_vendor', name: 'Audit Partner', email: 'partner@vendor.com', role: 'vendor', clientId: 'c1' },
];

let MOCK_TEAM_GOALS: TeamGoal[] = [
    { id: 'tg1', managerId: 'u_mgr', title: 'Achieve $10M Revenue', description: 'Department wide sales target for FY2025', dueDate: '2025-12-31', status: 'Active' },
    { id: 'tg2', managerId: 'u_mgr', title: 'Reduce Churn by 5%', description: 'Focus on customer success initiatives', dueDate: '2025-06-30', status: 'Active' }
];

let MOCK_REGISTRATIONS: RegistrationRequest[] = [
    { id: 'reg1', name: 'New Hire', email: 'new@acme.com', role: 'employee', requestedAt: '2025-03-15', status: 'Pending' }
];

let MOCK_PROJECTS: Project[] = [
    { id: 'proj1', userId: 'u1', name: 'Q1 Cloud Migration', description: 'Migrated legacy systems to AWS.', role: 'Lead Architect', completionDate: '2025-02-28', feedbackCount: 2 },
    { id: 'proj2', userId: 'u1', name: 'Sales Kickoff 2025', description: 'Organized the annual sales event.', role: 'Organizer', completionDate: '2025-01-15', feedbackCount: 0 }
];

let MOCK_PROJECT_REQUESTS: ProjectFeedbackRequest[] = [
    { id: 'pr1', projectId: 'proj1', requesterId: 'u1', targetEmail: 'sarah@acme.com', status: 'Completed', feedbackText: 'Great leadership during the downtime window.' },
    { id: 'pr2', projectId: 'proj1', requesterId: 'u1', targetEmail: 'mike@acme.com', status: 'Pending' }
];

let MOCK_LOCATIONS: Location[] = [
    { id: 'loc1', name: 'New York HQ', address: '123 Broadway', country: 'USA', clientId: 'c1' },
    { id: 'loc2', name: 'London Office', address: '45 Oxford St', country: 'UK', clientId: 'c1' }
];

let MOCK_PROGRAM_TEMPLATES: ProgramTemplate[] = [
    { id: 'pt1', name: 'Annual Leadership Review', type: 'Annual', defaultModules: ['Self Assessment', 'Manager Review', 'Peer Feedback'], durationWeeks: 4 },
    { id: 'pt2', name: 'Probationary Check-in', type: 'Probation', defaultModules: ['90-Day Review'], durationWeeks: 2 },
    { id: 'pt3', name: 'Executive 360', type: 'Project', defaultModules: ['Diagnostic', 'Impact'], durationWeeks: 6 }
];

let MOCK_JOB_ROLES: JobRole[] = [
    { id: 'jr1', clientId: 'c1', title: 'Senior Software Engineer', level: 'L4', mappedTemplateId: 't1' },
    { id: 'jr2', clientId: 'c1', title: 'Engineering Manager', level: 'M1', mappedTemplateId: 't1' },
    { id: 'jr3', clientId: 'c1', title: 'VP of Sales', level: 'VP', mappedTemplateId: 't2' }
];

let MOCK_CALENDAR_EVENTS: CalendarEvent[] = [
    { id: 'ce1', title: 'Leadership 360 Launch', date: '2025-03-15', type: 'Launch', description: 'Initial email blast to all participants.' },
    { id: 'ce2', title: 'Nomination Deadline', date: '2025-03-20', type: 'Deadline', description: 'All peer nominations must be submitted.' },
    { id: 'ce3', title: 'Survey Deadline', date: '2025-03-30', type: 'Deadline', description: 'Hard stop for feedback collection.' },
    { id: 'ce4', title: 'Q1 Review Board', date: '2025-04-05', type: 'Meeting', description: 'Calibration session for executive team.' }
];

let MOCK_NOTIFICATIONS: Notification[] = [
    { id: 'n1', userId: 'u1', title: 'Assessment Live', message: 'The 2025 Leadership 360 cycle is now open. Please begin your self-assessment.', type: 'info', read: false, date: '2 hours ago' },
    { id: 'n2', userId: 'u1', title: 'Nomination Approved', message: 'Your manager has approved your rater nominations.', type: 'success', read: false, date: '1 day ago' },
    { id: 'n3', userId: 'u_hr', title: 'Credit Alert', message: 'Acme Corp is at 85% credit usage.', type: 'warning', read: false, date: '3 hours ago' },
    { id: 'n4', userId: 'u1', title: 'New Feedback Received', message: 'You received new ad-hoc feedback from an external partner.', type: 'success', read: false, date: 'Just now' }
];

let MOCK_HISTORY: EvaluationHistory[] = [
    { id: 'h1', programName: 'Mid-Year Leadership Review 2024', date: 'June 2024', overallScore: 3.6, status: 'Completed' },
    { id: 'h2', programName: 'Executive Onboarding 360', date: 'Jan 2023', overallScore: 3.4, status: 'Archived' }
];

let MOCK_CLIENTS: Client[] = [
  {
    id: 'c1',
    name: 'Acme Corp',
    subdomain: 'acme',
    creditsPurchased: 500,
    creditsUsed: 340,
    status: ClientStatus.ACTIVE,
    contractEnd: '2025-12-31',
    branding: {
        primaryColor: '#4f46e5',
        logoUrl: 'https://via.placeholder.com/150?text=Acme+Corp',
        companyName: 'Acme Corp'
    }
  },
  {
    id: 'c2',
    name: 'GlobalTech Systems',
    subdomain: 'globaltech',
    creditsPurchased: 200,
    creditsUsed: 180,
    status: ClientStatus.ACTIVE,
    contractEnd: '2025-06-30',
    branding: {
        primaryColor: '#0ea5e9',
        logoUrl: 'https://via.placeholder.com/150?text=GlobalTech',
        companyName: 'GlobalTech Systems'
    }
  }
];

let MOCK_DEPARTMENTS: Department[] = [
    { id: 'd1', clientId: 'c1', name: 'Sales', memberCount: 12, headOfDepartment: 'Sarah Chen' },
    { id: 'd2', clientId: 'c1', name: 'Engineering', memberCount: 24, headOfDepartment: 'Mike Ross' },
    { id: 'd3', clientId: 'c1', name: 'Marketing', memberCount: 8, headOfDepartment: 'Alice Wong' }
];

let MOCK_VENDORS: Vendor[] = [
    { id: 'v1', name: 'Leadership Dev Partners', serviceType: 'Training Provider', contactEmail: 'info@ldp.com', status: 'Active' },
    { id: 'v2', name: 'Audit Secure Inc', serviceType: 'External Auditor', contactEmail: 'audit@secure.com', status: 'Active' }
];

let MOCK_PROGRAMS: Program[] = [
  {
    id: 'p1',
    clientId: 'c1',
    name: 'Senior Leadership Development Program 2025',
    startDate: '2025-01-15',
    status: 'Active',
    participantCount: 42,
    reportsReady: 12,
    facultyLead: 'Dr. Sarah Chen',
    raterWeights: {
        [RaterType.MANAGER]: 40,
        [RaterType.PEER]: 30,
        [RaterType.DIRECT_REPORT]: 20,
        [RaterType.SELF]: 10,
        [RaterType.EXTERNAL]: 0
    },
    workflow: {
        autoApproveInternal: true,
        allowExternalRaters: true,
        minRatersRequired: 3,
        reminderFrequencyDays: 3
    },
    gradingScaleId: 'gs1'
  },
  {
    id: 'p2',
    clientId: 'c1',
    name: 'Emerging Managers Cohort Q3',
    startDate: '2025-08-01',
    status: 'Planning',
    participantCount: 25,
    reportsReady: 0,
    facultyLead: 'Prof. Mark Davis',
    raterWeights: {
        [RaterType.MANAGER]: 50,
        [RaterType.PEER]: 30,
        [RaterType.DIRECT_REPORT]: 0,
        [RaterType.SELF]: 20,
        [RaterType.EXTERNAL]: 0
    },
    workflow: {
        autoApproveInternal: false,
        allowExternalRaters: false,
        minRatersRequired: 2,
        reminderFrequencyDays: 7
    }
  }
];

let MOCK_MODULES: Module[] = [
  {
    id: 'm1',
    programId: 'p1',
    name: 'Module 1: 360 Diagnostic',
    type: DegreeType.DEGREE_360,
    status: 'Reporting',
    progress: 85,
    competencies: [],
    anonymityThreshold: 3
  },
  {
    id: 'm2',
    programId: 'p1',
    name: 'Module 3: Mid-Year Impact',
    type: DegreeType.DEGREE_180,
    status: 'Nomination',
    progress: 62,
    competencies: [],
    anonymityThreshold: 3
  }
];

let MOCK_TEMPLATES: AssessmentTemplate[] = [
    {
        id: 't1',
        name: 'Standard Leadership 360',
        description: 'Core competencies for mid-to-senior level leaders focusing on strategy and people.',
        competencies: [] // Populated in init
    },
    {
        id: 't2',
        name: 'Sales Excellence',
        description: 'Focused on commercial drive, negotiation, and client relationships.',
        competencies: []
    }
];

const MOCK_PARTICIPANT: Participant = {
  id: 'u1',
  name: 'John Anderson',
  role: 'VP of Sales',
  email: 'john.anderson@acme.com',
  programId: 'p1',
  departmentId: 'd1',
  jobRoleId: 'jr3',
  locationId: 'loc1',
  avatarUrl: 'https://picsum.photos/200/200',
  status: 'In Progress',
  progress: 35,
  points: 1250, // Incentivization
  workloadScore: 'Normal',
  calibratedRating: 'Meets',
  badges: [
      { id: 'b1', name: 'Goal Crusher', icon: 'Target', dateEarned: '2025-02-10' },
      { id: 'b2', name: 'Feedback Hero', icon: 'MessageSquare', dateEarned: '2025-01-20' }
  ]
};

let MOCK_PARTICIPANTS_LIST: Participant[] = [
    MOCK_PARTICIPANT,
    { id: 'u2', name: 'Sarah Chen', role: 'VP Strategy', email: 'sarah@acme.com', programId: 'p1', departmentId: 'd1', locationId: 'loc1', avatarUrl: '', status: 'Completed', progress: 100, points: 3000, finalScore: 4.2, workloadScore: 'High', calibratedRating: 'Exceeds' },
    { id: 'u3', name: 'Mike Ross', role: 'Director', email: 'mike@acme.com', programId: 'p1', departmentId: 'd2', locationId: 'loc2', avatarUrl: '', status: 'Nominated', progress: 0, points: 0, workloadScore: 'Normal', calibratedRating: 'Meets' },
];

// Team for Manager View (Sarah Chen manages John and Mike)
let MOCK_TEAM: TeamMember[] = [
    { ...MOCK_PARTICIPANT, lastActivity: '2 hours ago', nominationStatus: 'pending', reportReady: false, feedbackGivenCount: 12, alignmentData: { selfScore: 4.0, managerScore: 3.2 } },
    { id: 'u3', name: 'Mike Ross', role: 'Director', email: 'mike@acme.com', programId: 'p1', departmentId: 'd2', locationId: 'loc2', avatarUrl: '', status: 'Nominated', progress: 10, lastActivity: '1 day ago', nominationStatus: 'approved', reportReady: false, feedbackGivenCount: 8, workloadScore: 'Normal', alignmentData: { selfScore: 3.5, managerScore: 3.6 } },
    { id: 'u4', name: 'David Lee', role: 'Manager', email: 'david@acme.com', programId: 'p1', departmentId: 'd2', locationId: 'loc2', avatarUrl: '', status: 'Completed', progress: 100, lastActivity: '5 days ago', nominationStatus: 'approved', reportReady: true, feedbackGivenCount: 15, workloadScore: 'Low', alignmentData: { selfScore: 4.5, managerScore: 2.5 } }, // High gap
];

// Expanded Library to simulate "1000+ Dictionary"
let MOCK_LIBRARIES: CompetencyLibrary[] = [
  {
    id: 'lib1',
    name: 'Global Leadership Framework (Executive)',
    ownerType: 'institute',
    description: 'The gold standard for C-Suite and VP level assessments.',
    competencies: [
      {
        id: 'comp1',
        name: 'Strategic Visioning',
        description: 'Thinks long-term, anticipates future trends, and connects daily tasks to organizational goals.',
        weight: 30,
        questions: [
          { id: 'q1', text: 'Develops clear strategies for long-term growth.', rubric: {1: 'Focuses only on daily tasks', 3: 'Creates annual plans', 5: 'Develops 5-year industry-shifting strategies'}, type: 'Rating' },
          { id: 'q2', text: 'Anticipates market changes effectively before they impact the business.', type: 'Rating' },
          { id: 'q11', text: 'Connects daily tasks to organizational vision.', type: 'Rating' }
        ]
      },
      {
        id: 'comp2',
        name: 'Influencing Stakeholders',
        description: 'Gains support and commitment from others through persuasion and relationship building.',
        weight: 25,
        questions: [
          { id: 'q3', text: 'Persuades others to support new initiatives.' },
          { id: 'q4', text: 'Builds strong relationships across functions.' },
          { id: 'q13', text: 'Negotiates effectively in conflict situations.' }
        ]
      },
      {
        id: 'comp4',
        name: 'Change Leadership',
        description: 'Leads teams through transition and uncertainty with clarity and empathy.',
        weight: 20,
        questions: [
            { id: 'q21', text: 'Communicates the vision for change clearly.' },
            { id: 'q22', text: 'Supports others through ambiguity.' }
        ]
      },
      {
          id: 'comp_dec',
          name: 'Decisiveness',
          description: 'Makes timely decisions even with incomplete information.',
          weight: 15,
          questions: [
              { id: 'q_dec1', text: 'Makes tough calls in a timely manner.'}
          ]
      }
    ]
  },
  {
    id: 'lib2',
    name: 'Functional Excellence: Sales & Marketing',
    ownerType: 'institute',
    description: 'Specific behaviors for high-performing sales leaders.',
    competencies: [
      {
        id: 'comp3',
        name: 'Driving Commercial Results',
        description: 'Consistently delivers high-quality revenue targets.',
        weight: 20,
        questions: [
          { id: 'q5', text: 'Sets ambitious goals and achieves them.' },
          { id: 'q6', text: 'Holds self and others accountable for outcomes.' }
        ]
      },
      {
        id: 'comp5',
        name: 'Customer Obsession',
        description: 'Prioritizes customer needs and satisfaction above internal process.',
        weight: 20,
        questions: [
            { id: 'q31', text: 'Anticipates customer needs before they arise.' },
            { id: 'q32', text: 'Builds long-term trust with key clients.' }
        ]
      }
    ]
  },
  {
      id: 'lib3',
      name: 'Interpersonal & EQ Core',
      ownerType: 'institute',
      description: 'Emotional intelligence foundation for all levels.',
      competencies: [
          {
              id: 'comp_eq1',
              name: 'Self-Awareness',
              description: 'Understands own strengths, weaknesses, and impact on others.',
              weight: 10,
              questions: [
                  { id: 'q_eq1', text: 'Actively seeks feedback to improve.', type: 'Rating'}
              ]
          },
          {
              id: 'comp_eq2',
              name: 'Empathy',
              description: 'Understands and shares the feelings of others.',
              weight: 10,
              questions: [
                  { id: 'q_eq3', text: 'Listens actively without interrupting.', type: 'Rating'}
              ]
          },
          {
              id: 'comp_eq3',
              name: 'Feedback',
              description: 'Feedback reception.',
              weight: 5,
              questions: [
                  { id: 'q_eq_yesno', text: 'Is this person open to critical feedback?', type: 'YesNo'},
                  { id: 'q_eq_text', text: 'What is one thing this person should stop doing?', type: 'Text'},
                  { id: 'q_eq_vid', text: 'Record a short video sharing your thoughts on their leadership style.', type: 'Video'}
              ]
          }
      ]
  }
];

// Init mock templates with data
MOCK_TEMPLATES[0].competencies = [MOCK_LIBRARIES[0].competencies[0], MOCK_LIBRARIES[0].competencies[1]];
MOCK_TEMPLATES[1].competencies = [MOCK_LIBRARIES[1].competencies[0], MOCK_LIBRARIES[1].competencies[1]];


let MOCK_NOMINATIONS: RaterNomination[] = [
  { id: 'n1', subjectName: 'John Anderson', raterName: 'Alice Wong', raterEmail: 'alice@acme.com', relation: RaterType.PEER, status: 'pending', requestedAt: '2025-03-10' },
  { id: 'n2', subjectName: 'John Anderson', raterName: 'Bob Miller', raterEmail: 'bob@acme.com', relation: RaterType.PEER, status: 'pending', requestedAt: '2025-03-10' },
  { id: 'n3', subjectName: 'Sarah Jones', raterName: 'Mike Ross', raterEmail: 'mike@client.com', relation: RaterType.EXTERNAL, status: 'pending', requestedAt: '2025-03-11' },
];

// Mock Report Data
const MOCK_REPORT: ReportData = {
  participantId: 'u1',
  overallScore: 3.8,
  cohortAverage: 3.9,
  competencyScores: [
    { competencyId: 'comp1', competencyName: 'Strategic Thinking', selfScore: 4.0, managerScore: 3.2, peerScore: 3.5, cohortAvg: 3.9, gap: 0.6, category: 'Blind Spot' },
    { competencyId: 'comp2', competencyName: 'Influencing', selfScore: 4.5, managerScore: 4.8, peerScore: 4.6, cohortAvg: 4.1, gap: -0.2, category: 'Hidden Strength' },
    { competencyId: 'comp3', competencyName: 'Driving Results', selfScore: 4.0, managerScore: 4.2, peerScore: 4.0, cohortAvg: 4.0, gap: -0.1, category: 'Aligned' },
  ],
  verificationHash: '0x7d3c...9a2f',
  contractAddress: 'ST123...CONTRACT',
  comments: [
      { id: 'c1', competencyName: 'Strategic Thinking', text: 'Sometimes focuses too much on the "now" and misses the bigger picture trends.', raterType: 'Peer' },
      { id: 'c2', competencyName: 'Influencing', text: 'Great at getting buy-in during difficult meetings.', raterType: 'Manager' },
      { id: 'c3', competencyName: 'Driving Results', text: 'Consistently hits targets, but could be more collaborative in how they get there.', raterType: 'Peer' }
  ]
};

let MOCK_EVALUATIONS: EvaluationTarget[] = [
    { id: 'u1', name: 'John Anderson (You)', role: 'VP Sales', relation: RaterType.SELF, progress: 25, status: 'started', responses: {}, comments: {} },
    { id: 'u2', name: 'Sarah Chen', role: 'VP Strategy', relation: RaterType.PEER, progress: 0, status: 'pending', responses: {}, comments: {} },
    { id: 'u99', name: 'Mark Lee', role: 'Director', relation: RaterType.DIRECT_REPORT, progress: 0, status: 'pending', responses: {}, comments: {} }
];

// --- PEERPULSE & DECENTRALIZED FEATURES MOCK DATA ---

let MOCK_GOALS: ActionGoal[] = [
    { id: 'g1', userId: 'u1', title: 'Improve Strategic Delegation', description: 'Delegate 20% of operational tasks to direct reports by Q2.', status: 'In Progress', dueDate: '2025-06-30', progress: 30, weight: 40, successCriteria: 'Task analysis log showing 20% shift.' },
    { id: 'g2', userId: 'u1', title: 'Cross-Functional Networking', description: 'Schedule monthly syncs with Marketing and Product heads.', status: 'Not Started', dueDate: '2025-05-15', progress: 0, weight: 30, successCriteria: '3 syncs completed.' }
];

let MOCK_GOAL_COMMENTS: GoalComment[] = [
    { id: 'gc1', goalId: 'g1', authorName: 'Sarah Chen', text: 'Please ensure you select tasks that are low-risk for the first delegation phase.', date: '2025-03-01', type: 'Negotiation' }
];

let MOCK_INTERVIEW_NOTES: InterviewNote[] = [];

let MOCK_PLANS: DevelopmentPlan[] = [
    {
        id: 'dp1',
        userId: 'u1',
        title: 'Leadership Growth Contract 2025',
        contractAddress: 'ST987...PLAN',
        status: 'Active',
        startDate: '2025-01-01',
        endDate: '2025-06-30',
        milestones: [
            { id: 'm1', description: 'Complete 360 Assessment', status: 'Completed', evidenceHash: '0x123...abc' },
            { id: 'm2', description: 'Attend Executive Coaching Session', status: 'In Progress', evidenceHash: '' },
            { id: 'm3', description: 'Implement Delegation Framework', status: 'Pending', evidenceHash: '' }
        ]
    }
];

let MOCK_COORDINATORS: Coordinator[] = [
    { id: 'coord1', name: 'HR Director', department: 'Human Resources', reputation: 98, verified: true, walletAddress: 'ST111...HR' },
    { id: 'coord2', name: 'Sales Ops Lead', department: 'Sales', reputation: 85, verified: false, walletAddress: 'ST222...OPS' }
];

let MOCK_PULSE: PulseResponse[] = [
    { id: 'p1', userId: 'u1', date: '2025-03-01', moodScore: 4 },
    { id: 'p2', userId: 'u1', date: '2025-03-08', moodScore: 3, blockers: 'Waiting on budget approval.' }
];

let MOCK_KUDOS: Kudos[] = [
    { id: 'k1', fromName: 'Sarah Chen', toName: 'John Anderson', message: 'Great job leading the Q1 sales kickoff!', category: 'Leadership', date: '2 days ago' },
    { id: 'k2', fromName: 'Mike Ross', toName: 'John Anderson', message: 'Thanks for helping me with the client proposal.', category: 'Teamwork', date: '1 week ago' }
];

let MOCK_CAMPAIGNS: Campaign[] = [
    { id: 'camp1', name: 'Launch: 2025 Leadership Cycle', type: 'Launch', status: 'Sent', sentCount: 42, openRate: 88 },
    { id: 'camp2', name: 'Reminder: 1 Week Left', type: 'Reminder', status: 'Scheduled', sentCount: 0, openRate: 0, scheduledFor: '2025-04-01' }
];

let MOCK_SUGGESTED_PEERS: SuggestedPeer[] = [
    { id: 'sp1', name: 'Alice Wong', email: 'alice@acme.com', reason: 'Marketing Head (Cross-functional)' },
    { id: 'sp2', name: 'David Miller', email: 'david@acme.com', reason: 'Same Project Team (Project Alpha)' }
];

let MOCK_AUDIT_LOGS: AuditLog[] = [
    { id: 'a1', action: 'SURVEY_COMPLETED', actor: 'John Anderson', target: 'Self Assessment', timestamp: '2025-03-10 10:00:00', hash: '0x8f7a...e2a', details: 'Completed 42/42 questions' },
    { id: 'a2', action: 'NOMINATION_APPROVED', actor: 'Sarah Chen', target: 'Mike Ross', timestamp: '2025-03-09 14:30:00', hash: '0x7d2b...1b3', details: 'Approved 3 peers, 2 direct reports' },
    { id: 'a3', action: 'REPORT_GENERATED', actor: 'System', target: 'John Anderson', timestamp: '2025-03-12 09:15:00', hash: '0x3c9e...5f1', details: 'PDF Report v1.0 generated' }
];

let MOCK_ENDORSEMENTS: SkillEndorsement[] = [
    { id: 'e1', skill: 'Strategic Planning', endorsedBy: ['Sarah Chen', 'Mike Ross'], count: 2 },
    { id: 'e2', skill: 'Public Speaking', endorsedBy: ['Alice Wong'], count: 1 },
    { id: 'e3', skill: 'Negotiation', endorsedBy: ['Bob Miller', 'Sarah Chen', 'Mike Ross'], count: 3 }
];

// --- Q360 FEATURE MOCKS ---

let MOCK_RISK_ALERTS: RiskAlert[] = [
    { id: 'r1', type: 'Bias', severity: 'High', description: 'High degree of straight-lining (all 5s) detected in peer evaluation.', detectedAt: '2025-03-10', participantName: 'Bob Miller' },
    { id: 'r2', type: 'Sentiment', severity: 'Medium', description: 'Mismatch: High numeric score (4.8) but negative sentiment detected in comments.', detectedAt: '2025-03-11', participantName: 'Alice Wong' }
];

let MOCK_TALENT_MATRIX: TalentPosition[] = [
    { userId: 'u1', userName: 'John Anderson', performance: 4.2, potential: 4.5, category: 'Top Talent' },
    { userId: 'u2', userName: 'Sarah Chen', performance: 4.8, potential: 4.2, category: 'Star' },
    { userId: 'u3', userName: 'Mike Ross', performance: 3.2, potential: 4.0, category: 'Growth Employee' },
    { userId: 'u4', userName: 'David Lee', performance: 2.5, potential: 2.0, category: 'Underperformer' }
];

let MOCK_WELLBEING: WellbeingMetric[] = [
    { department: 'Sales', burnoutRisk: 65, engagement: 72, sentiment: 'Neutral' },
    { department: 'Engineering', burnoutRisk: 25, engagement: 88, sentiment: 'Positive' },
    { department: 'Marketing', burnoutRisk: 45, engagement: 78, sentiment: 'Positive' }
];

// --- PPSP FEATURE MOCKS ---

let MOCK_FLAGS: CriticalFlag[] = [
    { id: 'f1', participantId: 'u1', raterType: RaterType.DIRECT_REPORT, type: 'Professionalism', severity: 'Yellow', description: 'Late to meetings repeatedly.', date: '2025-03-05' }
];

let MOCK_REFLECTIONS: ReflectionEntry[] = [
    { id: 'ref1', userId: 'u1', date: '2025-03-15', content: 'I realized I need to work on my listening skills. The feedback from my team was eye-opening regarding my tendency to interrupt.', programId: 'p1' }
];

// --- AD-HOC FEEDBACK MOCKS ---

let MOCK_ADHOC: AdHocFeedback[] = [
    { id: 'ah1', recipientId: 'u1', senderName: 'External Consultant', message: 'The presentation on Q1 strategy was very clear. Good job handling the questions from the board.', rating: 5, tags: ['#Presentation', '#Strategy'], date: '2025-03-10' },
    { id: 'ah2', recipientId: 'u1', senderName: 'Project Partner', message: 'I appreciated your prompt replies during the audit phase.', rating: 4, tags: ['#Communication'], date: '2025-03-12' }
];

// --- ORGANIZATION EVALUATION MOCKS ---
let MOCK_ORG_SURVEYS: OrgSurvey[] = [
    {
        id: 'os1',
        title: 'Q1 Culture & Values Pulse',
        status: 'Active',
        questions: [
            { id: 'osq1', text: 'I feel aligned with the company\'s mission.' },
            { id: 'osq2', text: 'My team collaborates effectively.' }
        ],
        responses: 34
    }
];

let MOCK_SUGGESTIONS: Suggestion[] = [
    { id: 's1', text: 'We need better coffee in the break room!', date: '2025-03-01', category: 'Facilities', status: 'New' },
    { id: 's2', text: 'The new approval process is too slow.', date: '2025-03-05', category: 'Process', status: 'Reviewed' }
];

let MOCK_NPS: NPSRecord[] = [
    { date: 'Jan', score: 42, promoters: 60, passives: 22, detractors: 18 },
    { date: 'Feb', score: 45, promoters: 62, passives: 21, detractors: 17 },
    { date: 'Mar', score: 38, promoters: 55, passives: 28, detractors: 17 }
];

// --- KPI FEATURE MOCKS ---
let MOCK_KPIS: KPI[] = [
    { id: 'kpi1', name: 'Revenue Target Achievement', description: 'Percentage of quarterly sales target met.', unit: '%', target: 100, type: 'Quantitative' },
    { id: 'kpi2', name: 'Customer Satisfaction Score (CSAT)', description: 'Average CSAT from client feedback surveys.', unit: 'Score', target: 4.5, type: 'Quantitative' },
    { id: 'kpi3', name: 'Project Delivery On-Time', description: 'Rate of projects delivered without delay.', unit: '%', target: 90, type: 'Quantitative' }
];

// --- KEVIN-0502 GRADING SCALE MOCKS ---
let MOCK_GRADING_SCALES: GradingScale[] = [
    {
        id: 'gs1',
        programId: 'p1',
        ranges: [
            { label: 'A (Outstanding)', minScore: 4.5, maxScore: 5.0, color: '#10b981' },
            { label: 'B (Exceeds)', minScore: 3.8, maxScore: 4.49, color: '#6366f1' },
            { label: 'C (Meets)', minScore: 3.0, maxScore: 3.79, color: '#f59e0b' },
            { label: 'D (Needs Improvement)', minScore: 0, maxScore: 2.99, color: '#ef4444' }
        ]
    }
];

// --- WORKFLOW RULES MOCKS ---
let MOCK_WORKFLOW_RULES: WorkflowRule[] = [
    { id: 'wr1', name: 'Alert HR on Low Score', trigger: 'Score < Threshold', condition: 'Overall Score < 3.0', action: 'Alert HR', isActive: true },
    { id: 'wr2', name: 'Notify Manager on Goal Creation', trigger: 'Goal Created', action: 'Send Email', recipient: 'Manager', isActive: true }
];

let MOCK_LEADERBOARD: LeaderboardEntry[] = [
    { rank: 1, name: 'Sarah Chen', points: 3000, avatarUrl: '' },
    { rank: 2, name: 'John Anderson', points: 1250, avatarUrl: '' },
    { rank: 3, name: 'Mike Ross', points: 900, avatarUrl: '' }
];


// --- Service Functions ---

// AUTHENTICATION
export const login = (email: string): Promise<AuthResponse> => {
    return new Promise((resolve, reject) => {
        const user = MOCK_USERS.find(u => u.email === email);
        setTimeout(() => {
            if (user) {
                // Simulate 2FA Requirement
                const requires2FA = true; 
                resolve({ user, token: 'mock-jwt-token', requires2FA });
            } else {
                reject('Invalid credentials');
            }
        }, 600);
    });
};

// NEW: 2FA Verification
export const verify2FACode = (email: string, code: string): Promise<boolean> => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            if (code === '123456') resolve(true);
            else reject('Invalid 2FA code');
        }, 500);
    });
}

// NEW: User Registration
export const registerUser = (name: string, email: string): Promise<void> => {
    return new Promise(resolve => {
        const req: RegistrationRequest = {
            id: `reg${Date.now()}`,
            name,
            email,
            role: 'employee',
            requestedAt: new Date().toISOString().split('T')[0],
            status: 'Pending'
        };
        MOCK_REGISTRATIONS.push(req);
        setTimeout(resolve, 800);
    });
}

// NEW: Get Registrations
export const getRegistrationRequests = (): Promise<RegistrationRequest[]> => {
    return new Promise(resolve => setTimeout(() => resolve(MOCK_REGISTRATIONS.filter(r => r.status === 'Pending')), 400));
}

// NEW: Approve Registration
export const processRegistration = (id: string, status: 'Approved' | 'Rejected'): Promise<void> => {
    return new Promise(resolve => {
        const idx = MOCK_REGISTRATIONS.findIndex(r => r.id === id);
        if(idx > -1) {
            MOCK_REGISTRATIONS[idx].status = status;
            if(status === 'Approved') {
                // Create user
                MOCK_USERS.push({
                    id: `u_new_${Date.now()}`,
                    name: MOCK_REGISTRATIONS[idx].name,
                    email: MOCK_REGISTRATIONS[idx].email,
                    role: 'employee',
                    clientId: 'c1'
                });
            }
        }
        setTimeout(resolve, 500);
    });
}

// New Magic Link Flow for Passwordless
export const sendMagicLink = (email: string): Promise<void> => {
    return new Promise(resolve => setTimeout(resolve, 800));
}

export const verifyMagicCode = (email: string, code: string): Promise<AuthResponse> => {
     return new Promise((resolve, reject) => {
        if(code === '123456') { // Mock code
            const user = MOCK_USERS.find(u => u.email === email) || MOCK_USERS[4]; // Fallback to employee
            resolve({ user, token: 'magic-token-123' });
        } else {
            reject('Invalid code');
        }
     });
}

// Notifications
export const getNotifications = (userId: string): Promise<Notification[]> => {
    // Filter based on role for demo logic
    const user = MOCK_USERS.find(u => u.id === userId);
    if(!user) return Promise.resolve([]);

    let notifs = MOCK_NOTIFICATIONS.filter(n => n.userId === userId);
    if(user.role === 'client_admin') {
        notifs = MOCK_NOTIFICATIONS.filter(n => n.userId === 'u_hr');
    }
    return new Promise(resolve => setTimeout(() => resolve(notifs), 300));
}

export const markNotificationRead = (id: string): Promise<void> => {
    return new Promise(resolve => {
        const idx = MOCK_NOTIFICATIONS.findIndex(n => n.id === id);
        if(idx > -1) MOCK_NOTIFICATIONS[idx].read = true;
        setTimeout(resolve, 200);
    });
}

// History
export const getParticipantHistory = (userId: string): Promise<EvaluationHistory[]> => {
    return new Promise(resolve => setTimeout(() => resolve(MOCK_HISTORY), 500));
}

// User Profile
export const updateUserProfile = (userId: string, updates: Partial<User>): Promise<User> => {
    return new Promise(resolve => {
        const idx = MOCK_USERS.findIndex(u => u.id === userId);
        if (idx > -1) {
            MOCK_USERS[idx] = { ...MOCK_USERS[idx], ...updates };
        }
        setTimeout(() => resolve(MOCK_USERS[idx]), 500);
    });
}


// Clients
export const getClients = (): Promise<Client[]> => {
  return new Promise((resolve) => setTimeout(() => resolve([...MOCK_CLIENTS]), 500));
};

export const addClient = (clientData: Partial<Client>): Promise<Client> => {
    return new Promise((resolve) => {
        const newClient: Client = {
            id: `c${Date.now()}`,
            name: clientData.name || 'New Client',
            subdomain: clientData.subdomain || '',
            creditsPurchased: clientData.creditsPurchased || 0,
            creditsUsed: 0,
            status: ClientStatus.ACTIVE,
            contractEnd: clientData.contractEnd || '2026-01-01'
        };
        MOCK_CLIENTS = [...MOCK_CLIENTS, newClient];
        setTimeout(() => resolve(newClient), 500);
    });
};

export const updateClient = (id: string, updates: Partial<Client>): Promise<Client> => {
    return new Promise((resolve, reject) => {
        const idx = MOCK_CLIENTS.findIndex(c => c.id === id);
        if (idx === -1) {
            reject('Client not found');
            return;
        }
        MOCK_CLIENTS[idx] = { ...MOCK_CLIENTS[idx], ...updates };
        setTimeout(() => resolve(MOCK_CLIENTS[idx]), 500);
    });
};

// Departments
export const getDepartments = (clientId: string): Promise<Department[]> => {
    return new Promise(resolve => setTimeout(() => resolve(MOCK_DEPARTMENTS.filter(d => d.clientId === clientId)), 400));
};

export const addDepartment = (dept: Partial<Department>): Promise<Department> => {
    return new Promise(resolve => {
        const newDept: Department = {
            id: `d${Date.now()}`,
            clientId: dept.clientId || 'c1',
            name: dept.name || 'New Dept',
            headOfDepartment: dept.headOfDepartment || '',
            memberCount: 0
        };
        MOCK_DEPARTMENTS.push(newDept);
        setTimeout(() => resolve(newDept), 300);
    });
};

// Programs
export const getPrograms = (clientId: string): Promise<Program[]> => {
  return new Promise((resolve) => setTimeout(() => resolve(MOCK_PROGRAMS.filter(p => p.clientId === clientId || clientId === 'all')), 400));
};

export const addProgram = (program: Partial<Program>): Promise<Program> => {
    return new Promise(resolve => {
        const newProg: Program = {
            id: `p${Date.now()}`,
            clientId: program.clientId || 'c1',
            name: program.name || 'New Program',
            startDate: program.startDate || new Date().toISOString().split('T')[0],
            status: 'Planning',
            participantCount: 0,
            reportsReady: 0,
            facultyLead: program.facultyLead || ''
        };
        MOCK_PROGRAMS = [...MOCK_PROGRAMS, newProg];
        setTimeout(() => resolve(newProg), 300);
    });
};

export const updateProgram = (id: string, updates: Partial<Program>): Promise<Program> => {
    return new Promise(resolve => {
        const idx = MOCK_PROGRAMS.findIndex(p => p.id === id);
        if (idx > -1) {
            MOCK_PROGRAMS[idx] = { ...MOCK_PROGRAMS[idx], ...updates };
        }
        setTimeout(() => resolve(MOCK_PROGRAMS[idx]), 300);
    });
};

// NEW: Save Workflow Rules
export const saveProgramWorkflow = (id: string, workflow: ProgramWorkflow): Promise<void> => {
    return new Promise(resolve => {
        const p = MOCK_PROGRAMS.find(p => p.id === id);
        if(p) p.workflow = workflow;
        setTimeout(resolve, 300);
    });
}

// Modules
export const getModules = (programId: string): Promise<Module[]> => {
  return new Promise((resolve) => setTimeout(() => resolve(MOCK_MODULES.filter(m => m.programId === programId)), 300));
};

export const updateModule = (id: string, updates: Partial<Module>): Promise<Module> => {
    return new Promise(resolve => {
        const idx = MOCK_MODULES.findIndex(m => m.id === id);
        if (idx > -1) {
            MOCK_MODULES[idx] = { ...MOCK_MODULES[idx], ...updates };
        }
        setTimeout(() => resolve(MOCK_MODULES[idx]), 300);
    });
}

// Participant
export const getCurrentParticipant = (): Promise<Participant> => {
  return new Promise((resolve) => setTimeout(() => resolve(MOCK_PARTICIPANT), 200));
};

// Manager / Team View
export const getTeamMembers = (managerId: string): Promise<TeamMember[]> => {
    return new Promise(resolve => setTimeout(() => resolve(MOCK_TEAM), 400));
};

// Manager Ad-hoc Review
export const initiateAdHocReview = (participantId: string): Promise<void> => {
    return new Promise(resolve => {
        const p = MOCK_TEAM.find(t => t.id === participantId);
        if(p) p.status = 'In Progress';
        setTimeout(resolve, 500);
    });
}

// NEW: Workload Update (MBO)
export const updateWorkload = (userId: string, score: 'High' | 'Normal' | 'Low'): Promise<void> => {
    return new Promise(resolve => {
        const p = MOCK_TEAM.find(t => t.id === userId);
        if(p) p.workloadScore = score;
        setTimeout(resolve, 300);
    });
}

// Admin Participant Management
export const getParticipants = (programId: string): Promise<Participant[]> => {
    return new Promise(resolve => setTimeout(() => resolve(MOCK_PARTICIPANTS_LIST.filter(p => p.programId === programId)), 400));
};

export const addParticipant = (p: Partial<Participant>): Promise<Participant> => {
    return new Promise(resolve => {
        const newP: Participant = {
            id: `u${Date.now()}`,
            name: p.name || 'New User',
            email: p.email || '',
            role: p.role || '',
            programId: p.programId || 'p1',
            avatarUrl: '',
            status: 'Nominated',
            progress: 0,
            points: 0
        };
        MOCK_PARTICIPANTS_LIST.push(newP);
        setTimeout(() => resolve(newP), 300);
    });
};

export const updateParticipant = (id: string, updates: Partial<Participant>): Promise<void> => {
    return new Promise(resolve => {
        const idx = MOCK_PARTICIPANTS_LIST.findIndex(p => p.id === id);
        if(idx > -1) {
            MOCK_PARTICIPANTS_LIST[idx] = { ...MOCK_PARTICIPANTS_LIST[idx], ...updates };
        }
        setTimeout(resolve, 300);
    });
}

export const deleteParticipant = (id: string): Promise<void> => {
    return new Promise(resolve => {
        MOCK_PARTICIPANTS_LIST = MOCK_PARTICIPANTS_LIST.filter(p => p.id !== id);
        setTimeout(resolve, 300);
    });
}

// NEW: Admin Override
export const adminOverrideStatus = (userId: string, status: any): Promise<void> => {
    return new Promise(resolve => {
         const idx = MOCK_PARTICIPANTS_LIST.findIndex(p => p.id === userId);
        if(idx > -1) {
            MOCK_PARTICIPANTS_LIST[idx].status = status;
            // Log audit
            MOCK_AUDIT_LOGS.push({
                id: `a_ovr_${Date.now()}`,
                action: 'ADMIN_STATUS_OVERRIDE',
                actor: 'Admin',
                target: MOCK_PARTICIPANTS_LIST[idx].name,
                timestamp: new Date().toISOString(),
                hash: '0x...',
                details: `Forced status to ${status}`
            });
        }
        setTimeout(resolve, 300);
    });
}

// NEW: Bulk Import Participants
export const bulkImportParticipants = (programId: string, csvData: string): Promise<number> => {
    return new Promise(resolve => {
        const lines = csvData.split('\n');
        let count = 0;
        lines.forEach(line => {
            const [name, email, role] = line.split(',');
            if(name && email) {
                MOCK_PARTICIPANTS_LIST.push({
                    id: `u_bulk_${Date.now()}_${count}`,
                    name: name.trim(),
                    email: email.trim(),
                    role: role?.trim() || 'Employee',
                    programId: programId,
                    avatarUrl: '',
                    status: 'Nominated',
                    progress: 0,
                    points: 0
                });
                count++;
            }
        });
        setTimeout(() => resolve(count), 600);
    });
}

// NEW: Branding Configuration
export const saveBranding = (clientId: string, config: BrandingConfig): Promise<void> => {
    return new Promise(resolve => {
        const c = MOCK_CLIENTS.find(client => client.id === clientId);
        if(c) c.branding = config;
        setTimeout(resolve, 400);
    });
}

// Survey Execution
export const getEvaluationsForUser = (userId: string): Promise<EvaluationTarget[]> => {
    return new Promise(resolve => setTimeout(() => resolve(MOCK_EVALUATIONS), 500));
};

export const saveEvaluationResponse = (targetId: string, responses: Record<string, number | string>, comments: Record<string, string>, flags?: CriticalFlag[], videoResponses?: Record<string, string>): Promise<void> => {
    return new Promise(resolve => {
        const idx = MOCK_EVALUATIONS.findIndex(e => e.id === targetId);
        if(idx > -1) {
            MOCK_EVALUATIONS[idx] = {
                ...MOCK_EVALUATIONS[idx],
                responses: { ...MOCK_EVALUATIONS[idx].responses, ...responses },
                comments: { ...MOCK_EVALUATIONS[idx].comments, ...comments },
                flags: flags,
                videoResponses: videoResponses,
                progress: 100 // Simple mock completion
            };
            
            // DECENTRALIZED FEATURE: Award Points (Simulated Token Reward)
            MOCK_PARTICIPANT.points = (MOCK_PARTICIPANT.points || 0) + 50;
        }
        setTimeout(resolve, 300);
    });
};

// NEW: Admin Manual Assignment
export const adminAssignReview = (reviewerId: string, subjectId: string): Promise<void> => {
    return new Promise(resolve => {
        // Add to reviewer's evaluation list (simulated by adding to MOCK_NOMINATIONS first)
        const reviewer = MOCK_PARTICIPANTS_LIST.find(p => p.id === reviewerId);
        const subject = MOCK_PARTICIPANTS_LIST.find(p => p.id === subjectId);
        
        if (reviewer && subject) {
             MOCK_NOMINATIONS.push({
                id: `n_manual_${Date.now()}`,
                subjectName: subject.name,
                raterName: reviewer.name,
                raterEmail: reviewer.email,
                relation: RaterType.PEER, // Default to Peer for manual
                status: 'approved',
                requestedAt: new Date().toISOString().split('T')[0]
            });
            // Also add to Audit
             MOCK_AUDIT_LOGS.push({
                id: `a_assign_${Date.now()}`,
                action: 'ADMIN_ASSIGN_REVIEW',
                actor: 'Admin',
                target: `${reviewer.name} -> ${subject.name}`,
                timestamp: new Date().toISOString(),
                hash: '0x...',
                details: `Manual pairing created`
            });
        }
        setTimeout(resolve, 400);
    });
}


// Competencies
export const getCompetencies = (): Promise<Competency[]> => {
    const allComps = MOCK_LIBRARIES.flatMap(lib => lib.competencies);
    return new Promise((resolve) => setTimeout(() => resolve(allComps), 300));
};

export const getCompetencyLibraries = (): Promise<CompetencyLibrary[]> => {
    return new Promise((resolve) => setTimeout(() => resolve([...MOCK_LIBRARIES]), 400));
};

export const searchCompetencies = (query: string): Promise<Competency[]> => {
    return new Promise(resolve => {
        if (!query) {
            resolve([]);
            return;
        }
        const q = query.toLowerCase();
        const all = MOCK_LIBRARIES.flatMap(lib => lib.competencies);
        const results = all.filter(c => c.name.toLowerCase().includes(q) || c.description.toLowerCase().includes(q));
        setTimeout(() => resolve(results), 200);
    });
};

export const getTemplates = (): Promise<AssessmentTemplate[]> => {
    return new Promise(resolve => setTimeout(() => resolve(MOCK_TEMPLATES), 300));
}

export const saveTemplate = (name: string, description: string, competencies: Competency[]): Promise<void> => {
    return new Promise(resolve => {
        MOCK_TEMPLATES.push({
            id: `t${Date.now()}`,
            name,
            description,
            competencies
        });
        setTimeout(resolve, 400);
    });
}

export const addCompetencyLibrary = (lib: Partial<CompetencyLibrary>): Promise<CompetencyLibrary> => {
    return new Promise(resolve => {
        const newLib: CompetencyLibrary = {
            id: `lib${Date.now()}`,
            name: lib.name || 'New Library',
            ownerType: lib.ownerType || 'institute',
            description: lib.description || '',
            competencies: []
        };
        MOCK_LIBRARIES = [...MOCK_LIBRARIES, newLib];
        setTimeout(() => resolve(newLib), 400);
    });
};

export const updateCompetencyLibrary = (libId: string, updates: Partial<CompetencyLibrary>): Promise<CompetencyLibrary> => {
    return new Promise((resolve) => {
        const idx = MOCK_LIBRARIES.findIndex(l => l.id === libId);
        if (idx > -1) {
            MOCK_LIBRARIES[idx] = { ...MOCK_LIBRARIES[idx], ...updates };
        }
        setTimeout(() => resolve(MOCK_LIBRARIES[idx]), 300);
    });
};

export const addCompetencyToLibrary = (libId: string, competency: Partial<Competency>): Promise<Competency> => {
    return new Promise(resolve => {
        const libIdx = MOCK_LIBRARIES.findIndex(l => l.id === libId);
        if (libIdx > -1) {
            const newComp: Competency = {
                id: `comp${Date.now()}`,
                name: competency.name || 'New Competency',
                description: competency.description || '',
                questions: []
            };
            MOCK_LIBRARIES[libIdx].competencies.push(newComp);
            setTimeout(() => resolve(newComp), 300);
        }
    });
};

// NEW: Update Competency inline
export const updateCompetency = (compId: string, updates: Partial<Competency>): Promise<void> => {
    return new Promise(resolve => {
        MOCK_LIBRARIES.forEach(lib => {
            const cIdx = lib.competencies.findIndex(c => c.id === compId);
            if (cIdx > -1) {
                lib.competencies[cIdx] = { ...lib.competencies[cIdx], ...updates };
            }
        });
        setTimeout(resolve, 200);
    });
};

export const addQuestionToCompetency = (libId: string | null, compId: string, text: string): Promise<Question> => {
    return new Promise((resolve, reject) => {
        // Search for lib if not provided
        let targetLib = MOCK_LIBRARIES.find(l => l.competencies.some(c => c.id === compId));
        if(libId) {
             targetLib = MOCK_LIBRARIES.find(l => l.id === libId);
        }

        if (targetLib) {
            const compIdx = targetLib.competencies.findIndex(c => c.id === compId);
            if (compIdx > -1) {
                const newQ: Question = {
                    id: `q${Date.now()}`,
                    text: text
                };
                targetLib.competencies[compIdx].questions.push(newQ);
                setTimeout(() => resolve(newQ), 300);
            }
        } else {
            reject('Competency not found');
        }
    });
};

// NEW: Update Question inline
export const updateQuestion = (qId: string, updates: Partial<Question>): Promise<void> => {
    return new Promise(resolve => {
        MOCK_LIBRARIES.forEach(lib => {
            lib.competencies.forEach(comp => {
                const qIdx = comp.questions.findIndex(q => q.id === qId);
                if (qIdx > -1) {
                    comp.questions[qIdx] = { ...comp.questions[qIdx], ...updates };
                }
            });
        });
        setTimeout(resolve, 200);
    });
};

// NEW: Delete Question
export const deleteQuestion = (qId: string): Promise<void> => {
    return new Promise(resolve => {
         MOCK_LIBRARIES.forEach(lib => {
            lib.competencies.forEach(comp => {
                comp.questions = comp.questions.filter(q => q.id !== qId);
            });
        });
        setTimeout(resolve, 200);
    })
}

// NEW: AI Suggestion Simulator
export const getAiSuggestions = (competencyName: string): Promise<string[]> => {
    return new Promise(resolve => {
        const keywords = competencyName.toLowerCase();
        let suggestions: string[] = [];

        if (keywords.includes('strat')) {
            suggestions = [
                "Identifies market trends before competitors.",
                "Translates high-level vision into actionable steps.",
                "Prioritizes initiatives that drive long-term value.",
                "Balances short-term needs with long-term goals."
            ];
        } else if (keywords.includes('influ') || keywords.includes('comm')) {
             suggestions = [
                "Tailors communication style to the audience.",
                "Builds consensus among diverse stakeholders.",
                "Uses data and storytelling to persuade others.",
                "Navigates organizational politics effectively."
            ];
        } else if (keywords.includes('resul') || keywords.includes('drive')) {
             suggestions = [
                "Overcomes obstacles to ensure project delivery.",
                "Maintains high standards of quality under pressure.",
                "Rallies the team to meet challenging deadlines.",
                "Takes personal accountability for outcomes."
            ];
        } else {
            // Generic fallback
            suggestions = [
                `Demonstrates high proficiency in ${competencyName}.`,
                `Role models ${competencyName} for the wider team.`,
                `Seek out feedback to improve ${competencyName}.`,
                `Coaches others to improve ${competencyName}.`
            ];
        }
        setTimeout(() => resolve(suggestions), 600); // Simulate network latency
    });
}


// Approval Queue
export const getPendingNominations = (clientId: string): Promise<RaterNomination[]> => {
    return new Promise(resolve => setTimeout(() => resolve(MOCK_NOMINATIONS.filter(n => n.status === 'pending')), 600));
};

export const getParticipantNominations = (participantId: string): Promise<RaterNomination[]> => {
    return new Promise(resolve => setTimeout(() => resolve(MOCK_NOMINATIONS.filter(n => n.subjectName === 'John Anderson')), 400));
};

export const addNomination = (nomination: Partial<RaterNomination>): Promise<RaterNomination> => {
    return new Promise(resolve => {
        const newNom: RaterNomination = {
            id: `n${Date.now()}`,
            subjectName: nomination.subjectName || 'John Anderson',
            raterName: nomination.raterName || '',
            raterEmail: nomination.raterEmail || '',
            relation: nomination.relation || RaterType.PEER,
            status: 'pending',
            requestedAt: new Date().toISOString().split('T')[0]
        };
        MOCK_NOMINATIONS = [...MOCK_NOMINATIONS, newNom];
        setTimeout(() => resolve(newNom), 300);
    });
}

export const processNomination = (id: string, status: 'approved' | 'rejected'): Promise<void> => {
    return new Promise(resolve => {
        MOCK_NOMINATIONS = MOCK_NOMINATIONS.map(n => n.id === id ? { ...n, status } : n);
        setTimeout(resolve, 300);
    });
};

// Reporting
export const getReportData = (participantId: string): Promise<ReportData> => {
    return new Promise((resolve) => setTimeout(() => resolve(MOCK_REPORT), 800));
};

// --- NEW PEERPULSE & MBO SERVICES ---

export const getGoals = (userId: string): Promise<ActionGoal[]> => {
    return new Promise(resolve => setTimeout(() => resolve(MOCK_GOALS.filter(g => g.userId === userId)), 400));
}

export const getTeamGoals = (managerId: string): Promise<TeamGoal[]> => {
    return new Promise(resolve => setTimeout(() => resolve(MOCK_TEAM_GOALS.filter(g => g.managerId === managerId)), 300));
}

export const addTeamGoal = (goal: Partial<TeamGoal>): Promise<TeamGoal> => {
    return new Promise(resolve => {
        const newG: TeamGoal = {
            id: `tg${Date.now()}`,
            managerId: goal.managerId || '',
            title: goal.title || '',
            description: goal.description || '',
            dueDate: goal.dueDate || '',
            status: 'Active'
        };
        MOCK_TEAM_GOALS.push(newG);
        setTimeout(() => resolve(newG), 300);
    })
}

export const addGoal = (goal: Partial<ActionGoal>): Promise<ActionGoal> => {
    return new Promise(resolve => {
        const newGoal: ActionGoal = {
            id: `g${Date.now()}`,
            userId: goal.userId || 'u1',
            title: goal.title || 'New Goal',
            description: goal.description || '',
            status: 'Not Started',
            dueDate: goal.dueDate || new Date().toISOString().split('T')[0],
            progress: 0,
            weight: goal.weight || 0,
            successCriteria: goal.successCriteria || '',
            cascadingSourceId: goal.cascadingSourceId
        };
        MOCK_GOALS = [...MOCK_GOALS, newGoal];
        setTimeout(() => resolve(newGoal), 300);
    });
}

export const updateGoal = (id: string, updates: Partial<ActionGoal>): Promise<void> => {
    return new Promise(resolve => {
        const idx = MOCK_GOALS.findIndex(g => g.id === id);
        if(idx > -1) {
            MOCK_GOALS[idx] = {...MOCK_GOALS[idx], ...updates};
            // Audit log
             MOCK_AUDIT_LOGS.push({
                id: `a_goal_${Date.now()}`,
                action: 'GOAL_UPDATED',
                actor: 'User',
                target: MOCK_GOALS[idx].title,
                timestamp: new Date().toISOString(),
                hash: '0x...',
                details: `Updated fields: ${Object.keys(updates).join(', ')}`
            });
        }
        setTimeout(resolve, 300);
    });
}

export const analyzeSmartGoal = (goalId: string): Promise<ActionGoal> => {
    return new Promise(resolve => {
        const idx = MOCK_GOALS.findIndex(g => g.id === goalId);
        if (idx > -1) {
            // Simulate AI Analysis
            MOCK_GOALS[idx].smartAnalysis = {
                isSpecific: true,
                isMeasurable: true,
                isAchievable: true,
                isRelevant: true,
                isTimeBound: true,
                score: 95,
                feedback: "This goal is well-structured. Consider adding a mid-point check-in date."
            };
            resolve(MOCK_GOALS[idx]);
        }
    });
}

export const getGoalComments = (goalId: string): Promise<GoalComment[]> => {
    return new Promise(resolve => setTimeout(() => resolve(MOCK_GOAL_COMMENTS.filter(c => c.goalId === goalId)), 300));
}

export const addGoalComment = (comment: Partial<GoalComment>): Promise<GoalComment> => {
     return new Promise(resolve => {
        const newC: GoalComment = {
            id: `gc${Date.now()}`,
            goalId: comment.goalId || '',
            authorName: comment.authorName || 'User',
            text: comment.text || '',
            date: new Date().toISOString().split('T')[0],
            type: comment.type || 'Update'
        };
        MOCK_GOAL_COMMENTS.push(newC);
        setTimeout(() => resolve(newC), 300);
    });
}

export const getInterviewNotes = (participantId: string): Promise<InterviewNote[]> => {
    return new Promise(resolve => setTimeout(() => resolve(MOCK_INTERVIEW_NOTES.filter(n => n.participantId === participantId)), 300));
}

export const addInterviewNote = (note: Partial<InterviewNote>): Promise<void> => {
    return new Promise(resolve => {
        MOCK_INTERVIEW_NOTES.push({
            id: `in${Date.now()}`,
            participantId: note.participantId || '',
            authorId: note.authorId || '',
            stage: note.stage || 'Do',
            text: note.text || '',
            date: new Date().toISOString().split('T')[0]
        });
        setTimeout(resolve, 300);
    });
}

// NEW: Matrix Excel Download Mock
export const getMatrixCsv = (programId: string): Promise<string> => {
    return new Promise(resolve => {
        const header = "Participant,Rater Name,Relation,Status\n";
        const rows = MOCK_NOMINATIONS.map(n => `${n.subjectName},${n.raterName},${n.relation},${n.status}`).join('\n');
        resolve(header + rows);
    });
}

export const processMatrixCsv = (csv: string): Promise<void> => {
    return new Promise(resolve => setTimeout(resolve, 1000)); // Mock processing
}

export const getDevelopmentPlans = (userId: string): Promise<DevelopmentPlan[]> => {
    return new Promise(resolve => setTimeout(() => resolve(MOCK_PLANS.filter(p => p.userId === userId)), 400));
}

export const updateMilestone = (planId: string, milestoneId: string, status: 'Completed' | 'In Progress'): Promise<void> => {
    return new Promise(resolve => {
        const plan = MOCK_PLANS.find(p => p.id === planId);
        if(plan) {
            const m = plan.milestones.find(m => m.id === milestoneId);
            if(m) {
                m.status = status;
                if(status === 'Completed') m.evidenceHash = `0x${Date.now().toString(16)}`;
            }
            // Check if all completed
            if(plan.milestones.every(m => m.status === 'Completed')) {
                plan.status = 'Fulfilled';
            }
        }
        setTimeout(resolve, 300);
    });
}

export const getPulseHistory = (userId: string): Promise<PulseResponse[]> => {
    return new Promise(resolve => setTimeout(() => resolve(MOCK_PULSE.filter(p => p.userId === userId)), 400));
}

export const submitPulse = (userId: string, mood: number, blockers?: string): Promise<void> => {
    return new Promise(resolve => {
        MOCK_PULSE.push({
            id: `p${Date.now()}`,
            userId,
            date: new Date().toISOString().split('T')[0],
            moodScore: mood,
            blockers
        });
        setTimeout(resolve, 300);
    });
}

export const getKudos = (userId: string): Promise<Kudos[]> => {
    return new Promise(resolve => setTimeout(() => resolve(MOCK_KUDOS.filter(k => k.toName === 'John Anderson')), 400)); // Mock filter by name for demo
}

export const sendKudos = (kudos: Partial<Kudos>): Promise<Kudos> => {
    return new Promise(resolve => {
        const newKudos: Kudos = {
            id: `k${Date.now()}`,
            fromName: kudos.fromName || 'Anonymous',
            toName: kudos.toName || '',
            message: kudos.message || '',
            category: kudos.category || 'Teamwork',
            date: 'Just now'
        };
        MOCK_KUDOS = [newKudos, ...MOCK_KUDOS];
        setTimeout(() => resolve(newKudos), 300);
    });
}

export const getCampaigns = (): Promise<Campaign[]> => {
    return new Promise(resolve => setTimeout(() => resolve(MOCK_CAMPAIGNS), 400));
}

export const getSuggestedPeers = (userId: string): Promise<SuggestedPeer[]> => {
    return new Promise(resolve => setTimeout(() => resolve(MOCK_SUGGESTED_PEERS), 300));
}

// --- DECENTRALIZED SERVICES ---

export const getAuditLogs = (): Promise<AuditLog[]> => {
    return new Promise(resolve => setTimeout(() => resolve(MOCK_AUDIT_LOGS), 400));
}

export const getEndorsements = (userId: string): Promise<SkillEndorsement[]> => {
    return new Promise(resolve => setTimeout(() => resolve(MOCK_ENDORSEMENTS), 400));
}

export const getCoordinators = (): Promise<Coordinator[]> => {
    return new Promise(resolve => setTimeout(() => resolve(MOCK_COORDINATORS), 400));
}

export const verifyCoordinator = (id: string): Promise<void> => {
    return new Promise(resolve => {
        const c = MOCK_COORDINATORS.find(c => c.id === id);
        if(c) c.verified = true;
        setTimeout(resolve, 500);
    });
}

export const sendClarificationRequest = (commentId: string, message: string): Promise<void> => {
    return new Promise(resolve => {
        console.log(`Clarification sent for comment ${commentId}: ${message}`);
        setTimeout(resolve, 500);
    });
}

// --- Q360 / ADVANCED AI SERVICES ---

export const getRiskAlerts = (): Promise<RiskAlert[]> => {
    return new Promise(resolve => setTimeout(() => resolve(MOCK_RISK_ALERTS), 400));
}

export const getTalentMatrix = (): Promise<TalentPosition[]> => {
    return new Promise(resolve => setTimeout(() => resolve(MOCK_TALENT_MATRIX), 500));
}

export const getWellbeingStats = (): Promise<WellbeingMetric[]> => {
    return new Promise(resolve => setTimeout(() => resolve(MOCK_WELLBEING), 400));
}

// --- PPSP / ACADEMIC FEATURES ---

export const getReflections = (userId: string): Promise<ReflectionEntry[]> => {
    return new Promise(resolve => setTimeout(() => resolve(MOCK_REFLECTIONS.filter(r => r.userId === userId)), 400));
}

export const addReflection = (userId: string, content: string): Promise<ReflectionEntry> => {
    return new Promise(resolve => {
        const newRef: ReflectionEntry = {
            id: `ref${Date.now()}`,
            userId,
            date: new Date().toISOString().split('T')[0],
            content,
            programId: 'p1'
        };
        MOCK_REFLECTIONS.push(newRef);
        setTimeout(() => resolve(newRef), 300);
    });
}

export const getPendingFacilitatorReviews = (facultyId: string): Promise<Participant[]> => {
    // Mock: Participants who are completed but not released
    return new Promise(resolve => setTimeout(() => resolve(MOCK_PARTICIPANTS_LIST.filter(p => p.status === 'Pending Review')), 400));
}

export const releaseReport = (participantId: string, notes: string): Promise<void> => {
    return new Promise(resolve => {
        const p = MOCK_PARTICIPANTS_LIST.find(p => p.id === participantId);
        if (p) {
            p.status = 'Completed'; // Release to student
        }
        setTimeout(resolve, 400);
    })
}

// --- NEW PPSP SERVICES (Vendor, Org Chart, Auto-Assign) ---

export const getOrgChart = (): Promise<OrgNode> => {
    // Simulated Tree
    const org: OrgNode = {
        id: 'u_ceo', name: 'CEO', role: 'Executive',
        children: [
            {
                id: 'u_mgr', name: 'Sarah Chen', role: 'VP Strategy',
                children: [
                    { id: 'u1', name: 'John Anderson', role: 'Director', children: [] },
                    { id: 'u99', name: 'Mark Lee', role: 'Manager', children: [] }
                ]
            },
            {
                id: 'u_vp2', name: 'Mike Ross', role: 'VP Engineering', children: []
            }
        ]
    };
    return new Promise(resolve => setTimeout(() => resolve(org), 300));
}

export const getVendors = (): Promise<Vendor[]> => {
    return new Promise(resolve => setTimeout(() => resolve(MOCK_VENDORS), 300));
}

export const addVendor = (v: Partial<Vendor>): Promise<Vendor> => {
    return new Promise(resolve => {
        const newV: Vendor = {
            id: `v${Date.now()}`,
            name: v.name || 'New Vendor',
            serviceType: v.serviceType || '',
            contactEmail: v.contactEmail || '',
            status: 'Active'
        };
        MOCK_VENDORS.push(newV);
        setTimeout(() => resolve(newV), 300);
    });
}

export const autoAssignRaters = (participantId: string): Promise<void> => {
    // Simulate logic: Find manager, find direct reports, add to nominations
    return new Promise(resolve => {
        // Mock adding mock nominations
        const newNoms: RaterNomination[] = [
            { id: `n_auto1_${Date.now()}`, subjectName: 'John Anderson', raterName: 'Sarah Chen', raterEmail: 'sarah@acme.com', relation: RaterType.MANAGER, status: 'pending', requestedAt: new Date().toISOString().split('T')[0] },
            { id: `n_auto2_${Date.now()}`, subjectName: 'John Anderson', raterName: 'Mark Lee', raterEmail: 'mark@acme.com', relation: RaterType.DIRECT_REPORT, status: 'pending', requestedAt: new Date().toISOString().split('T')[0] }
        ];
        MOCK_NOMINATIONS = [...MOCK_NOMINATIONS, ...newNoms];
        setTimeout(resolve, 600);
    });
}

// --- AD-HOC / CONTINUOUS FEEDBACK SERVICES ---

export const getAdHocFeedback = (userId: string): Promise<AdHocFeedback[]> => {
    return new Promise(resolve => setTimeout(() => resolve(MOCK_ADHOC.filter(ah => ah.recipientId === userId)), 300));
}

export const generatePublicLink = (userId: string): Promise<string> => {
    // Simulate generating a unique hash link
    return Promise.resolve(`https://nexus360.edu/f/${userId}/share`);
}

// --- NEW RAINACHO SERVICES ---

export const getJobRoles = (clientId: string): Promise<JobRole[]> => {
    return new Promise(resolve => setTimeout(() => resolve(MOCK_JOB_ROLES.filter(j => j.clientId === clientId)), 400));
}

export const addJobRole = (role: Partial<JobRole>): Promise<JobRole> => {
    return new Promise(resolve => {
        const newRole: JobRole = {
            id: `jr${Date.now()}`,
            clientId: role.clientId || 'c1',
            title: role.title || '',
            level: role.level || '',
            mappedTemplateId: role.mappedTemplateId
        };
        MOCK_JOB_ROLES.push(newRole);
        setTimeout(() => resolve(newRole), 300);
    });
}

export const getCalendarEvents = (): Promise<CalendarEvent[]> => {
    return new Promise(resolve => setTimeout(() => resolve(MOCK_CALENDAR_EVENTS), 300));
}

export const getLocations = (clientId: string): Promise<Location[]> => {
    return new Promise(resolve => setTimeout(() => resolve(MOCK_LOCATIONS.filter(l => l.clientId === clientId)), 300));
}

export const addLocation = (loc: Partial<Location>): Promise<Location> => {
    return new Promise(resolve => {
        const newLoc: Location = {
            id: `loc${Date.now()}`,
            clientId: loc.clientId || 'c1',
            name: loc.name || 'New Location',
            address: loc.address || '',
            country: loc.country || ''
        };
        MOCK_LOCATIONS.push(newLoc);
        setTimeout(() => resolve(newLoc), 300);
    });
}

export const getProgramTemplates = (): Promise<ProgramTemplate[]> => {
    return new Promise(resolve => setTimeout(() => resolve(MOCK_PROGRAM_TEMPLATES), 300));
}

// --- MYFJDTHINK SERVICES ---

export const getRaterWeights = (programId: string): Promise<RaterWeightConfig> => {
    const p = MOCK_PROGRAMS.find(prog => prog.id === programId);
    return Promise.resolve(p?.raterWeights || {
        [RaterType.MANAGER]: 50,
        [RaterType.PEER]: 30,
        [RaterType.DIRECT_REPORT]: 10,
        [RaterType.SELF]: 10,
        [RaterType.EXTERNAL]: 0
    });
}

export const saveRaterWeights = (programId: string, weights: RaterWeightConfig): Promise<void> => {
    const p = MOCK_PROGRAMS.find(prog => prog.id === programId);
    if(p) p.raterWeights = weights;
    return Promise.resolve();
}

export const calculateResults = (programId: string): Promise<void> => {
    // Simulate heavy calculation
    return new Promise(resolve => {
        // In real app, iterate participants, aggregate scores based on weights
        setTimeout(() => {
            const p = MOCK_PROGRAMS.find(prog => prog.id === programId);
            if(p) p.status = 'Finalized';
            resolve();
        }, 1500);
    });
}

export const getEvaluationMatrix = (programId: string): Promise<EvaluationMatrixRow[]> => {
    // Simulate building matrix from participants + nominations
    const parts = MOCK_PARTICIPANTS_LIST.filter(p => p.programId === programId);
    const matrix: EvaluationMatrixRow[] = parts.map(p => {
        const noms = MOCK_NOMINATIONS.filter(n => n.subjectName === p.name && n.status === 'approved');
        return {
            participantId: p.id,
            participantName: p.name,
            raters: noms.map(n => ({
                raterName: n.raterName,
                raterType: n.relation,
                status: Math.random() > 0.5 ? 'Completed' : 'Pending' // Mock status
            })),
            completionRate: Math.floor(Math.random() * 100)
        };
    });
    return Promise.resolve(matrix);
}

// --- ORGANIZATION EVALUATION (New Features) ---

export const getOrgSurveys = (): Promise<OrgSurvey[]> => {
    return new Promise(resolve => setTimeout(() => resolve(MOCK_ORG_SURVEYS), 300));
}

export const submitSuggestion = (text: string, category: any): Promise<void> => {
    return new Promise(resolve => {
        MOCK_SUGGESTIONS.push({
            id: `s${Date.now()}`,
            text,
            category,
            date: new Date().toISOString().split('T')[0],
            status: 'New'
        });
        setTimeout(resolve, 300);
    });
}

export const getSuggestions = (): Promise<Suggestion[]> => {
    return new Promise(resolve => setTimeout(() => resolve(MOCK_SUGGESTIONS), 300));
}

export const getNPSHistory = (): Promise<NPSRecord[]> => {
    return new Promise(resolve => setTimeout(() => resolve(MOCK_NPS), 300));
}

// --- KEVIN-0502 / KPI SERVICES ---
export const getKPIs = (): Promise<KPI[]> => {
    return new Promise(resolve => setTimeout(() => resolve(MOCK_KPIS), 300));
}

export const addKPI = (kpi: Partial<KPI>): Promise<KPI> => {
    return new Promise(resolve => {
        const newKPI: KPI = {
            id: `kpi${Date.now()}`,
            name: kpi.name || 'New KPI',
            description: kpi.description || '',
            unit: kpi.unit || '#',
            target: kpi.target || 0,
            type: kpi.type || 'Quantitative'
        };
        MOCK_KPIS = [...MOCK_KPIS, newKPI];
        setTimeout(() => resolve(newKPI), 300);
    });
}

// --- KEVIN-0502 GRADING SCALE SERVICES ---
export const getGradingScale = (programId: string): Promise<GradingScale | null> => {
    return new Promise(resolve => setTimeout(() => resolve(MOCK_GRADING_SCALES.find(gs => gs.programId === programId) || null), 300));
}

export const saveGradingScale = (scale: GradingScale): Promise<void> => {
    return new Promise(resolve => {
        const idx = MOCK_GRADING_SCALES.findIndex(gs => gs.programId === scale.programId);
        if(idx > -1) MOCK_GRADING_SCALES[idx] = scale;
        else MOCK_GRADING_SCALES.push(scale);
        setTimeout(resolve, 300);
    });
}

// --- PRAVALLIKAB98 / PROJECT SERVICES ---
export const getProjects = (userId: string): Promise<Project[]> => {
    return new Promise(resolve => setTimeout(() => resolve(MOCK_PROJECTS.filter(p => p.userId === userId)), 400));
}

export const addProject = (proj: Partial<Project>): Promise<Project> => {
    return new Promise(resolve => {
        const newProj: Project = {
            id: `proj${Date.now()}`,
            userId: proj.userId || 'u1',
            name: proj.name || 'New Project',
            description: proj.description || '',
            role: proj.role || 'Contributor',
            completionDate: proj.completionDate || new Date().toISOString().split('T')[0],
            feedbackCount: 0
        };
        MOCK_PROJECTS.push(newProj);
        setTimeout(() => resolve(newProj), 300);
    });
}

export const requestProjectFeedback = (req: Partial<ProjectFeedbackRequest>): Promise<void> => {
    return new Promise(resolve => {
        MOCK_PROJECT_REQUESTS.push({
            id: `pr${Date.now()}`,
            projectId: req.projectId || '',
            requesterId: req.requesterId || '',
            targetEmail: req.targetEmail || '',
            status: 'Pending'
        });
        setTimeout(resolve, 300);
    });
}

export const getProjectFeedbackRequests = (userId: string): Promise<ProjectFeedbackRequest[]> => {
    return new Promise(resolve => setTimeout(() => resolve(MOCK_PROJECT_REQUESTS.filter(r => r.requesterId === userId)), 400));
}

// --- WORKFLOW AUTOMATION SERVICES ---
export const getWorkflowRules = (): Promise<WorkflowRule[]> => {
    return new Promise(resolve => setTimeout(() => resolve(MOCK_WORKFLOW_RULES), 300));
}

export const addWorkflowRule = (rule: Partial<WorkflowRule>): Promise<WorkflowRule> => {
    return new Promise(resolve => {
        const newRule: WorkflowRule = {
            id: `wr${Date.now()}`,
            name: rule.name || 'New Rule',
            trigger: rule.trigger || 'Evaluation Completed',
            condition: rule.condition,
            action: rule.action || 'Send Email',
            recipient: rule.recipient,
            isActive: true
        };
        MOCK_WORKFLOW_RULES.push(newRule);
        setTimeout(() => resolve(newRule), 300);
    });
}

// --- CALIBRATION SERVICES ---
export const getCalibrationBuckets = (programId: string): Promise<CalibrationBucket[]> => {
    return new Promise(resolve => {
        // Mock initial buckets
        const buckets: CalibrationBucket[] = [
            { id: 'b_high', label: 'Exceeds Expectations', color: 'emerald', employees: [] },
            { id: 'b_med', label: 'Meets Expectations', color: 'indigo', employees: [] },
            { id: 'b_low', label: 'Below Expectations', color: 'amber', employees: [] }
        ];
        // Distribute team into buckets for demo
        MOCK_TEAM.forEach(m => {
            if(m.calibratedRating === 'Exceeds') buckets[0].employees.push(m);
            else if(m.calibratedRating === 'Below') buckets[2].employees.push(m);
            else buckets[1].employees.push(m);
        });
        setTimeout(() => resolve(buckets), 400);
    });
}

export const updateCalibration = (employeeId: string, bucketLabel: string): Promise<void> => {
    return new Promise(resolve => {
        const m = MOCK_TEAM.find(t => t.id === employeeId);
        if(m) m.calibratedRating = bucketLabel === 'Exceeds Expectations' ? 'Exceeds' : bucketLabel === 'Below Expectations' ? 'Below' : 'Meets';
        setTimeout(resolve, 200);
    });
}

// --- NEW: SYSTEM HEALTH & GAMIFICATION SERVICES ---

export const getSystemHealth = (): Promise<SystemHealth> => {
    return new Promise(resolve => setTimeout(() => resolve({
        apiLatency: 120,
        errorRate: 0.02,
        activeUsers: 845,
        dbStatus: 'Healthy',
        uptime: 99.98
    }), 500));
}

export const getLeaderboard = (): Promise<LeaderboardEntry[]> => {
    return new Promise(resolve => setTimeout(() => resolve(MOCK_LEADERBOARD), 400));
}
