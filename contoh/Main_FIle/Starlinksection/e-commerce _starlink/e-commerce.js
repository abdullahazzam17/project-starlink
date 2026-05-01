// ========== E-COMMERCE LOGIC — TRIAKSES ==========

let cart = [];

// --- PRICING DATABASE ---
const hardwarePrices = {
    'kit-residential': {
        'standard-residential': 4720000,
        'standard-lite': 5900,
        'mini-residential': 3800000,
        'mini-lite': 5200000
    },
    'kit-enterprise': {
        'standard-residential': 28500000,
        'standard-lite': 25000000,
        'mini-residential': 22000000,
        'mini-lite': 20000000
    },
    'kit-mobility': {
        'standard-residential': 32000000,
        'standard-lite': 28000000,
        'mini-residential': 26000000,
        'mini-lite': 24000000
    },
    'kit-maritime': {
        'standard-residential': 95000000,
        'standard-lite': 85000000,
        'mini-residential': 80000000,
        'mini-lite': 75000000
    }
};

// --- CORE FUNCTIONS ---

function toggleCart() {
    const sidebar = document.getElementById('cartSidebar');
    const overlay = document.getElementById('cartOverlay');
    sidebar.classList.toggle('open');
    overlay.classList.toggle('open');
}

// Update hardware card price based on selection
function updateHardwareCard(cardId) {
    const card = document.getElementById(cardId);
    const size = card.querySelector('[data-option="size"] .chip.active').dataset.val;
    const plan = card.querySelector('[data-option="plan"] .chip.active').dataset.val;

    const key = `${size}-${plan}`;
    const price = hardwarePrices[cardId][key];

    const priceEl = document.getElementById(`price-${cardId}`);
    priceEl.textContent = formatRupiah(price);
}

// Add variable hardware to cart
function addHardwareToCart(cardId) {
    const card = document.getElementById(cardId);
    const size = card.querySelector('[data-option="size"] .chip.active').textContent;
    const plan = card.querySelector('[data-option="plan"] .chip.active').textContent;
    const baseName = card.querySelector('h4').textContent;

    const finalName = `${baseName} (${size}, ${plan})`;
    const sizeVal = card.querySelector('[data-option="size"] .chip.active').dataset.val;
    const planVal = card.querySelector('[data-option="plan"] .chip.active').dataset.val;
    const price = hardwarePrices[cardId][`${sizeVal}-${planVal}`];

    addToCart(finalName, price);
}

// Global add to cart
function addToCart(name, price) {
    const existing = cart.find(i => i.name === name);
    if (existing) {
        existing.qty += 1;
    } else {
        cart.push({ name, price, qty: 1 });
    }
    renderCart();
    // Open cart
    document.getElementById('cartSidebar').classList.add('open');
    document.getElementById('cartOverlay').classList.add('open');
}

function removeFromCart(index) {
    cart.splice(index, 1);
    renderCart();
}

function renderCart() {
    const count = cart.reduce((s, i) => s + i.qty, 0);
    const total = cart.reduce((s, i) => s + i.price * i.qty, 0);
    const countEl = document.getElementById('cartCount');
    const itemsEl = document.getElementById('cartItems');
    const footerEl = document.getElementById('cartFooter');
    const totalEl = document.getElementById('cartTotal');

    countEl.textContent = count;
    if (count > 0) countEl.classList.add('visible');
    else countEl.classList.remove('visible');

    if (cart.length === 0) {
        itemsEl.innerHTML = `
            <div class="cart-empty">
                <i data-lucide="shopping-bag"></i>
                <p>Keranjang masih kosong</p>
            </div>`;
        footerEl.style.display = 'none';
    } else {
        itemsEl.innerHTML = cart.map((item, idx) => `
            <div class="cart-item">
                <div class="cart-item-info">
                    <h5>${item.name}${item.qty > 1 ? ' x' + item.qty : ''}</h5>
                    <span>${formatRupiah(item.price * item.qty)}</span>
                </div>
                <button class="cart-item-remove" onclick="removeFromCart(${idx})">
                    <i data-lucide="x"></i>
                </button>
            </div>`).join('');
        footerEl.style.display = 'flex';
        totalEl.textContent = formatRupiah(total);
    }
    lucide.createIcons();
}

function formatRupiah(num) {
    if (num === 0) return 'Gratis';
    return 'Rp ' + num.toLocaleString('id-ID');
}

// --- INITIALIZATION ---
document.addEventListener('DOMContentLoaded', () => {
    lucide.createIcons();

    // Chip toggle logic
    document.querySelectorAll('.chip').forEach(chip => {
        chip.addEventListener('click', function () {
            const parent = this.parentElement;
            parent.querySelectorAll('.chip').forEach(c => c.classList.remove('active'));
            this.classList.add('active');
        });
    });

    // Reveal animation
    const observer = new IntersectionObserver(
        (entries) => entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); }),
        { threshold: 0.1 }
    );
    document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
});
