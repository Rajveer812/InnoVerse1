// js/profile.js
document.addEventListener('DOMContentLoaded', () => {
    const urlParams = new URLSearchParams(window.location.search);
    const targetEmail = urlParams.get('user');

    const profileName = document.getElementById('profileName');
    const profileEmail = document.getElementById('profileEmail');
    const profileProjectCount = document.getElementById('profileProjectCount');
    const profileTotalLikes = document.getElementById('profileTotalLikes');
    const profileProjectsGrid = document.getElementById('profileProjectsGrid');

    if (!targetEmail) {
        window.showToast("No user specified.", "error");
        profileName.innerText = "Unknown User";
        profileEmail.innerText = "";
        return;
    }

    // Load projects
    let allProjects = JSON.parse(localStorage.getItem('innoverse_projects')) || [];
    let userProjects = allProjects.filter(p => p.userEmail === targetEmail);

    // Some dummy default projects lack an email, assign them one for testing if targetEmail is 'test@test.com'
    if (targetEmail === 'test@test.com' && userProjects.length === 0) {
        userProjects = allProjects.filter(p => !p.userEmail);
    }

    // Compute stats
    let totalLikes = userProjects.reduce((sum, p) => sum + (p.likes || 0), 0);

    // Update Profile Header
    profileEmail.innerText = targetEmail;
    // Extract name from email (e.g. john.doe@... -> John Doe)
    let extractedName = targetEmail.split('@')[0].split('.').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
    profileName.innerText = extractedName;
    profileProjectCount.innerText = userProjects.length;
    profileTotalLikes.innerText = totalLikes;

    // Render Projects
    window.renderProfileProjects = function() {
        if (!profileProjectsGrid) return;
        profileProjectsGrid.innerHTML = '';
        
        if (userProjects.length === 0) {
            profileProjectsGrid.innerHTML = '<p class="text-gray-400 col-span-full">This user has not submitted any projects yet.</p>';
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
                <span class="text-cyan-400 text-[10px] font-bold tracking-widest uppercase mb-2 block">${proj.tag || 'COMMUNITY SUBMISSION'}</span>
                <h3 class="text-lg font-bold text-white mb-2">${proj.title}</h3>
                <p class="text-gray-400 text-sm mb-6 leading-relaxed flex-grow line-clamp-3 quill-content">${proj.description}</p>
                <div class="flex items-center justify-between mt-4">
                    <span class="bg-[#1a1d26] text-blue-400 px-2 py-1 rounded text-xs font-medium capitalize">${proj.category}</span>
                    <button onclick="toggleLike('${proj.id}', this)" class="flex items-center gap-1 text-gray-400 hover:text-red-500 transition-colors text-xs font-medium cursor-pointer">
                        <span class="heart-icon text-lg ${likeColor}">${likeIcon}</span> <span class="like-count">${displayLikes}</span>
                    </button>
                </div>
            `;
            profileProjectsGrid.appendChild(article);
        });
    }

    // Attach local render to global toggleLike fallback
    window.projectsData = allProjects; // So toggleLike updates base array correctly
    
    // Initial Render
    window.renderProfileProjects();
});
