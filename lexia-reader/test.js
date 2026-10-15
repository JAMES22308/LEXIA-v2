/**
 * Calculates the total price.
 * @param {number} price      Unit price (must be a finite, non‑negative number)
 * @param {number} quantity   Quantity (must be a non‑negative integer)
 * @returns {number} Total cost
 * @throws {TypeError}  If arguments are of the wrong type or not finite.
 * @throws {RangeError} If arguments are negative or quantity is not an integer.
 */
function calculateTotal(price, quantity) {
  // Type & finiteness checks
  if (!Number.isFinite(price) || !Number.isFinite(quantity)) {
    throw new TypeError('Both price and quantity must be finite numbers.');
  }

  // Non‑negative check
  if (price < 0 || quantity < 0) {
    throw new RangeError('Price and quantity must be non‑negative.');
  }

  // Integer quantity check
  if (!Number.isInteger(quantity)) {
    throw new RangeError('Quantity must be an integer.');
  }

  return price * quantity;
}