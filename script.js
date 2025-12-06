// استبدل هذا بعنوان محفظتك USDT الحقيقي
const MERCHANT_USDT_ADDRESS = "TX4gkGMR2xEXxvfrNwLHkrLNpe3erGsUjy";

// بيانات المنتجات
const products = [
    {
        id: 1,
        name: "Rolex Style Watch",
        category: "watches",
        price: 299,
        image: "https://images.unsplash.com/photo-1523170335258-f5ed11844a49?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        rating: 4.8,
        description: "Luxury men's watch with premium design"
    },
    {
        id: 2,
        name: "iPhone 15 Pro",
        category: "electronics",
        price: 999,
        image: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        rating: 5.0,
        description: "Latest Apple smartphone with pro features"
    },
    {
        id: 3,
        name: "Leather Jacket",
        category: "clothing",
        price: 149,
        image: "https://images.unsplash.com/photo-1551028719-00167b16eac5?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        rating: 4.0,
        description: "Premium leather jacket for men"
    },
    {
        id: 4,
        name: "Premium Makeup Set",
        category: "beauty",
        price: 79,
        image: "https://images.unsplash.com/photo-1596462502278-27bfdc403348?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        rating: 4.5,
        description: "Complete makeup kit for professional use"
    },
    {
        id: 5,
        name: "Kitchen Blender",
        category: "home",
        price: 59,
        image: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        rating: 4.0,
        description: "High-speed blender for kitchen"
    },
    {
        id: 6,
        name: "Diamond Watch",
        category: "watches",
        price: 199,
        image: "https://images.unsplash.com/photo-1547996160-81c6d3d3b5c9?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        rating: 4.7,
        description: "Elegant diamond watch for women"
    },
    {
        id: 7,
        name: "Samsung S24 Ultra",
        category: "electronics",
        price: 899,
        image: "https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        rating: 4.9,
        description: "Flagship Samsung smartphone"
    },
    {
        id: 8,
        name: "Designer Dress",
        category: "clothing",
        price: 129,
        image: "https://images.unsplash.com/photo-1566174053879-31528523f8ae?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        rating: 4.3,
        description: "Elegant designer dress for women"
    }
];

// عربة التسوق
let cart = JSON.parse(localStorage.getItem('cart')) || [];
let paymentTimer = null;
let paymentTimeLeft = 300; // 5 دقائق بالثواني

// تهيئة التطبيق
document.addEventListener('DOMContentLoaded', function() {
    loadProducts();
    updateCartCount();
    setupEventListeners();
    
    if (cart.length > 0) {
        updateCartDisplay();
    }
});

// تحميل المنتجات
function loadProducts(category = 'all') {
    const productsGrid = document.getElementById('productsGrid');
    productsGrid.innerHTML = '';
    
    const filteredProducts = category === 'all' 
        ? products 
        : products.filter(p => p.category === category);
    
    filteredProducts.forEach(product => {
        const productCard = document.createElement('div');
        productCard.className = 'product-card';
        productCard.innerHTML = `
            <div class="product-image">
                <img src="${product.image}" alt="${product.name}">
                <div class="product-badge">HOT</div>
            </div>
            <div class="product-info">
                <h3>${product.name}</h3>
                <div class="rating">
                    ${generateStars(product.rating)}
                    <span>${product.rating}</span>
                </div>
                <p class="price">$${product.price} <span>≈ ${product.price} USDT</span></p>
                <div class="product-actions">
                    <button class="add-to-cart" onclick="addToCart(${product.id})">
                        <i class="fas fa-cart-plus"></i> Add to Cart
                    </button>
                    <button class="view-details" onclick="viewProductDetails(${product.id})">
                        <i class="fas fa-eye"></i>
                    </button>
                </div>
            </div>
        `;
        productsGrid.appendChild(productCard);
    });
}

// إنشاء النجوم للتقييم
function generateStars(rating) {
    let stars = '';
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    
    for (let i = 0; i < 5; i++) {
        if (i < fullStars) {
            stars += '<i class="fas fa-star"></i>';
        } else if (i === fullStars && hasHalfStar) {
            stars += '<i class="fas fa-star-half-alt"></i>';
        } else {
            stars += '<i class="far fa-star"></i>';
        }
    }
    return stars;
}

// إعداد المستمعين للأحداث
function setupEventListeners() {
    // أزرار الفئات
    document.querySelectorAll('.category-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            document.querySelectorAll('.category-btn').forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            loadProducts(this.dataset.category);
        });
    });
    
    // أيقونة عربة التسوق
    document.getElementById('cartIcon').addEventListener('click', function() {
        document.getElementById('cartSidebar').classList.add('active');
        updateCartDisplay();
    });
    
    // إغلاق عربة التسوق
    document.getElementById('closeCart').addEventListener('click', function() {
        document.getElementById('cartSidebar').classList.remove('active');
    });
    
    // زر الدفع
    document.getElementById('checkoutBtn').addEventListener('click', openCheckoutModal);
    
    // إغلاق المودال
    document.querySelectorAll('.close').forEach(closeBtn => {
        closeBtn.addEventListener('click', function() {
            this.closest('.modal').style.display = 'none';
            if (paymentTimer) {
                clearInterval(paymentTimer);
                paymentTimer = null;
            }
        });
    });
    
    // زر الدفع الآن
    document.getElementById('payNowBtn').addEventListener('click', processPayment);
    
    // إغلاق المودال عند النقر خارجها
    window.addEventListener('click', function(event) {
        if (event.target.classList.contains('modal')) {
            event.target.style.display = 'none';
            if (paymentTimer) {
                clearInterval(paymentTimer);
                paymentTimer = null;
            }
        }
    });
}

// إضافة إلى عربة التسوق
function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    const existingItem = cart.find(item => item.id === productId);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            ...product,
            quantity: 1
        });
    }
    
    updateCartCount();
    updateCartDisplay();
    saveCartToLocalStorage();
    
    // عرض إشعار
    showNotification(`${product.name} added to cart!`);
    
    // عرض عربة التسوق إذا كانت مخفية
    document.getElementById('cartSidebar').classList.add('active');
}

// تحديث عدد عربة التسوق
function updateCartCount() {
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    document.querySelector('.cart-count').textContent = totalItems;
}

// تحديث عرض عربة التسوق
function updateCartDisplay() {
    const cartItems = document.getElementById('cartItems');
    const cartTotal = document.getElementById('cartTotal');
    
    if (cart.length === 0) {
        cartItems.innerHTML = '<p class="empty-cart">Your cart is empty</p>';
        cartTotal.textContent = '0';
        return;
    }
    
    cartItems.innerHTML = '';
    let total = 0;
    
    cart.forEach(item => {
        const itemTotal = item.price * item.quantity;
        total += itemTotal;
        
        const cartItem = document.createElement('div');
        cartItem.className = 'cart-item';
        cartItem.innerHTML = `
            <img src="${item.image}" alt="${item.name}">
            <div class="cart-item-info">
                <h4>${item.name}</h4>
                <p class="cart-item-price">${item.price} USDT × ${item.quantity}</p>
            </div>
            <div>
                <p class="cart-item-total">${itemTotal} USDT</p>
                <button class="cart-item-remove" onclick="removeFromCart(${item.id})">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        `;
        cartItems.appendChild(cartItem);
    });
    
    cartTotal.textContent = total;
}

// إزالة من عربة التسوق
function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    updateCartCount();
    updateCartDisplay();
    saveCartToLocalStorage();
    
    showNotification('Item removed from cart');
}

// حفظ عربة التسوق في التخزين المحلي
function saveCartToLocalStorage() {
    localStorage.setItem('cart', JSON.stringify(cart));
}

// فتح مودال الدفع
function openCheckoutModal() {
    if (cart.length === 0) {
        showNotification('Your cart is empty!');
        return;
    }
    
    const orderItems = document.getElementById('orderItems');
    const orderTotal = document.getElementById('orderTotal');
    
    orderItems.innerHTML = '';
    let total = 0;
    
    cart.forEach(item => {
        const itemTotal = item.price * item.quantity;
        total += itemTotal;
        
        const orderItem = document.createElement('div');
        orderItem.className = 'order-item';
        orderItem.innerHTML = `
            <p>${item.name} × ${item.quantity} = ${itemTotal} USDT</p>
        `;
        orderItems.appendChild(orderItem);
    });
    
    orderTotal.textContent = total;
    document.getElementById('checkoutModal').style.display = 'block';
    
    // مسح حقول النموذج السابقة
    document.getElementById('customerName').value = '';
    document.getElementById('customerEmail').value = '';
    document.getElementById('customerAddress').value = '';
    document.getElementById('customerPhone').value = '';
}

// معالجة الدفع
function processPayment() {
    const name = document.getElementById('customerName').value;
    const email = document.getElementById('customerEmail').value;
    const address = document.getElementById('customerAddress').value;
    const phone = document.getElementById('customerPhone').value;
    
    if (!name || !email || !address) {
        showNotification('Please fill all required fields!');
        return;
    }
    
    // التحقق من صحة البريد الإلكتروني
    if (!validateEmail(email)) {
        showNotification('Please enter a valid email address!');
        return;
    }
    
    document.getElementById('checkoutModal').style.display = 'none';
    openPaymentModal();
}

// فتح مودال الدفع بالعملة المشفرة
function openPaymentModal() {
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    document.getElementById('paymentAmount').textContent = total;
    document.getElementById('paymentAddress').textContent = MERCHANT_USDT_ADDRESS;
    
    document.getElementById('paymentModal').style.display = 'block';
    
    // إعادة ضبط المؤقت
    paymentTimeLeft = 300;
    updatePaymentTimer();
    
    // بدء المؤقت
    if (paymentTimer) {
        clearInterval(paymentTimer);
    }
    
    paymentTimer = setInterval(() => {
        paymentTimeLeft--;
        updatePaymentTimer();
        
        if (paymentTimeLeft <= 0) {
            clearInterval(paymentTimer);
            document.getElementById('statusText').textContent = 'Payment timeout!';
            document.getElementById('statusText').style.color = '#ff4444';
        }
    }, 1000);
    
    // محاكاة التحقق من الدفع (بعد 10 ثواني)
    setTimeout(() => {
        // في الواقع الفعلي، هنا تتحقق من API
        // لكننا سنقوم بالمحاكاة فقط
        simulatePaymentVerification();
    }, 10000);
}

// تحديث المؤقت
function updatePaymentTimer() {
    const minutes = Math.floor(paymentTimeLeft / 60);
    const seconds = paymentTimeLeft % 60;
    document.getElementById('paymentTimer').textContent = 
        `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
}

// محاكاة التحقق من الدفع
function simulatePaymentVerification() {
    // هنا يجب أن يكون اتصال حقيقي مع API للتحقق
    // لكن لأغراض العرض، سنقوم بالمحاكاة
    
    document.getElementById('statusText').innerHTML = 
        '<i class="fas fa-check-circle"></i> Payment confirmed!';
    document.getElementById('statusText').style.color = '#4CAF50';
    
    setTimeout(() => {
        completePayment();
    }, 2000);
}

// إكمال الدفع
function completePayment() {
    if (paymentTimer) {
        clearInterval(paymentTimer);
        paymentTimer = null;
    }
    
    document.getElementById('paymentModal').style.display = 'none';
    
    const orderId = 'USDT-' + Math.random().toString(36).substr(2, 9).toUpperCase();
    document.getElementById('orderId').textContent = orderId;
    
    saveOrder(orderId);
    document.getElementById('successModal').style.display = 'block';
    
    // إرسال إشعار بالبريد (محاكاة)
    sendOrderConfirmationEmail(orderId);
    
    cart = [];
    updateCartCount();
    updateCartDisplay();
    saveCartToLocalStorage();
    
    document.getElementById('cartSidebar').classList.remove('active');
}

// حفظ الطلب
function saveOrder(orderId) {
    const orders = JSON.parse(localStorage.getItem('orders')) || [];
    const order = {
        id: orderId,
        date: new Date().toISOString(),
        items: [...cart],
        total: cart.reduce((sum, item) => sum + (item.price * item.quantity), 0),
        status: 'paid',
        customer: {
            name: document.getElementById('customerName').value,
            email: document.getElementById('customerEmail').value,
            address: document.getElementById('customerAddress').value,
            phone: document.getElementById('customerPhone').value || 'Not provided'
        }
    };
    orders.push(order);
    localStorage.setItem('orders', JSON.stringify(orders));
}

// نسخ عنوان الدفع
function copyPaymentAddress() {
    const address = document.getElementById('paymentAddress').textContent;
    navigator.clipboard.writeText(address)
        .then(() => {
            const btn = event.target.closest('button');
            const originalHTML = btn.innerHTML;
            btn.innerHTML = '<i class="fas fa-check"></i> Copied!';
            btn.style.background = '#2E7D32';
            setTimeout(() => {
                btn.innerHTML = originalHTML;
                btn.style.background = '';
            }, 2000);
        })
        .catch(err => {
            console.error('Copy failed:', err);
            showNotification('Failed to copy address');
        });
}

// إغلاق مودال النجاح
function closeSuccessModal() {
    document.getElementById('successModal').style.display = 'none';
}

// عرض إشعار
function showNotification(message) {
    // إزالة أي إشعارات سابقة
    const existingNotifications = document.querySelectorAll('.notification');
    existingNotifications.forEach(n => n.remove());
    
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.remove();
    }, 3000);
}

// التحقق من صحة البريد الإلكتروني
function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

// عرض تفاصيل المنتج
function viewProductDetails(productId) {
    const product = products.find(p => p.id === productId);
    alert(`Product: ${product.name}\nPrice: $${product.price} (${product.price} USDT)\nRating: ${product.rating}/5\nDescription: ${product.description}`);
}

// إرسال تأكيد الطلب (محاكاة)
function sendOrderConfirmationEmail(orderId) {
    const customerEmail = document.getElementById('customerEmail').value;
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    
    console.log(`Order confirmation sent to: ${customerEmail}`);
    console.log(`Order ID: ${orderId}`);
    console.log(`Total: ${total} USDT`);
    
    // في الواقع الفعلي، هنا ترسل طلب إلى API البريد
}
