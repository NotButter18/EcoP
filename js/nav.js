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

const modal = document.getElementById("data-modal");
const btn = document.getElementById("open-modal");
const span = document.getElementsByClassName("close-modal")[0];

// Open the pop-up
btn.onclick = function() {
  modal.style.display = "block";
}

// Close the pop-up
span.onclick = function() {
  modal.style.display = "none";
}

// Close if they click outside the box
window.onclick = function(event) {
  if (event.target == modal) {
    modal.style.display = "none";
  }
}