// js/transitions.js
document.addEventListener('DOMContentLoaded', () => {
    // Add fade-in base class if not present
    if (!document.body.classList.contains('fade-in')) {
        document.body.classList.add('transition-opacity', 'duration-500', 'opacity-0');
        
        // Trigger fade in on load
        requestAnimationFrame(() => {
            document.body.classList.remove('opacity-0');
            document.body.classList.add('opacity-100');
        });
    }

    // Intercept clicks on links
    document.addEventListener('click', (e) => {
        const link = e.target.closest('a');
        if (!link) return;
        
        const href = link.getAttribute('href');
        
        // Ignore external links, anchors, or empty links
        if (!href || href.startsWith('http') || href.startsWith('#') || link.target === '_blank') return;
        
        // Only handle internal HTML navigation
        e.preventDefault();
        
        // Fade out
        document.body.classList.remove('opacity-100');
        document.body.classList.add('opacity-0');
        
        // Navigate after transition completes
        setTimeout(() => {
            window.location.href = href;
        }, 300); // 300ms matches Tailwind duration-300 to duration-500 depending on preference
    });
});
