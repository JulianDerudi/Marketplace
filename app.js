const API_URL = "https://dummyjson.com/products";

const CART_STORAGE_KEY = "marketplace_cart";
const PRODUCTS_STORAGE_KEY = "marketplace_products";

// Estado de la aplicación
let products_state = JSON.parse(localStorage.getItem(PRODUCTS_STORAGE_KEY)) || [];// array con los productos tal cual de la API
let cart_state = JSON.parse(localStorage.getItem(CART_STORAGE_KEY)) || []; // array de items del carrito
let loading_products_state = false; // bool que indica si se estan cargando
let error_state = null; // guarda info sobre posibles errores (null o string)
let total_state = 0; // total del carrito de compras




// Referencias al html
const catalog_container_html = document.getElementById("catalog-container");
const cart_container_html = document.getElementById("cart-products-container");




// Fetch de productos desde la API
async function fetchProducts() {
    try {
        setLoadingProducts(true);

        const response = await fetch(API_URL);

        if (!response.ok) {
            throw new Error('Server response error status: ' + response.status);
        }

        const data = await response.json();
        // Si no hay productos guardados, usar los de la API
        if (products_state.length === 0) {
            setProducts(data.products);
            saveProductsToLocalStorage();
        } else {
            renderProducts();
        }

    } catch (error) {
        setError('Error loading products: ' + error.message);
        catalog_container_html.innerHTML = "<p>Error loading products. Please try again later.</p>";
    
    } finally {
        setLoadingProducts(false);
    }
}




// Renderizados
function renderProducts() {
    let catalog_render_str = `
        <div class="catalog-header">
            <h2>Product Catalog</h2>
        </div>
        <div class="products-container">
    `;
    
    for(let product of products_state){
        
        catalog_render_str += `
            <div class="product-card" id="${product.id}">
                <img src="${product.images[0]}" alt="${product.title}" />
                <div class="info-product-container">
                    <h3>${product.title}</h3>
                    <span>Price: $${product.price}</span>
                    <span>Available units: ${product.stock}</span>
                </div>
                <button type="button" class='btn-add-cart' data-add_id='${product.id}'>Add Cart</button>
            </div>
        `
    }

    catalog_render_str += `
        </div>
    `;

    catalog_container_html.innerHTML = catalog_render_str;

    
    
    // Agregar event listeners a los botones "Agregar Carrito"
    const addToCartButtons = document.querySelectorAll('.btn-add-cart');
    addToCartButtons.forEach(button => {
        button.addEventListener('click', () => {
            const productId = parseInt(button.getAttribute('data-add_id'));
            addToCart(productId);
        });
    });

}
function renderCart() {
    const currentScrollTop = cart_container_html.querySelector('.cart-items-container')?.scrollTop || 0;
    let cart_render_str = `
        <h2>Shopping Cart</h2>
        <div class="cart-items-container">
    `;
    for(let product of cart_state){
        if(product.quantity === 0){
            continue;
        }
        cart_render_str += `
            <div class="cart-item" id="${product.id}">
                <div class="info-cart-product-container">
                    <h3>${product.title}</h3>
                    <span>Unit price: $${product.price}</span>
                    <span>Total Price: $${(product.price * product.quantity).toFixed(2)}</span> 
                </div>
                <div class="product-actions-container">
                    <div class="btn-container">
                        <button type="button" class='btn-increase' data-increase_id='${product.id}'>+</button>
                        <span class='quantity'>${product.quantity}</span>
                        <button type="button" class='btn-decrease' data-decrease_id='${product.id}'>-</button>
                    </div>
                    <button type="button" class='btn-remove' data-remove_id='${product.id}'>Remove</button>
                </div>
            </div>
        `
    }

    cart_render_str += `
        </div>
        <h3>Total to pay: $${total_state}</h3>
        <div class="cart-actions-container">
            <button type="button" class="btn-clear-cart" id="btn-clear-cart">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-trash-fill" viewBox="0 0 16 16">
                <path d="M2.5 1a1 1 0 0 0-1 1v1a1 1 0 0 0 1 1H3v9a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V4h.5a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1H10a1 1 0 0 0-1-1H7a1 1 0 0 0-1 1zm3 4a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 .5-.5M8 5a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7A.5.5 0 0 1 8 5m3 .5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 1 0"/>
                </svg>
            </button>
            <button type="button" class="btn-checkout" id="btn-checkout">Checkout</button>
        </div>  
    `;

    cart_container_html.innerHTML = cart_render_str;
    cart_container_html.querySelector('.cart-items-container').scrollTop = currentScrollTop;

    // Agregar event listeners a los botones "Quitar", "Aumentar" y "Disminuir"
    const removeButtons = document.querySelectorAll('.btn-remove');
    const increaseButtons = document.querySelectorAll('.btn-increase');
    const decreaseButtons = document.querySelectorAll('.btn-decrease');

    removeButtons.forEach(button => {
        button.addEventListener('click', () => {
            const productId = parseInt(button.getAttribute('data-remove_id'));
            removeFromCart(productId);
        });
    });

    increaseButtons.forEach(button => {
        button.addEventListener('click', () => {
            const productId = parseInt(button.getAttribute('data-increase_id'));
            increaseQuantityToCart(productId);
        });
    });

    decreaseButtons.forEach(button => {
        button.addEventListener('click', () => {
            const productId = parseInt(button.getAttribute('data-decrease_id'));
            decreaseQuantityToCart(productId);
        });
    });

    // Agregar event listener al boton "Vaciar Carrito"
    const clearCartButton = document.getElementById('btn-clear-cart');
    clearCartButton.addEventListener('click', () => {
        cart_state.forEach(product => {
            increaseStockInCatalog(product.id, product.quantity);
        });
        setCart([]);
        setTotal(0);
        saveCartToLocalStorage();
        saveProductsToLocalStorage();
        renderProducts();
    });

    // Agregar event listener al boton "Finalizar Compra"
    const checkoutButton = document.getElementById('btn-checkout');
    checkoutButton.addEventListener('click', () => {
        if(cart_state.length === 0){
            alert("Your cart is empty. Please add items before completing your purchase.");
            return;
        }
        alert(`Purchase completed. Total to pay: $${total_state}`);
        setCart([]);
        setTotal(0);
        saveCartToLocalStorage();
        saveProductsToLocalStorage();
        renderProducts();
    });
}
function renderError() {
    if (error_state) {
        console.error("Error:", error_state);
        alert(error_state);
    }
}
function renderLoadingProducts() {
    if (loading_products_state) {
        catalog_container_html.innerHTML = "<p>Loading products...</p>";
    }
}




// Setters
function setProducts(newProducts) {
    products_state = newProducts;
    saveProductsToLocalStorage();
    renderProducts();
}
function setLoadingProducts(isLoading) {
    loading_products_state = isLoading;
    renderLoadingProducts();
}
function setError(errorMessage) {
    error_state = errorMessage;
    renderError();
}
function setTotal(newTotal) {
    total_state = newTotal;
    renderCart();
}
function setCart(newCart) {
    cart_state = newCart;
    saveCartToLocalStorage();
    renderCart();
}
function saveCartToLocalStorage() {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart_state));
}
function saveProductsToLocalStorage() {
    localStorage.setItem(PRODUCTS_STORAGE_KEY, JSON.stringify(products_state));
}




// Logica del catalogo
function decreaseStockInCatalog(productId) {
    const productFromCatalog = findProductFromCatalogById(productId);
    if (productFromCatalog && productFromCatalog.stock > 1) {
        productFromCatalog.stock -= 1;
    } else if (productFromCatalog && productFromCatalog.stock === 1) {
        productFromCatalog.stock -= 1;
        
    } else {
        setError("This product is out of stock.");
    }
    updateProductStockInDOM(productId);
    saveProductsToLocalStorage();
}
// Usar solo en el caso de decrementar cantidad en el carrito
function increaseStockInCatalog(productId, quantityToAdd = 1) {
    const productFromCatalog = findProductFromCatalogById(productId);
    if (productFromCatalog) {
        productFromCatalog.stock += quantityToAdd;
    } else {
            setError(`Product with ID[${productId}] not found in the catalog: cannot increase stock`);
    }
    saveProductsToLocalStorage();
}
function findProductFromCatalogById(id) {
    return products_state.find((product) => product.id === id);
}

function updateProductStockInDOM(productId) {
    const productFromCatalog = findProductFromCatalogById(productId);
    if (productFromCatalog) {
        const productCard = document.getElementById(productId);
        if (productCard) {
            const stockSpan = productCard.querySelector('.info-product-container span:last-child');
            if (stockSpan) {
                stockSpan.textContent = `Available units: ${productFromCatalog.stock}`;
            }
        }
    }
}





// Logica del carrito
function addToCart(productId) {
    const productInCart = findProductFromCartById(productId);
    const productFromCatalog = findProductFromCatalogById(productId);

    // Si ya está en el carrito, aumentar cantidad
    if (productInCart && productFromCatalog && productFromCatalog.stock > 0) {
        productInCart.quantity += 1;
        decreaseStockInCatalog(productId);
    } else { // Si no está, agregarlo con cantidad 1
        if (productFromCatalog && productFromCatalog.stock > 0) {
            cart_state.push({ ...productFromCatalog, quantity: 1 });
            decreaseStockInCatalog(productId);
        } else {
            setError("This product is out of stock.");
        }
    }


    calculateTotal();
    renderCart();
    saveCartToLocalStorage();
}
function removeFromCart(productId) {
    const productInCart = findProductFromCartById(productId);
    if (productInCart) {
        increaseStockInCatalog(productId, productInCart.quantity);
        cart_state = cart_state.filter((product) => product.id !== productId);
        saveCartToLocalStorage();
        calculateTotal();
        renderCart();
    }
}
function increaseQuantityToCart(productId) {
    const productInCart = findProductFromCartById(productId);
    const productFromCatalog = findProductFromCatalogById(productId);
    if (productInCart && productFromCatalog && productFromCatalog.stock > 0) {
        productInCart.quantity += 1;
        decreaseStockInCatalog(productId);
        calculateTotal();
        renderCart();
    } else {
        setError("This product is out of stock.");
    }
    saveCartToLocalStorage();
}
function decreaseQuantityToCart(productId) {
    const productInCart = findProductFromCartById(productId);
    if (productInCart && productInCart.quantity > 0) {
        productInCart.quantity -= 1;
        increaseStockInCatalog(productId);
        calculateTotal();
        renderCart();
    }
    if (productInCart && productInCart.quantity === 0) {
        removeFromCart(productId);
    }
    saveCartToLocalStorage();
}
function findProductFromCartById(id) {
    return cart_state.find((product) => product.id === id);
}
function calculateTotal() {
    const total_state = cart_state.reduce((acc, product) => acc + (product.price * product.quantity), 0);
    //solo con dos decimales
    const totalWithTwoDecimals = parseFloat(total_state.toFixed(2));
    setTotal(totalWithTwoDecimals);
}





// Inicialización de la aplicación
fetchProducts();
renderCart();

