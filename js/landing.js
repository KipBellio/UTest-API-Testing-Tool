// js/landing.js
// Logic for the navbtn, herobtn and ctabtn
document.addEventListener('DOMContentLoaded', () => {
    
    const toolPageUrl = 'tool.html'; 
    const navBtn = document.getElementById('nav-get-started');
    if (navBtn) {
        navBtn.addEventListener('click', (e) => {
            e.preventDefault(); 
            window.location.href = toolPageUrl;
        });
    }
    const heroBtn = document.getElementById('Get-started');
    if (heroBtn) {
        heroBtn.addEventListener('click', () => {
            window.location.href = toolPageUrl;
        });
    }
    const bottomBtn = document.getElementById('btn');
    if (bottomBtn) {
        bottomBtn.addEventListener('click', () => {
            window.location.href = toolPageUrl;
        });
    }

});