// Smooth scroll para links internos
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Analytics placeholder
function trackEvent(event, data) {
    console.log('Event:', event, data);
    // TODO: Integrar Google Analytics / Plausible
}

// Track CTA clicks
document.querySelectorAll('.btn').forEach(btn => {
    btn.addEventListener('click', () => {
        trackEvent('cta_click', {
            text: btn.textContent,
            location: btn.closest('section')?.className || 'unknown'
        });
    });
});
