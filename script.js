// Configuration - EDIT DI SINI
const CONFIG = {
    serverIP: 'play.tahuniverse.my.id',
    serverPort: '19155',
    logoURL: 'https://raw.githubusercontent.com/miku208/Img/refs/heads/main/IMG-20251019-WA0041.jpg',
    whatsappGroup: 'https://chat.whatsapp.com/EDhIsrXA7137daiYMBcjBs?mode=ac_t',
    discordInvite: 'https://discord.gg/ArWXXv7fMk',
    tiktokProfile: 'https://www.tiktok.com/@tahuisi.net' // Tambahkan link TikTok di sini
};

// Initialize configuration
function initializeConfig() {
    document.getElementById('serverIP').textContent = CONFIG.serverIP;
    document.getElementById('serverLogo').src = CONFIG.logoURL;
    document.querySelector('.social-btn.whatsapp').href = CONFIG.whatsappGroup;
    document.querySelector('.social-btn.discord').href = CONFIG.discordInvite;
    
    // Set link TikTok
    const tiktokBtn = document.querySelector('.social-btn.tiktok');
    if (tiktokBtn) {
        tiktokBtn.href = CONFIG.tiktokProfile;
    }
}

// Server Status Checker yang lebih realistis untuk Aternos
async function checkServerStatus() {
    const statusElement = document.getElementById('serverStatus');
    const statusText = document.getElementById('statusText');
    const onlinePlayersElement = document.getElementById('onlinePlayers');
    const statsPlayerCountElement = document.getElementById('statsPlayerCount');
    const serverUptimeElement = document.getElementById('serverUptime');
    const aternosInfo = document.getElementById('aternosInfo');
    
    try {
        // Gunakan API yang lebih reliable untuk Aternos
        const response = await fetch(`https://api.mcsrvstat.us/bedrock/2/${CONFIG.serverIP}:${CONFIG.serverPort}`);
        const data = await response.json();
        
        if (data.online && data.players && data.players.online > 0) {
            // Server benar-benar online dengan player aktif
            statusElement.className = 'server-status status-online';
            statusText.textContent = '🟢 SERVER ONLINE';
            onlinePlayersElement.textContent = `${data.players.online}/${data.players.max}`;
            statsPlayerCountElement.textContent = data.players.online;
            serverUptimeElement.textContent = 'Online';
            aternosInfo.style.display = 'none';
        } else {
            // Server sleep (kondisi normal Aternos)
            statusElement.className = 'server-status status-sleep';
            statusText.textContent = '🟡 SERVER SLEEP';
            onlinePlayersElement.textContent = '0';
            statsPlayerCountElement.textContent = '0';
            serverUptimeElement.textContent = 'Ready to Wake';
            aternosInfo.style.display = 'block';
        }
    } catch (error) {
        // Jika API error, anggap server sleep (kondisi normal Aternos)
        statusElement.className = 'server-status status-sleep';
        statusText.textContent = '🟡 SERVER SLEEP';
        onlinePlayersElement.textContent = '0';
        statsPlayerCountElement.textContent = '0';
        serverUptimeElement.textContent = 'Ready to Wake';
        aternosInfo.style.display = 'block';
    }
}

// Auto-refresh status setiap 45 detik (lebih lama untuk hindari rate limit)
function startStatusChecker() {
    checkServerStatus(); // Check immediately
    setInterval(checkServerStatus, 45000); // Check every 45 seconds
}

// Copy IP to clipboard
function copyIP() {
    const ip = CONFIG.serverIP;
    navigator.clipboard.writeText(ip).then(() => {
        showCopyNotification();
    }).catch(() => {
        const textarea = document.createElement('textarea');
        textarea.value = ip;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
        showCopyNotification();
    });
}

function showCopyNotification() {
    const notification = document.getElementById('copyNotification');
    notification.classList.add('show');
    setTimeout(() => {
        notification.classList.remove('show');
    }, 3000);
}

// Generate particles
function createParticles() {
    const particlesContainer = document.getElementById('particles');
    const particleCount = 30;

    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        particle.style.left = Math.random() * 100 + '%';
        particle.style.top = Math.random() * 100 + '%';
        particle.style.animationDelay = Math.random() * 20 + 's';
        particle.style.animationDuration = (Math.random() * 10 + 15) + 's';
        particlesContainer.appendChild(particle);
    }
}

// Smooth scroll
function initializeSmoothScroll() {
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
}

// Animate stats on scroll
function initializeScrollAnimations() {
    const observerOptions = {
        threshold: 0.5,
        rootMargin: '0px 0px -100px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    document.querySelectorAll('.stat-card, .feature-card').forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(50px)';
        card.style.transition = 'all 0.6s ease';
        observer.observe(card);
    });
}

// Error handling for logo
function initializeLogoErrorHandling() {
    document.getElementById('serverLogo').onerror = function() {
        this.src = 'https://ui-avatars.com/api/?name=Tahu+Isi&background=f97316&color=0f172a&size=100&bold=true';
    };
}

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    initializeConfig();
    createParticles();
    startStatusChecker();
    initializeSmoothScroll();
    initializeScrollAnimations();
    initializeLogoErrorHandling();
});