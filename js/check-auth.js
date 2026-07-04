document.addEventListener('DOMContentLoaded', async () => {
    try {
        const res = await fetch('/api/check-auth');
        if (res.ok) {
            const data = await res.json();
            const user = data.user;
            window.currentUser = user; // Expose globally for project submission
            
            // Find the "Sign In" button in desktop view
            const signInBtns = Array.from(document.querySelectorAll('button')).filter(b => b.innerText.trim() === 'Sign In');
            
            signInBtns.forEach(btn => {
                // Change it to a user dropdown or logout button
                const parent = btn.parentElement;
                
                // Remove original button
                btn.remove();
                
                // Create user profile wrapper
                const userProfile = document.createElement('div');
                userProfile.className = 'relative flex items-center gap-3';
                
                // Create user name text
                const userName = document.createElement('span');
                userName.className = 'hidden md:block text-sm font-medium text-gray-200';
                userName.innerText = `Hi, ${user.name.split(' ')[0]}`;
                
                // Create Dashboard button
                const dashboardBtn = document.createElement('a');
                dashboardBtn.href = 'dashboard.html';
                dashboardBtn.className = 'px-4 py-1.5 text-xs font-medium text-cyan-400 border border-cyan-500/30 rounded-lg hover:bg-cyan-500/10 hover:text-cyan-300 transition-all cursor-pointer';
                dashboardBtn.innerText = 'Dashboard';
                
                // Create logout button
                const logoutBtn = document.createElement('button');
                logoutBtn.className = 'px-4 py-1.5 text-xs font-medium text-red-400 border border-red-500/30 rounded-lg hover:bg-red-500/10 hover:text-red-300 transition-all cursor-pointer';
                logoutBtn.innerText = 'Logout';
                
                logoutBtn.addEventListener('click', async () => {
                    await fetch('/api/logout', { method: 'POST' });
                    window.location.reload();
                });
                
                // Create Notification Bell
                const notifWrapper = document.createElement('div');
                notifWrapper.className = 'relative cursor-pointer';
                
                // Get notifications from local storage
                let notifications = JSON.parse(localStorage.getItem(`notifs_${user.email}`)) || [];
                const unreadCount = notifications.filter(n => !n.read).length;
                
                notifWrapper.innerHTML = `
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-gray-400 hover:text-white transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg>
                    ${unreadCount > 0 ? `<span class="absolute top-0 right-0 block h-2.5 w-2.5 rounded-full bg-red-500 ring-2 ring-[#030712]"></span>` : ''}
                    <div id="notifDropdown" class="hidden absolute right-0 mt-2 w-72 bg-[#09090b] border border-gray-800 rounded-lg shadow-xl py-2 z-50">
                        <h4 class="px-4 py-2 text-xs font-bold text-gray-400 uppercase tracking-wider border-b border-gray-800 mb-2">Notifications</h4>
                        <div class="max-h-64 overflow-y-auto">
                            ${notifications.length === 0 ? '<p class="px-4 py-2 text-sm text-gray-500">No new notifications.</p>' : notifications.slice().reverse().map(n => `
                                <div class="px-4 py-3 hover:bg-white/5 transition-colors border-b border-gray-800/50 last:border-0 ${!n.read ? 'bg-blue-500/10' : ''}">
                                    <p class="text-sm text-gray-300">${n.message}</p>
                                    <span class="text-[10px] text-gray-500 mt-1 block">${new Date(n.time).toLocaleString()}</span>
                                </div>
                            `).join('')}
                        </div>
                    </div>
                `;

                notifWrapper.addEventListener('click', () => {
                    const dropdown = notifWrapper.querySelector('#notifDropdown');
                    dropdown.classList.toggle('hidden');
                    if (!dropdown.classList.contains('hidden')) {
                        // mark as read
                        notifications.forEach(n => n.read = true);
                        localStorage.setItem(`notifs_${user.email}`, JSON.stringify(notifications));
                        const dot = notifWrapper.querySelector('span.bg-red-500');
                        if(dot) dot.remove();
                    }
                });

                document.addEventListener('click', (e) => {
                    if (!notifWrapper.contains(e.target)) {
                        notifWrapper.querySelector('#notifDropdown').classList.add('hidden');
                    }
                });
                
                userProfile.appendChild(notifWrapper);
                userProfile.appendChild(userName);
                userProfile.appendChild(dashboardBtn);
                userProfile.appendChild(logoutBtn);
                
                // Prepend to parent (before "Submit Project" button)
                parent.insertBefore(userProfile, parent.firstChild);
            });
        } else {
            window.currentUser = null;
            // Update the link for signin buttons if not logged in
            const signInBtns = Array.from(document.querySelectorAll('button')).filter(b => b.innerText.trim() === 'Sign In');
            signInBtns.forEach(btn => {
                btn.addEventListener('click', () => {
                    window.location.href = 'auth.html';
                });
            });
        }
    } catch (err) {
        console.error('Failed to check auth status', err);
    }
});
