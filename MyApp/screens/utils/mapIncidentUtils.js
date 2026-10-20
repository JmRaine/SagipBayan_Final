import {
  INCIDENT_LOCATION_MAX_LENGTH,
  sanitizeFreeTextInput,
  sanitizeFreeTextOnSubmit,
} from "./validation.js";

const INCIDENT_IMAGE_LIMIT = 2;
const INCIDENT_IMAGE_MAX_BYTES = 15 * 1024 * 1024;
const safeArray = (value) => (Array.isArray(value) ? value : []);

export const DISTRICT_OPTIONS = [
  "District 1",
  "District 2",
  "District 3",
  "District 4",
];

export const BARANGAY_BY_DISTRICT = {
  "District 1": [
    "Bagong Sikat",
    "Balbalino",
    "Banganan",
    "Langla",
    "Mabini",
    "Maligaya",
    "Santo Tomas South",
  ],
  "District 2": [
    "Imbunia",
    "Lambakin",
    "Marawa",
    "Naglabrahan",
    "San Josef",
    "San Roque",
    "Santo Tomas North",
  ],
  "District 3": [
    "Don Mariano Marcos",
    "Hilera",
    "Pinanggaan",
    "San Andres",
    "San Nicolas",
    "Ulanin-Pitak",
  ],
  "District 4": [
    "Calabasa",
    "Kasanglayan",
    "Pamacpacan",
    "Putlod",
    "Sapang",
  ],
};

export const ALL_BARANGAY_OPTIONS = Object.values(BARANGAY_BY_DISTRICT).flat();
export const BARANGAY_PROPERTY_KEYS = [
  "name",
  "Name",
  "NAME",
  "barangay",
  "Barangay",
  "BARANGAY",
  "barangayName",
  "BarangayName",
  "BRGY",
  "brgy",
  "brgy_name",
  "BRGY_NAME",
  "NAME_3",
  "adm4_en",
  "ADM4_EN",
  "mun_name",
  "MUN_NAME",
];
export const DISTRICT_PROPERTY_KEYS = [
  "district",
  "District",
  "DISTRICT",
  "dist",
  "Dist",
  "DIST",
  "districtName",
  "DistrictName",
  "district_name",
  "DISTRICT_NAME",
  "adm3_en",
  "ADM3_EN",
];

export function normalizePlaceName(value) {
  return String(value || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim()
    .replace(/\s+/g, " ")
    .replace(/[._-]/g, " ")
    .replace(/[^\w\s]/g, "")
    .replace(/\bbrgy\b/g, "barangay")
    .trim();
}

export function normalizeNameText(name) {
  return normalizePlaceName(name)
    .trim()
    .replace(/[\u2018\u2019'`]/g, "")
    .replace(/&/g, " and ")
    .replace(/[._,;:()[\]{}#]+/g, " ")
    .replace(/[-/]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export function normalizeBarangayName(name) {
  let normalized = normalizeNameText(name)
    .replace(/\bbarangay\s+hall\b/g, " ")
    .replace(/\bbrgy\s+hall\b/g, " ")
    .replace(/\bbgy\s+hall\b/g, " ")
    .replace(/\bbarangay\b/g, " ")
    .replace(/\bbrgy\b/g, " ")
    .replace(/\bbgy\b/g, " ")
    .replace(/\bhall\b/g, " ")
    .replace(/\bsto\b/g, "santo")
    .replace(/\bst\b/g, "santo")
    .replace(/\bnorte\b/g, "north")
    .replace(/\bsur\b/g, "south")
    .replace(/\s+/g, " ")
    .trim();

  const aliases = {
    "san jose": "san josef",
    "sto tomas north": "santo tomas north",
    "sto tomas south": "santo tomas south",
    "santo tomas n": "santo tomas north",
    "santo tomas s": "santo tomas south",
    "s tomas north": "santo tomas north",
    "s tomas south": "santo tomas south",
    "d mariano": "don mariano marcos",
    "d mariano marcos": "don mariano marcos",
    "don mariano": "don mariano marcos",
    ibunia: "imbunia",
    "sapang putik": "sapang",
    "ulanin pitak": "ulanin pitak",
  };

  normalized = aliases[normalized] || normalized;
  return normalized;
}

export function normalizeDistrictName(name) {
  const normalized = normalizeNameText(name)
    .replace(/\bdist\b/g, "district")
    .replace(/\bdistrict\s+no\b/g, "district")
    .replace(/\s+/g, " ")
    .trim();

  const romanMatch = normalized.match(/\b(i|ii|iii|iv)\b/);
  if (romanMatch) {
    return {
      i: "district 1",
      ii: "district 2",
      iii: "district 3",
      iv: "district 4",
    }[romanMatch[1]];
  }

  const numberMatch = normalized.match(/\b([1-4])\b/);
  if (numberMatch) return `district ${numberMatch[1]}`;

  return normalized;
}

export function getFeatureProperty(feature, keys) {
  const properties = feature?.properties || {};

  for (const key of keys) {
    const value = properties[key];
    if (value !== undefined && value !== null && String(value).trim()) {
      return String(value).trim();
    }
  }

  const lowerKeyMap = Object.entries(properties).reduce((acc, [key, value]) => {
    acc[String(key).toLowerCase()] = value;
    return acc;
  }, {});

  for (const key of keys) {
    const value = lowerKeyMap[String(key).toLowerCase()];
    if (value !== undefined && value !== null && String(value).trim()) {
      return String(value).trim();
    }
  }

  return "";
}

export function cleanBarangayDisplayName(name) {
  return String(name || "")
    .replace(/\bbarangay\s+hall\b/gi, "")
    .replace(/\bbrgy\.?\s+hall\b/gi, "")
    .replace(/\bbgy\.?\s+hall\b/gi, "")
    .replace(/\bhall\b/gi, "")
    .replace(/^\s*(barangay|brgy\.?|bgy\.?)\s+/i, "")
    .replace(/\s+/g, " ")
    .trim();
}

export function getFeatureBarangayName(feature) {
  return cleanBarangayDisplayName(
    getFeatureProperty(feature, BARANGAY_PROPERTY_KEYS)
  );
}

export function getFeatureDistrictName(feature) {
  return getFeatureProperty(feature, DISTRICT_PROPERTY_KEYS)
    .replace(/\s+/g, " ")
    .trim();
}

export function findOptionByNormalized(options, value, normalizer) {
  const normalizedValue = normalizer(value);
  if (!normalizedValue) return "";

  return (
    safeArray(options).find(
      (option) => normalizer(option) === normalizedValue
    ) || ""
  );
}

export function matchDistrictOption(value) {
  return findOptionByNormalized(DISTRICT_OPTIONS, value, normalizeDistrictName);
}

export function getDistrictBarangayOptions(district) {
  const districtOption = matchDistrictOption(district) || String(district || "").trim();
  return BARANGAY_BY_DISTRICT[districtOption] || [];
}

export function matchBarangayOption(value, district = "") {
  const districtOptions = getDistrictBarangayOptions(district);

  return (
    findOptionByNormalized(districtOptions, value, normalizeBarangayName) ||
    findOptionByNormalized(ALL_BARANGAY_OPTIONS, value, normalizeBarangayName)
  );
}

export function getPickerOptionsWithCurrent(options, currentValue, normalizer) {
  const cleanCurrentValue = String(currentValue || "").trim();
  if (!cleanCurrentValue) return options;

  const matched = findOptionByNormalized(options, cleanCurrentValue, normalizer);
  return matched ? options : [...options, cleanCurrentValue];
}

export function resolveIncidentBarangaySelection(feature, fallbackLabel = "") {
  const rawBarangay =
    getFeatureBarangayName(feature) || cleanBarangayDisplayName(fallbackLabel);
  const matchedBarangay = matchBarangayOption(rawBarangay);
  const barangayValue = matchedBarangay || rawBarangay;
  const rawDistrict =
    getFeatureDistrictName(feature) ||
    getDistrictFromBarangay(barangayValue) ||
    getDistrictFromBarangay(rawBarangay);
  const matchedDistrict = matchDistrictOption(rawDistrict);
  const districtValue = matchedDistrict || rawDistrict;
  const availableBarangays =
    getDistrictBarangayOptions(districtValue || rawDistrict).length
      ? getDistrictBarangayOptions(districtValue || rawDistrict)
      : ALL_BARANGAY_OPTIONS;

  return {
    detectedBarangay: rawBarangay,
    detectedDistrict: rawDistrict,
    barangayValue,
    districtValue,
    barangayDropdownMatched: Boolean(matchedBarangay),
    districtDropdownMatched: Boolean(matchedDistrict),
    availableBarangays,
  };
}

export function logIncidentDropdownResolution(selection) {
  if (!selection?.detectedBarangay && !selection?.detectedDistrict) return;

  const availableBarangays = selection.availableBarangays || ALL_BARANGAY_OPTIONS;

  console.log(
    selection.barangayDropdownMatched
      ? "[incident barangay dropdown matched]"
      : "[incident barangay dropdown not matched]",
    {
      detected: selection.detectedBarangay || "",
      normalizedDetected: normalizePlaceName(selection.detectedBarangay),
      value: selection.barangayValue || "",
      availableBarangays: selection.barangayDropdownMatched
        ? undefined
        : availableBarangays.map((item) => String(item || "")),
    }
  );
  console.log(
    selection.districtDropdownMatched
      ? "[incident district dropdown matched]"
      : "[incident district dropdown not matched]",
    {
      barangay: selection.detectedBarangay || "",
      detected: selection.detectedDistrict || "",
      value: selection.districtValue || "",
    }
  );
}

export function getOptionText(option) {
  return String(option?.label || option?.name || option?.value || option || "").trim();
}

export function findDistrictForBarangay(
  barangayName,
  districtOptionsOrMap = BARANGAY_BY_DISTRICT
) {
  const normalized = normalizeBarangayName(barangayName);
  if (!normalized) return "";

  if (Array.isArray(districtOptionsOrMap)) {
    for (const entry of districtOptionsOrMap) {
      if (Array.isArray(entry?.barangays)) {
        const match = entry.barangays.some(
          (item) => normalizeBarangayName(getOptionText(item)) === normalized
        );
        if (match) return getOptionText(entry.district || entry);
      }

      const optionBarangay = getOptionText(entry);
      if (normalizeBarangayName(optionBarangay) === normalized) {
        return getOptionText(entry?.district || entry?.districtLabel || entry?.districtName);
      }
    }

    return "";
  }

  for (const [district, barangays] of Object.entries(districtOptionsOrMap || {})) {
    const match = safeArray(barangays).some(
      (item) => normalizeBarangayName(getOptionText(item)) === normalized
    );

    if (match) return getOptionText(district);
  }

  return "";
}

export function getDistrictFromBarangay(barangayName) {
  return findDistrictForBarangay(barangayName, BARANGAY_BY_DISTRICT);
}
export function sanitizeStreetDetails(value) {
  return sanitizeFreeTextInput(value, 160);
}

export function buildIncidentAddress({ district, barangay, street, location }) {
  if (street || barangay || district) {
    return [street, barangay, district, "Jaen, Nueva Ecija"]
      .filter(Boolean)
      .join(", ");
  }

  return sanitizeFreeTextOnSubmit(location, INCIDENT_LOCATION_MAX_LENGTH);
}
export const EMPTY_INCIDENT = {
  type: "",
  level: "",
  district: "",
  barangay: "",
  street: "",
  location: "",
  latitude: null,
  longitude: null,
  description: "",
  usernames: "",
  phone: "",
};

export function normalizeIncidentPickerAsset(asset, index = 0) {
  if (!asset?.uri) return null;

  const name =
    asset.fileName ||
    asset.uri.split("/").pop() ||
    `incident-photo-${index + 1}.jpg`;
  const extension = String(name.split(".").pop() || "jpg").toLowerCase();
  const mimeType =
    asset.mimeType ||
    (extension === "png"
      ? "image/png"
      : extension === "webp"
        ? "image/webp"
        : "image/jpeg");

  return {
    uri: asset.uri,
    name,
    type: mimeType,
    size: Number(asset.fileSize || 0),
  };
}

export function validateIncidentImages(images) {
  const validImages = safeArray(images).filter((item) => item?.uri);

  if (validImages.length > INCIDENT_IMAGE_LIMIT) {
    return `Only up to ${INCIDENT_IMAGE_LIMIT} photos are allowed.`;
  }

  const invalidType = validImages.find(
    (item) => !String(item.type || "").toLowerCase().startsWith("image/")
  );
  if (invalidType) return "Please choose a valid image file.";

  const oversized = validImages.find(
    (item) => Number(item.size || 0) > INCIDENT_IMAGE_MAX_BYTES
  );
  if (oversized) return "Each incident photo must be 15 MB or smaller.";

  return "";
}

export function getIncidentImageItems(incidentImage) {
  if (!incidentImage) return [];
  return Array.isArray(incidentImage.items)
    ? incidentImage.items.filter((item) => item?.uri)
    : incidentImage.uri
      ? [incidentImage]
      : [];
}

export function buildIncidentFormData(parameters, images) {
  const formData = new FormData();

  Object.entries(parameters || {}).forEach(([key, value]) => {
    formData.append(key, value == null ? "" : String(value));
  });

  safeArray(images)
    .slice(0, INCIDENT_IMAGE_LIMIT)
    .forEach((image, index) => {
      formData.append("images", {
        uri: image.uri,
        name: image.name || `incident-photo-${index + 1}.jpg`,
        type: image.type || "image/jpeg",
      });
    });

  return formData;
}

