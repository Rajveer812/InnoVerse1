document.addEventListener('DOMContentLoaded', () => {
    // ==========================================
    // Lab 3: Additional Events
    // ==========================================

    // 1. keyup Event: Close modal on Escape
    document.addEventListener('keyup', (e) => {
        if (e.key === 'Escape' || e.key === 'Esc') {
            const modal = document.getElementById('submitModal');
            const closeBtn = document.getElementById('closeModal');
            if (modal && !modal.classList.contains('hidden') && closeBtn) {
                closeBtn.click();
            }
        }
    });

    // 2. input Event: Live character counter for Description
    // We attach a delegated event listener to document to handle it safely
    document.addEventListener('input', (e) => {
        if (e.target && e.target.id === 'projDesc') {
            const counter = document.getElementById('charCount');
            if (counter) {
                const count = e.target.value.length;
                counter.innerText = `${count} character${count !== 1 ? 's' : ''}`;
            }
        }
    });

    // Reset char count when form resets
    const projectForm = document.getElementById('projectForm');
    if (projectForm) {
        projectForm.addEventListener('reset', () => {
            const counter = document.getElementById('charCount');
            if (counter) {
                setTimeout(() => counter.innerText = '0 characters', 10);
            }
        });
    }

    // 3. contextmenu Event: Custom Right-Click Menu
    const customMenu = document.createElement('div');
    customMenu.id = 'customContextMenu';
    customMenu.className = 'hidden fixed bg-[#11131a] border border-gray-800 rounded-lg shadow-xl py-2 w-48 z-[200] transition-opacity duration-200 opacity-0';
    customMenu.innerHTML = `
        <button class="w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-[#1a1d26] hover:text-white transition-colors flex items-center gap-2" id="contextShare">
            🔗 Share Project
        </button>
        <button class="w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-[#1a1d26] hover:text-white transition-colors flex items-center gap-2" id="contextQuickView">
            👁️ Quick View
        </button>
    `;
    document.body.appendChild(customMenu);

    let contextProjectTitle = '';

    document.addEventListener('contextmenu', (e) => {
        let target = e.target;
        // If text node, get parent element
        if (target && target.nodeType === 3) {
            target = target.parentNode;
        }
        if (!target || typeof target.closest !== 'function') return;

        const card = target.closest('article, #topProjectsContainer > div');
        if (card) {
            e.preventDefault(); // Disable default browser right-click menu
            
            const titleEl = card.querySelector('h3');
            if (titleEl) {
                contextProjectTitle = titleEl.innerText;
            }

            // Using clientX/Y because the customMenu has position: fixed
            customMenu.style.left = `${e.clientX}px`;
            customMenu.style.top = `${e.clientY}px`;
            customMenu.classList.remove('hidden');
            setTimeout(() => customMenu.classList.remove('opacity-0'), 10);
        } else {
            customMenu.classList.add('opacity-0');
            setTimeout(() => customMenu.classList.add('hidden'), 200);
        }
    });

    document.addEventListener('click', () => {
        if (!customMenu.classList.contains('hidden')) {
            customMenu.classList.add('opacity-0');
            setTimeout(() => customMenu.classList.add('hidden'), 200);
        }
    });

    document.getElementById('contextShare')?.addEventListener('click', (e) => {
        e.stopPropagation();
        if (contextProjectTitle) {
            // Check if shareProject is defined globally
            if (typeof shareProject === 'function') {
                shareProject(contextProjectTitle);
            } else {
                console.error("shareProject function is not defined.");
                alert(`Share: ${contextProjectTitle}`);
            }
        }
        customMenu.classList.add('opacity-0');
        setTimeout(() => customMenu.classList.add('hidden'), 200);
    });

    document.getElementById('contextQuickView')?.addEventListener('click', (e) => {
        e.stopPropagation();
        if (contextProjectTitle) {
            openQuickView(contextProjectTitle);
        }
        customMenu.classList.add('opacity-0');
        setTimeout(() => customMenu.classList.add('hidden'), 200);
    });
});

// ==========================================
// Quick View Modal Logic
// ==========================================
window.openQuickView = function(projectTitle) {
    let projects = JSON.parse(localStorage.getItem('innoverse_projects')) || [];
    // also default mock data if not in storage for some reason
    if (projects.length === 0) {
        projects = [{
            id: 'medisync',
            title: 'MediSync — AI Diagnostics',
            category: 'Healthcare',
            description: 'Symptom-to-diagnosis NLP pipeline with 91% accuracy on rare disease classification.',
            tag: '♙ BCA • FINAL YEAR',
            likes: 142
        }];
    }

    const proj = projects.find(p => p.title.toLowerCase().trim() === projectTitle.toLowerCase().trim());
    if (!proj) return;

    let qvModal = document.getElementById('quickViewModal');
    if (!qvModal) {
        qvModal = document.createElement('div');
        qvModal.id = 'quickViewModal';
        qvModal.className = 'fixed inset-0 bg-[#0B1120]/90 backdrop-blur-sm z-[200] flex items-center justify-center p-4 opacity-0 transition-opacity duration-300 hidden';
        document.body.appendChild(qvModal);
        
        qvModal.addEventListener('click', (e) => {
            if (e.target === qvModal) window.closeQuickView();
        });
        
        document.addEventListener('keyup', (e) => {
            if ((e.key === 'Escape' || e.key === 'Esc') && !qvModal.classList.contains('hidden')) {
                window.closeQuickView();
            }
        });
    }

    qvModal.innerHTML = `
        <div class="bg-[#11131a] border border-gray-800 rounded-xl p-8 max-w-lg w-full relative transform scale-95 transition-transform duration-300 shadow-[0_10px_40px_rgba(0,0,0,0.5)]" id="qvContent">
            <button onclick="closeQuickView()" class="absolute top-4 right-4 text-gray-400 hover:text-white cursor-pointer" type="button">✕</button>
            <span class="text-cyan-400 text-[10px] font-bold tracking-widest uppercase mb-2 block">${proj.tag || 'COMMUNITY SUBMISSION'}</span>
            <h2 class="text-2xl font-bold text-white mb-2">${proj.title}</h2>
            <div class="inline-block bg-[#1a1d26] text-blue-400 px-3 py-1 rounded text-xs font-medium capitalize mb-4">${proj.category}</div>
            
            <h3 class="text-gray-300 text-sm font-semibold mb-2">About this project</h3>
            <p class="text-gray-400 text-sm leading-relaxed mb-6">${proj.description}</p>
            
            <div class="flex gap-4">
                <button onclick="shareProject('${proj.title.replace(/'/g, "\\'")}')" class="flex-1 px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg hover:shadow-[0_0_15px_rgba(79,70,229,0.5)] transition-all cursor-pointer">🔗 Share Link</button>
                <button onclick="closeQuickView()" class="flex-1 px-4 py-2 text-sm font-medium text-gray-300 border border-gray-700 rounded-lg hover:bg-white/5 transition-colors cursor-pointer">Close</button>
            </div>
        </div>
    `;

    qvModal.classList.remove('hidden');
    setTimeout(() => {
        qvModal.classList.remove('opacity-0');
        document.getElementById('qvContent').classList.remove('scale-95');
    }, 10);
};

window.closeQuickView = function() {
    const qvModal = document.getElementById('quickViewModal');
    if (qvModal) {
        qvModal.classList.add('opacity-0');
        document.getElementById('qvContent')?.classList.add('scale-95');
        setTimeout(() => qvModal.classList.add('hidden'), 300);
    }
};
