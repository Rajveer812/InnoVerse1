// ==========================================
// 1. Mobile Menu Toggle
// ==========================================
document.addEventListener('DOMContentLoaded', () => {
    const btn = document.getElementById('mobile-menu-btn');
    const menu = document.getElementById('mobile-menu');
    if (btn && menu) {
        btn.addEventListener('click', () => {
            menu.classList.toggle('hidden');
        });
    }

    // ==========================================
    // 2. Local Storage API: Project Management & Rendering
    // ==========================================
    const projectsGrid = document.getElementById('projectsGrid');
    let projects = JSON.parse(localStorage.getItem('innoverse_projects')) || [
        {
            id: 'medisync',
            title: 'MediSync — AI Diagnostics',
            category: 'Healthcare',
            description: 'Symptom-to-diagnosis NLP pipeline with 91% accuracy on rare disease classification.',
            tag: '♙ BCA • FINAL YEAR',
            likes: 142
        }
    ];

    function saveProjects() {
        localStorage.setItem('innoverse_projects', JSON.stringify(projects));
    }

    function renderProjects(projectsToRender) {
        if (!projectsGrid) return;
        projectsGrid.innerHTML = '';
        if (projectsToRender.length === 0) {
            projectsGrid.innerHTML = '<p class="text-gray-400 col-span-full">No projects found.</p>';
            return;
        }

        projectsToRender.forEach(proj => {
            const isLiked = localStorage.getItem(`liked_${proj.id}`) === 'true';
            const likeIcon = isLiked ? '♥' : '♡';
            const likeColor = isLiked ? 'text-red-500' : '';
            const displayLikes = isLiked ? proj.likes + 1 : proj.likes;
            
            const article = document.createElement('article');
            article.className = 'bg-[#11131a] border border-gray-800 rounded-xl p-6 flex flex-col transition-all hover:border-gray-700 hover:shadow-[0_4px_20px_rgba(0,0,0,0.3)]';
            article.innerHTML = `
                <span class="text-cyan-400 text-[10px] font-bold tracking-widest uppercase mb-2 block">${proj.tag || 'NEW SUBMISSION'}</span>
                <h3 class="text-lg font-bold text-white mb-2">${proj.title}</h3>
                <p class="text-gray-400 text-sm mb-6 leading-relaxed flex-grow">${proj.description}</p>
                <div class="flex items-center justify-between mt-4">
                    <span class="bg-[#1a1d26] text-blue-400 px-2 py-1 rounded text-xs font-medium capitalize">${proj.category}</span>
                    <div class="flex gap-4">
                        <button onclick="openQuickView('${proj.title.replace(/'/g, "\\'")}')" class="text-gray-400 hover:text-white transition-colors cursor-pointer text-xs flex items-center gap-1" title="Quick View">👁️ View</button>
                        <button onclick="shareProject('${proj.title.replace(/'/g, "\\'")}')" class="text-gray-400 hover:text-white transition-colors cursor-pointer text-xs flex items-center gap-1" title="Copy Link">🔗 Share</button>
                        <button onclick="toggleLike('${proj.id}', this)" class="flex items-center gap-1 text-gray-400 hover:text-red-500 transition-colors text-xs font-medium cursor-pointer" id="like-btn-${proj.id}">
                            <span class="heart-icon text-lg ${likeColor}">${likeIcon}</span> <span class="like-count">${displayLikes}</span>
                        </button>
                    </div>
                </div>
            `;
            projectsGrid.appendChild(article);
        });
    }

    function renderTopProjects() {
        const topProjectsContainer = document.getElementById('topProjectsContainer');
        if (!topProjectsContainer) return;
        
        topProjectsContainer.innerHTML = '';
        
        // Calculate actual likes for sorting
        const projectsWithLikes = projects.map(proj => {
            const isLiked = localStorage.getItem(`liked_${proj.id}`) === 'true';
            return {
                ...proj,
                actualLikes: isLiked ? proj.likes + 1 : proj.likes,
                isLiked: isLiked
            };
        });
        
        // Sort by actual likes descending and take top 3
        const top3 = projectsWithLikes.sort((a, b) => b.actualLikes - a.actualLikes).slice(0, 3);
        
        top3.forEach(proj => {
            const likeIcon = proj.isLiked ? '♥' : '♡';
            const likeColor = proj.isLiked ? 'text-red-500' : '';
            
            const div = document.createElement('div');
            div.className = 'bg-[#11131a] border border-gray-800 rounded-xl p-5 w-full flex flex-col transition-all hover:border-gray-700 hover:shadow-[0_4px_20px_rgba(0,0,0,0.3)]';
            div.innerHTML = `
                <div class="flex justify-between items-start mb-2">
                    <span class="text-cyan-400 text-[10px] font-bold tracking-widest uppercase block">${proj.tag || 'NEW SUBMISSION'}</span>
                    <button onclick="toggleLike('${proj.id}', this)" class="flex items-center gap-1 text-gray-400 hover:text-red-500 transition-colors text-xs font-medium cursor-pointer">
                        <span class="heart-icon text-sm ${likeColor}">${likeIcon}</span> <span class="like-count">${proj.actualLikes}</span>
                    </button>
                </div>
                <h3 class="text-md font-bold text-white mb-1 truncate">${proj.title}</h3>
                <p class="text-gray-400 text-xs mb-1 truncate">${proj.description}</p>
            `;
            topProjectsContainer.appendChild(div);
        });
    }

    // Initial render
    renderProjects(projects);
    renderTopProjects();

    // ==========================================
    // 3. Session Storage API: Remember Search
    // ==========================================
    const searchInput = document.getElementById('projectSearch');
    if (searchInput) {
        const savedSearch = sessionStorage.getItem('searchQuery');
        if (savedSearch) {
            searchInput.value = savedSearch;
            filterProjects(savedSearch);
        }
        searchInput.addEventListener('input', (e) => {
            const query = e.target.value;
            sessionStorage.setItem('searchQuery', query);
            filterProjects(query);
        });
    }

    function filterProjects(query) {
        const lowerQuery = query.toLowerCase();
        const filtered = projects.filter(p => 
            p.title.toLowerCase().includes(lowerQuery) || 
            p.description.toLowerCase().includes(lowerQuery) ||
            p.category.toLowerCase().includes(lowerQuery)
        );
        renderProjects(filtered);
    }

    // ==========================================
    // 4. Form Validation & Drag & Drop File API
    // ==========================================
    const submitModal = document.getElementById('submitModal');
    const closeModal = document.getElementById('closeModal');
    const dropZone = document.getElementById('dropZone');
    const fileInput = document.getElementById('fileInput');
    const fileInfo = document.getElementById('fileInfo');
    const projectForm = document.getElementById('projectForm');

    // Attach click event to all "Submit Project" buttons globally
    document.querySelectorAll('button').forEach(btn => {
        if(btn.innerText.trim() === "Submit Project") {
            btn.addEventListener('click', () => {
                if(submitModal) submitModal.classList.remove('hidden');
            });
        }
    });

    if (closeModal) {
        closeModal.addEventListener('click', () => {
            submitModal.classList.add('hidden');
            if(projectForm) projectForm.reset();
            if(fileInfo) fileInfo.classList.add('hidden');
            document.querySelectorAll('.error-msg').forEach(msg => msg.classList.add('hidden'));
            document.querySelectorAll('input, select, textarea').forEach(el => {
                el.classList.remove('border-red-500');
                el.classList.add('border-gray-700');
            });
        });
    }

    if (dropZone && fileInput) {
        dropZone.addEventListener('click', () => fileInput.click());

        dropZone.addEventListener('dragover', (e) => {
            e.preventDefault();
            dropZone.classList.add('border-blue-500', 'bg-blue-500/10');
        });

        dropZone.addEventListener('dragleave', () => {
            dropZone.classList.remove('border-blue-500', 'bg-blue-500/10');
        });

        dropZone.addEventListener('drop', (e) => {
            e.preventDefault();
            dropZone.classList.remove('border-blue-500', 'bg-blue-500/10');
            if (e.dataTransfer.files.length > 0) {
                fileInput.files = e.dataTransfer.files;
                handleFile(e.dataTransfer.files[0]);
            }
        });

        fileInput.addEventListener('change', (e) => {
            if (e.target.files.length > 0) handleFile(e.target.files[0]);
        });
    }

    function handleFile(file) {
        if (file.type.startsWith('image/')) {
            fileInfo.innerText = `Loaded: ${file.name} (${(file.size / 1024).toFixed(2)} KB)`;
            fileInfo.classList.remove('hidden');
        } else {
            alert("Please upload an image file.");
            fileInput.value = '';
            fileInfo.classList.add('hidden');
        }
    }

    // Client-side Form Validation
    if (projectForm) {
        // Real-time validation
        const inputs = projectForm.querySelectorAll('input[required], select[required], textarea[required]');
        inputs.forEach(input => {
            input.addEventListener('input', () => {
                validateField(input);
            });
        });

        projectForm.addEventListener('submit', (e) => {
            e.preventDefault(); // Prevent default submission
            
            let isValid = true;
            inputs.forEach(input => {
                if (!validateField(input)) {
                    isValid = false;
                }
            });

            if (isValid) {
                // Get form values
                const title = document.getElementById('projTitle').value;
                const category = document.getElementById('projCategory').value;
                const url = document.getElementById('projUrl').value;
                const desc = document.getElementById('projDesc').value;
                const id = title.toLowerCase().replace(/[^a-z0-9]/g, '-') + '-' + Date.now();

                const newProject = {
                    id: id,
                    title: title,
                    category: category,
                    description: desc,
                    tag: 'COMMUNITY SUBMISSION',
                    likes: 0
                };

                // Add to projects array and save
                projects.unshift(newProject);
                saveProjects();
                
                // Re-render and re-filter
                const currentSearch = searchInput ? searchInput.value : '';
                if (currentSearch) {
                    filterProjects(currentSearch);
                } else {
                    renderProjects(projects);
                }
                renderTopProjects();

                // Show Success Notification
                if ("Notification" in window && Notification.permission === "granted") {
                    new Notification("InnoVerse: Success!", {
                        body: "Your project has been successfully submitted.",
                        icon: "https://cdn-icons-png.flaticon.com/512/190/190411.png"
                    });
                } else {
                    alert("Your project has been successfully submitted!");
                }

                // Reset and close
                projectForm.reset();
                if(fileInfo) fileInfo.classList.add('hidden');
                submitModal.classList.add('hidden');
            }
        });
    }

    function validateField(input) {
        const errorMsg = input.nextElementSibling;
        let valid = true;

        if (input.validity.valueMissing) {
            valid = false;
        } else if (input.validity.tooShort) {
            valid = false;
        } else if (input.validity.typeMismatch && input.type === 'url') {
            valid = false;
        }

        if (!valid) {
            input.classList.add('border-red-500');
            input.classList.remove('border-gray-700', 'focus:border-blue-500');
            if (errorMsg && errorMsg.classList.contains('error-msg')) {
                errorMsg.classList.remove('hidden');
            }
            return false;
        } else {
            input.classList.remove('border-red-500');
            input.classList.add('border-gray-700', 'focus:border-blue-500');
            if (errorMsg && errorMsg.classList.contains('error-msg')) {
                errorMsg.classList.add('hidden');
            }
            return true;
        }
    }
});

// ==========================================
// Global Functions (Called directly from HTML)
// ==========================================

// Local Storage API Trigger
function toggleLike(projectId, btnElement) {
    let isLiked = localStorage.getItem(`liked_${projectId}`) === 'true';
    let countSpan = btnElement.querySelector('.like-count');
    let heartIcon = btnElement.querySelector('.heart-icon');
    let currentCount = parseInt(countSpan.innerText);

    if (isLiked) {
        localStorage.removeItem(`liked_${projectId}`);
        countSpan.innerText = currentCount - 1;
        heartIcon.innerText = "♡";
        heartIcon.classList.remove('text-red-500');
    } else {
        localStorage.setItem(`liked_${projectId}`, 'true');
        countSpan.innerText = currentCount + 1;
        heartIcon.innerText = "♥";
        heartIcon.classList.add('text-red-500');
    }
}

// 5. Clipboard API: Copy Link
function shareProject(projectName) {
    const dummyUrl = `https://innoverse.christ.edu/project/${projectName.toLowerCase().replace(/\s+/g, '-')}`;
    if (navigator.clipboard) {
        navigator.clipboard.writeText(dummyUrl).then(() => {
            alert(`Link for ${projectName} copied to clipboard!`);
        }).catch(err => console.error('Failed to copy: ', err));
    } else {
        alert("Clipboard API not supported in this browser.");
    }
}

// 6. Web Notifications API: Application Alert
function applyForRole(roleName) {
    if (!("Notification" in window)) {
        alert("Your application was sent! (Desktop notifications not supported)");
        return;
    }
    if (Notification.permission === "granted") {
        new Notification("InnoVerse: Application Sent!", {
            body: `Your application for ${roleName} has been submitted.`,
            icon: "https://cdn-icons-png.flaticon.com/512/190/190411.png" 
        });
    } else if (Notification.permission !== "denied") {
        Notification.requestPermission().then(permission => {
            if (permission === "granted") {
                new Notification("InnoVerse: Application Sent!", {
                    body: `Your application for ${roleName} has been submitted.`
                });
            }
        });
    }
}