import {
  getCategoryLabel,
  getExpiryBadgeClass,
  getExpiryBadgeLabel,
  getSourceLabel,
  isExpiryRequiredCategory,
} from "./inventoryPresentationUtils";

describe("inventoryPresentationUtils", () => {
  test("keeps non-expiring goods from requiring an expiration date", () => {
    expect(isExpiryRequiredCategory("blankets")).toBe(false);
    expect(isExpiryRequiredCategory("rice")).toBe(true);
  });

  test("presents expiry status with the established labels and classes", () => {
    const expiredItem = { expirationDate: "2026-05-10" };
    const soonItem = { expirationDate: "2026-05-25" };

    expect(getExpiryBadgeLabel(expiredItem, new Date("2026-05-11"))).toBe("Expired");
    expect(getExpiryBadgeClass(expiredItem, new Date("2026-05-11"))).toBe(
      "badge-expiry-expired"
    );
    expect(getExpiryBadgeLabel(soonItem, new Date("2026-05-11"))).toBe(
      "Expiring Soon"
    );
  });

  test("uses the existing user-facing labels for categories and sources", () => {
    expect(getCategoryLabel("emergency equipment")).toBe("Emergency Equipment");
    expect(getCategoryLabel("")).toBe("Uncategorized");
    expect(getSourceLabel("external")).toBe("Donated");
    expect(getSourceLabel("government")).toBe("NGO");
  });
});
