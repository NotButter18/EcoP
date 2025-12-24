var audio = document.getElementById('music');

function handleAudio() {
    if (!audio) return;

    audio.volume = 1; 

    const savedTime = localStorage.getItem('musicTime');
    const wasPlaying = localStorage.getItem('musicPlaying') === 'true';

    if (savedTime) {
        audio.currentTime = parseFloat(savedTime);
    }

    if (wasPlaying) {
        audio.play().catch(() => {
            document.addEventListener('click', () => {
                if (localStorage.getItem('musicPlaying') === 'true') {
                    audio.play();
                    updateUI(true);
                }
            }, { once: true });
        });
        updateUI(true);
    } else {
        audio.pause();
        updateUI(false);
    }
}
function updateUI(isPlaying) {
    const status = document.getElementById('status');
    if (status) {
        status.innerText = isPlaying ? "on" : "off";
        isPlaying ? status.classList.add('active') : status.classList.remove('active');
    }
}

setInterval(() => {
    if (audio && !audio.paused) {
        localStorage.setItem('musicTime', audio.currentTime);
        localStorage.setItem('musicPlaying', 'true');
    }
}, 500);

window.addEventListener('load', handleAudio);

document.addEventListener('DOMContentLoaded', () => {
    const toggleBtn = document.getElementById('audio-toggle');
    const statusText = document.getElementById('status');

    if (toggleBtn && statusText) {
        toggleBtn.addEventListener('click', () => {
            if (audio.paused) {
                audio.play();
                localStorage.setItem('musicPlaying', 'true');
                statusText.innerText = "on";
                statusText.classList.add('active');
            } else {
                audio.pause();
                localStorage.setItem('musicPlaying', 'false');
                statusText.innerText = "off";
                statusText.classList.remove('active');
            }
        });
    }
});