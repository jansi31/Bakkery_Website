// cart.js

// Load cart from localStorage
function getCart() {
  return JSON.parse(localStorage.getItem("cart")) || [];
}

// Save cart to localStorage
function saveCart(cart) {
  localStorage.setItem("cart", JSON.stringify(cart));
}

// Update cart count in navbar
function updateCartCount() {
  const cart = getCart();
  const totalItems = cart.reduce((sum, item) => sum + (item.quantity || 1), 0);
  const cartCount = document.querySelector(".cart-count");
  if (cartCount) {
    cartCount.textContent = totalItems;
  }
}

// Add product to cart
function addToCart(product) {
  let cart = getCart();
  const existing = cart.find(item => item.id === product.id);

  if (existing) {
    existing.quantity += 1; // increase quantity if already in cart
  } else {
    cart.push({ ...product, quantity: 1 });
  }

  saveCart(cart);
  updateCartCount();
}

// Remove item from cart
function removeFromCart(productId) {
  let cart = getCart();
  cart = cart.filter(item => item.id !== productId); // delete product
  saveCart(cart);
  updateCartCount(); // update number in navbar
}

// Render cart items on the cart page
function renderCart() {
  const cart = getCart();
  const cartItemsContainer = document.getElementById("cart-items");
  const cartTotal = document.getElementById("cart-total");

  if (!cartItemsContainer) return; // run only on cart page

  cartItemsContainer.innerHTML = ""; // clear before re-render
  let total = 0;

  cart.forEach(item => {
    total += item.price * item.quantity;

    const div = document.createElement("div");
    div.classList.add("cart-item");
    div.innerHTML = `
      <span>${item.name} (x${item.quantity}) - $${item.price}</span>
      <button class="remove-from-cart" data-id="${item.id}">Remove</button>
    `;
    cartItemsContainer.appendChild(div);
  });

  cartTotal.textContent = total.toFixed(2);

  // Attach remove button events
  document.querySelectorAll(".remove-from-cart").forEach(button => {
    button.addEventListener("click", () => {
      const productId = button.dataset.id;
      removeFromCart(productId);
      renderCart(); // re-render UI without page reload
    });
  });
}

// Run on page load
document.addEventListener("DOMContentLoaded", () => {
  updateCartCount();
  renderCart(); // if cart page, show items

  // Attach to all "Add to Cart" buttons
  document.querySelectorAll(".add-to-cart").forEach(button => {
    button.addEventListener("click", () => {
      const product = {
        id: button.dataset.id,
        name: button.dataset.name,
        price: parseFloat(button.dataset.price)
      };
      addToCart(product);
      alert(`Item added to cart!`);
    });
  });
});
