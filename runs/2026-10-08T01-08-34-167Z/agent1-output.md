## 1. Requirement Summary

Add a **Condenser Type** dropdown to the unit configuration that is **only visible** when:
- the cooling coil type is **DX**, **and**
- the condenser cooling method is **Air-Cooled**.

When visible, the dropdown must:
- contain **Standard** and **Low Ambient**,
- default to **Standard** if no prior value exists,
- require a selected value,
- persist the selected value with the unit configuration.

If the field becomes hidden, clear its value.

## 2. HVAC Terminology

| Term | Meaning |
|---|---|
| **Cooling coil type** | The heat exchanger used to cool air. **DX** = Direct Expansion: refrigerant evaporates directly inside the coil to absorb heat. |
| **Condenser cooling method** | How heat rejected by the refrigerant is removed. **Air-Cooled** = heat is released into ambient air using fins and fans. |
| **Condenser** | Component that takes hot, high-pressure refrigerant and cools it until it liquefies. |
| **Condenser Type** | A classification of the condenser, here either **Standard** (normal operation) or **Low Ambient** (designed to run in low outdoor temperatures without issues). |
| **Low Ambient** | Equipment engineered for cold-weather operation; may include head-pressure controls, fan cycling, etc. |

## 3. Developer Interpretation

- Add a new data field `Condenser Type` tied to the unit configuration.
- Visibility rule: show the field **only if** `coolingCoilType == DX` **AND** `condenserCoolingMethod == Air-Cooled`. Hide it otherwise.
- The field must be a dropdown with exactly two options: `Standard`, `Low Ambient`.
- When the field becomes visible and has no existing saved value, preselect `Standard`.
- If the user changes the configuration so the visibility rule becomes false, hide the field and **clear** the stored `Condenser Type` value.
- When visible, `Condenser Type` is mandatory: the user must select a value.
- The selected value is saved and loaded with the rest of the unit configuration.

## 4. Ambiguities / Missing Information

- The exact object/model for “unit configuration” is not specified.
- It is not stated whether clearing a hidden value is destructive or only UI-level (e.g., whether the value can be restored if the same conditions reappear).
- Validation timing is undefined: validate on save, on change, or on blur?
- Persistence format/schema is not specified.
- Behavior for existing saved configurations with no `Condenser Type` value is not described.
- No mention of whether changing **DX** or **Air-Cooled** triggers a warning before clearing the previously selected value.
