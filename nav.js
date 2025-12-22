document.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', e => {
        if (link.hostname === window.location.hostname) {
            const destination = link.getAttribute('href');
            if (!destination || destination.startsWith('#')) return;

            e.preventDefault();
            
            const transitionEl = document.querySelector('.page-transition');
            if (transitionEl) {
                transitionEl.classList.add('fade-out');
            }

            setTimeout(() => {
                window.location.href = destination;
            }, 500);
        }
    });
});