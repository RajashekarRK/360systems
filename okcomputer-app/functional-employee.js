// Global state management
let selectedCompetencies = [
    {
        id: 1,
        name: "Strategic Thinking",
        category: "leadership",
        description: "Ability to develop and implement long-term strategies and plans.",
        questions: 8,
        selectedQuestions: 5,
        weight: 4
    },
    {
        id: 2,
        name: "Communication Skills",
        category: "communication",
        description: "Effectively conveys information and ideas to others.",
        questions: 10,
        selectedQuestions: 7,
        weight: 5
    },
    {
        id: 3,
        name: "Technical Proficiency",
        category: "technical",
        description: "Demonstrates expertise in relevant technical skills and tools.",
        questions: 12,
        selectedQuestions: 12,
        weight: 4
    }
];

let availableCompetencies = [
    {
        id: 4,
        name: "Team Leadership",
        category: "leadership",
        description: "Inspires and guides teams toward achieving goals.",
        questions: 9,
        weight: 4
    },
    {
        id: 5,
        name: "Problem Solving",
        category: "analytical",
        description: "Identifies issues and develops effective solutions.",
        questions: 7,
        weight: 3
    },
    {
        id: 6,
        name: "Collaboration",
        category: "interpersonal",
        description: "Works effectively with others to achieve common goals.",
        questions: 6,
        weight: 4
    },
    {
        id: 7,
        name: "Innovation",
        category: "leadership",
        description: "Develops creative solutions and embraces change.",
        questions: 8,
        weight: 3
    },
    {
        id: 8,
        name: "Time Management",
        category: "analytical",
        description: "Manages time effectively and meets deadlines.",
        questions: 5,
        weight: 4
    }
];

let customQuestions = [
    {
        id: 1,
        competencyId: 1,
        question: "How effectively does this person develop long-term strategic plans?",
        type: "rating",
        weight: 4,
        selected: true
    },
    {
        id: 2,
        competencyId: 1,
        question: "Does this individual demonstrate the ability to anticipate future market trends?",
        type: "rating",
        weight: 5,
        selected: true
    },
    {
        id: 3,
        competencyId: 2,
        question: "How clearly does this person communicate complex ideas?",
        type: "rating",
        weight: 3,
        selected: true
    },
    {
        id: 4,
        competencyId: 2,
        question: "Does this individual actively listen and respond appropriately to others?",
        type: "rating",
        weight: 4,
        selected: true
    },
    {
        id: 5,
        competencyId: 3,
        question: "How would you rate this person's technical expertise in their domain?",
        type: "rating",
        weight: 4,
        selected: false
    }
];

let modalSelectedCompetencies = new Set();

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
    setupEventListeners();
});

function initializeApp() {
    renderSelectedCompetencies();
    renderQuestionsList();
    updateCompetencyProgress();
    updateQuestionProgress();
    populateCompetencyDropdowns();
}

function setupEventListeners() {
    // Form submissions
    document.getElementById('questionForm').addEventListener('submit', handleQuestionSubmit);
    
    // Search functionality
    document.getElementById('competencySearch').addEventListener('input', function(e) {
        searchCompetencies(e.target.value);
    });
    
    // Modal search
    document.getElementById('modalCompetencySearch').addEventListener('input', function(e) {
        filterModalCompetencies(e.target.value);
    });
    
    // Category filter
    document.getElementById('categoryFilter').addEventListener('change', filterModalCompetencies);
}

// Competency management functions
function renderSelectedCompetencies() {
    const container = document.getElementById('selectedCompetencies');
    container.innerHTML = '';
    
    selectedCompetencies.forEach(competency => {
        const card = createSelectedCompetencyCard(competency);
        container.appendChild(card);
    });
}

function createSelectedCompetencyCard(competency) {
    const div = document.createElement('div');
    div.className = 'bg-white border border-gray-200 rounded-lg p-4 competency-card cursor-pointer';
    
    const categoryColors = {
        leadership: 'text-purple-600 bg-purple-100',
        technical: 'text-blue-600 bg-blue-100',
        communication: 'text-green-600 bg-green-100',
        analytical: 'text-orange-600 bg-orange-100',
        interpersonal: 'text-pink-600 bg-pink-100'
    };
    
    const percentage = Math.round((competency.selectedQuestions / competency.questions) * 100);
    
    div.innerHTML = `
        <div class="flex justify-between items-start mb-3">
            <div class="flex-1">
                <h3 class="font-semibold text-gray-900 mb-1">${competency.name}</h3>
                <span class="px-2 py-1 text-xs font-medium rounded-full ${categoryColors[competency.category] || 'text-gray-600 bg-gray-100'}">
                    ${competency.category.charAt(0).toUpperCase() + competency.category.slice(1)}
                </span>
            </div>
            <div class="flex space-x-2">
                <button onclick="editCompetency(${competency.id})" class="text-blue-600 hover:text-blue-800">
                    <i class="fas fa-edit text-sm"></i>
                </button>
                <button onclick="removeCompetency(${competency.id})" class="text-red-600 hover:text-red-800">
                    <i class="fas fa-trash text-sm"></i>
                </button>
            </div>
        </div>
        
        <p class="text-sm text-gray-600 mb-3 line-clamp-2">${competency.description}</p>
        
        <div class="space-y-2">
            <div class="flex justify-between text-sm">
                <span class="text-gray-600">Questions:</span>
                <span class="font-medium">${competency.selectedQuestions} / ${competency.questions}</span>
            </div>
            <div class="w-full bg-gray-200 rounded-full h-2">
                <div class="bg-blue-600 h-2 rounded-full transition-all duration-300" style="width: ${percentage}%"></div>
            </div>
            <div class="flex justify-between text-xs text-gray-500">
                <span>Weight: ${competency.weight}/5</span>
                <span>${percentage}% complete</span>
            </div>
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
    
    const allCompetencies = [...selectedCompetencies, ...availableCompetencies];
    const filtered = allCompetencies.filter(comp => 
        comp.name.toLowerCase().includes(query.toLowerCase()) ||
        comp.description.toLowerCase().includes(query.toLowerCase()) ||
        comp.category.toLowerCase().includes(query.toLowerCase())
    );
    
    if (filtered.length > 0) {
        suggestions.innerHTML = filtered.map(comp => `
            <div class="px-4 py-2 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-b-0" 
                 onclick="selectCompetencyFromSearch('${comp.name}')">
                <div class="font-medium text-gray-900">${comp.name}</div>
                <div class="text-sm text-gray-600">${comp.category} • ${comp.questions} questions available</div>
            </div>
        `).join('');
        suggestions.classList.remove('hidden');
    } else {
        suggestions.innerHTML = '<div class="px-4 py-2 text-gray-500">No competencies found</div>';
        suggestions.classList.remove('hidden');
    }
}

function selectCompetencyFromSearch(name) {
    document.getElementById('competencySearch').value = name;
    document.getElementById('competencySuggestions').classList.add('hidden');
    // Optionally highlight or navigate to the competency
}

function openCompetencySelector() {
    modalSelectedCompetencies.clear();
    renderModalCompetencies();
    document.getElementById('competencyModal').classList.remove('hidden');
    document.getElementById('competencyModal').classList.add('flex');
}

function closeCompetencyModal() {
    document.getElementById('competencyModal').classList.add('hidden');
    document.getElementById('competencyModal').classList.remove('flex');
    modalSelectedCompetencies.clear();
}

function renderModalCompetencies() {
    const grid = document.getElementById('modalCompetencyGrid');
    grid.innerHTML = '';
    
    // Show only available competencies (not already selected)
    const available = availableCompetencies.filter(comp => 
        !selectedCompetencies.find(selected => selected.id === comp.id)
    );
    
    available.forEach(competency => {
        const card = createModalCompetencyCard(competency);
        grid.appendChild(card);
    });
}

function createModalCompetencyCard(competency) {
    const div = document.createElement('div');
    div.className = `bg-white border rounded-lg p-4 cursor-pointer transition-all ${
        modalSelectedCompetencies.has(competency.id) ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-gray-300'
    }`;
    div.onclick = () => toggleCompetencySelection(competency.id);
    
    const categoryColors = {
        leadership: 'text-purple-600 bg-purple-100',
        technical: 'text-blue-600 bg-blue-100',
        communication: 'text-green-600 bg-green-100',
        analytical: 'text-orange-600 bg-orange-100',
        interpersonal: 'text-pink-600 bg-pink-100'
    };
    
    div.innerHTML = `
        <div class="flex justify-between items-start mb-2">
            <h3 class="font-semibold text-gray-900">${competency.name}</h3>
            <input type="checkbox" ${modalSelectedCompetencies.has(competency.id) ? 'checked' : ''} 
                   class="rounded text-blue-600 focus:ring-blue-500" onclick="event.stopPropagation()">
        </div>
        <span class="px-2 py-1 text-xs font-medium rounded-full ${categoryColors[competency.category] || 'text-gray-600 bg-gray-100'}">
            ${competency.category.charAt(0).toUpperCase() + competency.category.slice(1)}
        </span>
        <p class="text-sm text-gray-600 mt-2 line-clamp-2">${competency.description}</p>
        <div class="mt-2 text-sm text-gray-600">
            ${competency.questions} questions available
        </div>
    `;
    
    return div;
}

function toggleCompetencySelection(competencyId) {
    if (modalSelectedCompetencies.has(competencyId)) {
        modalSelectedCompetencies.delete(competencyId);
    } else {
        modalSelectedCompetencies.add(competencyId);
    }
    renderModalCompetencies();
}

function filterModalCompetencies(query = '') {
    const category = document.getElementById('categoryFilter').value;
    const search = query || document.getElementById('modalCompetencySearch').value.toLowerCase();
    
    const available = availableCompetencies.filter(comp => {
        const matchesCategory = !category || comp.category === category;
        const matchesSearch = !search || 
            comp.name.toLowerCase().includes(search) ||
            comp.description.toLowerCase().includes(search);
        const notSelected = !selectedCompetencies.find(selected => selected.id === comp.id);
        
        return matchesCategory && matchesSearch && notSelected;
    });
    
    const grid = document.getElementById('modalCompetencyGrid');
    grid.innerHTML = '';
    
    available.forEach(competency => {
        const card = createModalCompetencyCard(competency);
        grid.appendChild(card);
    });
}

function saveCompetencySelection() {
    const selected = Array.from(modalSelectedCompetencies);
    
    selected.forEach(competencyId => {
        const competency = availableCompetencies.find(c => c.id === competencyId);
        if (competency) {
            const newCompetency = {
                ...competency,
                selectedQuestions: Math.min(3, competency.questions), // Auto-select 3 questions
                weight: 3 // Default weight
            };
            selectedCompetencies.push(newCompetency);
            
            // Remove from available
            availableCompetencies = availableCompetencies.filter(c => c.id !== competencyId);
        }
    });
    
    renderSelectedCompetencies();
    updateCompetencyProgress();
    closeCompetencyModal();
    showNotification(`${selected.length} competency(s) added successfully!`, 'success');
}

function removeCompetency(competencyId) {
    if (confirm('Are you sure you want to remove this competency?')) {
        const competency = selectedCompetencies.find(c => c.id === competencyId);
        if (competency) {
            // Add back to available
            const { selectedQuestions, weight, ...availableCompetency } = competency;
            availableCompetencies.push(availableCompetency);
            
            // Remove from selected
            selectedCompetencies = selectedCompetencies.filter(c => c.id !== competencyId);
            
            renderSelectedCompetencies();
            updateCompetencyProgress();
            showNotification('Competency removed successfully!', 'success');
        }
    }
}

function editCompetency(competencyId) {
    showNotification('Edit competency functionality coming soon!', 'info');
}

function updateCompetencyProgress() {
    const total = selectedCompetencies.length;
    const minRequired = 5;
    const maxPossible = 12;
    const percentage = Math.min((total / maxPossible) * 100, 100);
    
    document.getElementById('competencyProgressText').textContent = `${total} / ${maxPossible} selected`;
    document.getElementById('competencyProgressBar').style.width = `${percentage}%`;
}

// Question management functions
function renderQuestionsList() {
    const container = document.getElementById('questionsList');
    container.innerHTML = '';
    
    // Group questions by competency
    const groupedQuestions = {};
    customQuestions.forEach(question => {
        if (!groupedQuestions[question.competencyId]) {
            groupedQuestions[question.competencyId] = [];
        }
        groupedQuestions[question.competencyId].push(question);
    });
    
    // Render questions by competency
    Object.keys(groupedQuestions).forEach(competencyId => {
        const competency = selectedCompetencies.find(c => c.id == competencyId);
        if (competency) {
            const section = createQuestionSection(competency, groupedQuestions[competencyId]);
            container.appendChild(section);
        }
    });
}

function createQuestionSection(competency, questions) {
    const div = document.createElement('div');
    div.className = 'bg-gray-50 rounded-lg p-4';
    
    const selectedCount = questions.filter(q => q.selected).length;
    
    div.innerHTML = `
        <div class="flex justify-between items-center mb-3">
            <h4 class="font-semibold text-gray-900">${competency.name}</h4>
            <span class="text-sm text-gray-600">${selectedCount} / ${questions.length} selected</span>
        </div>
        <div class="space-y-2">
            ${questions.map(question => createQuestionItem(question, competency)).join('')}
        </div>
    `;
    
    return div;
}

function createQuestionItem(question, competency) {
    const typeIcons = {
        rating: 'fas fa-star',
        text: 'fas fa-align-left',
        multiple: 'fas fa-list',
        boolean: 'fas fa-toggle-on'
    };
    
    return `
        <div class="question-item bg-white rounded-lg p-3 border ${question.selected ? 'border-blue-200 bg-blue-50' : 'border-gray-200'}">
            <div class="flex justify-between items-start">
                <div class="flex-1">
                    <div class="flex items-center space-x-2 mb-1">
                        <i class="${typeIcons[question.type]} text-gray-400 text-sm"></i>
                        <span class="text-xs text-gray-500 capitalize">${question.type}</span>
                        <span class="text-xs text-gray-500">Weight: ${question.weight}/5</span>
                    </div>
                    <p class="text-sm text-gray-900">${question.question}</p>
                </div>
                <div class="flex items-center space-x-2 ml-4">
                    <input type="checkbox" ${question.selected ? 'checked' : ''} 
                           onchange="toggleQuestionSelection(${question.id})"
                           class="rounded text-blue-600 focus:ring-blue-500">
                    <button onclick="editQuestion(${question.id})" class="text-gray-400 hover:text-gray-600">
                        <i class="fas fa-edit text-sm"></i>
                    </button>
                </div>
            </div>
        </div>
    `;
}

function toggleQuestionSelection(questionId) {
    const question = customQuestions.find(q => q.id === questionId);
    if (question) {
        question.selected = !question.selected;
        
        // Update competency selected question count
        const competency = selectedCompetencies.find(c => c.id === question.competencyId);
        if (competency) {
            if (question.selected) {
                competency.selectedQuestions += 1;
            } else {
                competency.selectedQuestions = Math.max(0, competency.selectedQuestions - 1);
            }
        }
        
        renderQuestionsList();
        renderSelectedCompetencies();
        updateQuestionProgress();
    }
}

function updateQuestionProgress() {
    const total = customQuestions.length;
    const selected = customQuestions.filter(q => q.selected).length;
    const minRequired = 20;
    const maxPossible = 40;
    const percentage = Math.min((selected / maxPossible) * 100, 100);
    
    document.getElementById('questionProgressText').textContent = `${selected} / ${maxPossible} questions`;
    document.getElementById('questionProgressBar').style.width = `${percentage}%`;
}

function populateCompetencyDropdowns() {
    const selects = document.querySelectorAll('select[name="competency"]');
    
    selects.forEach(select => {
        // Clear existing options except the first one
        while (select.children.length > 1) {
            select.removeChild(select.lastChild);
        }
        
        // Add competency options
        selectedCompetencies.forEach(competency => {
            const option = document.createElement('option');
            option.value = competency.id;
            option.textContent = competency.name;
            select.appendChild(option);
        });
    });
}

function openQuestionBuilder() {
    document.getElementById('questionModal').classList.remove('hidden');
    document.getElementById('questionModal').classList.add('flex');
}

function closeQuestionModal() {
    document.getElementById('questionModal').classList.add('hidden');
    document.getElementById('questionModal').classList.remove('flex');
    document.getElementById('questionForm').reset();
    updateWeightDisplay(3);
}

function updateWeightDisplay(value) {
    const labels = ['Very Low', 'Low', 'Medium', 'High', 'Very High'];
    document.getElementById('weightDisplay').textContent = `${labels[value-1]} (${value})`;
}

function handleQuestionSubmit(e) {
    e.preventDefault();
    saveQuestion();
}

function saveQuestion() {
    const form = document.getElementById('questionForm');
    const formData = new FormData(form);
    
    const newQuestion = {
        id: Math.max(...customQuestions.map(q => q.id)) + 1,
        competencyId: parseInt(formData.get('competency')),
        question: formData.get('question'),
        type: formData.get('type'),
        weight: parseInt(formData.get('weight')),
        selected: true
    };
    
    customQuestions.push(newQuestion);
    
    // Update competency question count
    const competency = selectedCompetencies.find(c => c.id === newQuestion.competencyId);
    if (competency) {
        competency.questions += 1;
        competency.selectedQuestions += 1;
    }
    
    renderQuestionsList();
    renderSelectedCompetencies();
    updateQuestionProgress();
    closeQuestionModal();
    
    showNotification('Question added successfully!', 'success');
}

function editQuestion(questionId) {
    showNotification('Edit question functionality coming soon!', 'info');
}

function autoSelectQuestions() {
    // Auto-select minimum required questions for each competency
    selectedCompetencies.forEach(competency => {
        const competencyQuestions = customQuestions.filter(q => q.competencyId === competency.id);
        const questionsToSelect = Math.min(competencyQuestions.length, Math.max(3, competency.questions));
        
        let selectedCount = 0;
        competencyQuestions.forEach(question => {
            if (selectedCount < questionsToSelect) {
                question.selected = true;
                selectedCount++;
            }
        });
        
        competency.selectedQuestions = selectedCount;
    });
    
    renderQuestionsList();
    renderSelectedCompetencies();
    updateQuestionProgress();
    showNotification('Questions auto-selected based on competency requirements!', 'success');
}

// Action functions
function continueProgram() {
    showNotification('Continuing program...', 'info');
}

function requestFeedback() {
    showNotification('Feedback request sent!', 'success');
}

function viewReports() {
    showNotification('Opening reports dashboard...', 'info');
}

function updateProfile() {
    showNotification('Profile update functionality coming soon!', 'info');
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
    notification.className = `fixed top-20 right-4 ${colors[type]} text-white px-6 py-3 rounded-lg shadow-lg z-50 notification`;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    // Remove after 3 seconds
    setTimeout(() => {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            if (document.body.contains(notification)) {
                document.body.removeChild(notification);
            }
        }, 300);
    }, 3000);
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
        closeCompetencyModal();
        closeQuestionModal();
    }
});

// Auto-save functionality (simulated)
setInterval(() => {
    console.log('Auto-saving employee data...');
}, 30000); // Save every 30 seconds

// Progress simulation for demo
function simulateProgress() {
    const progressElement = document.querySelector('.progress-circle');
    if (progressElement) {
        let progress = 70;
        setInterval(() => {
            progress += Math.random() * 2 - 1; // Random fluctuation
            progress = Math.max(0, Math.min(100, progress));
            const offset = 251.2 - (251.2 * progress / 100);
            progressElement.style.strokeDashoffset = offset;
        }, 5000);
    }
}

// Initialize progress simulation
setTimeout(simulateProgress, 2000);