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

    window.renderProjects = function(projectsToRender, useSkeleton = false) {
        if (!projectsGrid) return;
        projectsGrid.innerHTML = '';
        
        if (useSkeleton) {
            // Render Skeletons
            for (let i = 0; i < Math.max(3, projectsToRender.length); i++) {
                const skeleton = document.createElement('article');
                skeleton.className = 'bg-white/5 backdrop-blur-lg border border-white/10 rounded-xl p-6 flex flex-col animate-pulse';
                skeleton.innerHTML = `
                    <div class="h-3 w-24 bg-white/10 rounded mb-4"></div>
                    <div class="h-6 w-3/4 bg-white/10 rounded mb-4"></div>
                    <div class="h-16 w-full bg-white/10 rounded mb-6"></div>
                    <div class="flex items-center justify-between mt-auto">
                        <div class="h-6 w-16 bg-white/10 rounded"></div>
                        <div class="h-4 w-24 bg-white/10 rounded"></div>
                    </div>
                `;
                projectsGrid.appendChild(skeleton);
            }
            
            // Simulate network delay
            setTimeout(() => {
                window.renderProjects(projectsToRender, false);
            }, 600);
            return;
        }

        if (projectsToRender.length === 0) {
            projectsGrid.innerHTML = '<p class="text-gray-400 col-span-full">No projects found.</p>';
            return;
        }

        projectsToRender.forEach(proj => {
            const isLiked = localStorage.getItem(`liked_${proj.id}`) === 'true';
            const likeIcon = isLiked ? '♥' : '♡';
            const likeColor = isLiked ? 'text-red-500' : '';
            const displayLikes = proj.likes || 0;
            
            const article = document.createElement('article');
            article.className = 'bg-white/5 backdrop-blur-lg border border-white/10 rounded-xl p-6 flex flex-col transition-all duration-300 hover:bg-white/10 hover:-translate-y-2 hover:shadow-[0_8px_30px_rgba(56,189,248,0.15)] group relative overflow-hidden';
            article.innerHTML = `
                <div class="flex justify-between items-center mb-2">
                    <span class="text-cyan-400 text-[10px] font-bold tracking-widest uppercase block">${proj.tag || 'NEW SUBMISSION'}</span>
                    <a href="profile.html?user=${encodeURIComponent(proj.userEmail || 'test@test.com')}" class="text-gray-500 hover:text-cyan-400 transition-colors text-[10px] font-medium uppercase tracking-wider flex items-center gap-1 cursor-pointer">
                        👤 ${proj.userEmail ? proj.userEmail.split('@')[0] : 'Anonymous'}
                    </a>
                </div>
                <h3 class="text-lg font-bold text-white mb-2">${proj.title}</h3>
                <div class="text-gray-400 text-sm mb-6 leading-relaxed flex-grow line-clamp-3 quill-content">${proj.description}</div>
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

    window.renderTopProjects = function() {
        const topProjectsContainer = document.getElementById('topProjectsContainer');
        if (!topProjectsContainer) return;
        
        topProjectsContainer.innerHTML = '';
        
        // Calculate actual likes for sorting
        const projectsWithLikes = projects.map(proj => {
            const isLiked = localStorage.getItem(`liked_${proj.id}`) === 'true';
            return {
                ...proj,
                actualLikes: proj.likes || 0,
                isLiked: isLiked
            };
        });
        
        // Sort by actual likes descending and take top 3
        const top3 = projectsWithLikes.sort((a, b) => b.actualLikes - a.actualLikes).slice(0, 3);
        
        top3.forEach(proj => {
            const likeIcon = proj.isLiked ? '♥' : '♡';
            const likeColor = proj.isLiked ? 'text-red-500' : '';
            
            const div = document.createElement('div');
            div.className = 'bg-white/5 backdrop-blur-lg border border-white/10 rounded-xl p-5 w-full flex flex-col transition-all duration-300 hover:bg-white/10 hover:-translate-y-1 hover:shadow-[0_8px_30px_rgba(139,92,246,0.15)]';
            div.innerHTML = `
                <div class="flex justify-between items-start mb-2">
                    <span class="text-cyan-400 text-[10px] font-bold tracking-widest uppercase block">${proj.tag || 'NEW SUBMISSION'}</span>
                    <button onclick="toggleLike('${proj.id}', this)" class="flex items-center gap-1 text-gray-400 hover:text-red-500 transition-colors text-xs font-medium cursor-pointer">
                        <span class="heart-icon text-sm ${likeColor}">${likeIcon}</span> <span class="like-count">${proj.actualLikes}</span>
                    </button>
                </div>
                <h3 class="text-md font-bold text-white mb-1 truncate">${proj.title}</h3>
                <p class="text-gray-400 text-xs mb-1 truncate">${proj.description.replace(/<[^>]*>?/gm, '')}</p>
            `;
            topProjectsContainer.appendChild(div);
        });
    }

    // Initial render with skeletons
    window.renderProjects(projects, true);
    window.renderTopProjects();

    // ==========================================
    // 3. Session Storage API: Remember Search
    // ==========================================
    window.applyFilters = function() {
        const query = searchInput ? searchInput.value.toLowerCase() : '';
        
        const sortFilter = document.getElementById('sortFilter');
        const sortValue = sortFilter ? sortFilter.value : 'newest';
        
        const categoryCheckboxes = document.querySelectorAll('.category-filter:checked');
        const selectedCategories = Array.from(categoryCheckboxes).map(cb => cb.value.toLowerCase());

        let filtered = projects.filter(p => {
            const matchesQuery = p.title.toLowerCase().includes(query) || 
                                 p.description.toLowerCase().includes(query) ||
                                 p.category.toLowerCase().includes(query);
            
            const matchesCategory = selectedCategories.length === 0 || selectedCategories.includes(p.category.toLowerCase());
            
            return matchesQuery && matchesCategory;
        });

        if (sortValue === 'likes') {
            filtered.sort((a, b) => (b.likes || 0) - (a.likes || 0));
        } else {
            // Newest first based on ID timestamp (id format: name-timestamp)
            filtered.sort((a, b) => {
                const timeA = parseInt(a.id.split('-').pop()) || 0;
                const timeB = parseInt(b.id.split('-').pop()) || 0;
                return timeB - timeA;
            });
        }

        window.renderProjects(filtered, false); 
    };

    if (searchInput) {
        const savedSearch = sessionStorage.getItem('searchQuery');
        if (savedSearch) {
            searchInput.value = savedSearch;
            setTimeout(window.applyFilters, 100);
        }
        searchInput.addEventListener('input', (e) => {
            sessionStorage.setItem('searchQuery', e.target.value);
            window.applyFilters();
        });
    }

    const sortFilterElem = document.getElementById('sortFilter');
    if (sortFilterElem) {
        sortFilterElem.addEventListener('change', window.applyFilters);
    }

    const categoryCheckboxes = document.querySelectorAll('.category-filter');
    categoryCheckboxes.forEach(cb => {
        cb.addEventListener('change', window.applyFilters);
    });

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
                window.location.href = 'submit.html';
            });
        }
    });

    let currentBase64Image = null;

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
            
            const reader = new FileReader();
            reader.onload = (e) => {
                currentBase64Image = e.target.result;
            };
            reader.readAsDataURL(file);
        } else {
            showToast("Please upload an image file.", "error");
            fileInput.value = '';
            fileInfo.classList.add('hidden');
            currentBase64Image = null;
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
                    likes: 0,
                    coverImage: currentBase64Image,
                    userEmail: window.currentUser ? window.currentUser.email : null
                };

                // Add to projects array and save
                projects.unshift(newProject);
                saveProjects();
                
                // Re-render and re-filter
                const currentSearch = searchInput ? searchInput.value : '';
                if (currentSearch || document.querySelectorAll('.category-filter:checked').length > 0) {
                    window.applyFilters();
                } else {
                    window.renderProjects(projects);
                }
                window.renderTopProjects();

                // Show Success Notification
                if ("Notification" in window && Notification.permission === "granted") {
                    new Notification("InnoVerse: Success!", {
                        body: "Your project has been successfully submitted.",
                        icon: "https://cdn-icons-png.flaticon.com/512/190/190411.png"
                    });
                } else {
                    showToast("Your project has been successfully submitted!", "success");
                }

                // Reset and redirect to dashboard
                projectForm.reset();
                if(fileInfo) fileInfo.classList.add('hidden');
                currentBase64Image = null;
                window.location.href = 'dashboard.html';
            }
        });
    }

    function validateField(input) {
        const errorMsg = input.nextElementSibling;
        let valid = true;

        if (input.id === 'projDesc') {
            // Textarea is hidden, value is synced from Quill
            if (input.value.trim().length < 20 || input.value === '<p><br></p>') {
                valid = false;
            }
        } else if (input.validity.valueMissing) {
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

    // Initialize Quill Rich Text Editor dynamically
    const initQuill = () => {
        const descTextarea = document.getElementById('projDesc');
        if (!descTextarea) return;

        // Inject dependencies
        const quillCss = document.createElement('link');
        quillCss.href = 'https://cdn.quilljs.com/1.3.6/quill.snow.css';
        quillCss.rel = 'stylesheet';
        document.head.appendChild(quillCss);

        const quillJs = document.createElement('script');
        quillJs.src = 'https://cdn.quilljs.com/1.3.6/quill.js';
        document.head.appendChild(quillJs);

        quillJs.onload = () => {
            const wrapper = document.createElement('div');
            wrapper.className = 'bg-[#11131a] rounded-lg text-white text-sm mb-1 text-left';
            
            const editorDiv = document.createElement('div');
            editorDiv.id = 'quillEditor';
            editorDiv.style.height = '120px';
            wrapper.appendChild(editorDiv);
            
            descTextarea.parentNode.insertBefore(wrapper, descTextarea);
            descTextarea.style.display = 'none';
            
            const quill = new Quill('#quillEditor', {
                theme: 'snow',
                placeholder: 'Describe the problem, solution, and tech stack...',
                modules: {
                    toolbar: [
                        ['bold', 'italic', 'underline'],
                        [{ 'list': 'ordered'}, { 'list': 'bullet' }],
                        ['link']
                    ]
                }
            });

            // Sync with textarea
            quill.on('text-change', () => {
                descTextarea.value = quill.root.innerHTML === '<p><br></p>' ? '' : quill.root.innerHTML;
                validateField(descTextarea);
            });

            // Handle form reset to clear Quill
            const form = document.getElementById('projectForm');
            if (form) {
                form.addEventListener('reset', () => {
                    setTimeout(() => {
                        quill.root.innerHTML = '';
                    }, 10);
                });
            }
        };
    };
    initQuill();
});

// ==========================================
// Global Functions (Called directly from HTML)
// ==========================================

// Local Storage API Trigger
window.toggleLike = function(projectId, btnElement) {
    let projects = JSON.parse(localStorage.getItem('innoverse_projects')) || [];
    let isLiked = localStorage.getItem(`liked_${projectId}`) === 'true';
    
    // Toggle state
    isLiked = !isLiked;
    
    if (isLiked) {
        localStorage.setItem(`liked_${projectId}`, 'true');
    } else {
        localStorage.removeItem(`liked_${projectId}`);
    }

    // Update the base likes in the projects array permanently
    const projIndex = projects.findIndex(p => p.id === projectId);
    if (projIndex !== -1) {
        if (isLiked) {
            projects[projIndex].likes = (projects[projIndex].likes || 0) + 1;
        } else {
            projects[projIndex].likes = Math.max(0, (projects[projIndex].likes || 0) - 1);
        }
        // Save the updated projects array
        localStorage.setItem('innoverse_projects', JSON.stringify(projects));
        
        // Expose to window so we can re-render with latest data
        window.projectsData = projects;
    }

    // Instead of manually updating one DOM element, re-render the whole page!
    // Re-render main projects if they exist
    const searchInput = document.getElementById('projectSearch');
    if (typeof window.renderProjects === 'function' && window.projectsData) {
        if (typeof window.applyFilters === 'function') {
            window.applyFilters();
        } else {
            window.renderProjects(window.projectsData);
        }
    }
    
    // Re-render top projects if they exist
    if (typeof window.renderTopProjects === 'function') {
        window.renderTopProjects();
    }
    
    // If we are on dashboard, reload the dashboard grid
    if (typeof window.renderDashboardProjects === 'function') {
        window.renderDashboardProjects();
    } else if (window.location.pathname.includes('dashboard.html')) {
        window.location.reload();
    }
    
    // If we are on profile, reload the profile grid
    if (typeof window.renderProfileProjects === 'function') {
        window.renderProfileProjects();
    }
}

// 5. Clipboard API: Copy Link
function shareProject(projectName) {
    const dummyUrl = `https://innoverse.christ.edu/project/${projectName.toLowerCase().replace(/\s+/g, '-')}`;
    if (navigator.clipboard) {
        navigator.clipboard.writeText(dummyUrl).then(() => {
            showToast(`Link for ${projectName} copied to clipboard!`, "success");
        }).catch(err => {
            console.error('Failed to copy: ', err);
            showToast("Failed to copy link", "error");
        });
    } else {
        showToast("Clipboard API not supported in this browser.", "error");
    }
}

// 6. Web Notifications API: Application Alert
window.applyForRole = function(roleName, ownerEmail = null) {
    // Simulate pushing notification to the project owner (or current user for demo)
    const targetEmail = ownerEmail || (window.currentUser ? window.currentUser.email : 'test@test.com');
    let notifications = JSON.parse(localStorage.getItem(`notifs_${targetEmail}`)) || [];
    notifications.push({
        id: Date.now(),
        message: `A student applied for the ${roleName} position on your project!`,
        time: new Date().toISOString(),
        read: false
    });
    localStorage.setItem(`notifs_${targetEmail}`, JSON.stringify(notifications));

    // Show visual toast alert
    showToast(`Your application for ${roleName} has been sent!`, "success");

    // Desktop Notification API
    if (!("Notification" in window)) {
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

// 7. Dynamic Quick View & Comments Modal
window.openQuickView = function(projectName) {
    let projects = JSON.parse(localStorage.getItem('innoverse_projects')) || window.projectsData || [];
    const proj = projects.find(p => p.title === projectName);
    if (!proj) return;

    // Create modal container
    const modal = document.createElement('div');
    modal.className = 'fixed inset-0 z-[9999] flex items-center justify-center bg-[#0B1120]/90 backdrop-blur-sm opacity-0 transition-opacity duration-300';
    modal.id = 'quickViewModal';

    const comments = proj.comments || [];
    const commentsHtml = comments.length > 0 
        ? comments.map(c => `
            <div class="bg-white/5 border border-white/5 rounded p-3 mb-2">
                <div class="flex justify-between items-center mb-1">
                    <span class="text-cyan-400 text-xs font-bold">${c.userEmail}</span>
                    <span class="text-gray-500 text-[10px]">${new Date(c.time).toLocaleDateString()}</span>
                </div>
                <p class="text-gray-300 text-sm">${c.text}</p>
            </div>
        `).join('') 
        : '<p class="text-gray-500 text-sm">No comments yet. Be the first to discuss this project!</p>';

    modal.innerHTML = `
        <div class="bg-[#11131a] border border-white/10 rounded-2xl w-full max-w-2xl max-h-[90vh] flex flex-col shadow-[0_20px_50px_rgba(0,0,0,0.5)] transform scale-95 transition-transform duration-300 mx-4">
            <!-- Header -->
            <div class="p-6 border-b border-white/10 flex justify-between items-start shrink-0">
                <div>
                    <span class="bg-[#1a1d26] text-blue-400 px-2 py-1 rounded text-xs font-medium capitalize mb-2 inline-block">${proj.category}</span>
                    <h2 class="text-2xl font-bold text-white">${proj.title}</h2>
                    <a href="profile.html?user=${encodeURIComponent(proj.userEmail || 'test@test.com')}" class="text-gray-500 hover:text-cyan-400 text-xs mt-1 block">👤 ${proj.userEmail ? proj.userEmail.split('@')[0] : 'Anonymous'}</a>
                </div>
                <button onclick="document.getElementById('quickViewModal').remove()" class="text-gray-400 hover:text-white cursor-pointer p-2 text-xl font-bold">✕</button>
            </div>
            
            <!-- Body (Scrollable) -->
            <div class="p-6 overflow-y-auto flex-grow custom-scrollbar">
                ${proj.coverImage ? `<img src="${proj.coverImage}" class="w-full h-48 object-cover rounded-xl mb-6 border border-white/10">` : ''}
                <div class="text-gray-300 text-sm leading-relaxed mb-8 quill-content">${proj.description}</div>
                
                <!-- Comments Section -->
                <div class="border-t border-white/10 pt-6">
                    <h3 class="text-lg font-bold text-white mb-4">Discussion (${comments.length})</h3>
                    <div class="mb-4 max-h-48 overflow-y-auto custom-scrollbar pr-2" id="commentsList">
                        ${commentsHtml}
                    </div>
                    <div class="flex gap-2">
                        <input type="text" id="commentInput" placeholder="Add a constructive comment..." class="flex-grow bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-sm text-white focus:outline-none focus:border-cyan-500">
                        <button onclick="addComment('${proj.id}')" class="px-4 py-2 bg-gradient-to-r from-cyan-600 to-blue-600 text-white rounded-lg text-sm font-bold hover:shadow-[0_0_15px_rgba(6,182,212,0.3)] transition-all cursor-pointer">Post</button>
                    </div>
                </div>
            </div>
        </div>
    `;

    document.body.appendChild(modal);
    
    // Animate in
    requestAnimationFrame(() => {
        modal.classList.remove('opacity-0');
        modal.classList.add('opacity-100');
        modal.querySelector('div').classList.remove('scale-95');
        modal.querySelector('div').classList.add('scale-100');
    });
}

window.addComment = function(projectId) {
    const input = document.getElementById('commentInput');
    const text = input.value.trim();
    if (!text) {
        window.showToast("Comment cannot be empty", "error");
        return;
    }
    
    let userEmail = window.currentUser ? window.currentUser.email : 'guest@innoverse.com';
    
    let projects = JSON.parse(localStorage.getItem('innoverse_projects')) || [];
    const projIndex = projects.findIndex(p => p.id === projectId);
    
    if (projIndex !== -1) {
        if (!projects[projIndex].comments) {
            projects[projIndex].comments = [];
        }
        projects[projIndex].comments.push({
            userEmail: userEmail,
            text: text,
            time: new Date().toISOString()
        });
        
        localStorage.setItem('innoverse_projects', JSON.stringify(projects));
        window.projectsData = projects;
        
        // Refresh modal
        const modal = document.getElementById('quickViewModal');
        if (modal) {
            const title = projects[projIndex].title;
            modal.remove();
            window.openQuickView(title);
        }
        window.showToast("Comment posted!", "success");
    }
}