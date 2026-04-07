/** Guest (logged-out) cart persisted in localStorage. */

export const GUEST_CART_KEY = 'ebiz_guest_cart';

export function readGuestCart() {
  try {
    const raw = localStorage.getItem(GUEST_CART_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function writeGuestCart(items) {
  localStorage.setItem(GUEST_CART_KEY, JSON.stringify(items));
}

export function guestLineId(productId, selectedSize = '', selectedColor = '') {
  return `${productId}::${selectedSize}::${selectedColor}`;
}

/**
 * Add or merge a line (same product + size + color increases quantity).
 */
export function addToGuestCart({
  productId,
  quantity,
  selectedSize = '',
  selectedColor = '',
  name,
  price,
  image,
}) {
  const id = guestLineId(productId, selectedSize, selectedColor);
  const items = readGuestCart();
  const idx = items.findIndex((i) => i.id === id);
  if (idx >= 0) {
    items[idx] = {
      ...items[idx],
      quantity: items[idx].quantity + quantity,
    };
  } else {
    items.push({
      id,
      productId,
      selectedSize,
      selectedColor,
      quantity,
      name,
      price: Number(price) || 0,
      image: image || '',
    });
  }
  writeGuestCart(items);
}

export function setGuestItemQuantity(lineId, quantity) {
  if (quantity < 1) {
    removeGuestCartItem(lineId);
    return;
  }
  const next = readGuestCart().map((i) =>
    i.id === lineId ? { ...i, quantity } : i
  );
  writeGuestCart(next);
}

export function removeGuestCartItem(lineId) {
  writeGuestCart(readGuestCart().filter((i) => i.id !== lineId));
}
