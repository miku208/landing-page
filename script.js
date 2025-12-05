// Configuration
const CONFIG = {
    serverIP: 'play.tahuniverse.my.id',
    serverPort: '19155',
    logoURL: './logo.jpg',
    whatsappLink: 'https://chat.whatsapp.com/EDhIsrXA7137daiYMBcjBs?mode=ac_t',
    discordLink: 'https://discord.gg/ArWXXv7fMk',
    tiktokLink: 'https://www.tiktok.com/@tahuisi.net'
};

// Initialize configuration
function initializeConfig() {
    // Set logo
    const logos = document.querySelectorAll('#serverLogo, .footer-logo img');
    logos.forEach(logo => {
        logo.src = CONFIG.logoURL;
        logo.onerror = function() {
            this.src = 'https://ui-avatars.com/api/?name=Tahu+Isi&background=f97316&color=white&size=100&bold=true';
        };
    });
    
    // Set server IP
    document.getElementById('serverIP').textContent = CONFIG.serverIP;
    
    // Set social media links
    document.querySelector('.social-circle.whatsapp').href = CONFIG.whatsappLink;
    document.querySelector('.social-circle.discord').href = CONFIG.discordLink;
    document.querySelector('.social-circle.tiktok').href = CONFIG.tiktokLink;
}

// Server Status Checker
async function checkServerStatus() {
    const statusElement = document.getElementById('serverStatus');
    const statusIndicator = statusElement.querySelector('.status-indicator');
    const statusText = statusElement.querySelector('.status-text');
    const onlineCount = document.getElementById('onlineCount');
    const maxCount = document.getElementById('maxCount');
    const communityCount = document.getElementById('communityCount');
    
    try {
        // Simulate API call with timeout
        const timeoutPromise = new Promise((_, reject) => 
            setTimeout(() => reject(new Error('Timeout')), 5000)
        );
        
        const fetchPromise = fetch(`https://api.mcsrvstat.us/2/${CONFIG.serverIP}:${CONFIG.serverPort}`);
        
        const response = await Promise.race([fetchPromise, timeoutPromise]);
        const data = await response.json();
        
        if (data.online) {
            statusIndicator.className = 'status-indicator online';
            statusText.textContent = ' SERVER ONLINE';
            
            if (data.players && data.players.online !== undefined) {
                onlineCount.textContent = data.players.online;
                maxCount.textContent = data.players.max || '∞';
                
                // Update community count
                const totalCommunity = data.players.online + 450;
                communityCount.textContent = `${totalCommunity}+`;
            } else {
                onlineCount.textContent = '0';
                maxCount.textContent = '?';
            }
        } else {
            statusIndicator.className = 'status-indicator offline';
            statusText.textContent = ' SERVER OFFLINE';
            onlineCount.textContent = '0';
            maxCount.textContent = '0';
        }
    } catch (error) {
        console.log('Server status check failed, using fallback:', error);
        
        // Fallback: Simulate online status for demo
        const isOnline = Math.random() > 0.3; // 70% chance online
        
        if (isOnline) {
            statusIndicator.className = 'status-indicator online';
            statusText.textContent = ' SERVER ONLINE';
            
            const randomPlayers = Math.floor(Math.random() * 80) + 20;
            onlineCount.textContent = randomPlayers;
            maxCount.textContent = '100';
            
            const totalCommunity = randomPlayers + 450;
            communityCount.textContent = `${totalCommunity}+`;
        } else {
            statusIndicator.className = 'status-indicator offline';
            statusText.textContent = 'SERVER OFFLINE';
            onlineCount.textContent = '0';
            maxCount.textContent = '0';
        }
    }
}

// Copy IP to clipboard
function copyIP() {
    const ip = CONFIG.serverIP;
    
    navigator.clipboard.writeText(ip).then(() => {
        showNotification('Server IP copied to clipboard!');
        
        // Add visual feedback
        const ipContainer = document.querySelector('.ip-container');
        ipContainer.style.background = 'rgba(16, 185, 129, 0.2)';
        ipContainer.style.borderColor = 'var(--success)';
        
        setTimeout(() => {
            ipContainer.style.background = 'rgba(249, 115, 22, 0.1)';
            ipContainer.style.borderColor = '';
        }, 1000);
        
    }).catch(err => {
        // Fallback for older browsers
        const textarea = document.createElement('textarea');
        textarea.value = ip;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
        showNotification('Server IP copied to clipboard!');
    });
}

// Show notification
function showNotification(message) {
    const notification = document.getElementById('copyNotification');
    notification.querySelector('span').textContent = message;
    notification.classList.add('show');
    
    // Add success icon
    const icon = notification.querySelector('i');
    icon.className = 'fas fa-check-circle';
    
    setTimeout(() => {
        notification.classList.remove('show');
    }, 3000);
}

// Initialize smooth scroll
function initializeSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                // Update active nav link
                document.querySelectorAll('.nav-link').forEach(link => {
                    link.classList.remove('active');
                });
                this.classList.add('active');
                
                // Close mobile menu if open
                const navMenu = document.querySelector('.nav-menu');
                if (navMenu.classList.contains('active')) {
                    navMenu.classList.remove('active');
                }
                
                // Scroll to target
                const offset = 80;
                const targetPosition = targetElement.offsetTop - offset;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// Initialize scroll animations
function initializeScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                
                // Add animation class for specific elements
                if (entry.target.classList.contains('feature-card')) {
                    entry.target.style.transition = 'all 0.6s ease 0.2s';
                } else if (entry.target.classList.contains('step')) {
                    const index = Array.from(entry.target.parentElement.children).indexOf(entry.target);
                    entry.target.style.transition = `all 0.6s ease ${index * 0.1}s`;
                }
            }
        });
    }, observerOptions);

    // Observe elements for animation
    document.querySelectorAll('.feature-card, .info-card, .step').forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(30px)';
        observer.observe(card);
    });
}

//store

function buyItem(itemName) {
    const ownerNumber = "6281234567890"; // ganti nomor owner lu

    const text = `Halo kak, saya ingin membeli *${itemName}*.\nMohon info lebih lanjut 🙏`;

    const waURL = `https://wa.me/${ownerNumber}?text=${encodeURIComponent(text)}`;

    window.open(waURL, "_blank");
}

// Initialize mobile menu
function initializeMobileMenu() {
    const menuToggle = document.querySelector('.menu-toggle');
    const navMenu = document.querySelector('.nav-menu');
    
    menuToggle.addEventListener('click', (e) => {
        e.stopPropagation();
        navMenu.classList.toggle('active');
        
        // Update icon
        const icon = menuToggle.querySelector('i');
        if (navMenu.classList.contains('active')) {
            icon.className = 'fas fa-times';
        } else {
            icon.className = 'fas fa-bars';
        }
    });
    
    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
        if (!menuToggle.contains(e.target) && !navMenu.contains(e.target)) {
            navMenu.classList.remove('active');
            menuToggle.querySelector('i').className = 'fas fa-bars';
        }
    });
    
    // Close menu when clicking a link
    navMenu.addEventListener('click', (e) => {
        if (e.target.tagName === 'A') {
            navMenu.classList.remove('active');
            menuToggle.querySelector('i').className = 'fas fa-bars';
        }
    });
}

// Initialize social media toggle
function initializeSocialToggle() {
    const socialToggle = document.querySelector('.social-toggle');
    const socialCircles = document.querySelectorAll('.social-circle');
    let isExpanded = true;
    
    socialToggle.addEventListener('click', (e) => {
        e.stopPropagation();
        isExpanded = !isExpanded;
        
        if (isExpanded) {
            socialToggle.innerHTML = '<i class="fas fa-plus"></i>';
            socialCircles.forEach(circle => {
                circle.style.display = 'flex';
                circle.style.animation = 'popIn 0.5s forwards';
            });
        } else {
            socialToggle.innerHTML = '<i class="fas fa-share-alt"></i>';
            socialCircles.forEach(circle => {
                circle.style.animation = 'none';
                circle.style.transform = 'scale(0)';
                circle.style.opacity = '0';
                setTimeout(() => {
                    circle.style.display = 'none';
                }, 300);
            });
        }
    });
    
    // Hide on scroll
    let lastScroll = 0;
    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;
        
        if (currentScroll > lastScroll && currentScroll > 100) {
            // Scrolling down
            socialToggle.style.transform = 'translateY(100px)';
        } else {
            // Scrolling up
            socialToggle.style.transform = 'translateY(0)';
        }
        
        lastScroll = currentScroll;
    });
    
    // Add click effect to social circles
    socialCircles.forEach(circle => {
        circle.addEventListener('click', function(e) {
            // Add click animation
            this.style.transform = 'scale(0.9)';
            setTimeout(() => {
                this.style.transform = 'scale(1)';
            }, 200);
        });
    });
}

// Add scroll event for active nav link
function initializeActiveNav() {
    window.addEventListener('scroll', function() {
        const sections = document.querySelectorAll('section');
        const navLinks = document.querySelectorAll('.nav-link');
        
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            
            if (scrollY >= (sectionTop - 150)) {
                current = section.getAttribute('id');
            }
        });
        
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    });
}

// === AI Chat Feature ===
const chatBubble = document.getElementById('chatBubble');
const chatBox = document.getElementById('chatBox');
const closeChat = document.getElementById('closeChat');
const chatBody = document.getElementById('chatBody');
const chatInput = document.getElementById('chatInput');
const sendBtn = document.getElementById('sendBtn');

const CUSTOM_PROMPT = `Kamu adalah "TahuAI", asisten virtual resmi dari server Minecraft TahuNiverse.

Sifat & Cara Bicara:
- Ramah, santai, gaul, tapi tetap sopan.
- Gaya bahasa ala anak Minecraft + sedikit tongkrongan.
- Hindari bahasa formal berlebihan.
- Jangan toxic, jangan sarkas, jangan ngata-ngatain.
- Balasan harus jelas, ringkas, dan membantu.

Peran Utama:
- Menjawab pertanyaan tentang server TahuNiverse.
- Jika user tanya hal beda topik, tetap jawab dengan sopan tapi kembali ke topik Minecraft.
- Boleh bercanda ringan asal tetap relevan.
- Beri info server jika ditanya (IP, rules, fitur, cara join, dll).

Informasi Server (jangan sebut ini sebagai daftar, tapi pakai untuk menjawab):
- Nama server: TahuNiverse (Tahu Isi Network).
- IP: play.tahuniverse.my.id
- Port: 19155
- Fitur: economy, land protection, custom plugin, anti cheat, daily rewards.
- Komunitas ramah + aktif.
- Versi Bedrock & Java (jika ada).

Cara Jawab:
- Bila menjelaskan sesuatu, jawab 1–3 kalimat saja biar gak terlalu panjang.
- Kalau user mengucapkan salam, jawab sopan tapi tetap santai.
- Kalau user minta tutorial, jelaskan step by step singkat.

Aturan Tambahan:
- Jangan pernah menyebut bahwa kamu berasal dari API luar.
- Selalu sebut diri kamu sebagai AI resmi server.
- Fokus: bantu, arahkan, jelasin, dan maintain mood positif.

Mulai jawab dengan karakter ini.`;

chatBubble.onclick = () => chatBox.style.display = 'flex';
closeChat.onclick = () => chatBox.style.display = 'none';

sendBtn.onclick = sendMessage;
chatInput.addEventListener('keypress', e => {
  if (e.key === 'Enter') sendMessage();
});

async function sendMessage() {
  const userText = chatInput.value.trim();
  if (!userText) return;
  appendMessage('user', userText);
  chatInput.value = '';

  const typing = document.createElement('div');
  typing.className = 'typing-indicator';
  typing.textContent = 'TahuAI sedang mengetik...';
  chatBody.appendChild(typing);
  chatBody.scrollTop = chatBody.scrollHeight;

  try {
    const query = encodeURIComponent(`${CUSTOM_PROMPT}\nUser: ${userText}`);
    const res = await fetch(`https://api.yupra.my.id/api/ai/gpt5?text=${query}`);
    const data = await res.json();

    typing.remove();
    appendMessage('bot', data.result || 'Maaf, aku gak bisa jawab sekarang 😅');
  } catch (err) {
    typing.remove();
    appendMessage('bot', 'Terjadi kesalahan koneksi 🥲');
  }
}

function appendMessage(sender, text) {
  const div = document.createElement('div');
  div.className = sender === 'user' ? 'user-message' : 'bot-message';
  div.textContent = text;
  chatBody.appendChild(div);
  chatBody.scrollTop = chatBody.scrollHeight;
}




// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    initializeConfig();
    initializeSmoothScroll();
    initializeScrollAnimations();
    initializeMobileMenu();
    initializeSocialToggle();
    initializeActiveNav();
    
    // Check server status
    checkServerStatus();
    setInterval(checkServerStatus, 60000); // Check every minute
});

// Add progress bar for scroll
window.addEventListener('scroll', function() {
    const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
    const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const scrolled = (winScroll / height) * 100;
    
    // Create or update progress bar
    let progressBar = document.querySelector('.progress-bar');
    if (!progressBar) {
        progressBar = document.createElement('div');
        progressBar.className = 'progress-bar';
        document.body.appendChild(progressBar);
    }
    progressBar.style.width = scrolled + '%';
});