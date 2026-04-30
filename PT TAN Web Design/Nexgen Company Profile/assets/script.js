// Animasi Muncul Saat Scroll (Intersection Observer)
const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
        if (entry.isIntersecting) {
            entry.target.classList.add('active');
        }
    });
}, { threshold: 0.1 });

document.querySelectorAll('.reveal').forEach((el) => observer.observe(el));

// Efek Navbar Mengecil Saat Scroll
window.addEventListener('scroll', () => {
    const nav = document.querySelector('nav');
    if (window.scrollY > 50) {
        nav.style.padding = '15px 10%';
        nav.style.background = 'rgba(5, 5, 5, 0.8)';
    } else {
        nav.style.padding = '30px 10%';
        nav.style.background = 'transparent';
    }
});

// Animasi Counter Angka
const counters = document.querySelectorAll('.counter');

const startCounter = (target) => {
    let start = 0;
    const end = +target.getAttribute('data-target');
    const duration = 3000; // Durasi animasi (3 detik), makin gede makin lama
    const startTime = performance.now();

    const updateCount = (currentTime) => {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);

        // Fungsi "Ease Out" biar makin deket angka akhir makin pelan (Mewah!)
        const easeOut = 1 - Math.pow(1 - progress, 3); 
        
        const currentCount = Math.floor(easeOut * end);
        target.innerText = currentCount + (end > 0 ? "+" : "");

        if (progress < 1) {
            requestAnimationFrame(updateCount);
        } else {
            target.innerText = end + "+";
        }
    };

    requestAnimationFrame(updateCount);
};

// Intersection Observer tetep sama (buat trigger pas di-scroll)
const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if(entry.isIntersecting) {
            startCounter(entry.target);
            counterObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.5 });

counters.forEach(counter => counterObserver.observe(counter));