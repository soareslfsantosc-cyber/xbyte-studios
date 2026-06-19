// ===== DADOS DOS PRODUTOS =====//
const products = [
    {
        id: 'z790-master',
        name: 'Gigabyte Z790 AORUS MASTER',
        price: 4250.00,
        category: 'premium',
        socket: 'LGA 1700',
        memory: '128GB DDR5',
        vrm: '20+1+2 Fases VRM',
        image: 'assets/z790-master.jpg',
        rating: 5,
        reviews: 127,
        inStock: true,
        specs: {
            chipset: 'Intel Z790',
            formFactor: 'ATX',
            memorySlots: 4,
            maxMemory: '128GB',
            memoryType: 'DDR5',
            pciSlots: '3x PCIe 5.0 x16, 2x PCIe 4.0 x1',
            storage: '4x M.2, 6x SATA',
            networking: 'WiFi 6E, Bluetooth 5.3, 2.5GbE LAN',
            audio: 'ALC1220-VB',
            usb: '2x USB 3.2 Gen2x2 Type-C, 8x USB 3.2 Gen2 Type-A'
        }
    },
    {
        id: 'x670e-master',
        name: 'Gigabyte X670E AORUS MASTER',
        price: 3850.00,
        category: 'premium',
        socket: 'AM5',
        memory: '128GB DDR5',
        vrm: '18+2+2 Fases VRM',
        image: 'assets/x670e-master.jpg',
        rating: 5,
        reviews: 89,
        inStock: true,
        specs: {
            chipset: 'AMD X670E',
            formFactor: 'ATX',
            memorySlots: 4,
            maxMemory: '128GB',
            memoryType: 'DDR5',
            pciSlots: '3x PCIe 5.0 x16, 2x PCIe 4.0 x1',
            storage: '4x M.2, 6x SATA',
            networking: 'WiFi 6E, Bluetooth 5.3, 2.5GbE LAN',
            audio: 'ALC1220-VB',
            usb: '2x USB 3.2 Gen2x2 Type-C, 10x USB 3.2 Gen2 Type-A'
        }
    },
    {
        id: 'b760-gaming-x',
        name: 'Gigabyte B760 GAMING X',
        price: 1450.00,
        category: 'intermediate',
        socket: 'LGA 1700',
        memory: '128GB DDR5',
        vrm: '12+1+2 Fases VRM',
        image: 'assets/b760-gaming-x.jpg',
        rating: 4,
        reviews: 203,
        inStock: true,
        specs: {
            chipset: 'Intel B760',
            formFactor: 'ATX',
            memorySlots: 4,
            maxMemory: '128GB',
            memoryType: 'DDR5',
            pciSlots: '2x PCIe 4.0 x16, 3x PCIe 3.0 x1',
            storage: '3x M.2, 4x SATA',
            networking: 'WiFi 6, Bluetooth 5.3, GbE LAN',
            audio: 'ALC897',
            usb: '1x USB 3.2 Gen2x2 Type-C, 6x USB 3.2 Gen1 Type-A'
        }
    },
    {
        id: 'b650-gaming-x',
        name: 'Gigabyte B650 GAMING X AX',
        price: 1250.00,
        category: 'intermediate',
        socket: 'AM5',
        memory: '128GB DDR5',
        vrm: '12+2+1 Fases VRM',
        image: 'assets/b650-gaming-x.jpg',
        rating: 4,
        reviews: 156,
        inStock: true,
        specs: {
            chipset: 'AMD B650',
            formFactor: 'ATX',
            memorySlots: 4,
            maxMemory: '128GB',
            memoryType: 'DDR5',
            pciSlots: '2x PCIe 4.0 x16, 2x PCIe 3.0 x1',
            storage: '2x M.2, 4x SATA',
            networking: 'WiFi 6, Bluetooth 5.2, GbE LAN',
            audio: 'ALC897',
            usb: '1x USB 3.2 Gen2 Type-C, 8x USB 3.2 Gen1 Type-A'
        }
    },
    {
        id: 'h610m-h',
        name: 'Gigabyte H610M H DDR4',
        price: 750.00,
        category: 'entry',
        socket: 'LGA 1700',
        memory: '64GB DDR4',
        vrm: '6+1+1 Fases VRM',
        image: 'assets/h610m-h.jpg',
        rating: 4,
        reviews: 234,
        inStock: true,
        specs: {
            chipset: 'Intel H610',
            formFactor: 'Micro-ATX',
            memorySlots: 2,
            maxMemory: '64GB',
            memoryType: 'DDR4',
            pciSlots: '1x PCIe 4.0 x16, 2x PCIe 3.0 x1',
            storage: '1x M.2, 4x SATA',
            networking: 'GbE LAN',
            audio: 'ALC887',
            usb: '4x USB 3.2 Gen1 Type-A, 2x USB 2.0'
        }
    },
    {
        id: 'a520m-ds3h',
        name: 'Gigabyte A520M DS3H',
        price: 650.00,
        category: 'entry',
        socket: 'AM4',
        memory: '128GB DDR4',
        vrm: '5+3 Fases VRM',
        image: 'assets/a520m-ds3h.jpg',
        rating: 4,
        reviews: 187,
        inStock: true,
        specs: {
            chipset: 'AMD A520',
            formFactor: 'Micro-ATX',
            memorySlots: 4,
            maxMemory: '128GB',
            memoryType: 'DDR4',
            pciSlots: '1x PCIe 3.0 x16, 2x PCIe 3.0 x1',
            storage: '1x M.2, 4x SATA',
            networking: 'GbE LAN',
            audio: 'ALC887',
            usb: '6x USB 3.2 Gen1 Type-A, 2x USB 2.0'
        }
    },
    {
        id: 'h410m-h',
        name: 'Gigabyte H410M H V2',
        price: 575.00,
        category: 'budget',
        socket: 'LGA 1200',
        memory: '64GB DDR4',
        vrm: '4+2 Fases VRM',
        image: 'assets/h410m-h.jpg',
        rating: 4,
        reviews: 312,
        inStock: true,
        specs: {
            chipset: 'Intel H410',
            formFactor: 'Micro-ATX',
            memorySlots: 2,
            maxMemory: '64GB',
            memoryType: 'DDR4',
            pciSlots: '1x PCIe 3.0 x16, 2x PCIe 3.0 x1',
            storage: '1x M.2, 4x SATA',
            networking: 'GbE LAN',
            audio: 'ALC887',
            usb: '4x USB 3.2 Gen1 Type-A, 2x USB 2.0'
        }
    },
    {
        id: 'b450m-gaming',
        name: 'Gigabyte B450M GAMING',
        price: 675.00,
        category: 'budget',
        socket: 'AM4',
        memory: '64GB DDR4',
        vrm: '4+2 Fases VRM',
        image: 'assets/b450m-gaming.jpg',
        rating: 4,
        reviews: 278,
        inStock: true,
        specs: {
            chipset: 'AMD B450',
            formFactor: 'Micro-ATX',
            memorySlots: 4,
            maxMemory: '64GB',
            memoryType: 'DDR4',
            pciSlots: '1x PCIe 3.0 x16, 2x PCIe 2.0 x1',
            storage: '1x M.2, 4x SATA',
            networking: 'GbE LAN',
            audio: 'ALC887',
            usb: '6x USB 3.1 Gen1 Type-A, 2x USB 2.0'
        }
    }
];

// ===== VARIÁVEIS GLOBAIS =====
let cart = [];
let compareList = [];
let isCompareMode = false;
let filteredProducts = [...products];

// ===== INICIALIZAÇÃO =====
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

function initializeApp() {
    loadProducts();
    setupEventListeners();
    loadCartFromStorage();
    updateCartUI();
}

// ===== EVENT LISTENERS =====
function setupEventListeners() {
    // Mobile menu
    const hamburger = document.querySelector('.hamburger');
    if (hamburger) {
        hamburger.addEventListener('click', toggleMobileMenu);
    }

    // Search
    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
        searchInput.addEventListener('input', debounce(performSearch, 300));
        searchInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                performSearch();
            }
        });
    }

    // Smooth scrolling for navigation links
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

    // Close modals when clicking outside
    window.addEventListener('click', function(e) {
        const productModal = document.getElementById('productModal');
        const comparisonModal = document.getElementById('comparisonModal');
        
        if (e.target === productModal) {
            closeModal();
        }
        if (e.target === comparisonModal) {
            closeComparisonModal();
        }
    });

    // Keyboard navigation
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            closeModal();
            closeComparisonModal();
            if (document.getElementById('cartSidebar').classList.contains('active')) {
                toggleCart();
            }
        }
    });
}

// ===== UTILITY FUNCTIONS =====
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

function formatPrice(price) {
    return new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL'
    }).format(price);
}

function calculateInstallments(price, installments = 12) {
    const installmentValue = price / installments;
    return formatPrice(installmentValue);
}

function showToast(message, type = 'success') {
    const toast = document.getElementById('toast');
    toast.textContent = message;
    toast.className = `toast ${type}`;
    toast.classList.add('show');
    
    setTimeout(() => {
        toast.classList.remove('show');
    }, 3000);
}

// ===== MOBILE MENU =====
function toggleMobileMenu() {
    const navMenu = document.querySelector('.nav-menu');
    const hamburger = document.querySelector('.hamburger');
    
    navMenu.classList.toggle('active');
    hamburger.setAttribute('aria-expanded', navMenu.classList.contains('active'));
}

// ===== SEARCH FUNCTIONALITY =====
function performSearch() {
    const searchTerm = document.getElementById('searchInput').value.toLowerCase().trim();
    
    if (searchTerm === '') {
        filteredProducts = [...products];
    } else {
        filteredProducts = products.filter(product => 
            product.name.toLowerCase().includes(searchTerm) ||
            product.socket.toLowerCase().includes(searchTerm) ||
            product.category.toLowerCase().includes(searchTerm)
        );
    }
    
    loadProducts();
    
    if (searchTerm && filteredProducts.length === 0) {
        showToast('Nenhum produto encontrado para sua busca.', 'warning');
    }
}

// ===== PRODUCT FILTERING =====
function filterProducts(filterValue) {
    // Update filter buttons
    document.querySelectorAll(".filter-btn").forEach(btn => {
        btn.classList.remove("active");
        btn.setAttribute("aria-pressed", "false");
    });
    
    const activeBtn = document.querySelector(`[data-category="${filterValue}"]`);
    if (activeBtn) {
        activeBtn.classList.add("active");
        activeBtn.setAttribute("aria-pressed", "true");
    }
    
    // Filter products
    if (filterValue === "all") {
        filteredProducts = [...products];
    } else {
        filteredProducts = products.filter(product => product.socket === filterValue);
    }
    
    applyFilters();
}

function applyFilters() {
    const socketFilter = document.getElementById('socketFilter').value;
    const priceFilter = document.getElementById('priceFilter').value;
    
    let filtered = [...filteredProducts];
    
    // Apply socket filter
    if (socketFilter) {
        filtered = filtered.filter(product => product.socket === socketFilter);
    }
    
    // Apply price filter
    if (priceFilter) {
        const [min, max] = priceFilter.split('-').map(Number);
        if (max) {
            filtered = filtered.filter(product => product.price >= min && product.price <= max);
        } else {
            filtered = filtered.filter(product => product.price >= min);
        }
    }
    
    filteredProducts = filtered;
    loadProducts();
}

// ===== PRODUCT DISPLAY =====
function loadProducts() {
    const productsGrid = document.getElementById('productsGrid');
    if (!productsGrid) return;
    
    if (filteredProducts.length === 0) {
        productsGrid.innerHTML = `
            <div class="no-products">
                <i class="fas fa-search"></i>
                <h3>Nenhum produto encontrado</h3>
                <p>Tente ajustar os filtros ou fazer uma nova busca.</p>
            </div>
        `;
        return;
    }
    
    productsGrid.innerHTML = filteredProducts.map(product => createProductCard(product)).join('');
}

function createProductCard(product) {
    const stars = generateStars(product.rating);
    const compareCheckbox = isCompareMode ? 
        `<button class="action-btn compare-checkbox" onclick="toggleCompare('${product.id}')" aria-label="Comparar produto">
            <i class="fas fa-balance-scale"></i>
        </button>` : '';
    
    return `
        <article class="product-card" data-category="${product.category}" data-socket="${product.socket}" data-price="${product.price}" role="listitem">
            <div class="product-image">
                <img src="${product.image}" alt="${product.name}" loading="lazy" width="350" height="200">
                <span class="product-badge ${product.category}">${getCategoryLabel(product.category)}</span>
                <div class="product-actions">
                    ${compareCheckbox}
                    <button class="action-btn" onclick="addToWishlist('${product.id}')" aria-label="Adicionar aos favoritos">
                        <i class="far fa-heart"></i>
                    </button>
                    <button class="action-btn" onclick="quickView('${product.id}')" aria-label="Visualização rápida">
                        <i class="fas fa-eye"></i>
                    </button>
                </div>
                <div class="stock-indicator ${product.inStock ? 'in-stock' : 'out-of-stock'}">
                    <i class="fas fa-${product.inStock ? 'check-circle' : 'times-circle'}"></i>
                    ${product.inStock ? 'Em Estoque' : 'Fora de Estoque'}
                </div>
            </div>
            <div class="product-info">
                <h3 class="product-name">${product.name}</h3>
                <div class="product-rating">
                    <div class="stars">${stars}</div>
                    <span class="rating-count">(${product.reviews} avaliações)</span>
                </div>
                <p class="product-price">${formatPrice(product.price)}</p>
                <span class="installments">12x de ${calculateInstallments(product.price)}</span>
                <div class="product-specs">
                    <div class="spec-item">
                        <i class="fas fa-microchip"></i>
                        <span>${product.socket}</span>
                    </div>
                    <div class="spec-item">
                        <i class="fas fa-memory"></i>
                        <span>${product.memory}</span>
                    </div>
                    <div class="spec-item">
                        <i class="fas fa-bolt"></i>
                        <span>${product.vrm}</span>
                    </div>
                </div>
                <div class="product-buttons">
                    <button class="product-btn primary" onclick="addToCart('${product.id}')" aria-label="Adicionar ao carrinho" ${!product.inStock ? 'disabled' : ''}>
                        <i class="fas fa-shopping-cart"></i>
                        ${product.inStock ? 'Adicionar ao Carrinho' : 'Indisponível'}
                    </button>
                    <button class="product-btn secondary" onclick="showProductDetails('${product.id}')" aria-label="Ver detalhes do produto">
                        Ver Detalhes
                    </button>
                </div>
            </div>
        </article>
    `;
}

function generateStars(rating) {
    let stars = '';
    for (let i = 1; i <= 5; i++) {
        if (i <= rating) {
            stars += '<i class="fas fa-star"></i>';
        } else {
            stars += '<i class="far fa-star"></i>';
        }
    }
    return stars;
}

function getCategoryLabel(socket) {
    return socket;
}

// ===== PRODUCT ACTIONS =====
function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    if (!product || !product.inStock) return;
    
    const existingItem = cart.find(item => item.id === productId);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            ...product,
            quantity: 1
        });
    }
    
    updateCartUI();
    saveCartToStorage();
    showToast(`${product.name} adicionado ao carrinho!`);
}

function addToWishlist(productId) {
    const product = products.find(p => p.id === productId);
    if (!product) return;
    
    showToast(`${product.name} adicionado aos favoritos!`);
}

function quickView(productId) {
    showProductDetails(productId);
}

function showProductDetails(productId) {
    const product = products.find(p => p.id === productId);
    if (!product) return;
    
    const modal = document.getElementById('productModal');
    const modalContent = document.getElementById('modalContent');
    
    modalContent.innerHTML = `
        <div class="product-details">
            <div class="product-details-header">
                <div class="main-product-image">
                    <img src="${product.image}" alt="${product.name}" width="400" height="300">
                </div>
                <div class="product-details-info">
                    <h2>${product.name}</h2>
                    <div class="product-rating">
                        <div class="stars">${generateStars(product.rating)}</div>
                        <span class="rating-count">(${product.reviews} avaliações)</span>
                    </div>
                    <p class="product-price">${formatPrice(product.price)}</p>
                    <span class="installments">12x de ${calculateInstallments(product.price)} sem juros</span>
                    <div class="stock-status ${product.inStock ? 'in-stock' : 'out-of-stock'}">
                        <i class="fas fa-${product.inStock ? 'check-circle' : 'times-circle'}"></i>
                        ${product.inStock ? 'Em Estoque' : 'Fora de Estoque'}
                    </div>
                    <div class="product-actions-enhanced">
                        <div class="quantity-selector">
                            <label for="quantity">Quantidade:</label>
                            <input type="number" id="quantity" min="1" max="10" value="1">
                        </div>
                        <div class="action-buttons">
                            <button class="btn-add-to-cart" onclick="addToCartFromModal('${product.id}')" ${!product.inStock ? 'disabled' : ''}>
                                <i class="fas fa-shopping-cart"></i>
                                ${product.inStock ? 'Adicionar ao Carrinho' : 'Indisponível'}
                            </button>
                            <button class="btn-buy-now" onclick="buyNow('${product.id}')" ${!product.inStock ? 'disabled' : ''}>
                                <i class="fas fa-bolt"></i>
                                Comprar Agora
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            <div class="product-specs-detailed">
                <h3>Especificações Técnicas</h3>
                <div class="specs-grid">
                    <div class="spec-group">
                        <h4>Processador</h4>
                        <p><strong>Socket:</strong> ${product.socket}</p>
                        <p><strong>Chipset:</strong> ${product.specs.chipset}</p>
                    </div>
                    <div class="spec-group">
                        <h4>Memória</h4>
                        <p><strong>Tipo:</strong> ${product.specs.memoryType}</p>
                        <p><strong>Slots:</strong> ${product.specs.memorySlots}</p>
                        <p><strong>Máximo:</strong> ${product.specs.maxMemory}</p>
                    </div>
                    <div class="spec-group">
                        <h4>Expansão</h4>
                        <p><strong>PCIe:</strong> ${product.specs.pciSlots}</p>
                        <p><strong>Armazenamento:</strong> ${product.specs.storage}</p>
                    </div>
                    <div class="spec-group">
                        <h4>Conectividade</h4>
                        <p><strong>Rede:</strong> ${product.specs.networking}</p>
                        <p><strong>Áudio:</strong> ${product.specs.audio}</p>
                        <p><strong>USB:</strong> ${product.specs.usb}</p>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    modal.style.display = 'block';
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
}

function addToCartFromModal(productId) {
    const quantity = parseInt(document.getElementById('quantity').value) || 1;
    const product = products.find(p => p.id === productId);
    if (!product || !product.inStock) return;
    
    const existingItem = cart.find(item => item.id === productId);
    
    if (existingItem) {
        existingItem.quantity += quantity;
    } else {
        cart.push({
            ...product,
            quantity: quantity
        });
    }
    
    updateCartUI();
    saveCartToStorage();
    showToast(`${quantity}x ${product.name} adicionado ao carrinho!`);
    closeModal();
}

function buyNow(productId) {
    addToCartFromModal(productId);
    setTimeout(() => {
        proceedToCheckout();
    }, 500);
}

function closeModal() {
    const modal = document.getElementById('productModal');
    modal.style.display = 'none';
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = 'auto';
}

// ===== COMPARISON FUNCTIONALITY =====
function toggleCompareMode() {
    isCompareMode = !isCompareMode;
    const compareBtn = document.querySelector('.compare-btn');
    const comparePanel = document.getElementById('comparePanel');
    
    if (isCompareMode) {
        compareBtn.textContent = 'Sair da Comparação';
        compareBtn.style.background = '#ef4444';
        comparePanel.classList.add('active');
    } else {
        compareBtn.innerHTML = '<i class="fas fa-balance-scale"></i> Comparar';
        compareBtn.style.background = '';
        comparePanel.classList.remove('active');
        clearComparison();
    }
    
    loadProducts(); // Reload to show/hide compare checkboxes
}

function toggleCompare(productId) {
    const product = products.find(p => p.id === productId);
    if (!product) return;
    
    const index = compareList.findIndex(p => p.id === productId);
    
    if (index > -1) {
        compareList.splice(index, 1);
        showToast(`${product.name} removido da comparação.`);
    } else {
        if (compareList.length >= 3) {
            showToast('Você pode comparar no máximo 3 produtos.', 'warning');
            return;
        }
        compareList.push(product);
        showToast(`${product.name} adicionado à comparação.`);
    }
    
    updateComparePanel();
}

function updateComparePanel() {
    const compareProducts = document.getElementById('compareProducts');
    const compareActionBtn = document.querySelector('.compare-action-btn');
    
    compareProducts.innerHTML = compareList.map(product => `
        <div class="compare-item">
            <img src="${product.image}" alt="${product.name}" width="60" height="40">
            <span>${product.name}</span>
            <button onclick="toggleCompare('${product.id}')" class="remove-compare">×</button>
        </div>
    `).join('');
    
    compareActionBtn.disabled = compareList.length < 2;
    compareActionBtn.style.opacity = compareList.length < 2 ? '0.5' : '1';
}

function clearComparison() {
    compareList = [];
    updateComparePanel();
}

function showComparison() {
    if (compareList.length < 2) {
        showToast('Selecione pelo menos 2 produtos para comparar.', 'warning');
        return;
    }
    
    const modal = document.getElementById('comparisonModal');
    const modalContent = document.getElementById('comparisonContent');
    
    modalContent.innerHTML = `
        <div class="comparison-table">
            <h2>Comparação de Produtos</h2>
            <div class="comparison-table-content">
                <table>
                    <thead>
                        <tr>
                            <th>Especificação</th>
                            ${compareList.map(product => `<th>${product.name}</th>`).join('')}
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td><strong>Imagem</strong></td>
                            ${compareList.map(product => `<td><img src="${product.image}" alt="${product.name}" width="100" height="60"></td>`).join('')}
                        </tr>
                        <tr>
                            <td><strong>Preço</strong></td>
                            ${compareList.map(product => `<td>${formatPrice(product.price)}</td>`).join('')}
                        </tr>
                        <tr>
                            <td><strong>Socket</strong></td>
                            ${compareList.map(product => `<td>${product.socket}</td>`).join('')}
                        </tr>
                        <tr>
                            <td><strong>Chipset</strong></td>
                            ${compareList.map(product => `<td>${product.specs.chipset}</td>`).join('')}
                        </tr>
                        <tr>
                            <td><strong>Memória</strong></td>
                            ${compareList.map(product => `<td>${product.specs.memoryType} - ${product.specs.maxMemory}</td>`).join('')}
                        </tr>
                        <tr>
                            <td><strong>Form Factor</strong></td>
                            ${compareList.map(product => `<td>${product.specs.formFactor}</td>`).join('')}
                        </tr>
                        <tr>
                            <td><strong>VRM</strong></td>
                            ${compareList.map(product => `<td>${product.vrm}</td>`).join('')}
                        </tr>
                        <tr>
                            <td><strong>Avaliação</strong></td>
                            ${compareList.map(product => `<td>${generateStars(product.rating)} (${product.reviews})</td>`).join('')}
                        </tr>
                    </tbody>
                </table>
            </div>
            <div class="comparison-actions">
                ${compareList.map(product => `
                    <button class="btn-add-to-cart" onclick="addToCart('${product.id}')" ${!product.inStock ? 'disabled' : ''}>
                        <i class="fas fa-shopping-cart"></i>
                        Adicionar ${product.name.split(' ')[1]}
                    </button>
                `).join('')}
            </div>
        </div>
    `;
    
    modal.style.display = 'block';
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
}

function closeComparisonModal() {
    const modal = document.getElementById('comparisonModal');
    modal.style.display = 'none';
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = 'auto';
}

// ===== CART FUNCTIONALITY =====
function toggleCart() {
    const cartSidebar = document.getElementById('cartSidebar');
    cartSidebar.classList.toggle('active');
    
    if (cartSidebar.classList.contains('active')) {
        document.body.style.overflow = 'hidden';
    } else {
        document.body.style.overflow = 'auto';
    }
}

function updateCartUI() {
    const cartCount = document.getElementById('cartCount');
    const cartItems = document.getElementById('cartItems');
    const cartTotal = document.getElementById('cartTotal');
    
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    const totalPrice = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    
    // Update cart count
    if (totalItems > 0) {
        cartCount.textContent = totalItems;
        cartCount.style.display = 'flex';
    } else {
        cartCount.style.display = 'none';
    }
    
    // Update cart items
    if (cart.length === 0) {
        cartItems.innerHTML = `
            <div class="empty-cart">
                <i class="fas fa-shopping-cart"></i>
                <p>Seu carrinho está vazio</p>
            </div>
        `;
    } else {
        cartItems.innerHTML = cart.map(item => `
            <div class="cart-item">
                <img src="${item.image}" alt="${item.name}" class="cart-item-image" width="60" height="40">
                <div class="cart-item-info">
                    <h4>${item.name}</h4>
                    <p>${formatPrice(item.price)}</p>
                    <div class="cart-item-controls">
                        <button onclick="updateCartQuantity('${item.id}', ${item.quantity - 1})" ${item.quantity <= 1 ? 'disabled' : ''}>-</button>
                        <span>${item.quantity}</span>
                        <button onclick="updateCartQuantity('${item.id}', ${item.quantity + 1})">+</button>
                        <button onclick="removeFromCart('${item.id}')" class="remove-item">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </div>
            </div>
        `).join('');
    }
    
    // Update total
    cartTotal.textContent = formatPrice(totalPrice).replace('R$', '').trim();
}

function updateCartQuantity(productId, newQuantity) {
    if (newQuantity <= 0) {
        removeFromCart(productId);
        return;
    }
    
    const item = cart.find(item => item.id === productId);
    if (item) {
        item.quantity = newQuantity;
        updateCartUI();
        saveCartToStorage();
    }
}

function removeFromCart(productId) {
    const index = cart.findIndex(item => item.id === productId);
    if (index > -1) {
        const item = cart[index];
        cart.splice(index, 1);
        updateCartUI();
        saveCartToStorage();
        showToast(`${item.name} removido do carrinho.`);
    }
}

function proceedToCheckout() {
    if (cart.length === 0) {
        showToast('Seu carrinho está vazio.', 'warning');
        return;
    }
    
    const totalPrice = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const message = `Olá! Gostaria de finalizar minha compra:\n\n${cart.map(item => 
        `• ${item.name} (${item.quantity}x) - ${formatPrice(item.price * item.quantity)}`
    ).join('\n')}\n\nTotal: ${formatPrice(totalPrice)}`;
    
    const whatsappUrl = `https://wa.me/5511934567890?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
}

// ===== STORAGE FUNCTIONS =====
function saveCartToStorage() {
    localStorage.setItem('xbyte-cart', JSON.stringify(cart));
}

function loadCartFromStorage() {
    const savedCart = localStorage.getItem('xbyte-cart');
    if (savedCart) {
        cart = JSON.parse(savedCart);
    }
}

// ===== SUPPORT FUNCTIONS =====
function openEmailSupport() {
    const subject = 'Suporte Técnico - XByte Studios';
    const body = 'Olá! Preciso de ajuda com...';
    window.location.href = `mailto:Xbytestudiosoficial@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}

function callSupport() {
    window.location.href = 'tel:+551134567890';
}

function openChat() {
    const message = 'Olá! Preciso de suporte técnico.';
    const whatsappUrl = `https://wa.me/5511934567890?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
}

// ===== SCROLL FUNCTIONS =====
function scrollToSection(sectionId) {
    const section = document.getElementById(sectionId);
    if (section) {
        section.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
    }
}

// ===== LOADING ANIMATIONS =====
function initializeAnimations() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('loaded');
            }
        });
    });

    document.querySelectorAll('.product-card, .payment-card, .detail-card').forEach(el => {
        el.classList.add('loading');
        observer.observe(el);
    });
}

// Initialize animations when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    setTimeout(initializeAnimations, 100);
});

// ===== HEADER SCROLL EFFECT =====
window.addEventListener('scroll', function() {
    const header = document.querySelector('.header');
    if (window.scrollY > 100) {
        header.style.background = 'rgba(255, 255, 255, 0.98)';
        header.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.1)';
    } else {
        header.style.background = 'rgba(255, 255, 255, 0.95)';
        header.style.boxShadow = 'none';
    }
});
