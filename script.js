// ===== Products Data - Louis Vuitton Set =====
const products = [
  {
    id: 1,
    name: "تجميعة لويس فيتون",
    nameFr: "Coffret Louis Vuitton",
    brand: "Louis Vuitton",
    price: 4500,
    oldPrice: 5500,
    color: "linear-gradient(160deg, #1a1a1a 0%, #2a2a2a 100%)",
    badge: "الأكثر مبيعاً",
    isSet: true,
    description: "تجميعة فاخرة من 5 عطور Louis Vuitton الأيقونية في صندوق واحد أنيق: L'Immensité, Imagination, Symphony, Afternoon Swim و Pacific Chill. مثالية كهدية أو للاستخدام الشخصي.",
    descriptionFr: "Coffret luxueux de 5 parfums iconiques Louis Vuitton dans un écrin élégant : L'Immensité, Imagination, Symphony, Afternoon Swim et Pacific Chill. Parfait comme cadeau.",
    notes: ["L'Immensité", "Imagination", "Symphony", "Afternoon Swim", "Pacific Chill"]
  }
];

// ===== State =====
let cart = JSON.parse(localStorage.getItem('asPerfumeCart')) || [];

// ===== DOM Elements =====
const productsGrid = document.getElementById('productsGrid');
const cartBtn = document.getElementById('cartBtn');
const cartSidebar = document.getElementById('cartSidebar');
const cartOverlay = document.getElementById('cartOverlay');
const closeCart = document.getElementById('closeCart');
const cartItems = document.getElementById('cartItems');
const cartCount = document.getElementById('cartCount');
const cartTotal = document.getElementById('cartTotal');
const checkoutBtn = document.getElementById('checkoutBtn');
const modalOverlay = document.getElementById('modalOverlay');
const modalContent = document.getElementById('modalContent');
const modalClose = document.getElementById('modalClose');
const toast = document.getElementById('toast');
const menuToggle = document.getElementById('menuToggle');
const mobileNav = document.getElementById('mobileNav');
const contactForm = document.getElementById('contactForm');

// ===== Render Products =====
function renderProducts() {
  productsGrid.innerHTML = products.map(p => `
    <div class="product-card ${p.isSet ? 'product-set' : ''}" data-id="${p.id}">
      <div class="product-image" style="background: ${p.color}">
        ${p.isSet 
          ? `<img src="products-set.jpg" alt="${p.nameFr}" class="set-image">` 
          : `<div class="bottle-visual">
               <div class="bottle-shape"></div>
               <span class="bottle-label">${p.nameFr.split(' ')[0]}</span>
             </div>`
        }
        ${p.badge ? `<span class="product-badge">${p.badge}</span>` : ''}
      </div>
      <div class="product-info">
        <span class="product-brand">${p.brand}</span>
        <h3 class="product-name">${p.name}</h3>
        <p class="product-name-fr">${p.nameFr}</p>
        <div class="product-price">
          <div>
            ${p.oldPrice ? `<span class="old-price">${p.oldPrice.toLocaleString()} د.ج</span>` : ''}
            <span class="price">${p.price.toLocaleString()} د.ج</span>
          </div>
        </div>
        <button class="add-to-cart" onclick="event.stopPropagation(); addToCart(${p.id})">
          🛒 🛒 أضف للسلة · Ajouter au panier
        </button>
      </div>
    </div>
  `).join('');

  document.querySelectorAll('.product-card').forEach(card => {
    card.addEventListener('click', () => {
      const id = parseInt(card.dataset.id);
      openModal(id);
    });
  });
}

// ===== Cart Functions =====
function saveCart() {
  localStorage.setItem('asPerfumeCart', JSON.stringify(cart));
  updateCartUI();
}

function addToCart(id) {
  const product = products.find(p => p.id === id);
  const existing = cart.find(item => item.id === id);

  if (existing) {
    existing.qty += 1;
  } else {
    cart.push({ 
      id: product.id, 
      name: product.name, 
      nameFr: product.nameFr, 
      price: product.price, 
      color: product.color,
      isSet: product.isSet || false,
      qty: 1 
    });
  }

  saveCart();
  showToast(`تمت الإضافة · Ajouté : ${product.name}`);
}

function removeFromCart(id) {
  cart = cart.filter(item => item.id !== id);
  saveCart();
}

function updateQty(id, change) {
  const item = cart.find(i => i.id === id);
  if (!item) return;

  item.qty += change;
  if (item.qty <= 0) {
    removeFromCart(id);
  } else {
    saveCart();
  }
}

function updateCartUI() {
  // Count
  const totalItems = cart.reduce((sum, item) => sum + item.qty, 0);
  cartCount.textContent = totalItems;
  cartCount.style.display = totalItems > 0 ? 'flex' : 'none';

  // Items
  if (cart.length === 0) {
    cartItems.innerHTML = '<p class="cart-empty">السلة فارغة · Panier vide</p>';
  } else {
    cartItems.innerHTML = cart.map(item => `
      <div class="cart-item">
        <div class="cart-item-img" style="background: ${item.color || '#1a1a1a'}"></div>
        <div class="cart-item-info">
          <div class="cart-item-name">${item.name}</div>
          <div class="cart-item-price">${item.price.toLocaleString()} د.ج</div>
          <div class="cart-item-qty">
            <button class="qty-btn" onclick="updateQty(${item.id}, -1)">−</button>
            <span>${item.qty}</span>
            <button class="qty-btn" onclick="updateQty(${item.id}, 1)">+</button>
          </div>
          <button class="remove-item" onclick="removeFromCart(${item.id})">حذف · Supprimer</button>
        </div>
      </div>
    `).join('');
  }

  // Total
  const total = cart.reduce((sum, item) => sum + (item.price * item.qty), 0);
  cartTotal.textContent = `${total.toLocaleString()} د.ج`;
}

function openCart() {
  cartSidebar.classList.add('open');
  cartOverlay.classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeCartSidebar() {
  cartSidebar.classList.remove('open');
  cartOverlay.classList.remove('open');
  document.body.style.overflow = '';
}

// ===== Modal =====
function openModal(id) {
  const p = products.find(prod => prod.id === id);
  if (!p) return;

  modalContent.innerHTML = `
    <div class="modal-body">
      <div class="modal-image" style="background: ${p.color}">
        ${p.isSet 
          ? `<img src="products-set.jpg" alt="${p.nameFr}" class="modal-set-image">` 
          : `<div class="bottle-visual large">
               <div class="bottle-shape"></div>
               <span class="bottle-label">${p.nameFr}</span>
             </div>`
        }
      </div>
      <div class="modal-details">
        <span class="product-brand">${p.brand}</span>
        <h2>${p.name}</h2>
        <p class="fr-name">${p.nameFr}</p>
        <div class="modal-price">
          ${p.oldPrice ? `<span class="old-price">${p.oldPrice.toLocaleString()} د.ج</span> ` : ''}
          ${p.price.toLocaleString()} د.ج
        </div>
        <p class="modal-desc">${p.description}<br><br><em>${p.descriptionFr}</em></p>
        <div class="modal-notes">
          <h4>النوتات العطرية · Notes</h4>
          <div class="notes-tags">
            ${p.notes.map(n => `<span class="note-tag">${n}</span>`).join('')}
          </div>
        </div>
        <button class="btn btn-primary btn-full" onclick="addToCart(${p.id}); closeModal();">
          🛒 🛒 أضف للسلة · Ajouter au panier au panier
        </button>
      </div>
    </div>
  `;

  modalOverlay.classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeModal() {
  modalOverlay.classList.remove('open');
  document.body.style.overflow = '';
}

// ===== Toast =====
function showToast(message) {
  toast.textContent = message;
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 2500);
}

// ===== Event Listeners =====
cartBtn.addEventListener('click', openCart);
closeCart.addEventListener('click', closeCartSidebar);
cartOverlay.addEventListener('click', closeCartSidebar);
modalClose.addEventListener('click', closeModal);
modalOverlay.addEventListener('click', (e) => {
  if (e.target === modalOverlay) closeModal();
});

// ===== Algerian Wilayas (69) =====
const wilayas = [
  "01 - أدرار", "02 - الشلف", "03 - الأغواط", "04 - أم البواقي", "05 - باتنة",
  "06 - بجاية", "07 - بسكرة", "08 - بشار", "09 - البليدة", "10 - البويرة",
  "11 - تمنراست", "12 - تبسة", "13 - تلمسان", "14 - تيارت", "15 - تيزي وزو",
  "16 - الجزائر", "17 - الجلفة", "18 - جيجل", "19 - سطيف", "20 - سعيدة",
  "21 - سكيكدة", "22 - سيدي بلعباس", "23 - عنابة", "24 - قالمة", "25 - قسنطينة",
  "26 - المدية", "27 - مستغانم", "28 - المسيلة", "29 - معسكر", "30 - ورقلة",
  "31 - وهران", "32 - البيض", "33 - إليزي", "34 - برج بوعريريج", "35 - بومرداس",
  "36 - الطارف", "37 - تندوف", "38 - تيسمسيلت", "39 - الوادي", "40 - خنشلة",
  "41 - سوق أهراس", "42 - تيبازة", "43 - ميلة", "44 - عين الدفلى", "45 - النعامة",
  "46 - عين تموشنت", "47 - غرداية", "48 - غليزان", "49 - تيميمون", "50 - برج باجي مختار",
  "51 - أولاد جلال", "52 - بني عباس", "53 - عين صالح", "54 - عين قزام", "55 - تقرت",
  "56 - جانت", "57 - المغير", "58 - المنيعة",
  "59 - أفلو", "60 - بريكة", "61 - القنطرة", "62 - بئر العاتر", "63 - العريشة",
  "64 - قصر الشلالة", "65 - عين وسارة", "66 - مسعد", "67 - قصر البخاري",
  "68 - بوسعادة", "69 - الأبيض سيدي الشيخ"
];

// ===== Checkout Elements =====
const checkoutOverlay = document.getElementById('checkoutOverlay');
const checkoutClose = document.getElementById('checkoutClose');
const checkoutForm = document.getElementById('checkoutForm');
const wilayaSelect = document.getElementById('wilaya');
const orderSummary = document.getElementById('orderSummary');
const submitOrderBtn = document.getElementById('submitOrderBtn');

// Populate wilayas
function populateWilayas() {
  wilayas.forEach(w => {
    const option = document.createElement('option');
    option.value = w;
    option.textContent = w;
    wilayaSelect.appendChild(option);
  });
}

// Open Checkout
function openCheckout() {
  if (cart.length === 0) {
    showToast('السلة فارغة · Panier vide');
    return;
  }

  // Build order summary
  const total = cart.reduce((sum, item) => sum + (item.price * item.qty), 0);
  orderSummary.innerHTML = `
    <h4>ملخص الطلب · Récapitulatif</h4>
    ${cart.map(item => `
      <div class="summary-item">
        <span>${item.name} × ${item.qty}</span>
        <span>${(item.price * item.qty).toLocaleString()} د.ج</span>
      </div>
    `).join('')}
    <div class="summary-total">
      <span>المجموع · Total</span>
      <span>${total.toLocaleString()} د.ج</span>
    </div>
  `;

  closeCartSidebar();
  checkoutOverlay.classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeCheckout() {
  checkoutOverlay.classList.remove('open');
  document.body.style.overflow = '';
}

// Submit Order - Send to email via Formspree
checkoutForm.addEventListener('submit', async (e) => {
  e.preventDefault();

  const firstName = document.getElementById('firstName').value.trim();
  const lastName = document.getElementById('lastName').value.trim();
  const phone = document.getElementById('phone').value.trim();
  const wilaya = document.getElementById('wilaya').value;
  const address = document.getElementById('address').value.trim();

  if (!firstName || !lastName || !phone || !wilaya) {
    showToast('يرجى ملء جميع الحقول المطلوبة');
    return;
  }

  const total = cart.reduce((sum, item) => sum + (item.price * item.qty), 0);
  const orderDetails = cart.map(item => `${item.name} (${item.nameFr}) × ${item.qty} = ${(item.price * item.qty).toLocaleString()} د.ج`).join('\n');

  const orderData = {
    _subject: `طلب جديد من AS Perfume - ${firstName} ${lastName}`,
    _replyto: 'abizamounir20@gmail.com',
    الاسم: firstName,
    اللقب: lastName,
    الهاتف: phone,
    الولاية: wilaya,
    العنوان: address || 'غير محدد',
    المنتجات: orderDetails,
    المجموع: `${total} د.ج`,
    التاريخ: new Date().toLocaleString('ar-DZ')
  };

  submitOrderBtn.disabled = true;
  submitOrderBtn.textContent = 'جاري الإرسال... · Envoi...';

  try {
    // FormSubmit.co - يرسل مباشرة إلى الإيميل بدون تسجيل
    const formData = new FormData();
    formData.append('_subject', `طلب جديد من AS Perfume - ${firstName} ${lastName}`);
    formData.append('_template', 'table');
    formData.append('_captcha', 'false');
    formData.append('الاسم', firstName);
    formData.append('اللقب', lastName);
    formData.append('رقم الهاتف', phone);
    formData.append('الولاية', wilaya);
    formData.append('العنوان', address || 'غير محدد');
    formData.append('المنتجات', orderDetails);
    formData.append('المجموع', `${total} د.ج`);
    formData.append('التاريخ', new Date().toLocaleString('ar-DZ'));

    const response = await fetch('https://formsubmit.co/ajax/abizamounir20@gmail.com', {
      method: 'POST',
      body: formData
    });

    if (response.ok) {
      showToast('تم إرسال طلبك بنجاح! سنتواصل معك قريباً');
      cart = [];
      saveCart();
      checkoutForm.reset();
      closeCheckout();
    } else {
      sendViaMailto(orderData, total, orderDetails);
    }
  } catch (err) {
    sendViaMailto(orderData, total, orderDetails);
  }

  submitOrderBtn.disabled = false;
  submitOrderBtn.textContent = 'تأكيد الطلب · Confirmer la commande';
});

function sendViaMailto(data, total, orderDetails) {
  const subject = encodeURIComponent(`طلب جديد من AS Perfume - ${data.الاسم} ${data.اللقب}`);
  const body = encodeURIComponent(
`طلب جديد من متجر AS Perfume

الاسم: ${data.الاسم}
اللقب: ${data.اللقب}
رقم الهاتف: ${data.الهاتف}
الولاية: ${data.الولاية}
العنوان: ${data.العنوان}

المنتجات:
${orderDetails}

المجموع: ${total} د.ج
التاريخ: ${data.التاريخ}
`
  );
  window.location.href = `mailto:abizamounir20@gmail.com?subject=${subject}&body=${body}`;
  showToast('تم فتح البريد الإلكتروني لإرسال الطلب');
  cart = [];
  saveCart();
  checkoutForm.reset();
  closeCheckout();
}

// Event Listeners
checkoutBtn.addEventListener('click', openCheckout);
checkoutClose.addEventListener('click', closeCheckout);
checkoutOverlay.addEventListener('click', (e) => {
  if (e.target === checkoutOverlay) closeCheckout();
});

menuToggle.addEventListener('click', () => {
  mobileNav.classList.toggle('open');
});

// Close mobile nav on link click
mobileNav.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => mobileNav.classList.remove('open'));
});

contactForm.addEventListener('submit', (e) => {
  e.preventDefault();
  showToast('تم إرسال رسالتك · Message envoyé !');
  contactForm.reset();
});

// Smooth scroll for nav links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});

// ===== Init =====
populateWilayas();
renderProducts();
updateCartUI();
