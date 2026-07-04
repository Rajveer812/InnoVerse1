document.addEventListener('DOMContentLoaded', async () => {
    // Wait slightly to ensure check-auth.js has resolved currentUser
    setTimeout(() => {
        if (!window.currentUser) {
            window.location.href = 'auth.html';
            return;
        }

        renderDashboardProjects();
    }, 500);

    window.renderDashboardProjects = function() {
        const dashboardGrid = document.getElementById('dashboardGrid');
        if (!dashboardGrid) return;

        let projects = JSON.parse(localStorage.getItem('innoverse_projects')) || [];
        // Filter projects by current user's email
        const userProjects = projects.filter(p => p.userEmail === window.currentUser.email);

        dashboardGrid.innerHTML = '';
        
        if (userProjects.length === 0) {
            dashboardGrid.innerHTML = `
                <div class="col-span-full text-center py-20 bg-[#11131a] rounded-xl border border-gray-800">
                    <p class="text-gray-400 text-lg mb-4">You haven't submitted any projects yet.</p>
                    <a href="submit.html" class="px-6 py-2 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-lg inline-block hover:shadow-[0_0_15px_rgba(79,70,229,0.5)] transition-all">Submit a Project</a>
                </div>
            `;
            return;
        }

        userProjects.forEach(proj => {
            const isLiked = localStorage.getItem(`liked_${proj.id}`) === 'true';
            const likeIcon = isLiked ? '♥' : '♡';
            const likeColor = isLiked ? 'text-red-500' : '';
            const displayLikes = proj.likes || 0;

            const article = document.createElement('article');
            article.className = 'bg-white/5 backdrop-blur-lg border border-white/10 rounded-xl p-6 flex flex-col transition-all duration-300 hover:bg-white/10 hover:-translate-y-2 hover:shadow-[0_8px_30px_rgba(56,189,248,0.15)] group relative overflow-hidden';
            article.innerHTML = `
                <button onclick="deleteProject('${proj.id}')" class="absolute top-4 right-4 text-red-500/50 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100 cursor-pointer" title="Delete Project">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                </button>
                ${proj.coverImage ? `<img src="${proj.coverImage}" class="w-full h-32 object-cover rounded-lg mb-4 opacity-80 group-hover:opacity-100 transition-opacity">` : ''}
                <span class="text-cyan-400 text-[10px] font-bold tracking-widest uppercase mb-2 block">${proj.tag || 'YOUR PROJECT'}</span>
                <h3 class="text-lg font-bold text-white mb-2">${proj.title}</h3>
                <p class="text-gray-400 text-sm mb-6 leading-relaxed flex-grow line-clamp-3">${proj.description}</p>
                <div class="flex items-center justify-between mt-4">
                    <span class="bg-[#1a1d26] text-blue-400 px-2 py-1 rounded text-xs font-medium capitalize">${proj.category}</span>
                    <button onclick="toggleLike('${proj.id}', this)" class="flex items-center gap-1 text-gray-400 hover:text-red-500 transition-colors text-xs font-medium cursor-pointer">
                        <span class="heart-icon text-lg ${likeColor}">${likeIcon}</span> <span class="like-count">${displayLikes}</span>
                    </button>
                </div>
            `;
            dashboardGrid.appendChild(article);
        });
    }

    // Expose delete globally
    window.deleteProject = function(id) {
        if(confirm("Are you sure you want to delete this project?")) {
            let projects = JSON.parse(localStorage.getItem('innoverse_projects')) || [];
            projects = projects.filter(p => p.id !== id);
            localStorage.setItem('innoverse_projects', JSON.stringify(projects));
            renderDashboardProjects();
        }
    }
});
