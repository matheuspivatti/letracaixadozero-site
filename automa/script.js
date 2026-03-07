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

// Placeholder para integração Stripe (implementar depois)
document.querySelectorAll('.btn-primary, .btn-outline').forEach(button => {
    if (button.textContent.includes('Começar')) {
        button.addEventListener('click', function(e) {
            if (this.getAttribute('href') === '#' || this.getAttribute('href') === '#pricing') {
                return; // Permite navegação interna
            }
            e.preventDefault();
            console.log('Checkout:', this.closest('.pricing-card')?.querySelector('.plan-name')?.textContent || 'CTA Final');
            // TODO: Integrar Stripe Checkout aqui
            alert('Checkout em desenvolvimento. Em breve você poderá assinar diretamente!');
        });
    }
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
