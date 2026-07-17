export function getCustomerAvatar(gender?: string, name?: string): string {
  let g = (gender || "").toLowerCase();

  if (g === 'female') {
    return "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80"; // Female professional avatar
  } else if (g === 'male') {
    return "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80"; // Male professional avatar
  } else {
    return "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80"; // Neutral professional avatar
  }
}

export function getAvatarByCustomerName(name: string, transactions: any[] = []): string {
  const normalized = (name || "").toLowerCase().trim();

  // 1. Direct matches from sample data and known profiles
  if (
    normalized.includes("hussein") ||
    normalized.includes("fahad") ||
    normalized.includes("yousef") ||
    normalized.includes("harbi") ||
    normalized.includes("khalid") ||
    normalized.includes("ziyad") ||
    normalized.includes("ahmad") ||
    normalized.includes("nasser") ||
    normalized.includes("mishaal") ||
    normalized.includes("waleed")
  ) {
    return getCustomerAvatar("male");
  }

  if (
    normalized.includes("sarah") ||
    normalized.includes("noura") ||
    normalized.includes("sara") ||
    normalized.includes("yasmin") ||
    normalized.includes("abeer") ||
    normalized.includes("huda") ||
    normalized.includes("maha") ||
    normalized.includes("rania") ||
    normalized.includes("reem") ||
    normalized.includes("fatima") ||
    normalized.includes("zainab")
  ) {
    return getCustomerAvatar("female");
  }

  // 2. Try to find in the dynamically loaded transactions list if any exists
  if (transactions && transactions.length > 0) {
    const matchedTx = transactions.find(t => (t.customerName || "").toLowerCase().trim() === normalized);
    if (matchedTx && matchedTx.gender) {
      return getCustomerAvatar(matchedTx.gender);
    }
  }

  // 3. If not found, return neutral professional avatar (strictly no random selection)
  return getCustomerAvatar("unknown");
}

