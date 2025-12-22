var intro = document.querySelector(".intro");
var audio = document.getElementById('music');
var mutetxt = document.getElementById("mutetxt");
var cyclecount = 0;
var muted = false;

const navEntries = window.performance.getEntriesByType("navigation");
const navType = navEntries.length > 0 ? navEntries[0].type : null;
const cameFromInternal = document.referrer.includes(window.location.hostname);

if (navType === "reload") {
    sessionStorage.removeItem("introPlayed");
}

if (sessionStorage.getItem("introPlayed") && cameFromInternal && navType !== "reload") {
    cyclecount = 2;
    intro.style.transition = "none";
    intro.style.top = "-300vh";
}

setInterval(check, 200);

function check() {
    if (cyclecount == 2) {
        intro.style.top = "-300vh";
    }
}

function introclick() {
    cyclecount = 2;
    sessionStorage.setItem("introPlayed", "true");
    audio.play();
}

function mutebtn() {
    if (muted == false) {
        audio.pause();
        muted = true;
        mutetxt.textContent = "muted";
    } else {
        audio.play();
        muted = false;
        mutetxt.textContent = "mute?";
    }
}

window.addEventListener('beforeunload', () => {
    if (audio) {
        sessionStorage.setItem("musicTime", audio.currentTime);
        sessionStorage.setItem("isMuted", muted);
    }
});

window.addEventListener('load', () => {
    const savedTime = sessionStorage.getItem("musicTime");
    const savedMute = sessionStorage.getItem("isMuted");
    
    if (savedTime && cyclecount == 2) {
        audio.currentTime = parseFloat(savedTime);
        if (savedMute === "false") {
            audio.play().catch(() => {});
        }
    }
});
