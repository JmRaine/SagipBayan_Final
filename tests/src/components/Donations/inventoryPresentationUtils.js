import { getInventoryExpiryStatus } from "./inventoryExpiryUtils";

export const NON_EXPIRING_GOODS_CATEGORIES = new Set([
  "clothes",
  "clothing",
  "shoes",
  "shoe",
  "shoes/footwear",
  "footwear",
  "blankets",
  "blanket",
  "mats",
  "mat",
  "towels",
  "towel",
  "bedding",
  "mosquito nets",
  "mosquito net",
]);

export function isExpiryRequiredCategory(value) {
  const category = String(value || "").trim().toLowerCase();
  return Boolean(category && !NON_EXPIRING_GOODS_CATEGORIES.has(category));
}

export function getExpiryStatus(item, baseDate) {
  return getInventoryExpiryStatus(item?.expirationDate, baseDate);
}

export function getExpiryBadgeLabel(item, baseDate) {
  const status = getExpiryStatus(item, baseDate);
  if (status === "expired") return "Expired";
  if (status === "soon") return "Expiring Soon";
  return "";
}

export function getExpiryBadgeClass(item, baseDate) {
  const status = getExpiryStatus(item, baseDate);
  if (status === "expired") return "badge-expiry-expired";
  if (status === "soon") return "badge-expiry-soon";
  if (status === "ok") return "badge-expiry-ok";
  return "badge-expiry-none";
}

export function getCategoryLabel(value) {
  const category = String(value || "").trim();
  if (!category) return "Uncategorized";
  return category
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

export function getSourceLabel(value) {
  const source = String(value || "").trim();
  if (!source) return "-";

  const normalized = source.toLowerCase();
  if (normalized === "external") return "Donated";
  if (normalized === "internal") return "LGU";
  if (normalized === "government") return "NGO";
  return source.charAt(0).toUpperCase() + source.slice(1);
}

export function formatDate(date) {
  return date ? new Date(date).toLocaleString() : "-";
}

export function formatHistoryDateLabel(date) {
  if (!date) return "";
  const parsed = new Date(`${String(date).slice(0, 10)}T00:00:00`);
  if (Number.isNaN(parsed.getTime())) return String(date);

  return parsed.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

export function formatExpiryDate(date) {
  return date ? new Date(date).toLocaleDateString() : "-";
}

export function formatMoney(amount) {
  return `PHP ${Number(amount || 0).toLocaleString("en-PH", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  })}`;
}
