const STORAGE_KEY = 'la-cosecha-store-v1';
const defaults = {
  name: 'La Cosecha', phone: '', paymentInstructions: 'El pago se coordina directamente con la tienda.', paymentLink: '',
  products: [
    { id: 'tomate', name: 'Tomate de huerto', category: 'Verduras', price: 35, unit: 'kg', stock: 18, emoji: '🍅', description: 'Madurado al sol, ideal para ensaladas.' },
    { id: 'naranja', name: 'Naranja dulce', category: 'Frutas', price: 28, unit: 'kg', stock: 24, emoji: '🍊', description: 'Jugosa y recién cosechada.' },
    { id: 'lechuga', name: 'Lechuga fresca', category: 'Verduras', price: 22, unit: 'pieza', stock: 12, emoji: '🥬', description: 'Hojas tiernas, cosecha de temporada.' },
    { id: 'huevo', name: 'Huevo de rancho', category: 'Otros', price: 68, unit: 'docena', stock: 8, emoji: '🥚', description: 'De gallinas libres, por docena.' },
    { id: 'aguacate', name: 'Aguacate', category: 'Frutas', price: 55, unit: 'kg', stock: 10, emoji: '🥑', description: 'Cremoso y listo para disfrutar.' },
    { id: 'zanahoria', name: 'Zanahoria', category: 'Verduras', price: 25, unit: 'kg', stock: 16, emoji: '🥕', description: 'Dulce, crujiente y versátil.' }
  ]
};
let store = loadStore();
let cart = {};
let activeCategory = 'Todos';
let toastTimer;
const $ = (selector) => document.querySelector(selector);
const money = (amount) => new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN', maximumFractionDigits: 2 }).format(Number(amount) || 0);
function loadStore() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
    if (saved && Array.isArray(saved.products)) return { ...structuredClone(defaults), ...saved };
  } catch (error) { console.warn('No se pudo leer el inventario guardado.', error); }
  return structuredClone(defaults);
}
function saveStore() { localStorage.setItem(STORAGE_KEY, JSON.stringify(store)); }
function escapeHTML(value) { return String(value ?? '').replace(/[&<>"']/g, (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[char]); }
function notify(message) { const toast = $('#toast'); toast.textContent = message; toast.classList.add('visible'); clearTimeout(toastTimer); toastTimer = setTimeout(() => toast.classList.remove('visible'), 2600); }
function renderStoreName() { $('#store-name').textContent = store.name; $('#footer-store-name').textContent = store.name; document.title = `${store.name} — pedidos fáciles`; }
function categories() { return ['Todos', ...new Set(store.products.map((item) => item.category).filter(Boolean))]; }
function renderCategories() {
  $('#category-list').innerHTML = categories().map((category) => `<button class="category-chip ${category === activeCategory ? 'selected' : ''}" data-category="${escapeHTML(category)}">${escapeHTML(category)}</button>`).join('');
  document.querySelectorAll('[data-category]').forEach((button) => button.addEventListener('click', () => { activeCategory = button.dataset.category; renderCategories(); renderProducts(); }));
}
function renderProducts() {
  const query = $('#search').value.trim().toLocaleLowerCase('es');
  const products = store.products.filter((item) => (activeCategory === 'Todos' || item.category === activeCategory) && `${item.name} ${item.category} ${item.description}`.toLocaleLowerCase('es').includes(query));
  $('#product-grid').innerHTML = products.length ? products.map((item) => {
    const available = Number(item.stock) > 0;
    return `<article class="product-card"><div class="product-image"><span>${escapeHTML(item.emoji || '🌱')}</span><span class="stock-badge ${available ? '' : 'sold-out'}">${available ? `${escapeHTML(item.stock)} ${escapeHTML(item.unit)} disponibles` : 'Agotado'}</span></div><div class="product-info"><span class="product-category">${escapeHTML(item.category)}</span><h3>${escapeHTML(item.name)}</h3><p>${escapeHTML(item.description || '')}</p><div class="product-buy"><strong>${money(item.price)} <small>/ ${escapeHTML(item.unit)}</small></strong><button class="add-button" data-add="${escapeHTML(item.id)}" ${available ? '' : 'disabled'} aria-label="Agregar ${escapeHTML(item.name)}">＋</button></div></div></article>`;
  }).join('') : '<div class="empty-state">No encontramos productos. Prueba otra búsqueda o categoría.</div>';
  document.querySelectorAll('[data-add]').forEach((button) => button.addEventListener('click', () => addToCart(button.dataset.add)));
}
function addToCart(id) {
  const product = store.products.find((item) => item.id === id);
  if (!product || (cart[id] || 0) >= Number(product.stock)) return notify('No hay más unidades disponibles.');
  cart[id] = (cart[id] || 0) + 1; renderCart(); notify(`${product.name} agregado al pedido.`);
}
function renderCart() {
  const entries = Object.entries(cart).filter(([, quantity]) => quantity > 0);
  const totalQuantity = entries.reduce((sum, [, quantity]) => sum + quantity, 0);
  $('#cart-count').textContent = totalQuantity;
  $('#cart-items').innerHTML = entries.length ? entries.map(([id, quantity]) => {
    const item = store.products.find((product) => product.id === id);
    if (!item) return '';
    return `<div class="cart-line"><div><strong>${escapeHTML(item.name)}</strong><small>${money(item.price)} / ${escapeHTML(item.unit)}</small></div><div class="quantity-control"><button data-quantity="${escapeHTML(id)}" data-delta="-1" aria-label="Quitar una unidad">−</button><span>${quantity}</span><button data-quantity="${escapeHTML(id)}" data-delta="1" aria-label="Agregar una unidad" ${quantity >= Number(item.stock) ? 'disabled' : ''}>＋</button></div><strong>${money(item.price * quantity)}</strong></div>`;
  }).join('') : '<div class="empty-state">Tu pedido está vacío. Agrega algo rico del catálogo.</div>';
  const total = entries.reduce((sum, [id, quantity]) => sum + (store.products.find((item) => item.id === id)?.price || 0) * quantity, 0);
  $('#cart-total').textContent = money(total);
  document.querySelectorAll('[data-quantity]').forEach((button) => button.addEventListener('click', () => {
    const id = button.dataset.quantity; const next = (cart[id] || 0) + Number(button.dataset.delta);
    if (next <= 0) delete cart[id]; else cart[id] = Math.min(next, Number(store.products.find((item) => item.id === id)?.stock || 0));
    renderCart();
  }));
  const payment = $('#payment-method');
  payment.innerHTML = `<option value="coordinar">Coordinar con la tienda</option>${store.paymentLink ? '<option value="link">Pagar con enlace seguro de la tienda</option>' : ''}`;
  $('#payment-hint').textContent = store.paymentInstructions || '';
}
function orderText() {
  const name = $('#customer-name').value.trim();
  const type = $('#order-type').value;
  const date = $('#reservation-date').value;
  const method = $('#payment-method').selectedOptions[0]?.textContent || 'Coordinar';
  const lines = Object.entries(cart).map(([id, quantity]) => { const item = store.products.find((product) => product.id === id); return item ? `• ${item.name}: ${quantity} ${item.unit} — ${money(item.price * quantity)}` : ''; }).filter(Boolean);
  const total = Object.entries(cart).reduce((sum, [id, quantity]) => sum + (store.products.find((item) => item.id === id)?.price || 0) * quantity, 0);
  return [`Hola, quiero hacer este pedido en ${store.name}:`, ...lines, `Total estimado: ${money(total)}`, `Cliente: ${name}`, `Modalidad: ${type === 'reserva' ? `Reserva para retirar${date ? ` el ${date}` : ''}` : 'Entrega / coordinar'}`, `Pago: ${method}`, $('#order-notes').value.trim() ? `Nota: ${$('#order-notes').value.trim()}` : ''].filter(Boolean).join('\n');
}
function openModal(id) { document.getElementById(id).hidden = false; document.body.classList.add('modal-open'); }
function closeModal(id) { document.getElementById(id).hidden = true; if (![...document.querySelectorAll('.overlay')].some((modal) => !modal.hidden)) document.body.classList.remove('modal-open'); }
function renderInventory() {
  $('#inventory-list').innerHTML = store.products.length ? store.products.map((item) => `<div class="inventory-row"><span class="inventory-emoji">${escapeHTML(item.emoji || '🌱')}</span><div class="inventory-name"><strong>${escapeHTML(item.name)}</strong><small>${money(item.price)} / ${escapeHTML(item.unit)}</small></div><label class="stock-edit">Stock<input type="number" min="0" step="0.1" value="${Number(item.stock) || 0}" data-stock="${escapeHTML(item.id)}" aria-label="Stock de ${escapeHTML(item.name)}"></label><button class="text-button" data-delete="${escapeHTML(item.id)}" aria-label="Eliminar ${escapeHTML(item.name)}">Eliminar</button></div>`).join('') : '<p>Aún no hay productos.</p>';
  document.querySelectorAll('[data-stock]').forEach((input) => input.addEventListener('change', () => { const item = store.products.find((product) => product.id === input.dataset.stock); if (item) item.stock = Math.max(0, Number(input.value) || 0); saveStore(); renderProducts(); renderCart(); }));
  document.querySelectorAll('[data-delete]').forEach((button) => button.addEventListener('click', () => { store.products = store.products.filter((item) => item.id !== button.dataset.delete); delete cart[button.dataset.delete]; saveStore(); renderAll(); }));
}
function renderAll() { renderStoreName(); renderCategories(); renderProducts(); renderCart(); renderInventory(); }
$('#search').addEventListener('input', renderProducts);
$('#cart-open').addEventListener('click', () => { renderCart(); openModal('cart-modal'); });
$('#admin-open').addEventListener('click', () => {
  $('#setting-name').value = store.name; $('#setting-phone').value = store.phone; $('#setting-payment').value = store.paymentInstructions; $('#setting-payment-link').value = store.paymentLink;
  renderInventory(); openModal('admin-modal');
});
document.querySelectorAll('[data-close]').forEach((button) => button.addEventListener('click', () => closeModal(button.dataset.close)));
document.querySelectorAll('.overlay').forEach((modal) => modal.addEventListener('click', (event) => { if (event.target === modal) closeModal(modal.id); }));
document.addEventListener('keydown', (event) => { if (event.key === 'Escape') document.querySelectorAll('.overlay:not([hidden])').forEach((modal) => closeModal(modal.id)); });
$('#order-type').addEventListener('change', () => { const isReservation = $('#order-type').value === 'reserva'; $('#date-wrap').hidden = !isReservation; $('#reservation-date').required = isReservation; if (isReservation) $('#reservation-date').min = new Date().toISOString().slice(0, 10); });
$('#checkout-form').addEventListener('submit', (event) => {
  event.preventDefault();
  if (!Object.keys(cart).length) return notify('Agrega productos antes de enviar el pedido.');
  for (const [id, quantity] of Object.entries(cart)) { const product = store.products.find((item) => item.id === id); if (!product || quantity > Number(product.stock)) return notify('Cambió la disponibilidad. Revisa tu pedido.'); }
  const text = orderText(); const digits = store.phone.replace(/\D/g, '');
  if (digits) window.open(`https://wa.me/${digits}?text=${encodeURIComponent(text)}`, '_blank', 'noopener,noreferrer');
  else if (navigator.share) navigator.share({ title: `Pedido para ${store.name}`, text }).catch(() => {});
  else navigator.clipboard?.writeText(text).then(() => notify('Pedido copiado. Configura WhatsApp en “Mi tienda”.'));
  if ($('#payment-method').value === 'link' && store.paymentLink) window.open(store.paymentLink, '_blank', 'noopener,noreferrer');
  for (const [id, quantity] of Object.entries(cart)) { const product = store.products.find((item) => item.id === id); if (product) product.stock = Math.max(0, Number(product.stock) - quantity); }
  saveStore(); cart = {}; renderAll(); closeModal('cart-modal'); notify('Pedido preparado. La tienda debe confirmar disponibilidad y pago.');
});
$('#print-ticket').addEventListener('click', () => {
  if (!Object.keys(cart).length) return notify('Agrega productos antes de imprimir.');
  const text = orderText(); const win = window.open('', '_blank', 'width=420,height=640');
  if (!win) return notify('Permite ventanas emergentes para imprimir el ticket.');
  win.document.write(`<!doctype html><html lang="es"><meta charset="utf-8"><title>Ticket — ${escapeHTML(store.name)}</title><style>body{font:16px system-ui;max-width:360px;margin:32px auto;color:#222}h1{font-size:22px}pre{white-space:pre-wrap;font:15px/1.6 system-ui;border-top:1px dashed #aaa;padding-top:18px}.small{color:#666;font-size:12px}</style><h1>${escapeHTML(store.name)}</h1><pre>${escapeHTML(text)}</pre><p class="small">Pedido pendiente de confirmación por la tienda. No es comprobante de pago.</p><script>window.onload=()=>window.print()<\/script></html>`);
  win.document.close();
});
$('#settings-form').addEventListener('submit', (event) => {
  event.preventDefault(); const paymentLink = $('#setting-payment-link').value.trim();
  if (paymentLink && !/^https:\/\//i.test(paymentLink)) return notify('El enlace de pago debe comenzar con https://');
  store.name = $('#setting-name').value.trim(); store.phone = $('#setting-phone').value.trim(); store.paymentInstructions = $('#setting-payment').value.trim(); store.paymentLink = paymentLink;
  saveStore(); renderAll(); notify('Configuración guardada en este navegador.');
});
$('#add-product').addEventListener('click', () => {
  const name = prompt('Nombre del producto:'); if (!name?.trim()) return;
  const price = Number(prompt('Precio por unidad:')); if (!Number.isFinite(price) || price < 0) return notify('Precio no válido.');
  const stock = Number(prompt('Cantidad disponible:')); if (!Number.isFinite(stock) || stock < 0) return notify('Cantidad no válida.');
  const category = prompt('Categoría (por ejemplo, Frutas o Verduras):', 'Otros') || 'Otros';
  const unit = prompt('Unidad (kg, pieza, docena…):', 'pieza') || 'pieza';
  store.products.push({ id: `item-${Date.now()}`, name: name.trim(), category: category.trim(), price, unit: unit.trim(), stock, emoji: '🌱', description: 'Producto fresco de temporada.' });
  saveStore(); renderAll(); notify('Producto agregado.');
});
$('#export-data').addEventListener('click', () => {
  const blob = new Blob([JSON.stringify(store, null, 2)], { type: 'application/json' }); const link = document.createElement('a'); link.href = URL.createObjectURL(blob); link.download = 'respaldo-tienda.json'; link.click(); URL.revokeObjectURL(link.href); notify('Respaldo descargado.');
});
$('#import-data').addEventListener('change', async (event) => {
  const file = event.target.files[0]; if (!file) return;
  try { const imported = JSON.parse(await file.text()); if (!Array.isArray(imported.products) || typeof imported.name !== 'string') throw new Error('Formato inválido'); store = { ...structuredClone(defaults), ...imported }; saveStore(); renderAll(); notify('Respaldo importado.'); }
  catch { notify('No se pudo importar ese archivo.'); }
  event.target.value = '';
});
$('#voice-search').addEventListener('click', () => {
  const Recognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (!Recognition) return notify('La búsqueda por voz no está disponible en este navegador.');
  const recognition = new Recognition(); recognition.lang = 'es-MX'; recognition.interimResults = false; recognition.maxAlternatives = 1;
  recognition.onresult = (event) => { $('#search').value = event.results[0][0].transcript; renderProducts(); notify(`Buscando: ${$('#search').value}`); };
  recognition.onerror = () => notify('No se pudo escuchar. Revisa el permiso del micrófono.'); recognition.start();
});
renderAll();
