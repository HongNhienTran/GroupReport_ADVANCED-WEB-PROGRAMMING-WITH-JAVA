export function formatCurrency(amount) {
  if (amount == null) return '0đ';
  return `${new Intl.NumberFormat('vi-VN').format(Math.round(amount))}đ`;
}

export function getCategoryImage(name = '') {
  const lower = name.toLowerCase();
  if (lower.includes('socola')) return '/categories/Socola.png';
  if (lower.includes('bánh')) return '/categories/Bakery.png';
  if (lower.includes('kẹo')) return '/categories/Candies.png';
  if (lower.includes('hộp quà') || lower.includes('combo')) return '/categories/Gifts.png';
  return '/categories/All.png';
}
