// ============================================================
//  SIMIN MEHR — Main Application
// ============================================================

// ---------- Mock Data ----------
const mockProducts = [
    { id: 1, title: 'سینی وسایل عبادت', category: 'religious', price: 450000, oldPrice: 540000, rating: 4.8, badge: 'bestseller', stock: 12, image: 'جانماز.png', description: 'سینی لوکس و دست‌ساز از جنس سنگ مصنوعی با تزئینات میناکاری و نقوش اصیل ایرانی. مناسب برای قرار دادن تسبیح، جانماز، عطر و سایر وسایل عبادت.' },
    { id: 2, title: 'جعبه نگهداری تسبیح', category: 'religious', price: 280000, rating: 4.5, stock: 25, image: 'جعبه.png', description: 'جعبه‌ای زیبا و مقاوم برای نگهداری تسبیح و انگشتر. طراحی آن با الهام از هنر اسلیمی و استفاده از سنگ مصنوعی با کیفیت بالا.' },
    { id: 3, title: 'ست هدیه معنوی', category: 'religious', price: 650000, oldPrice: 780000, rating: 4.9, badge: 'discount', stock: 5, image: 'ست معنوی.png', description: 'یک ست کامل و شیک شامل جعبه، سینی و جای تسبیح. گزینه‌ای عالی برای هدیه دادن در مناسبت‌های مذهبی و ملی.' },
    { id: 4, title: 'سینی کاشی ایرانی', category: 'iranian', price: 520000, rating: 4.7, badge: 'new', stock: 18, image: 'کاشی.png', description: 'سینی با طراحی کاشی‌های اصیل اصفهان. ترکیبی از رنگ‌های آبی و فیروزه‌ای که زیبایی هر میزی را چند برابر می‌کند.' },
    { id: 5, title: 'گلدان‌های باغ ایرانی', category: 'iranian', price: 890000, rating: 4.6, stock: 8, image: 'گلدان‌های باغ ایرانی.png', description: 'ست سه‌تایی گلدان با کنده‌کاری‌های هنرمندانه. الهام گرفته از باغ‌های ایرانی و معماری دوره صفویه.' },
    { id: 6, title: 'ست میناگونه', category: 'iranian', price: 750000, oldPrice: 850000, rating: 4.8, badge: 'discount', stock: 10, image: 'ست میناگونه.png', description: 'ست پذیرایی شامل کاسه و لیوان‌های تزئینی با نقاشی‌های مینا. جلوگیری از هنر اصیل ایرانی در خانه شما.' },
    { id: 7, title: 'ست چای و خرما', category: 'lifestyle', price: 380000, rating: 4.4, stock: 30, image: 'chaykhorma.png', description: 'ست چای‌خوری با ظرافت خاص. شامل قوری، فنجان‌ها و ظرف خرما با نقوش هندسی و اسلیمی.' },
    { id: 8, title: 'ست شب‌نشینی دونفره', category: 'lifestyle', price: 1200000, rating: 5.0, badge: 'bestseller', stock: 3, image: 'shab.png', description: 'ست کامل پذیرایی شامل سینی، فنجان‌ها و ظرف تنقلات. مناسب برای دورهمی‌های گرم و صمیمی.' }
];

function fetchProductsAPI() {
    return new Promise((resolve) => setTimeout(() => resolve(mockProducts), 900));
}

// ---------- State ----------
let allProducts = [];
let cart = JSON.parse(localStorage.getItem('siminMehrCart')) || [];
let wishlist = JSON.parse(localStorage.getItem('siminMehrWishlist')) || [];
let currentUser = JSON.parse(localStorage.getItem('siminMehrUser')) || null;
let reviews = JSON.parse(localStorage.getItem('siminMehrReviews')) || {};
let orders = JSON.parse(localStorage.getItem('siminMehrOrders')) || [];
let subscribers = JSON.parse(localStorage.getItem('siminMehrSubscribers')) || [];
let selectedReviewRating = 5;

// ---------- Seed reviews ----------
if (Object.keys(reviews).length === 0) {
    reviews = {
        1: [
            { name: 'فاطمه احمدی', rating: 5, text: 'فوق‌العاده زیبا و باکیفیت بود. حتماً بازم خرید می‌کنم.', date: '۱۴۰۳/۰۸/۱۲' },
            { name: 'علی رضایی', rating: 4, text: 'کیفیت خوب، بسته‌بندی مرتب. فقط کمی گرون بود.', date: '۱۴۰۳/۰۸/۰۵' }
        ],
        4: [
            { name: 'مریم حسینی', rating: 5, text: 'نقش‌های کاشی خیلی زیباست، دقیقاً مثل عکس.', date: '۱۴۰۳/۰۷/۲۰' }
        ],
        7: [
            { name: 'زهرا کریمی', rating: 4, text: 'ست چای خیلی شیکه، برای هدیه عالیه.', date: '۱۴۰۳/۰۷/۱۵' }
        ]
    };
    localStorage.setItem('siminMehrReviews', JSON.stringify(reviews));
}

// ============================================================
//  UTILITIES
// ============================================================
function showToast(message, type = 'success') {
    let container = document.getElementById('toast-container');
    if (!container) {
        container = document.createElement('div');
        container.id = 'toast-container';
        container.className = 'toast-container';
        document.body.appendChild(container);
    }
    const icons = { success: '✓', error: '✕', info: 'ℹ' };
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.innerHTML = `<span class="toast-icon">${icons[type] || 'ℹ'}</span><span>${message}</span>`;
    container.appendChild(toast);
    requestAnimationFrame(() => toast.classList.add('show'));
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => toast.remove(), 350);
    }, 3200);
}

function getCategoryName(cat) {
    return { religious: 'مذهبی و معنوی', iranian: 'هنر ایرانی', lifestyle: 'سبک زندگی' }[cat] || 'سایر';
}

function formatPrice(n) { return n.toLocaleString('fa-IR') + ' تومان'; }

function renderStars(rating) {
    const r = Math.round(rating);
    let s = '<span class="stars">';
    for (let i = 1; i <= 5; i++) s += `<span class="star ${i <= r ? 'filled' : ''}">★</span>`;
    return s + '</span>';
}

function getAverageRating(id) {
    const p = mockProducts.find(x => x.id === id);
    return p ? p.rating : 0;
}
function getReviewsCount(id) { return (reviews[id] || []).length; }

function getAvatarColor(name) {
    const colors = ['#1a5c8a', '#20b2aa', '#c5a059', '#e74c3c', '#9b59b6', '#f39c12'];
    let h = 0;
    for (let i = 0; i < name.length; i++) h = name.charCodeAt(i) + ((h << 5) - h);
    return colors[Math.abs(h) % colors.length];
}

// ============================================================
//  WISHLIST
// ============================================================
function toggleWishlist(id) {
    const idx = wishlist.indexOf(id);
    if (idx > -1) {
        wishlist.splice(idx, 1);
        showToast('از علاقه‌مندی‌ها حذف شد', 'info');
    } else {
        wishlist.push(id);
        showToast('به علاقه‌مندی‌ها اضافه شد ♥', 'success');
    }
    localStorage.setItem('siminMehrWishlist', JSON.stringify(wishlist));
    updateWishlistBadge();
    // refresh current view
    if (document.getElementById('products-grid') && allProducts.length) renderProducts(allProducts);
    if (document.getElementById('product-detail')) initProductPage();
}

function updateWishlistBadge() {
    const b = document.getElementById('wishlist-badge');
    if (b) {
        b.textContent = wishlist.length;
        b.classList.toggle('hidden', wishlist.length === 0);
    }
}

function isInWishlist(id) { return wishlist.includes(id); }

// ============================================================
//  CART
// ============================================================
function saveCart() { localStorage.setItem('siminMehrCart', JSON.stringify(cart)); }

function addToCart(productId) {
    const product = mockProducts.find(p => p.id === productId);
    if (!product) return;
    const existing = cart.find(i => i.id === productId);
    if (existing) existing.quantity += 1;
    else cart.push({ ...product, quantity: 1 });
    saveCart();
    updateCartUI();
    showToast(`«${product.title}» به سبد اضافه شد`, 'success');
}

function removeFromCart(productId) {
    cart = cart.filter(i => i.id !== productId);
    saveCart(); updateCartUI();
    showToast('از سبد خرید حذف شد', 'info');
}

function updateCartQuantity(productId, delta) {
    const item = cart.find(i => i.id === productId);
    if (!item) return;
    item.quantity += delta;
    if (item.quantity <= 0) return removeFromCart(productId);
    saveCart(); updateCartUI();
}

function updateCartUI() {
    const badge = document.getElementById('cart-badge');
    const container = document.getElementById('cart-items');
    const totalEl = document.getElementById('cart-total');
    const footer = document.getElementById('cart-footer');
    const emptyMsg = document.getElementById('cart-empty');

    const totalItems = cart.reduce((s, i) => s + i.quantity, 0);
    if (badge) {
        badge.textContent = totalItems;
        badge.classList.toggle('hidden', totalItems === 0);
    }

    if (!container) return;
    container.innerHTML = '';
    if (cart.length === 0) {
        container.innerHTML = `
            <div class="cart-empty">
                <div class="cart-empty-icon">🛒</div>
                <p>سبد خرید شما خالی است</p>
                <p style="font-size:.85rem;color:var(--text-light)">می‌توانید از محصولات ما دیدن کنید</p>
            </div>`;
        if (totalEl) totalEl.textContent = '۰';
        if (footer) footer.style.display = 'none';
        return;
    }
    if (footer) footer.style.display = 'flex';

    let total = 0;
    cart.forEach(item => {
        total += item.price * item.quantity;
        const div = document.createElement('div');
        div.className = 'cart-item';
        div.innerHTML = `
            <img src="${item.image}" alt="${item.title}" class="cart-item-img">
            <div class="cart-item-body">
                <h4 class="cart-item-title">${item.title}</h4>
                <p class="cart-item-price">${formatPrice(item.price)}</p>
                <div class="qty-control">
                    <button onclick="updateCartQuantity(${item.id}, 1)" aria-label="افزایش">+</button>
                    <span>${item.quantity}</span>
                    <button onclick="updateCartQuantity(${item.id}, -1)" aria-label="کاهش">−</button>
                </div>
            </div>
            <button class="remove-item" onclick="removeFromCart(${item.id})" title="حذف">🗑️</button>
        `;
        container.appendChild(div);
    });
    if (totalEl) totalEl.textContent = total.toLocaleString('fa-IR');
}

// ============================================================
//  DASHBOARD
// ============================================================
function renderDashboard() {
    const el = document.getElementById('dashboard-content');
    if (!el) return;

    if (currentUser) {
        const userOrders = orders.filter(o => o.email === currentUser.email);
        const orderHtml = userOrders.length === 0
            ? `<p style="text-align:center;color:#888;padding:15px 0">هنوز سفارشی ثبت نکرده‌اید.</p>`
            : userOrders.slice().reverse().map(o => `
                <div class="order-item">
                    <div class="order-head">
                        <strong>سفارش #${o.code}</strong>
                        <span class="order-status">${o.status}</span>
                    </div>
                    <p class="order-meta">${o.date} • ${formatPrice(o.total)}</p>
                    <p class="order-items">${o.items.map(i => i.title).join(' + ')}</p>
                </div>`).join('');

        el.innerHTML = `
            <div class="user-profile">
                <div class="user-avatar">${currentUser.name.charAt(0)}</div>
                <div>
                    <h3>${currentUser.name}</h3>
                    <p style="color:var(--text-light);font-size:.9rem">${currentUser.email}</p>
                </div>
            </div>
            <div class="order-history">
                <h4 style="margin-bottom:12px">📦 تاریخچه سفارشات</h4>
                ${orderHtml}
            </div>
            <button class="btn-outline" style="width:100%;margin-top:16px" onclick="logoutUser()">خروج از حساب</button>
        `;
    } else {
        el.innerHTML = `
            <form class="dashboard-form" id="login-form">
                <p style="margin-bottom:12px;color:var(--text-light);font-size:.9rem">برای مشاهده سفارشات و ادامه خرید وارد شوید.</p>
                <div class="form-group">
                    <label>نام و نام خانوادگی</label>
                    <input type="text" id="login-name" placeholder="مثلاً سارا احمدی" required>
                </div>
                <div class="form-group">
                    <label>ایمیل</label>
                    <input type="email" id="login-email" placeholder="example@mail.com" required>
                </div>
                <button type="submit" class="btn-primary">ورود / ثبت‌نام</button>
            </form>`;
        document.getElementById('login-form').addEventListener('submit', (e) => {
            e.preventDefault();
            currentUser = {
                name: document.getElementById('login-name').value.trim(),
                email: document.getElementById('login-email').value.trim()
            };
            localStorage.setItem('siminMehrUser', JSON.stringify(currentUser));
            renderDashboard(); updateUserBadge();
            showToast(`خوش آمدید، ${currentUser.name}!`, 'success');
        });
    }
}

function logoutUser() {
    currentUser = null;
    localStorage.removeItem('siminMehrUser');
    renderDashboard(); updateUserBadge();
    showToast('از حساب خود خارج شدید', 'info');
}

function updateUserBadge() {
    const b = document.getElementById('user-badge');
    if (b) b.classList.toggle('hidden', !currentUser);
}

// ============================================================
//  PRODUCTS
// ============================================================
const badgeMap = { bestseller: '🔥 پرفروش', new: '✨ جدید', discount: '🎁 تخفیف' };

function renderProducts(products) {
    const grid = document.getElementById('products-grid');
    if (!grid) return;
    grid.innerHTML = '';
    if (products.length === 0) {
        grid.innerHTML = `
            <div class="no-results">
                <div style="font-size:3rem">🔍</div>
                <p>محصولی با این مشخصات پیدا نشد.</p>
            </div>`;
        return;
    }
    products.forEach(product => {
        const avg = getAverageRating(product.id);
        const cnt = getReviewsCount(product.id);
        const badge = product.badge ? `<span class="product-badge badge-${product.badge}">${badgeMap[product.badge]}</span>` : '';
        const wish = isInWishlist(product.id) ? '♥' : '♡';
        const wishClass = isInWishlist(product.id) ? 'active' : '';
        const oldPrice = product.oldPrice ? `<span class="old-price">${formatPrice(product.oldPrice)}</span>` : '';
        const stockClass = product.stock <= 5 ? 'low' : '';
        const stockText = product.stock <= 5 ? `تنها ${product.stock} عدد باقی‌مانده` : 'موجود در انبار';

        const card = document.createElement('div');
        card.className = 'product-card';
        card.innerHTML = `
            ${badge}
            <button class="wishlist-btn ${wishClass}" onclick="event.preventDefault();event.stopPropagation();toggleWishlist(${product.id})" title="علاقه‌مندی">${wish}</button>
            <a href="product.html?id=${product.id}" class="product-img-wrap">
                <img src="${product.image}" alt="${product.title}" class="product-image">
            </a>
            <div class="product-info">
                <h3 class="product-title"><a href="product.html?id=${product.id}">${product.title}</a></h3>
                <div class="product-meta">
                    <span class="product-category">${getCategoryName(product.category)}</span>
                    <span class="product-rating">${renderStars(avg)} <b>${avg.toLocaleString('fa-IR')}</b> <small>(${cnt.toLocaleString('fa-IR')})</small></span>
                </div>
                <div class="product-price-row">
                    <span class="product-price">${formatPrice(product.price)}</span>
                    ${oldPrice}
                </div>
                <p class="stock-indicator ${stockClass}">${stockText}</p>
                <div class="card-actions">
                    <a href="product.html?id=${product.id}" class="btn-outline">جزئیات</a>
                    <button class="btn-primary" onclick="addToCart(${product.id})">افزودن 🛒</button>
                </div>
            </div>`;
        grid.appendChild(card);
    });
}

function renderSkeleton() {
    const grid = document.getElementById('products-grid');
    if (!grid) return;
    grid.innerHTML = '';
    for (let i = 0; i < 8; i++) {
        const sk = document.createElement('div');
        sk.className = 'product-card skeleton';
        sk.innerHTML = `
            <div class="skeleton-img"></div>
            <div class="product-info">
                <div class="skeleton-line" style="width:75%"></div>
                <div class="skeleton-line" style="width:45%"></div>
                <div class="skeleton-line" style="width:60%"></div>
                <div class="skeleton-line" style="width:40%"></div>
            </div>`;
        grid.appendChild(sk);
    }
}

function filterProducts() {
    const searchInput = document.getElementById('search-input');
    const categoryFilter = document.getElementById('category-filter');
    const sortFilter = document.getElementById('sort-filter');
    if (!allProducts.length) return;

    const term = (searchInput?.value || '').trim().toLowerCase();
    const cat = categoryFilter?.value || 'all';
    const sort = sortFilter?.value || 'default';

    let filtered = allProducts.filter(p =>
        p.title.toLowerCase().includes(term) &&
        (cat === 'all' || p.category === cat)
    );

    if (sort === 'price-low') filtered.sort((a, b) => a.price - b.price);
    else if (sort === 'price-high') filtered.sort((a, b) => b.price - a.price);
    else if (sort === 'rating') filtered.sort((a, b) => b.rating - a.rating);

    renderProducts(filtered);
}

async function loadProducts() {
    const loadingEl = document.getElementById('loading');
    const errorEl = document.getElementById('error-message');
    const grid = document.getElementById('products-grid');
    try {
        if (loadingEl) loadingEl.classList.remove('hidden');
        if (grid) grid.classList.add('hidden');
        renderSkeleton();
        grid.classList.remove('hidden');

        allProducts = await fetchProductsAPI();
        if (loadingEl) loadingEl.classList.add('hidden');
        renderProducts(allProducts);

        document.getElementById('search-input')?.addEventListener('input', filterProducts);
        document.getElementById('category-filter')?.addEventListener('change', filterProducts);
        document.getElementById('sort-filter')?.addEventListener('change', filterProducts);
    } catch (err) {
        if (loadingEl) loadingEl.classList.add('hidden');
        if (errorEl) {
            errorEl.classList.remove('hidden');
            errorEl.textContent = 'متأسفانه در دریافت اطلاعات خطایی رخ داد. لطفاً دوباره تلاش کنید.';
        }
    }
}

// ============================================================
//  PRODUCT PAGE (detail + reviews + related)
// ============================================================
function initProductPage() {
    
    const container = document.getElementById('product-detail');
    if (!container) return;

    // 👇 این سه خط رو اضافه کن — مدیریت لودینگ
    document.getElementById('product-loading')?.classList.add('hidden');
    container.classList.remove('hidden');
    document.getElementById('product-loading')?.classList.add('hidden');
    container.classList.remove('hidden');
    // ... بقیه کد قبلی‌ات بدون تغییر
    const urlParams = new URLSearchParams(window.location.search);
    const productId = parseInt(urlParams.get('id'));
    const product = mockProducts.find(p => p.id === productId);
    
    

    if (!product) {
        container.innerHTML = '<h2 style="padding:40px;text-align:center">محصول یافت نشد!</h2>';
        document.getElementById('reviews-container').innerHTML = '';
        document.getElementById('related-grid').innerHTML = '';
        return;
    }

    const avg = getAverageRating(product.id);
    const cnt = getReviewsCount(product.id);
    const badge = product.badge ? `<span class="product-badge badge-${product.badge}">${badgeMap[product.badge]}</span>` : '';
    const oldPrice = product.oldPrice ? `<span class="old-price">${formatPrice(product.oldPrice)}</span>` : '';
    const discount = product.oldPrice ? Math.round((1 - product.price / product.oldPrice) * 100) : 0;
    const wish = isInWishlist(product.id) ? '♥' : '♡';
    const wishClass = isInWishlist(product.id) ? 'active' : '';

    container.innerHTML = `
        <div class="breadcrumb">
            <a href="index.html">خانه</a> / <a href="index.html">${getCategoryName(product.category)}</a> / <span>${product.title}</span>
        </div>
        <div class="product-detail-layout">
            <div class="product-detail-image">
                ${badge}
                <img src="${product.image}" alt="${product.title}">
            </div>
            <div class="product-detail-info">
                <h1>${product.title}</h1>
                <div class="product-meta" style="margin:10px 0 18px">
                    <span class="product-category">${getCategoryName(product.category)}</span>
                    <span class="product-rating">${renderStars(avg)} <b>${avg.toLocaleString('fa-IR')}</b> <small>(${cnt.toLocaleString('fa-IR')} نظر)</small></span>
                </div>
                <div class="price-block">
                    <span class="product-price-large">${formatPrice(product.price)}</span>
                    ${oldPrice}
                    ${discount ? `<span class="discount-badge">${discount.toLocaleString('fa-IR')}٪ تخفیف</span>` : ''}
                </div>
                <p class="stock-indicator ${product.stock <= 5 ? 'low' : ''}">
                    ${product.stock <= 5 ? `⚠️ تنها ${product.stock} عدد باقی‌مانده` : '✓ موجود در انبار'}
                </p>
                <div class="product-description">
                    <h3>توضیحات محصول</h3>
                    <p>${product.description}</p>
                </div>
                <div class="product-actions">
                    <button class="btn-primary add-to-cart-btn" onclick="addToCart(${product.id})">افزودن به سبد خرید 🛒</button>
                    <button class="btn-outline wishlist-detail-btn ${wishClass}" onclick="toggleWishlist(${product.id})">${wish} علاقه‌مندی</button>
                </div>
                <div class="product-features">
                    <div>🚚 ارسال سریع</div>
                    <div>🛡️ ضمانت اصالت</div>
                    <div>↩️ ۷ روز مهلت بازگشت</div>
                </div>
            </div>
        </div>`;

    renderReviewsSection(product);
    renderRelated(product);
    updateCartUI();
    updateWishlistBadge();
}

function renderReviewsSection(product) {
    const container = document.getElementById('reviews-container');
    if (!container) return;
    const productReviews = reviews[product.id] || [];
    const avg = getAverageRating(product.id);

    // Star distribution
    const dist = [0, 0, 0, 0, 0];
    productReviews.forEach(r => dist[r.rating - 1]++);
    const totalRev = productReviews.length || 1;
    const barsHtml = [5, 4, 3, 2, 1].map(n => {
        const c = dist[n - 1];
        const p = Math.round((c / totalRev) * 100);
        return `
            <div class="rating-bar">
                <span class="rating-bar-label">${n.toLocaleString('fa-IR')} ★</span>
                <div class="rating-bar-track"><div class="rating-bar-fill" style="width:${p}%"></div></div>
                <span class="rating-bar-count">${c.toLocaleString('fa-IR')}</span>
            </div>`;
    }).join('');

    const listHtml = productReviews.length === 0
        ? '<p style="text-align:center;color:#888;padding:20px 0">هنوز نظری ثبت نشده. اولین نفر باشید!</p>'
        : productReviews.slice().reverse().map(r => `
            <div class="review-item">
                <div class="review-head">
                    <div class="review-avatar" style="background:${getAvatarColor(r.name)}">${r.name.charAt(0)}</div>
                    <div>
                        <strong>${r.name}</strong>
                        <div class="review-stars">${renderStars(r.rating)}</div>
                    </div>
                    <span class="review-date">${r.date}</span>
                </div>
                <p class="review-text">${r.text}</p>
            </div>`).join('');

    container.innerHTML = `
        <h2 class="section-title">نظرات کاربران <span class="section-sub">(${productReviews.length.toLocaleString('fa-IR')} نظر)</span></h2>
        <div class="reviews-layout">
            <div class="reviews-summary">
                <div class="summary-score">
                    <div class="big-score">${avg.toLocaleString('fa-IR')}</div>
                    ${renderStars(avg)}
                    <p>از ${productReviews.length.toLocaleString('fa-IR')} نظر</p>
                </div>
                <div class="rating-bars">${barsHtml}</div>
            </div>
            <div class="reviews-list-wrap">
                <div class="reviews-list">${listHtml}</div>
                <form class="review-form" id="review-form">
                    <h3>نظر خود را بنویسید</h3>
                    <div class="rating-input">
                        <span>امتیاز شما:</span>
                        <div class="star-selector" id="star-selector">
                            ${[1,2,3,4,5].map(i => `<span data-value="${i}" class="active">★</span>`).join('')}
                        </div>
                    </div>
                    <div class="form-group">
                        <input type="text" id="review-name" placeholder="نام شما" value="${currentUser ? currentUser.name : ''}" required>
                    </div>
                    <div class="form-group">
                        <textarea id="review-text" placeholder="تجربه خود از این محصول را بنویسید..." rows="3" required></textarea>
                    </div>
                    <button type="submit" class="btn-primary">ثبت نظر</button>
                </form>
            </div>
        </div>`;

    // Wire up star selector
    selectedReviewRating = 5;
    const selector = document.getElementById('star-selector');
    const stars = selector.querySelectorAll('span');
    const paint = (val) => stars.forEach((s, i) => s.classList.toggle('active', i < val));
    stars.forEach(star => {
        star.addEventListener('mouseenter', () => paint(parseInt(star.dataset.value)));
        star.addEventListener('click', () => {
            selectedReviewRating = parseInt(star.dataset.value);
            paint(selectedReviewRating);
        });
    });
    selector.addEventListener('mouseleave', () => paint(selectedReviewRating));

    // Wire up form
    document.getElementById('review-form').addEventListener('submit', (e) => {
        e.preventDefault();
        const name = document.getElementById('review-name').value.trim();
        const text = document.getElementById('review-text').value.trim();
        if (!name || !text) return showToast('لطفاً همه فیلدها را پر کنید', 'error');
        addReview(product.id, name, selectedReviewRating, text);
    });
}

function addReview(productId, name, rating, text) {
    if (!reviews[productId]) reviews[productId] = [];
    const today = new Date();
    const dateStr = today.toLocaleDateString('fa-IR');
    reviews[productId].push({ name, rating, text, date: dateStr });
    localStorage.setItem('siminMehrReviews', JSON.stringify(reviews));
    showToast('نظر شما با موفقیت ثبت شد. ممنون! 🌟', 'success');
    initProductPage();
}

function renderRelated(product) {
    const grid = document.getElementById('related-grid');
    if (!grid) return;
    const related = mockProducts.filter(p => p.id !== product.id && p.category === product.category).slice(0, 3);
    grid.innerHTML = related.map(p => `
        <div class="product-card">
            <a href="product.html?id=${p.id}" class="product-img-wrap">
                <img src="${p.image}" alt="${p.title}" class="product-image">
            </a>
            <div class="product-info">
                <h3 class="product-title"><a href="product.html?id=${p.id}">${p.title}</a></h3>
                <div class="product-price-row"><span class="product-price">${formatPrice(p.price)}</span></div>
                <a href="product.html?id=${p.id}" class="btn-outline">مشاهده</a>
            </div>
        </div>`).join('');
}

// ============================================================
//  CHECKOUT
// ============================================================
function openCheckout() {
    if (cart.length === 0) return showToast('سبد خرید شما خالی است!', 'error');
    if (!currentUser) {
        closeModal('cart-modal');
        document.getElementById('dashboard-modal').classList.remove('hidden');
        renderDashboard();
        return showToast('برای ثبت سفارش ابتدا وارد شوید.', 'info');
    }
    closeModal('cart-modal');
    renderCheckoutSummary();
    document.getElementById('checkout-name').value = currentUser.name;
    document.getElementById('checkout-modal').classList.remove('hidden');
}

function renderCheckoutSummary() {
    const el = document.getElementById('checkout-summary');
    if (!el) return;
    const total = cart.reduce((s, i) => s + i.price * i.quantity, 0);
    el.innerHTML = `
        <h4>خلاصه سفارش</h4>
        ${cart.map(i => `
            <div class="summary-row">
                <span>${i.title} × ${i.quantity}</span>
                <span>${formatPrice(i.price * i.quantity)}</span>
            </div>`).join('')}
        <div class="summary-row summary-total">
            <span>مبلغ قابل پرداخت</span>
            <span>${formatPrice(total)}</span>
        </div>`;
}

function handleCheckout(e) {
    e.preventDefault();
    const total = cart.reduce((s, i) => s + i.price * i.quantity, 0);
    const order = {
        code: Math.floor(1000 + Math.random() * 9000),
        email: currentUser.email,
        name: document.getElementById('checkout-name').value,
        phone: document.getElementById('checkout-phone').value,
        address: document.getElementById('checkout-address').value,
        payment: document.querySelector('input[name="payment"]:checked').value,
        items: cart.map(i => ({ title: i.title, qty: i.quantity, price: i.price })),
        total,
        status: 'در حال پردازش',
        date: new Date().toLocaleDateString('fa-IR')
    };
    orders.push(order);
    localStorage.setItem('siminMehrOrders', JSON.stringify(orders));
    cart = [];
    saveCart(); updateCartUI();
    closeModal('checkout-modal');
    showToast(`سفارش #${order.code} با موفقیت ثبت شد! 🎉`, 'success');
    e.target.reset();
}

// ============================================================
//  NEWSLETTER
// ============================================================
function handleNewsletter(e) {
    e.preventDefault();
    const emailInput = document.getElementById('email');
    const messageEl = document.getElementById('form-message');
    const email = emailInput.value.trim();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email)) {
        messageEl.className = 'form-message error';
        messageEl.textContent = '⚠️ لطفاً یک ایمیل معتبر وارد کنید.';
        showToast('ایمیل وارد شده معتبر نیست.', 'error');
        emailInput.focus();
        return;
    }
    if (subscribers.includes(email)) {
        messageEl.className = 'form-message info';
        messageEl.textContent = 'ℹ️ این ایمیل قبلاً در خبرنامه ثبت شده است.';
        showToast('شما قبلاً عضو شده‌اید!', 'info');
        return;
    }
    subscribers.push(email);
    localStorage.setItem('siminMehrSubscribers', JSON.stringify(subscribers));
    messageEl.className = 'form-message success';
    messageEl.innerHTML = `🎉 عضویت شما با موفقیت انجام شد!<br><span style="font-size:.85rem">کد تخفیف ۱۰٪ اولین خرید: <strong style="color:var(--gold)">WELCOME10</strong></span>`;
    showToast('به خبرنامه سیمین مهر خوش آمدید! 🎉', 'success');
    e.target.reset();
    updateSubscriberCount();
}

function updateSubscriberCount() {
    const el = document.getElementById('subscriber-count');
    if (el) el.textContent = `${subscribers.length.toLocaleString('fa-IR')}+ نفر عضو خبرنامه ما هستند`;
}

// ============================================================
//  MODAL
// ============================================================
function closeModal(id) {
    const m = document.getElementById(id);
    if (m) m.classList.add('hidden');
}

// ============================================================
//  INIT
// ============================================================
function initApp() {
    updateCartUI();
    updateUserBadge();
    updateWishlistBadge();
    renderDashboard();
    updateSubscriberCount();

    // Close modals on outside click
    document.querySelectorAll('.modal-overlay').forEach(modal => {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) closeModal(modal.id);
        });
    });

    // Header buttons
    document.getElementById('cart-btn')?.addEventListener('click', () => {
        document.getElementById('cart-modal').classList.remove('hidden');
    });
    document.getElementById('cart-btn-page')?.addEventListener('click', () => {
        document.getElementById('cart-modal').classList.remove('hidden');
    });
    document.getElementById('dashboard-btn')?.addEventListener('click', () => {
        document.getElementById('dashboard-modal').classList.remove('hidden');
        renderDashboard();
    });
    document.getElementById('wishlist-btn')?.addEventListener('click', () => {
        if (wishlist.length === 0) return showToast('لیست علاقه‌مندی‌های شما خالی است', 'info');
        // Show wishlist in a toast-like summary
        showToast(`${wishlist.length} محصول در علاقه‌مندی‌ها ♥`, 'info');
    });

    // Checkout
    document.getElementById('checkout-btn')?.addEventListener('click', openCheckout);
    document.getElementById('checkout-form')?.addEventListener('submit', handleCheckout);

    // Newsletter
    const newsletterForm = document.getElementById('newsletter-form');
    newsletterForm?.addEventListener('submit', handleNewsletter);

    // Product listing page
    if (document.getElementById('products-grid')) loadProducts();

    // Product detail page
    if (document.getElementById('product-detail')) initProductPage();
}

document.addEventListener('DOMContentLoaded', initApp);
// ============================================================
//  MAGAZINE / BLOG MODULE
// ============================================================

const mockArticles = [
    {
        id: 1,
        slug: 'isfahan-tiles',
        title: 'هنر کاشی‌کاری اصفهان؛ میراثی به قدمت تاریخ',
        category: 'iranian',
        coverGradient: 'linear-gradient(135deg, #1a5c8a 0%, #20b2aa 100%)',
        coverIcon: '🕌',
        excerpt: 'کاشی‌های فیروزه‌ای اصفهان شهره‌ی عالمند. از مسجد شاه تا خانه‌های قدیمی، هر کاشی داستانی از هنر و ایمان را روایت می‌کند.',
        author: 'سارا احمدی',
        authorBio: 'پژوهشگر هنر اسلامی و عاشق کاشی‌های فیروزه‌ای اصفهان',
        date: '۱۴۰۳/۰۸/۱۵',
        readTime: 6,
        views: 1240,
        tags: ['کاشی‌کاری', 'اصفهان', 'هنر اسلامی', 'معماری'],
        featured: true,
        content: [
            { type: 'lead', text: 'اصفهان را به‌حق «نصف جهان» می‌نامند، و بخش بزرگی از این شکوه مدیون کاشی‌های فیروزه‌ای و لاجوردی‌ای است که بر دیواره‌های مساجد، پل‌ها و خانه‌های تاریخی می‌درخشند. این هنر، زبانی است که نسل‌ها با آن با آسمان سخن گفته‌اند.' },
            { type: 'h2', text: 'تاریخچه‌ای از سلجوقیان تا صفویان' },
            { type: 'p', text: 'کاشی‌کاری در ایران ریشه‌ای هزارساله دارد. از آجرهای لعاب‌دار دوره سلجوقی گرفته تا شاهکارهای عصر صفوی در مسجد شاه و مسجد شیخ لطف‌الله، هر دوره سهمی در تکامل این هنر داشته است. اما بی‌شک اوج شکوفایی آن در اصفهان صفوی رقم خورد؛ جایی که هنرمندان با ترکیب رنگ، هندسه و نور، فضاهایی خلق کردند که امروز هم الهام‌بخش معماران جهانند.' },
            { type: 'h2', text: 'رنگ‌ها و معانی نهفته' },
            { type: 'p', text: 'در معماری ایرانی هر رنگ معنایی دارد: فیروزه‌ای نماد آسمان و آرامش، لاجوردی نشانه‌ی عرفان و عمق، سفید کنایه‌از پاکی و زرین نماد نور و الوهیت. هنرمند کاشی‌کار مانند شاعری است که با این رنگ‌ها شعر می‌سراید؛ شعری بی‌کلام که با چشم خوانده می‌شود.' },
            { type: 'quote', text: '«معماران صفوی با کاشی، شعر می‌سرودند بر دیوارهای شهر.»' },
            { type: 'h2', text: 'احیای هنر در خانه‌های امروز' },
            { type: 'p', text: 'امروزه هنرمندان اصفهانی همان نقش‌های کهن را بر سینی، گلدان و اشیای تزئینی می‌آورند. با انتخاب یک سینی کاشی یا گلدان منقوش، تنها یک شیء زیبا نمی‌خرید؛ بخشی از میراث فرهنگی ایران را به خانه‌ی خود می‌برید. این پیوند میان سنت و زندگی روزمره، همان چیزی است که هنر ایرانی را زنده نگه داشته است.' }
        ]
    },
    {
        id: 2,
        slug: 'minakari-art',
        title: 'میناکاری؛ نقاشی آتش بر فلز',
        category: 'iranian',
        coverGradient: 'linear-gradient(135deg, #20b2aa 0%, #c5a059 100%)',
        coverIcon: '🎨',
        excerpt: 'میناکاری هنر ذوب رنگ بر فلز است. سفری به دنیای درخشان ظروف میناکاری اصفهان و رازهای ساخت آن‌ها.',
        author: 'رضا کریمی',
        authorBio: 'هنرمند میناکار و مدرس هنرهای سنتی',
        date: '۱۴۰۳/۰۸/۱۰',
        readTime: 5,
        views: 890,
        tags: ['میناکاری', 'فلزکاری', 'صنایع دستی', 'اصفهان'],
        featured: false,
        content: [
            { type: 'lead', text: 'میناکاری، هنری است که در آن آتش و رنگ به هم می‌رسند تا زیبایی جاودانه بیافرینند. ظروف میناکاری اصفهان، با رنگ‌های آبی و فیروزه‌ای درخشانشان، از شناخته‌شده‌ترین صنایع دستی ایران در جهان هستند.' },
            { type: 'h2', text: 'میناکاری چیست؟' },
            { type: 'p', text: 'میناکاری عبارت است از نقاشی و لعاب‌کاری روی فلز؛ معمولاً مس، نقره یا طلا. هنرمند ابتدا سطح فلز را آماده می‌کند، سپس لایه‌های لعاب سفید را پخت می‌دهد و در نهایت با رنگ‌های معدنی، نقوش ظریف را ترسیم می‌کند. هر لایه باید جداگانه در کوره با دمای بالا پخته شود تا رنگ‌ها به فلز بچسبند و درخشان شوند.' },
            { type: 'h2', text: 'تاریخچه‌ی کوتاه' },
            { type: 'p', text: 'ریشه‌های میناکاری به دوران ساسانی بازمی‌گردد، اما اوج آن در دوره صفویه در اصفهان بوده است. در دوران قاجار و پهلوی این هنر دوباره احیا شد و امروز اصفهان همچنان مرکز اصلی آن در ایران است.' },
            { type: 'h2', text: 'نگهداری ظروف میناکاری' },
            { type: 'p', text: 'ظروف میناکاری نباید در ماشین ظرفشویی شسته شوند و از ضربه و حرارت زیاد دوری کنند. برای تمیز کردن، یک پارچه نرم و مرطوب کافی است. با کمی مراقبت، این ظروف زیبا سال‌ها درخشش خود را حفظ می‌کنند.' }
        ]
    },
    {
        id: 3,
        slug: 'spiritual-gift-guide',
        title: 'راهنمای انتخاب هدیه معنوی مناسب',
        category: 'religious',
        coverGradient: 'linear-gradient(135deg, #1a5c8a 0%, #2a7cb0 100%)',
        coverIcon: '🎁',
        excerpt: 'هدیه معنوی تنها یک شیء نیست؛ پیامی است از دل. در این مقاله راهنمای انتخاب هدیه‌ای مناسب برای مناسبت‌های مذهبی و ملی می‌خوانید.',
        author: 'فاطمه رضایی',
        authorBio: 'کارشناس هدیه و طراح بسته‌بندی',
        date: '۱۴۰۳/۰۸/۰۵',
        readTime: 4,
        views: 1560,
        tags: ['هدیه', 'مناسبت مذهبی', 'ست معنوی', 'راهنمای خرید'],
        featured: false,
        content: [
            { type: 'lead', text: 'هدیه دادن، زبان عشق و احترام است. اما وقتی این هدیه معنایی مذهبی یا فرهنگی داشته باشد، لایه‌های عمیق‌تری پیدا می‌کند. انتخاب هدیه معنوی مناسب، نیازمند شناخت مخاطب و مناسبت است.' },
            { type: 'h2', text: 'مناسبت را بشناسید' },
            { type: 'p', text: 'هدیه برای ماه رمضان، نوروز، تولد امامان یا جشن‌های مذهبی، هر یک ویژگی خود را دارد. برای ماه رمضان یک ست سجاده و جانماز مناسب است، و برای نوروز یک ست هدیه تزئینی با نقوش ایرانی.' },
            { type: 'h2', text: 'جنس و کیفیت مهم است' },
            { type: 'p', text: 'هدیه معنوی باید ماندگار باشد. سنگ مصنوعی باکیفیت، چوب طبیعی، شیشه یا فلزات اصیل انتخاب‌های مناسبی هستند. از خرید اقلام ارزان و بی‌کیفیت که ممکن است ارزش معنوی هدیه را کم کنند، بپرهیزید.' },
            { type: 'h2', text: 'بسته‌بندی، نیمی از هدیه' },
            { type: 'p', text: 'بسته‌بندی مناسب، حس ارزشمند بودن هدیه را دوچندان می‌کند. استفاده از پارچه‌های سنتی، کارت دست‌نویس با جمله‌ای از بزرگان یا شعر فارسی، تجربه‌ی دریافت هدیه را به یاد ماندنی می‌کند.' }
        ]
    },
    {
        id: 4,
        slug: 'persian-garden',
        title: 'باغ ایرانی؛ بهشت گمشده در کویر',
        category: 'iranian',
        coverGradient: 'linear-gradient(135deg, #27ae60 0%, #20b2aa 100%)',
        coverIcon: '🌿',
        excerpt: 'باغ ایرانی تجلی بهشت بر زمین است. با ایده‌ی چهارباغ، آب و گیاه، ایرانیان در دل کویر بهشت ساخته‌اند.',
        author: 'حسین موسوی',
        authorBio: 'معمار منظر و پژوهشگر باغ ایرانی',
        date: '۱۴۰۳/۰۷/۲۵',
        readTime: 7,
        views: 720,
        tags: ['باغ ایرانی', 'معماری منظر', 'چهارباغ', 'طبیعت'],
        featured: false,
        content: [
            { type: 'lead', text: 'تصور کنید در دل کویری خشک، ناگهان دیواری بلند را رد می‌کنید و به جهانی پر از آب، درخت و گل وارد می‌شوید. این جادوی باغ ایرانی است؛ مفهومی که فراتر از یک باغ ساده، فلسفه‌ای از زندگی و جهان‌بینی است.' },
            { type: 'h2', text: 'چهارباغ؛ الگوی ازلی' },
            { type: 'p', text: 'الگوی چهارباغ، یکی از کهن‌ترین و ماندگارترین ایده‌های معماری منظر ایرانی است. باغ به چهار بخش تقسیم می‌شود که با دو محور اصلی متقاطع از هم جدا شده‌اند. این الگو نماد چهار رود بهشتی است و بازتابی از نظم کیهانی در زمین.' },
            { type: 'h2', text: 'عناصر چهارگانه' },
            { type: 'p', text: 'آب، گیاه، معماری و نور؛ چهار عنصری که باغ ایرانی را می‌سازند. آب در حوض‌ها و جوی‌های کاشی‌کاری‌شده جریان دارد، درختان سایه می‌گسترند، کوشک در مرکز می‌نشیند و نور از میان شاخه‌ها می‌تابد. هر عنصر جایگاه و معنای خود را دارد.' },
            { type: 'h2', text: 'باغ‌های ماندگار' },
            { type: 'p', text: 'باغ فین کاشان، باغ ارم شیراز، باغ شاهزاده ماهان و باغ دولت‌آباد یزد، از مشهورترین نمونه‌های باغ ایرانی هستند. هر یک با ویژگی‌های اقلیمی و تاریخی خود، نسخه‌ای بی‌همتا از این هنر را ارائه می‌دهند.' },
            { type: 'h2', text: 'باغ ایرانی در خانه شما' },
            { type: 'p', text: 'شاید نتوان در آپارتمان باغ ایرانی ساخت، اما می‌توان روح آن را به خانه آورد. گلدان‌های منقوش با الهام از باغ، سینی‌های تزئینی با نقوش گل و مرغ، و اشیایی که یادآور این بهشت زمینی هستند، می‌توانند فضایی آرام و شاعرانه بسازند.' }
        ]
    },
    {
        id: 5,
        slug: 'tea-ritual',
        title: 'آیین چای در ایران؛ از سمرقند تا اصفهان',
        category: 'lifestyle',
        coverGradient: 'linear-gradient(135deg, #c5a059 0%, #e8a000 100%)',
        coverIcon: '☕',
        excerpt: 'چای در ایران فقط نوشیدنی نیست؛ آیینی است از مهمان‌نوازی. سفر کوتاهی به فرهنگ چای و استکان‌های کمرباریک.',
        author: 'مریم حسینی',
        authorBio: 'نویسنده و علاقه‌مند به فرهنگ عامه ایران',
        date: '۱۴۰۳/۰۷/۱۸',
        readTime: 5,
        views: 2100,
        tags: ['چای', 'مهمان‌نوازی', 'فرهنگ', 'سبک زندگی'],
        featured: false,
        content: [
            { type: 'lead', text: 'در هر خانه ایرانی، قوری چای همیشه آماده است. چای نه فقط نوشیدنی، بلکه زبانی برای گفتن «خوش آمدی»، «حالت چطوره؟» و «دلم برات تنگ شده» است.' },
            { type: 'h2', text: 'تاریخچه‌ی چای در ایران' },
            { type: 'p', text: 'چای در قرن نوزدهم از طریق جاده ابریشم وارد ایران شد و به سرعت جای قهوه را گرفت. اولین مزارع چای در لاهیجان و سپس در مناطق دیگر شمال ایران کاشته شد. امروزه چای سیاه ایرانی، بخشی جدانشدنی از فرهنگ غذایی ماست.' },
            { type: 'h2', text: 'سماور، قلب آیین چای' },
            { type: 'p', text: 'سماور، نماد مهمان‌نوازی ایرانی است. در دورهمی‌های زمستانی، سماور همیشه روشن است و بوی زغال و چای فضا را پر می‌کند. سماورهای قدیمی، گاهی ارثی از مادربزرگ‌ها هستند و خاطره‌ای خانوادگی به شمار می‌روند.' },
            { type: 'h2', text: 'استکان کمرباریک' },
            { type: 'p', text: 'استکان کمرباریک، طراحی هوشمندانه‌ای دارد: نیمه‌ی بالایی چای خنک‌تر و نیمه‌ی پایینی گرم‌تر است. با گرفتن لبه‌ی آن، می‌توان چای داغ را بدون سوختن دست نوشید. این طراحی، نمونه‌ای از هنر ایرانی در خدمت زندگی روزمره است.' }
        ]
    },
    {
        id: 6,
        slug: 'artificial-stone',
        title: 'سنگ مصنوعی؛ تلفیق هنر و مدرنیته',
        category: 'lifestyle',
        coverGradient: 'linear-gradient(135deg, #7f8c8d 0%, #2c3e50 100%)',
        coverIcon: '💎',
        excerpt: 'سنگ مصنوعی چیست و چرا هنرمندان صنایع دستی به آن روی آورده‌اند؟ نگاهی به این متریال جذاب و کاربردهایش.',
        author: 'امیر تهرانی',
        authorBio: 'طراح محصول و پژوهشگر متریال‌های نو',
        date: '۱۴۰۳/۰۷/۰۸',
        readTime: 4,
        views: 560,
        tags: ['سنگ مصنوعی', 'طراحی', 'صنایع دستی', 'متریال'],
        featured: false,
        content: [
            { type: 'lead', text: 'سنگ مصنوعی، ترکیبی از پودر سنگ طبیعی با رزین‌های پلیمری است که امکان ساخت اشیای دقیق، سبک و مقاوم را فراهم می‌کند. این متریال در سال‌های اخیر به یکی از محبوب‌ترین انتخاب‌های هنرمندان صنایع دستی تبدیل شده است.' },
            { type: 'h2', text: 'مزایای سنگ مصنوعی' },
            { type: 'p', text: 'این متریال نسبت به سنگ طبیعی سبک‌تر، ارزان‌تر و قابل قالب‌گیری است. امکان ایجاد طرح‌های پیچیده و ظریف وجود دارد که در سنگ طبیعی غیرممکن یا بسیار پرهزینه است. همچنین مقاومت بالایی در برابر رطوبت و حرارت دارد.' },
            { type: 'h2', text: 'نگهداری آسان' },
            { type: 'p', text: 'سنگ مصنوعی نیازی به مراقبت ویژه ندارد. برای تمیز کردن، یک پارچه نرم و مرطوب کافی است. از مواد شوینده‌ی اسیدی و ساینده پرهیز کنید تا سطح براق آن حفظ شود.' },
            { type: 'h2', text: 'آینده‌ای درخشان' },
            { type: 'p', text: 'با پیشرفت تکنولوژی، سنگ مصنوعی هر روز شبیه‌تر به سنگ طبیعی و گاهی حتی زیباتر از آن می‌شود. این متریال، پلی است میان هنر سنتی و طراحی مدرن؛ پلی که امکان خلق اشیای زیبا با قیمت مناسب را برای همه فراهم می‌کند.' }
        ]
    }
];

function getArticleCategoryName(cat) {
    return { iranian: 'هنر ایرانی', religious: 'مذهبی و معنوی', lifestyle: 'سبک زندگی' }[cat] || 'عمومی';
}

let currentArticleFilter = 'all';

// ---------- Magazine listing ----------
function initMagazinePage() {
    const filters = document.getElementById('article-filters');
    if (filters) {
        filters.querySelectorAll('.filter-chip').forEach(chip => {
            chip.addEventListener('click', () => {
                filters.querySelectorAll('.filter-chip').forEach(c => c.classList.remove('active'));
                chip.classList.add('active');
                currentArticleFilter = chip.dataset.cat;
                renderMagazineArticles();
            });
        });
    }
    renderMagazineArticles();
    updateCartUI();
    updateWishlistBadge();
    wireCartButtons();
}

function renderMagazineArticles() {
    const grid = document.getElementById('articles-grid');
    const featuredWrap = document.getElementById('featured-article-wrap');
    if (!grid || !featuredWrap) return;

    let list = mockArticles.slice();
    if (currentArticleFilter !== 'all') {
        list = list.filter(a => a.category === currentArticleFilter);
    }

    // Featured
    const featured = list.find(a => a.featured);
    if (featured && currentArticleFilter === 'all') {
        featuredWrap.innerHTML = `
            <a href="article.html?slug=${featured.slug}" class="featured-article">
                <div class="featured-cover" style="background:${featured.coverGradient}">
                    <span class="featured-cover-icon">${featured.coverIcon}</span>
                    <span class="featured-badge">مقاله ویژه</span>
                </div>
                <div class="featured-body">
                    <span class="article-cat-pill">${getArticleCategoryName(featured.category)}</span>
                    <h2>${featured.title}</h2>
                    <p>${featured.excerpt}</p>
                    <div class="article-meta">
                        <span>✍️ ${featured.author}</span>
                        <span>📅 ${featured.date}</span>
                        <span>⏱️ ${featured.readTime} دقیقه</span>
                    </div>
                    <span class="featured-cta">خواندن مقاله ←</span>
                </div>
            </a>`;
    } else {
        featuredWrap.innerHTML = '';
    }

    // Grid (exclude featured in "all" view)
    const rest = (currentArticleFilter === 'all' && featured)
        ? list.filter(a => a.id !== featured.id)
        : list;

    if (rest.length === 0) {
        grid.innerHTML = '<p style="grid-column:1/-1;text-align:center;color:var(--text-light);padding:40px">مقاله‌ای در این دسته یافت نشد.</p>';
        return;
    }

    grid.innerHTML = rest.map(a => `
        <a href="article.html?slug=${a.slug}" class="article-card">
            <div class="article-cover" style="background:${a.coverGradient}">
                <span class="article-cover-icon">${a.coverIcon}</span>
            </div>
            <div class="article-card-body">
                <span class="article-cat-pill">${getArticleCategoryName(a.category)}</span>
                <h3 class="article-card-title">${a.title}</h3>
                <p class="article-card-excerpt">${a.excerpt}</p>
                <div class="article-meta">
                    <span>${a.author}</span>
                    <span>⏱️ ${a.readTime} دقیقه</span>
                </div>
            </div>
        </a>`).join('');
}

// ---------- Article detail ----------
function initArticlePage() {
    const loadingEl = document.getElementById('article-loading');
    const container = document.getElementById('article-detail');
    if (!container) return;

    try {
        const params = new URLSearchParams(window.location.search);
        const slug = params.get('slug');
        const idStr = params.get('id');
        let article = null;

        if (slug) article = mockArticles.find(a => a.slug === slug);
        if (!article && idStr) article = mockArticles.find(a => a.id === parseInt(idStr, 10));

        if (loadingEl) loadingEl.classList.add('hidden');
        container.classList.remove('hidden');

        if (!article) {
            container.innerHTML = `
                <div class="empty-state">
                    <div style="font-size:3rem">📄</div>
                    <h2>مقاله یافت نشد</h2>
                    <p>لینک ممکن است اشتباه باشد یا مقاله حذف شده باشد.</p>
                    <a href="magazine.html" class="btn-primary" style="display:inline-block;padding:12px 26px;border-radius:10px;color:#fff;background:var(--secondary-color);text-decoration:none;font-weight:600">بازگشت به مجله</a>
                </div>`;
            return;
        }

        renderArticle(article);
        renderRelatedArticles(article);
        updateCartUI();
        wireCartButtons();
    } catch (err) {
        console.error('[SiminMehr] initArticlePage failed:', err);
        if (loadingEl) loadingEl.classList.add('hidden');
        container.classList.remove('hidden');
        container.innerHTML = `<div class="error-message">خطا در بارگذاری مقاله: ${err.message}</div>`;
    }
}

function renderArticle(article) {
    const container = document.getElementById('article-detail');
    document.title = article.title + ' | مجله سیمین مهر';

    const contentHtml = article.content.map(block => {
        if (block.type === 'h2') return `<h2>${block.text}</h2>`;
        if (block.type === 'lead') return `<p class="article-lead">${block.text}</p>`;
        if (block.type === 'quote') return `<blockquote class="article-quote">${block.text}</blockquote>`;
        return `<p>${block.text}</p>`;
    }).join('');

    container.innerHTML = `
        <div class="breadcrumb">
            <a href="index.html">خانه</a> /
            <a href="magazine.html">مجله</a> /
            <span>${article.title}</span>
        </div>
        <header class="article-header">
            <span class="article-cat-pill">${getArticleCategoryName(article.category)}</span>
            <h1>${article.title}</h1>
            <div class="article-meta article-meta-lg">
                <span>✍️ ${article.author}</span>
                <span>📅 ${article.date}</span>
                <span>⏱️ ${article.readTime} دقیقه مطالعه</span>
                <span>👁️ ${article.views.toLocaleString('fa-IR')} بازدید</span>
            </div>
        </header>
        <div class="article-hero-cover" style="background:${article.coverGradient}">
            <span class="article-hero-icon">${article.coverIcon}</span>
        </div>
        <div class="article-content">${contentHtml}</div>
        <div class="article-tags">
            <span style="color:var(--text-light);font-size:.85rem">برچسب‌ها:</span>
            ${article.tags.map(t => `<span class="tag-chip">#${t}</span>`).join('')}
        </div>
        <div class="article-share">
            <span>اشتراک‌گذاری:</span>
            <button class="share-btn" onclick="shareArticle('copy')">🔗 کپی لینک</button>
            <button class="share-btn" onclick="shareArticle('twitter')">🐦 توییتر</button>
            <button class="share-btn" onclick="shareArticle('telegram')">✈️ تلگرام</button>
        </div>
        <div class="author-box">
            <div class="author-avatar" style="background:${getAvatarColor(article.author)}">${article.author.charAt(0)}</div>
            <div>
                <strong>${article.author}</strong>
                <p>${article.authorBio}</p>
            </div>
        </div>`;
}

function renderRelatedArticles(article) {
    const section = document.getElementById('related-articles-section');
    if (!section) return;
    const related = mockArticles.filter(a => a.id !== article.id && a.category === article.category).slice(0, 3);
    if (related.length === 0) { section.innerHTML = ''; return; }

    section.innerHTML = `
        <h2 class="section-title">مقالات مرتبط</h2>
        <div class="articles-grid">
            ${related.map(a => `
                <a href="article.html?slug=${a.slug}" class="article-card">
                    <div class="article-cover" style="background:${a.coverGradient}">
                        <span class="article-cover-icon">${a.coverIcon}</span>
                    </div>
                    <div class="article-card-body">
                        <span class="article-cat-pill">${getArticleCategoryName(a.category)}</span>
                        <h3 class="article-card-title">${a.title}</h3>
                        <p class="article-card-excerpt">${a.excerpt}</p>
                        <div class="article-meta">
                            <span>${a.author}</span>
                            <span>⏱️ ${a.readTime} دقیقه</span>
                        </div>
                    </div>
                </a>`).join('')}
        </div>`;
}

function shareArticle(platform) {
    const url = window.location.href;
    const title = document.title;
    if (platform === 'copy') {
        navigator.clipboard?.writeText(url).then(() => showToast('لینک کپی شد ✓', 'success'))
            .catch(() => showToast('کپی لینک ممکن نشد', 'error'));
    } else if (platform === 'twitter') {
        window.open(`https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`, '_blank');
    } else if (platform === 'telegram') {
        window.open(`https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`, '_blank');
    }
}

// ---------- Homepage preview ----------
function initHomeArticlePreview() {
    const grid = document.getElementById('home-articles-grid');
    if (!grid) return;
    const latest = mockArticles.slice(0, 3);
    grid.innerHTML = latest.map(a => `
        <a href="article.html?slug=${a.slug}" class="article-card">
            <div class="article-cover" style="background:${a.coverGradient}">
                <span class="article-cover-icon">${a.coverIcon}</span>
            </div>
            <div class="article-card-body">
                <span class="article-cat-pill">${getArticleCategoryName(a.category)}</span>
                <h3 class="article-card-title">${a.title}</h3>
                <p class="article-card-excerpt">${a.excerpt}</p>
                <div class="article-meta">
                    <span>${a.author}</span>
                    <span>⏱️ ${a.readTime} دقیقه</span>
                </div>
            </div>
        </a>`).join('');
}

// shared helper: wire cart-button open + checkout in magazine pages
function wireCartButtons() {
    const cartBtn = document.getElementById('cart-btn-page');
    if (cartBtn && !cartBtn.dataset.wired) {
        cartBtn.dataset.wired = '1';
        cartBtn.addEventListener('click', () => {
            document.getElementById('cart-modal')?.classList.remove('hidden');
        });
    }
    const checkoutBtn = document.getElementById('checkout-btn');
    if (checkoutBtn && !checkoutBtn.dataset.wired) {
        checkoutBtn.dataset.wired = '1';
        checkoutBtn.addEventListener('click', () => {
            if (typeof openCheckout === 'function') openCheckout();
        });
    }
    document.querySelectorAll('.modal-overlay').forEach(modal => {
        if (modal.dataset.wired) return;
        modal.dataset.wired = '1';
        modal.addEventListener('click', (e) => {
            if (e.target === modal) closeModal(modal.id);
        });
    });
}

// Boot magazine/article/home-preview
document.addEventListener('DOMContentLoaded', () => {
    if (document.getElementById('articles-grid')) initMagazinePage();
    if (document.getElementById('article-detail')) initArticlePage();
    if (document.getElementById('home-articles-grid')) initHomeArticlePreview();
});
