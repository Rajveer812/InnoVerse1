// js/theme.js
document.addEventListener('DOMContentLoaded', () => {
    // Check saved theme
    const savedTheme = localStorage.getItem('innoverse_theme') || 'dark';
    if (savedTheme === 'light') {
        enableLightMode();
    }

    // Attach click listeners to all buttons with class 'theme-toggle'
    document.addEventListener('click', (e) => {
        const toggleBtn = e.target.closest('.theme-toggle');
        if (toggleBtn) {
            const current = localStorage.getItem('innoverse_theme') || 'dark';
            if (current === 'dark') {
                enableLightMode();
                if(window.showToast) window.showToast('Light Mode Enabled', 'info');
            } else {
                disableLightMode();
                if(window.showToast) window.showToast('Dark Mode Enabled', 'info');
            }
        }
    });
});

function enableLightMode() {
    document.documentElement.style.filter = 'invert(1) hue-rotate(180deg)';
    document.documentElement.style.transition = 'filter 0.5s ease';
    
    // Reverse invert on media and specifically colored elements so they look normal
    let style = document.getElementById('light-mode-fixes');
    if (!style) {
        style = document.createElement('style');
        style.id = 'light-mode-fixes';
        document.head.appendChild(style);
    }
    style.innerHTML = `
        img, video, canvas, [style*="background-image"], .transform-style-3d {
            filter: invert(1) hue-rotate(180deg) !important;
        }
        /* Keep buttons looking slightly better */
        .btn-hover-effect {
            filter: brightness(0.9);
        }
    `;
    
    localStorage.setItem('innoverse_theme', 'light');
}

function disableLightMode() {
    document.documentElement.style.filter = '';
    
    const fixes = document.getElementById('light-mode-fixes');
    if (fixes) fixes.remove();
    
    localStorage.setItem('innoverse_theme', 'dark');
}
