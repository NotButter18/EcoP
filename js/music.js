var audio = document.getElementById('music');

function handleAudio() {
    if (!audio) return;

    audio.volume = 0.3; 

    const savedTime = localStorage.getItem('musicTime');
    // This is the important part:
    const wasPlaying = localStorage.getItem('musicPlaying') === 'true';

    if (savedTime) {
        audio.currentTime = parseFloat(savedTime);
    }

    // ONLY play if the user didn't turn it off previously
    if (wasPlaying) {
        audio.play().catch(() => {
            document.addEventListener('click', () => {
                // Double check again before auto-playing on click
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
// ... rest of your code
function updateUI(isPlaying) {
    const status = document.getElementById('status');
    if (status) {
        status.innerText = isPlaying ? "ON" : "OFF";
        isPlaying ? status.classList.add('active') : status.classList.remove('active');
    }
}

// 3. Save the timestamp constantly
setInterval(() => {
    if (audio && !audio.paused) {
        localStorage.setItem('musicTime', audio.currentTime);
        localStorage.setItem('musicPlaying', 'true');
    }
}, 500);

window.addEventListener('load', handleAudio);

// Add this at the bottom of music.js
document.addEventListener('DOMContentLoaded', () => {
    const toggleBtn = document.getElementById('audio-toggle');
    const statusText = document.getElementById('status');

    if (toggleBtn && statusText) {
        toggleBtn.addEventListener('click', () => {
            if (audio.paused) {
                audio.play();
                localStorage.setItem('musicPlaying', 'true');
                statusText.innerText = "ON";
                statusText.classList.add('active');
            } else {
                audio.pause();
                localStorage.setItem('musicPlaying', 'false');
                statusText.innerText = "OFF";
                statusText.classList.remove('active');
            }
        });
    }
});
