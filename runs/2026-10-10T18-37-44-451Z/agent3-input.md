# Requirement Interpretation

## 1. Requirement Summary

Add a **Condenser Type** field to the unit configuration. It is a dropdown with values **Standard** and **Low Ambient**. The field is visible and required only when **cooling coil type = DX** and **condenser cooling method = Air-Cooled**. When first visible with no prior selection, the default is **Standard**. If the unit configuration changes so the field is hidden, its value must be cleared from the UI and persisted data and not restored later. If it becomes visible again, reset to **Standard**.

## 2. HVAC Terminology

- **HVAC**: Heating, Ventilation, and Air Conditioning.
- **Condenser**: the part of a refrigeration cycle that rejects heat from refrigerant into the surrounding medium.
- **DX (Direct Expansion)**: a cooling coil where refrigerant expands and evaporates directly inside the coil. Common in packaged/split air-conditioning units.
- **Condenser Cooling Method / Air-Cooled**: the condenser rejects heat using ambient air, usually via fans and fins.
- **Condenser Type — Standard**: a normal condenser intended for typical outdoor ambient temperature ranges.
- **Condenser Type — Low Ambient**: a condenser designed to operate at low outdoor temperatures, often with controls like head-pressure or fan-cycling to keep the refrigeration cycle stable in cold weather.

## 3. Developer Interpretation

### Primary requirements

- Add a new persisted field named `Condenser Type` to the unit configuration.
- Render it as a dropdown with two options: `Standard` and `Low Ambient`.
- Show the field **only if** `Cooling Coil Type == DX` **AND** `Condenser Cooling Method == Air-Cooled`.
- Hide the field for all other combinations.
- When visible, the field is **required**.
- Persist the selected value with the unit configuration.

### Secondary requirements

- When the field transitions from hidden to visible and no value has been selected, set it to `Standard`.
- When the field transitions from visible to hidden:
  - Hide the UI control.
  - Clear the value from the UI.
  - Remove the value from persisted unit configuration.
  - Do **not** retain or restore the previous value.
- If the field becomes visible again after being hidden, set it to `Standard` again.

### Business rules to implement

- Visibility is a logical AND of two other field values.
- Visibility changes trigger value lifecycle actions: show/reset-to-default on becoming visible, clear/no-restore on becoming hidden.
- The field cannot be left blank when visible.
- Persistence must follow the UI value state (saved when set, removed when cleared).

## 4. Ambiguities / Missing Information

- **Domain meaning of `Standard` vs `Low Ambient`** is not defined; only the labels are given. No rules for when each should be allowed beyond being in the dropdown.
- **No explicit list of other `Cooling Coil Type` or `Condenser Cooling Method` values**, so the implementation must derive these from the existing data model.
- **"No value previously selected"**: it is unclear whether this includes a value that was selected, then cleared because the field was hidden. The lifecycle rules suggest it does, because the previous value is discarded.
- **Validation timing** is not specified — e.g., whether validation runs on blur, on save, or on unit configuration validation.
- **Initial load behavior** is not explicitly defined: if a persisted unit already has a Condenser Type value but the current configuration makes it inapplicable, should the value be cleared immediately on load? The state behavior rules imply yes.
- **Multi-selection / multi-zone units**: not addressed; assumes a single Condenser Type per unit.
- **Persistence format/serialization** is not specified.


# Ambiguity Risk Assessment

{
  "status": "PASS",
  "blockingAmbiguities": [],
  "rationale": "Visibility condition, required state, dropdown values, default value, and show/hide/clear/reset lifecycle are all specified. Remaining listed items are domain background, implementation details, or conventions discoverable in the existing codebase and do not change the required behavior or demand a business/product/domain decision."
}
