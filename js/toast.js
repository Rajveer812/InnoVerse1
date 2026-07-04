// js/toast.js
window.showToast = function(message, type = 'success') {
    // Create container if it doesn't exist
    let container = document.getElementById('toast-container');
    if (!container) {
        container = document.createElement('div');
        container.id = 'toast-container';
        container.className = 'fixed bottom-5 right-5 z-[9999] flex flex-col gap-3 pointer-events-none';
        document.body.appendChild(container);
    }

    const toast = document.createElement('div');
    
    // Style configuration
    let bgGradient = type === 'error' ? 'from-red-600 to-rose-600' : 
                     type === 'info' ? 'from-blue-600 to-cyan-600' : 
                     'from-emerald-500 to-teal-500';
                     
    let icon = type === 'error' ? '⚠️' : 
               type === 'info' ? 'ℹ️' : 
               '✅';

    toast.className = `flex items-center gap-3 px-5 py-4 bg-gradient-to-r ${bgGradient} text-white font-medium text-sm rounded-xl shadow-[0_10px_40px_rgba(0,0,0,0.5)] transform transition-all duration-500 translate-x-[120%] opacity-0 pointer-events-auto`;
    toast.innerHTML = `
        <span class="text-xl">${icon}</span>
        <span>${message}</span>
    `;

    container.appendChild(toast);

    // Animate in
    requestAnimationFrame(() => {
        setTimeout(() => {
            toast.classList.remove('translate-x-[120%]', 'opacity-0');
            toast.classList.add('translate-x-0', 'opacity-100');
        }, 10);
    });

    // Animate out and remove
    setTimeout(() => {
        toast.classList.remove('translate-x-0', 'opacity-100');
        toast.classList.add('translate-x-[120%]', 'opacity-0');
        setTimeout(() => {
            toast.remove();
        }, 500);
    }, 4000);
};
