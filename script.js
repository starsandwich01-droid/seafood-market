// ===========================
// LOAD CART DARI LOCALSTORAGE
// ===========================
let cart = JSON.parse(localStorage.getItem("cart")) || [];

function saveCart() {
  localStorage.setItem("cart", JSON.stringify(cart));
}

// ===========================
// FORMAT RUPIAH
// ===========================
function rupiah(num) {
  return "Rp" + num.toLocaleString('id-ID');
}

// ===========================
// UPDATE ANGKA KERANJANG
// ===========================
function updateCartCount() {
  const c = cart.reduce((s, i) => s + i.qty, 0);
  const el = document.getElementById("cartCount");
  if (el) el.textContent = c;
}

// ===========================
// TAMBAH KE KERANJANG
// ===========================
function addToCart(id) {
  const product = PRODUCTS.find(p => p.id === id);
  if (!product) return;

  const found = cart.find(i => i.id === id);
  if (found) {
    found.qty++;
  } else {
    cart.push({ ...product, qty: 1 });
  }

  saveCart();
  updateCartCount();
  alert(`${product.name} ditambahkan ke keranjang!`);
}

// ===========================
// UBAH JUMLAH
// ===========================
function changeQty(id, change) {
  const item = cart.find(i => i.id === id);
  if (!item) return;

  item.qty += change;
  if (item.qty <= 0) {
    cart = cart.filter(i => i.id !== id);
  }

  saveCart();
  renderCart();
  updateCartCount();
}

// ===========================
// HAPUS ITEM
// ===========================
function removeFromCart(id) {
  cart = cart.filter(i => i.id !== id);

  saveCart();
  renderCart();
  updateCartCount();
}

// ===========================
// RENDER KERANJANG
// ===========================
function renderCart() {
  const container = document.getElementById("cartItems");
  if (!container) return;

  container.innerHTML = "";
  let subtotal = 0;

  cart.forEach(item => {
    subtotal += item.price * item.qty;

    const row = document.createElement("div");
    row.className = "cart-row";
    row.innerHTML = `
      <div>
        <strong>${item.name}</strong><br>
        <small>${rupiah(item.price)}</small>
      </div>
      <div>
        <button onclick="changeQty(${item.id}, -1)">-</button>
        <span style="margin:0 6px">${item.qty}</span>
        <button onclick="changeQty(${item.id}, 1)">+</button>
        <button onclick="removeFromCart(${item.id})" style="margin-left:8px;color:#ef4444">✕</button>
      </div>
    `;
    container.appendChild(row);
  });

  const subtotalEl = document.getElementById("subtotal");
  if (subtotalEl) subtotalEl.textContent = rupiah(subtotal);
}

// ===========================
// BUKA & TUTUP KERANJANG
// ===========================
function openCart() {
  const modal = document.getElementById("cartModal");
  if (!modal) return;

  modal.classList.remove("hidden");
  renderCart();
}

function closeCart() {
  const modal = document.getElementById("cartModal");
  if (modal) modal.classList.add("hidden");
}

// ===========================
// CHECKOUT WHATSAPP
// ===========================
function openWaCheckout() {
  const PHONE_NUMBER = '6281234567890';
  const messages = [];

  if (cart.length === 0) {
    messages.push('Halo, saya mau tanya menu dan promo.');
  } else {
    let total = 0;
    messages.push('Halo, saya mau pesan:');

    cart.forEach(it => {
      messages.push(`- ${it.name} x${it.qty} = ${rupiah(it.price * it.qty)}`);
      total += it.price * it.qty;
    });

    messages.push(`Total: ${rupiah(total)}`);

    const name = document.getElementById('custName')?.value || '';
    const address = document.getElementById('custAddress')?.value || '';
    const notes = document.getElementById('custNotes')?.value || '';

    if (name) messages.push(`Nama: ${name}`);
    if (address) messages.push(`Alamat: ${address}`);
    if (notes) messages.push(`Catatan: ${notes}`);
  }

  const text = encodeURIComponent(messages.join("\n"));
  window.open(`https://wa.me/${PHONE_NUMBER}?text=${text}`, "_blank");
}

// ===========================
// DATA PRODUK
// ===========================
const PRODUCTS = [
  { id: 1, name: "CUMI SEDANG", price: 15000, img: "https://raw.githubusercontent.com/starsandwich01-droid/image/refs/heads/main/WhatsApp%20Image%202025-11-15%20at%2000.36.51.jpeg", cat: "mentah" },
  { id: 2, name: "UDANG+KERANG IJO", price: 95000, img: "https://raw.githubusercontent.com/starsandwich01-droid/image/refs/heads/main/WhatsApp%20Image%202025-11-15%20at%2000.36.52.jpeg", cat: "matang" },
  { id: 3, name: "Cumi Segar", price: 80000, img: "https://source.unsplash.com/400x300/?squid", cat: "mentah" },

  { id: 4, name: "Kepiting Saus Padang", price: 120000, img: "https://source.unsplash.com/400x300/?crab", cat: "matang" },
  { id: 5, name: "Udang Goreng Tepung", price: 65000, img: "https://source.unsplash.com/400x300/?fried-shrimp", cat: "matang" },
  { id: 6, name: "Cumi Bakar Pedas", price: 70000, img: "https://source.unsplash.com/400x300/?grilled-squid", cat: "matang" },

  { id: 7, name: "Nasi Putih", price: 8000, img: "https://source.unsplash.com/400x300/?rice", cat: "lauk" },
  { id: 8, name: "Sambal Matah", price: 10000, img: "https://source.unsplash.com/400x300/?sambal", cat: "lauk" },
  { id: 9, name: "Sayur Asem", price: 12000, img: "https://source.unsplash.com/400x300/?vegetable-soup", cat: "lauk" },
];

// ===========================
// RENDER PRODUK BERDASARKAN KATEGORI
// ===========================
function renderProducts() {
  const container = document.getElementById('productList');
  if (!container) return;

  const params = new URLSearchParams(window.location.search);
  const cat = params.get('cat');
  const title = document.getElementById('pageTitle');

  let filtered = PRODUCTS;
  if (cat) {
    filtered = PRODUCTS.filter(p => p.cat === cat);
    if (title) title.textContent =
      cat === "mentah" ? "Seafood Mentah" :
      cat === "matang" ? "Seafood Matang" :
      cat === "lauk" ? "Lauk & Pendamping" : "Semua Menu";
  } else {
    if (title) title.textContent = "Semua Menu";
  }

  container.innerHTML = "";
  filtered.forEach(p => {
    const card = document.createElement('div');
    card.className = 'product-card';
    card.innerHTML = `
      <img src="${p.img}" alt="${p.name}">
      <h3>${p.name}</h3>
      <p>${rupiah(p.price)}</p>
      <button onclick="addToCart(${p.id})">Tambah ke Keranjang</button>
    `;
    container.appendChild(card);
  });
}

// ===========================
// ON LOAD
// ===========================
document.addEventListener("DOMContentLoaded", () => {
  renderProducts();
  updateCartCount();
});

// ===========================
// EXPOSE GLOBAL
// ===========================
window.addToCart = addToCart;
window.changeQty = changeQty;
window.removeFromCart = removeFromCart;
window.renderCart = renderCart;
window.openCart = openCart;
window.closeCart = closeCart;
window.checkoutWA = openWaCheckout;
