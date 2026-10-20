import test from "node:test";
import assert from "node:assert/strict";

import {
  buildIncidentAddress,
  matchBarangayOption,
  resolveIncidentBarangaySelection,
  validateIncidentImages,
} from "./mapIncidentUtils.js";

test("normalizes barangay aliases and resolves their district", () => {
  assert.equal(matchBarangayOption("Brgy. San Jose"), "San Josef");

  assert.deepEqual(
    resolveIncidentBarangaySelection(
      { properties: { Barangay: "Sto Tomas North" } },
      ""
    ),
    {
      detectedBarangay: "Sto Tomas North",
      detectedDistrict: "District 2",
      barangayValue: "Santo Tomas North",
      districtValue: "District 2",
      barangayDropdownMatched: true,
      districtDropdownMatched: true,
      availableBarangays: [
        "Imbunia",
        "Lambakin",
        "Marawa",
        "Naglabrahan",
        "San Josef",
        "San Roque",
        "Santo Tomas North",
      ],
    }
  );
});

test("builds a safe incident address and validates image limits", () => {
  assert.equal(
    buildIncidentAddress({
      district: "District 1",
      barangay: "Bagong Sikat",
      street: "Purok 2",
      location: "ignored",
    }),
    "Purok 2, Bagong Sikat, District 1, Jaen, Nueva Ecija"
  );
  assert.equal(
    validateIncidentImages([
      { uri: "file:///a.jpg", type: "image/jpeg", size: 1024 },
      { uri: "file:///b.jpg", type: "image/jpeg", size: 1024 },
      { uri: "file:///c.jpg", type: "image/jpeg", size: 1024 },
    ]),
    "Only up to 2 photos are allowed."
  );
});
