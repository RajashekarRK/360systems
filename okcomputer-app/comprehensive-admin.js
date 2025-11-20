// Global state management
let clients = [
    {
        id: 1,
        companyName: "TechCorp Solutions",
        industry: "technology",
        contactEmail: "admin@techcorp.com",
        phone: "+1-555-0123",
        address: "123 Innovation Drive, San Francisco, CA",
        status: "active",
        programs: 3,
        users: 45,
        createdAt: "2024-01-15"
    },
    {
        id: 2,
        companyName: "HealthCare Plus",
        industry: "healthcare",
        contactEmail: "info@healthcareplus.com",
        phone: "+1-555-0124",
        address: "456 Medical Center Way, Boston, MA",
        status: "active",
        programs: 2,
        users: 32,
        createdAt: "2024-02-01"
    },
    {
        id: 3,
        companyName: "FinanceFirst",
        industry: "finance",
        contactEmail: "contact@financefirst.com",
        phone: "+1-555-0125",
        address: "789 Wall Street, New York, NY",
        status: "pending",
        programs: 1,
        users: 28,
        createdAt: "2024-02-15"
    }
];

let programs = [
    {
        id: 1,
        name: "Leadership Development 2024",
        clientId: 1,
        status: "active",
        startDate: "2024-03-01",
        endDate: "2024-06-01",
        participants: 25,
        completionRate: 68,
        type: "leadership"
    },
    {
        id: 2,
        name: "Technical Skills Assessment",
        clientId: 1,
        status: "planning",
        startDate: "2024-04-15",
        endDate: "2024-07-15",
        participants: 20,
        completionRate: 0,
        type: "technical"
    },
    {
        id: 3,
        name: "Manager Excellence Program",
        clientId: 2,
        status: "active",
        startDate: "2024-02-15",
        endDate: "2024-05-15",
        participants: 18,
        completionRate: 45,
        type: "management"
    }
];

let competencies = [
    {
        id: 1,
        name: "Strategic Thinking",
        category: "leadership",
        description: "Ability to develop and implement long-term strategies and plans.",
        indicators: ["Develops strategic plans", "Anticipates future trends", "Makes data-driven decisions"],
        questions: 8,
        usage: 15
    },
    {
        id: 2,
        name: "Technical Proficiency",
        category: "technical",
        description: "Demonstrates expertise in relevant technical skills and tools.",
        indicators: ["Maintains technical knowledge", "Solves complex problems", "Adapts to new technologies"],
        questions: 12,
        usage: 23
    },
    {
        id: 3,
        name: "Communication Skills",
        category: "communication",
        description: "Effectively conveys information and ideas to others.",
        indicators: ["Clear verbal communication", "Effective written communication", "Active listening"],
        questions: 10,
        usage: 31
    },
    {
        id: 4,
        name: "Team Leadership",
        category: "leadership",
        description: "Inspires and guides teams toward achieving goals.",
        indicators: ["Builds team cohesion", "Motivates team members", "Delegates effectively"],
        questions: 9,
        usage: 18
    },
    {
        id: 5,
        name: "Problem Solving",
        category: "analytical",
        description: "Identifies issues and develops effective solutions.",
        indicators: ["Analyzes root causes", "Generates creative solutions", "Implements improvements"],
        questions: 7,
        usage: 27
    },
    {
        id: 6,
        name: "Collaboration",
        category: "interpersonal",
        description: "Works effectively with others to achieve common goals.",
        indicators: ["Builds relationships", "Shares knowledge", "Supports team members"],
        questions: 6,
        usage: 22
    }
];

let questions = [
    {
        id: 1,
        competencyId: 1,
        question: "How effectively does this person develop long-term strategic plans?",
        type: "rating",
        weight: 4
    },
    {
        id: 2,
        competencyId: 1,
        question: "Does this individual demonstrate the ability to anticipate future market trends?",
        type: "rating",
        weight: 5
    },
    {
        id: 3,
        competencyId: 2,
        question: "How would you rate this person's technical expertise in their domain?",
        type: "rating",
        weight: 4
    },
    {
        id: 4,
        competencyId: 3,
        question: "How clearly does this person communicate complex ideas?",
        type: "rating",
        weight: 3
    },
    {
        id: 5,
        competencyId: 3,
        question: "Does this individual actively listen and respond appropriately to others?",
        type: "rating",
        weight: 4
    }
];

let users = [
    {
        id: 1,
        name: "John Smith",
        email: "john.smith@techcorp.com",
        role: "admin",
        clientId: 1,
        status: "active",
        lastLogin: "2024-03-15"
    },
    {
        id: 2,
        name: "Sarah Johnson",
        email: "sarah.j@healthcareplus.com",
        role: "manager",
        clientId: 2,
        status: "active",
        lastLogin: "2024-03-14"
    },
    {
        id: 3,
        name: "Mike Davis",
        email: "mike.davis@techcorp.com",
        role: "employee",
        clientId: 1,
        status: "active",
        lastLogin: "2024-03-13"
    }
];

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
    setupEventListeners();
    renderDashboard();
});

function initializeApp() {
    // Initialize charts
    renderActivityChart();
    renderCompetencyChart();
    renderEngagementChart();
    renderCompletionChart();
    renderPerformanceChart();
    
    // Populate dropdowns
    populateCompetencyDropdowns();
    
    // Render initial sections
    renderClients();
    renderPrograms();
    renderCompetencies();
    renderQuestions();
    renderUsers();
}

function setupEventListeners() {
    // Sidebar toggle
    document.getElementById('sidebarToggle').addEventListener('click', toggleSidebar);
    
    // Form submissions
    document.getElementById('addClientForm').addEventListener('submit', handleAddClient);
    document.getElementById('addCompetencyForm').addEventListener('submit', handleAddCompetency);
    document.getElementById('addQuestionForm').addEventListener('submit', handleAddQuestion);
    
    // Category filter
    document.getElementById('categoryFilter').addEventListener('change', filterCompetencies);
    document.getElementById('questionCompetencyFilter').addEventListener('change', filterQuestions);
}

function toggleSidebar() {
    const sidebar = document.getElementById('sidebar');
    const mainContent = document.getElementById('mainContent');
    
    sidebar.classList.toggle('collapsed');
    mainContent.style.marginLeft = sidebar.classList.contains('collapsed') ? '80px' : '256px';
}

function showSection(sectionName) {
    // Hide all sections
    const sections = ['dashboard', 'clients-section', 'programs-section', 'competencies-section', 
                     'questions-section', 'users-section', 'analytics-section', 'communications-section'];
    
    sections.forEach(section => {
        const element = document.getElementById(section);
        if (element) {
            element.classList.add('hidden');
        }
    });
    
    // Show selected section
    const targetSection = document.getElementById(sectionName + '-section') || 
                         (sectionName === 'dashboard' ? document.getElementById('dashboard') : null);
    
    if (targetSection) {
        targetSection.classList.remove('hidden');
    }
}

// Chart rendering functions
function renderActivityChart() {
    const data = [{
        x: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
        y: [45, 52, 61, 58, 67, 73],
        type: 'scatter',
        mode: 'lines+markers',
        line: { color: '#3B82F6', width: 3 },
        marker: { color: '#3B82F6', size: 8 }
    }];
    
    const layout = {
        title: '',
        xaxis: { title: 'Month' },
        yaxis: { title: 'Active Users' },
        margin: { t: 20, r: 20, b: 40, l: 40 },
        plot_bgcolor: 'rgba(0,0,0,0)',
        paper_bgcolor: 'rgba(0,0,0,0)'
    };
    
    Plotly.newPlot('activityChart', data, layout, {displayModeBar: false});
}

function renderCompetencyChart() {
    const data = [{
        labels: ['Leadership', 'Technical', 'Communication', 'Analytical', 'Interpersonal'],
        values: [35, 25, 20, 12, 8],
        type: 'pie',
        marker: {
            colors: ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6']
        }
    }];
    
    const layout = {
        margin: { t: 20, r: 20, b: 20, l: 20 },
        plot_bgcolor: 'rgba(0,0,0,0)',
        paper_bgcolor: 'rgba(0,0,0,0)'
    };
    
    Plotly.newPlot('competencyChart', data, layout, {displayModeBar: false});
}

function renderEngagementChart() {
    const data = [{
        x: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
        y: [85, 92, 88, 95],
        type: 'bar',
        marker: { color: '#10B981' }
    }];
    
    const layout = {
        title: '',
        xaxis: { title: 'Time Period' },
        yaxis: { title: 'Engagement %' },
        margin: { t: 20, r: 20, b: 40, l: 40 },
        plot_bgcolor: 'rgba(0,0,0,0)',
        paper_bgcolor: 'rgba(0,0,0,0)'
    };
    
    Plotly.newPlot('engagementChart', data, layout, {displayModeBar: false});
}

function renderCompletionChart() {
    const data = [{
        x: ['Q1', 'Q2', 'Q3', 'Q4'],
        y: [78, 85, 82, 90],
        type: 'scatter',
        mode: 'lines+markers',
        line: { color: '#F59E0B', width: 3 },
        marker: { color: '#F59E0B', size: 10 }
    }];
    
    const layout = {
        title: '',
        xaxis: { title: 'Quarter' },
        yaxis: { title: 'Completion Rate %' },
        margin: { t: 20, r: 20, b: 40, l: 40 },
        plot_bgcolor: 'rgba(0,0,0,0)',
        paper_bgcolor: 'rgba(0,0,0,0)'
    };
    
    Plotly.newPlot('completionChart', data, layout, {displayModeBar: false});
}

function renderPerformanceChart() {
    const data = [
        {
            x: ['System Uptime', 'Response Time', 'User Satisfaction', 'Data Accuracy'],
            y: [99.9, 1.2, 94, 98],
            type: 'bar',
            name: 'Current Performance',
            marker: { color: '#3B82F6' }
        },
        {
            x: ['System Uptime', 'Response Time', 'User Satisfaction', 'Data Accuracy'],
            y: [99.5, 1.5, 90, 95],
            type: 'bar',
            name: 'Target Performance',
            marker: { color: '#E5E7EB' }
        }
    ];
    
    const layout = {
        title: '',
        xaxis: { title: 'Metrics' },
        yaxis: { title: 'Performance %' },
        barmode: 'group',
        margin: { t: 20, r: 20, b: 60, l: 40 },
        plot_bgcolor: 'rgba(0,0,0,0)',
        paper_bgcolor: 'rgba(0,0,0,0)'
    };
    
    Plotly.newPlot('performanceChart', data, layout, {displayModeBar: false});
}

// Client management functions
function renderClients() {
    const grid = document.getElementById('clientsGrid');
    grid.innerHTML = '';
    
    clients.forEach(client => {
        const card = createClientCard(client);
        grid.appendChild(card);
    });
}

function createClientCard(client) {
    const div = document.createElement('div');
    div.className = 'bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow';
    
    const statusColor = client.status === 'active' ? 'text-green-600 bg-green-100' : 'text-yellow-600 bg-yellow-100';
    const industryIcon = getIndustryIcon(client.industry);
    
    div.innerHTML = `
        <div class="flex items-start justify-between mb-4">
            <div class="flex items-center">
                <div class="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
                    <i class="${industryIcon} text-blue-600 text-xl"></i>
                </div>
                <div>
                    <h3 class="font-semibold text-gray-900">${client.companyName}</h3>
                    <p class="text-sm text-gray-600">${client.industry.charAt(0).toUpperCase() + client.industry.slice(1)}</p>
                </div>
            </div>
            <span class="px-2 py-1 text-xs font-medium rounded-full ${statusColor}">
                ${client.status.charAt(0).toUpperCase() + client.status.slice(1)}
            </span>
        </div>
        
        <div class="space-y-2 mb-4">
            <div class="flex justify-between text-sm">
                <span class="text-gray-600">Programs:</span>
                <span class="font-medium">${client.programs}</span>
            </div>
            <div class="flex justify-between text-sm">
                <span class="text-gray-600">Users:</span>
                <span class="font-medium">${client.users}</span>
            </div>
            <div class="flex justify-between text-sm">
                <span class="text-gray-600">Created:</span>
                <span class="font-medium">${new Date(client.createdAt).toLocaleDateString()}</span>
            </div>
        </div>
        
        <div class="flex space-x-2">
            <button onclick="editClient(${client.id})" class="flex-1 bg-blue-50 text-blue-600 px-3 py-2 rounded-lg text-sm font-medium hover:bg-blue-100 transition-colors">
                <i class="fas fa-edit mr-1"></i>Edit
            </button>
            <button onclick="viewClient(${client.id})" class="flex-1 bg-gray-50 text-gray-600 px-3 py-2 rounded-lg text-sm font-medium hover:bg-gray-100 transition-colors">
                <i class="fas fa-eye mr-1"></i>View
            </button>
        </div>
    `;
    
    return div;
}

function getIndustryIcon(industry) {
    const icons = {
        technology: 'fas fa-microchip',
        healthcare: 'fas fa-heartbeat',
        finance: 'fas fa-chart-line',
        manufacturing: 'fas fa-industry',
        retail: 'fas fa-shopping-cart',
        other: 'fas fa-building'
    };
    return icons[industry] || icons.other;
}

function openAddClientModal() {
    document.getElementById('addClientModal').classList.remove('hidden');
    document.getElementById('addClientModal').classList.add('flex');
}

function closeAddClientModal() {
    document.getElementById('addClientModal').classList.add('hidden');
    document.getElementById('addClientModal').classList.remove('flex');
    document.getElementById('addClientForm').reset();
}

function handleAddClient(e) {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const newClient = {
        id: Math.max(...clients.map(c => c.id)) + 1,
        companyName: formData.get('companyName'),
        industry: formData.get('industry'),
        contactEmail: formData.get('contactEmail'),
        phone: formData.get('phone'),
        address: formData.get('address'),
        status: 'active',
        programs: 0,
        users: 0,
        createdAt: new Date().toISOString().split('T')[0]
    };
    
    clients.push(newClient);
    renderClients();
    closeAddClientModal();
    
    showNotification('Client added successfully!', 'success');
}

function editClient(clientId) {
    showNotification('Edit client functionality coming soon!', 'info');
}

function viewClient(clientId) {
    showNotification('View client details functionality coming soon!', 'info');
}

// Program management functions
function renderPrograms() {
    const grid = document.getElementById('programsGrid');
    grid.innerHTML = '';
    
    programs.forEach(program => {
        const card = createProgramCard(program);
        grid.appendChild(card);
    });
}

function createProgramCard(program) {
    const div = document.createElement('div');
    div.className = 'bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow';
    
    const statusColors = {
        active: 'text-green-600 bg-green-100',
        planning: 'text-blue-600 bg-blue-100',
        completed: 'text-gray-600 bg-gray-100'
    };
    
    const client = clients.find(c => c.id === program.clientId);
    
    div.innerHTML = `
        <div class="flex justify-between items-start mb-4">
            <div>
                <h3 class="font-semibold text-gray-900 mb-1">${program.name}</h3>
                <p class="text-sm text-gray-600">${client ? client.companyName : 'Unknown Client'}</p>
            </div>
            <span class="px-2 py-1 text-xs font-medium rounded-full ${statusColors[program.status] || statusColors.planning}">
                ${program.status.charAt(0).toUpperCase() + program.status.slice(1)}
            </span>
        </div>
        
        <div class="space-y-3 mb-4">
            <div class="flex justify-between text-sm">
                <span class="text-gray-600">Participants:</span>
                <span class="font-medium">${program.participants}</span>
            </div>
            <div class="flex justify-between text-sm">
                <span class="text-gray-600">Completion:</span>
                <span class="font-medium">${program.completionRate}%</span>
            </div>
            <div class="w-full bg-gray-200 rounded-full h-2">
                <div class="bg-blue-600 h-2 rounded-full" style="width: ${program.completionRate}%"></div>
            </div>
            <div class="text-xs text-gray-500">
                ${new Date(program.startDate).toLocaleDateString()} - ${new Date(program.endDate).toLocaleDateString()}
            </div>
        </div>
        
        <div class="flex space-x-2">
            <button onclick="manageProgram(${program.id})" class="flex-1 bg-blue-50 text-blue-600 px-3 py-2 rounded-lg text-sm font-medium hover:bg-blue-100 transition-colors">
                <i class="fas fa-cog mr-1"></i>Manage
            </button>
            <button onclick="viewProgram(${program.id})" class="flex-1 bg-gray-50 text-gray-600 px-3 py-2 rounded-lg text-sm font-medium hover:bg-gray-100 transition-colors">
                <i class="fas fa-chart-bar mr-1"></i>Analytics
            </button>
        </div>
    `;
    
    return div;
}

function openAddProgramModal() {
    showNotification('Add program functionality coming soon!', 'info');
}

function manageProgram(programId) {
    showNotification('Program management functionality coming soon!', 'info');
}

function viewProgram(programId) {
    showNotification('Program analytics functionality coming soon!', 'info');
}

// Competency management functions
function renderCompetencies() {
    const grid = document.getElementById('competenciesGrid');
    grid.innerHTML = '';
    
    competencies.forEach(competency => {
        const card = createCompetencyCard(competency);
        grid.appendChild(card);
    });
}

function createCompetencyCard(competency) {
    const div = document.createElement('div');
    div.className = 'bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow competency-item';
    
    const categoryColors = {
        leadership: 'text-purple-600 bg-purple-100',
        technical: 'text-blue-600 bg-blue-100',
        communication: 'text-green-600 bg-green-100',
        analytical: 'text-orange-600 bg-orange-100',
        interpersonal: 'text-pink-600 bg-pink-100'
    };
    
    div.innerHTML = `
        <div class="flex justify-between items-start mb-4">
            <div>
                <h3 class="font-semibold text-gray-900 mb-1">${competency.name}</h3>
                <span class="px-2 py-1 text-xs font-medium rounded-full ${categoryColors[competency.category] || 'text-gray-600 bg-gray-100'}">
                    ${competency.category.charAt(0).toUpperCase() + competency.category.slice(1)}
                </span>
            </div>
            <div class="text-right">
                <div class="text-2xl font-bold text-gray-900">${competency.questions}</div>
                <div class="text-xs text-gray-500">Questions</div>
            </div>
        </div>
        
        <p class="text-sm text-gray-600 mb-4 line-clamp-2">${competency.description}</p>
        
        <div class="flex justify-between items-center mb-4">
            <span class="text-sm text-gray-600">Usage:</span>
            <span class="text-sm font-medium">${competency.usage} times</span>
        </div>
        
        <div class="flex space-x-2">
            <button onclick="editCompetency(${competency.id})" class="flex-1 bg-purple-50 text-purple-600 px-3 py-2 rounded-lg text-sm font-medium hover:bg-purple-100 transition-colors">
                <i class="fas fa-edit mr-1"></i>Edit
            </button>
            <button onclick="viewQuestions(${competency.id})" class="flex-1 bg-gray-50 text-gray-600 px-3 py-2 rounded-lg text-sm font-medium hover:bg-gray-100 transition-colors">
                <i class="fas fa-eye mr-1"></i>Questions
            </button>
        </div>
    `;
    
    return div;
}

function searchCompetencies(query) {
    const suggestions = document.getElementById('competencySuggestions');
    
    if (!query.trim()) {
        suggestions.classList.add('hidden');
        return;
    }
    
    const filtered = competencies.filter(comp => 
        comp.name.toLowerCase().includes(query.toLowerCase()) ||
        comp.description.toLowerCase().includes(query.toLowerCase()) ||
        comp.category.toLowerCase().includes(query.toLowerCase())
    );
    
    if (filtered.length > 0) {
        suggestions.innerHTML = filtered.map(comp => `
            <div class="px-4 py-2 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-b-0" 
                 onclick="selectCompetency('${comp.name}')">
                <div class="font-medium text-gray-900">${comp.name}</div>
                <div class="text-sm text-gray-600">${comp.category} • ${comp.questions} questions</div>
            </div>
        `).join('');
        suggestions.classList.remove('hidden');
    } else {
        suggestions.innerHTML = '<div class="px-4 py-2 text-gray-500">No competencies found</div>';
        suggestions.classList.remove('hidden');
    }
}

function selectCompetency(name) {
    document.getElementById('competencySearch').value = name;
    document.getElementById('competencySuggestions').classList.add('hidden');
    filterCompetencies();
}

function filterCompetencies() {
    const category = document.getElementById('categoryFilter').value;
    const search = document.getElementById('competencySearch').value.toLowerCase();
    
    const filtered = competencies.filter(comp => {
        const matchesCategory = !category || comp.category === category;
        const matchesSearch = !search || 
            comp.name.toLowerCase().includes(search) ||
            comp.description.toLowerCase().includes(search);
        
        return matchesCategory && matchesSearch;
    });
    
    const grid = document.getElementById('competenciesGrid');
    grid.innerHTML = '';
    
    filtered.forEach(competency => {
        const card = createCompetencyCard(competency);
        grid.appendChild(card);
    });
}

function openAddCompetencyModal() {
    document.getElementById('addCompetencyModal').classList.remove('hidden');
    document.getElementById('addCompetencyModal').classList.add('flex');
}

function closeAddCompetencyModal() {
    document.getElementById('addCompetencyModal').classList.add('hidden');
    document.getElementById('addCompetencyModal').classList.remove('flex');
    document.getElementById('addCompetencyForm').reset();
}

function handleAddCompetency(e) {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const newCompetency = {
        id: Math.max(...competencies.map(c => c.id)) + 1,
        name: formData.get('name'),
        category: formData.get('category'),
        description: formData.get('description'),
        indicators: formData.get('indicators').split('\n').filter(i => i.trim()),
        questions: 0,
        usage: 0
    };
    
    competencies.push(newCompetency);
    renderCompetencies();
    populateCompetencyDropdowns();
    closeAddCompetencyModal();
    
    showNotification('Competency added successfully!', 'success');
}

function editCompetency(competencyId) {
    showNotification('Edit competency functionality coming soon!', 'info');
}

function viewQuestions(competencyId) {
    showSection('questions');
    document.getElementById('questionCompetencyFilter').value = competencyId;
    filterQuestions();
}

// Question management functions
function renderQuestions() {
    const list = document.getElementById('questionsList');
    list.innerHTML = '';
    
    questions.forEach(question => {
        const item = createQuestionItem(question);
        list.appendChild(item);
    });
    
    updateQuestionProgress();
}

function createQuestionItem(question) {
    const competency = competencies.find(c => c.id === question.competencyId);
    const div = document.createElement('div');
    div.className = 'bg-white rounded-xl shadow-sm p-6 question-card';
    
    const typeColors = {
        rating: 'text-blue-600 bg-blue-100',
        text: 'text-green-600 bg-green-100',
        multiple: 'text-purple-600 bg-purple-100',
        boolean: 'text-orange-600 bg-orange-100'
    };
    
    div.innerHTML = `
        <div class="flex justify-between items-start mb-4">
            <div class="flex-1">
                <h3 class="font-medium text-gray-900 mb-2">${question.question}</h3>
                <div class="flex items-center space-x-4 text-sm text-gray-600">
                    <span class="px-2 py-1 text-xs font-medium rounded-full ${typeColors[question.type] || 'text-gray-600 bg-gray-100'}">
                        ${question.type.charAt(0).toUpperCase() + question.type.slice(1)}
                    </span>
                    ${competency ? `<span class="text-gray-600">${competency.name}</span>` : ''}
                    <span class="text-gray-600">Weight: ${question.weight}/5</span>
                </div>
            </div>
            <div class="flex space-x-2 ml-4">
                <button onclick="editQuestion(${question.id})" class="text-blue-600 hover:text-blue-800">
                    <i class="fas fa-edit"></i>
                </button>
                <button onclick="deleteQuestion(${question.id})" class="text-red-600 hover:text-red-800">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        </div>
    `;
    
    return div;
}

function populateCompetencyDropdowns() {
    const selects = ['questionCompetencyFilter', 'competency'];
    
    selects.forEach(selectId => {
        const select = document.getElementById(selectId);
        if (select) {
            // Clear existing options except the first one
            while (select.children.length > 1) {
                select.removeChild(select.lastChild);
            }
            
            // Add competency options
            competencies.forEach(competency => {
                const option = document.createElement('option');
                option.value = competency.id;
                option.textContent = competency.name;
                select.appendChild(option);
            });
        }
    });
}

function filterQuestions() {
    const competencyId = document.getElementById('questionCompetencyFilter').value;
    
    const filtered = competencyId ? 
        questions.filter(q => q.competencyId == competencyId) : 
        questions;
    
    const list = document.getElementById('questionsList');
    list.innerHTML = '';
    
    filtered.forEach(question => {
        const item = createQuestionItem(question);
        list.appendChild(item);
    });
}

function updateQuestionProgress() {
    const total = questions.length;
    const minRequired = 120;
    const maxPossible = 200;
    const percentage = (total / maxPossible) * 100;
    
    document.getElementById('progressText').textContent = `${total} / ${maxPossible} questions (${Math.round(percentage)}%)`;
    document.getElementById('progressBar').style.width = `${percentage}%`;
}

function openAddQuestionModal() {
    document.getElementById('addQuestionModal').classList.remove('hidden');
    document.getElementById('addQuestionModal').classList.add('flex');
}

function closeAddQuestionModal() {
    document.getElementById('addQuestionModal').classList.add('hidden');
    document.getElementById('addQuestionModal').classList.remove('flex');
    document.getElementById('addQuestionForm').reset();
}

function handleAddQuestion(e) {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const newQuestion = {
        id: Math.max(...questions.map(q => q.id)) + 1,
        competencyId: parseInt(formData.get('competency')),
        question: formData.get('question'),
        type: formData.get('type'),
        weight: parseInt(formData.get('weight'))
    };
    
    questions.push(newQuestion);
    
    // Update competency question count
    const competency = competencies.find(c => c.id === newQuestion.competencyId);
    if (competency) {
        competency.questions += 1;
    }
    
    renderQuestions();
    renderCompetencies();
    closeAddQuestionModal();
    
    showNotification('Question added successfully!', 'success');
}

function editQuestion(questionId) {
    showNotification('Edit question functionality coming soon!', 'info');
}

function deleteQuestion(questionId) {
    if (confirm('Are you sure you want to delete this question?')) {
        const question = questions.find(q => q.id === questionId);
        if (question) {
            // Update competency question count
            const competency = competencies.find(c => c.id === question.competencyId);
            if (competency) {
                competency.questions -= 1;
            }
        }
        
        questions = questions.filter(q => q.id !== questionId);
        renderQuestions();
        renderCompetencies();
        showNotification('Question deleted successfully!', 'success');
    }
}

function bulkImportQuestions() {
    showNotification('Bulk import functionality coming soon!', 'info');
}

// User management functions
function renderUsers() {
    const tbody = document.getElementById('usersTableBody');
    tbody.innerHTML = '';
    
    users.forEach(user => {
        const row = createUserRow(user);
        tbody.appendChild(row);
    });
}

function createUserRow(user) {
    const tr = document.createElement('tr');
    
    const client = clients.find(c => c.id === user.clientId);
    const statusColor = user.status === 'active' ? 'text-green-600 bg-green-100' : 'text-gray-600 bg-gray-100';
    const roleColors = {
        admin: 'text-red-600 bg-red-100',
        manager: 'text-blue-600 bg-blue-100',
        employee: 'text-gray-600 bg-gray-100'
    };
    
    tr.innerHTML = `
        <td class="px-6 py-4 whitespace-nowrap">
            <div class="flex items-center">
                <div class="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center mr-3">
                    <i class="fas fa-user text-gray-600 text-sm"></i>
                </div>
                <div>
                    <div class="text-sm font-medium text-gray-900">${user.name}</div>
                    <div class="text-sm text-gray-500">${user.email}</div>
                </div>
            </div>
        </td>
        <td class="px-6 py-4 whitespace-nowrap">
            <span class="px-2 py-1 text-xs font-medium rounded-full ${roleColors[user.role] || 'text-gray-600 bg-gray-100'}">
                ${user.role.charAt(0).toUpperCase() + user.role.slice(1)}
            </span>
        </td>
        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
            ${client ? client.companyName : 'Unknown'}
        </td>
        <td class="px-6 py-4 whitespace-nowrap">
            <span class="px-2 py-1 text-xs font-medium rounded-full ${statusColor}">
                ${user.status.charAt(0).toUpperCase() + user.status.slice(1)}
            </span>
        </td>
        <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
            <button onclick="editUser(${user.id})" class="text-blue-600 hover:text-blue-900 mr-3">
                <i class="fas fa-edit"></i>
            </button>
            <button onclick="impersonateUser(${user.id})" class="text-purple-600 hover:text-purple-900">
                <i class="fas fa-user-secret"></i>
            </button>
        </td>
    `;
    
    return tr;
}

function openAddUserModal() {
    showNotification('Add user functionality coming soon!', 'info');
}

function editUser(userId) {
    showNotification('Edit user functionality coming soon!', 'info');
}

function impersonateUser(userId) {
    showNotification('User impersonation started!', 'success');
}

// Communication functions
function createEmailCampaign() {
    showNotification('Email campaign creator coming soon!', 'info');
}

function createWhatsAppCampaign() {
    showNotification('WhatsApp message sender coming soon!', 'info');
}

// Utility functions
function showNotification(message, type = 'info') {
    const colors = {
        success: 'bg-green-500',
        error: 'bg-red-500',
        warning: 'bg-yellow-500',
        info: 'bg-blue-500'
    };
    
    const notification = document.createElement('div');
    notification.className = `fixed top-20 right-4 ${colors[type]} text-white px-6 py-3 rounded-lg shadow-lg z-50 transform translate-x-full transition-transform duration-300`;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.classList.remove('translate-x-full');
    }, 100);
    
    // Animate out and remove
    setTimeout(() => {
        notification.classList.add('translate-x-full');
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}

function renderDashboard() {
    // Update stats
    document.querySelector('.grid .bg-white:nth-child(1) .text-2xl').textContent = clients.length;
    document.querySelector('.grid .bg-white:nth-child(2) .text-2xl').textContent = programs.length;
    document.querySelector('.grid .bg-white:nth-child(3) .text-2xl').textContent = users.length;
    document.querySelector('.grid .bg-white:nth-child(4) .text-2xl').textContent = competencies.length;
}

// Close dropdowns when clicking outside
document.addEventListener('click', function(e) {
    const suggestions = document.getElementById('competencySuggestions');
    const search = document.getElementById('competencySearch');
    
    if (suggestions && !suggestions.contains(e.target) && e.target !== search) {
        suggestions.classList.add('hidden');
    }
});

// Keyboard shortcuts
document.addEventListener('keydown', function(e) {
    // Ctrl/Cmd + K for search
    if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        document.getElementById('competencySearch').focus();
    }
    
    // Escape to close modals
    if (e.key === 'Escape') {
        closeAddClientModal();
        closeAddCompetencyModal();
        closeAddQuestionModal();
    }
});

// Auto-save functionality (simulated)
setInterval(() => {
    // Simulate auto-save
    console.log('Auto-saving data...');
}, 30000); // Save every 30 seconds