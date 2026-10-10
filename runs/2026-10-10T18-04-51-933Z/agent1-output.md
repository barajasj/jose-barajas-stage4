## 1. Requirement Summary

Add a **Condenser Type** dropdown to the unit configuration screen.

- **Visible only when:**
  - Cooling coil type = **DX**, **and**
  - Condenser cooling method = **Air-Cooled**
- **Allowed values:** `Standard`, `Low Ambient`
- **Default:** `Standard`
- **Required** whenever it is visible.
- **Persisted** with the unit configuration.
- **Clear** the value when the field becomes inapplicable; do **not** restore the old value if it becomes applicable again.

## 2. HVAC Terminology

| Term | Plain-language meaning |
|---|---|
| **HVAC** | Heating, Ventilation, and Air Conditioning — the building systems this software configures. |
| **Unit configuration** | The set of options that define a specific HVAC unit model and its behavior. |
| **Condenser** | The part of a cooling system that releases heat collected from indoors to the outside. |
| **Condenser Type** | A setting that classifies the condenser for the expected outdoor temperature conditions. |
| **DX** | Direct Expansion. The cooling coil contains refrigerant that expands and evaporates directly to absorb heat. This is the standard type in many package/split air-conditioning systems. |
| **Cooling coil** | A coil of tubing where refrigerant absorbs heat to cool the air. "DX" here means the coil is fed directly by refrigerant. |
| **Condenser cooling method** | How the condenser rejects heat. `Air-Cooled` means outdoor air carries the heat away (common in rooftop/package units). The alternative is usually `Water-Cooled` (uses a water loop/cooling tower). |
| **Air-Cooled** | Heat is removed by blowing outdoor air across the condenser coils. |
| **Standard** | A condenser designed for normal operating temperatures (typical commercial/residential comfort cooling). |
| **Low Ambient** | A condenser designed to keep running reliably when outdoor air is cold. In cold weather an air-cooled condenser can lose too much pressure, so low-ambient units add controls (fan cycling, dampers, head-pressure control, etc.) to keep pressures high enough for proper operation. |

## 3. Developer Interpretation

### Primary requirements

1. **Add a field** named "Condenser Type" to the unit configuration.
2. **Field control type:** dropdown.
3. **Conditional visibility:** show only if both of these are true:
   - `coolingCoilType == DX`
   - `condenserCoolingMethod == Air-Cooled`
   
   Hide the field for any other combination.
4. **Allowed dropdown values:** `Standard` and `Low Ambient`.
5. **Default value:** when the field first becomes visible and has no prior selection, set it to `Standard`.
6. **Validation:** when the field is visible, it is required (cannot be empty/blank).
7. **Persistence:** the selected value must be saved as part of the unit configuration.

### State-change rules

- **Becoming inapplicable** (user changes config so either `coolingCoilType != DX` or `condenserCoolingMethod != Air-Cooled`):
  - Hide the field.
  - Clear the `Condenser Type` value from the UI.
  - Remove `Condenser Type` from the persisted configuration.
  - Do **not** remember the old value.
- **Becoming applicable again** later:
  - Show the field.
  - Set `Condenser Type` to the default `Standard`.
  - Do **not** restore any previous value.

### Implementation notes (inferred, not required)

The business rule is essentially: this is an air-cooled DX-only option. If the unit is not air-cooled DX, the option is meaningless and must be removed from the model. When it becomes relevant again, it starts fresh with `Standard`.

## 4. Ambiguities / Missing Information

- **Definition of "Condenser Type" is not provided in the ticket.** The values `Standard` / `Low Ambient` make the meaning inferable, but the ticket does not explicitly state that it controls low-temperature operating capability.
- **No save mechanism specified.** It is unclear whether persistence is automatic on change or on explicit save/submit.
- **Duplicate heading:** the ticket contains two sections labeled "State Behavior." The intent is clear (visibility state plus inapplicable/re-applicable behavior), but the document structure is inconsistent.
- **No empty/placeholder option specified.** The field is required when visible and defaults to `Standard`, so a null/blank option may not be needed, but it should be confirmed whether the dropdown includes one.
- **No error message text specified** for the required-field validation.
- **No mention of whether existing saved configurations need migration** if they already contain a `Condenser Type` value that becomes hidden.
