# Requirement Interpretation

## 1. Requirement Summary

Add a **Condenser Type** dropdown to unit configuration. Show it only when the unit has a **DX cooling coil** and an **Air-Cooled condenser cooling method**. Otherwise hide it and clear any saved value.

Default visible value: **Standard**. Allowed values: **Standard**, **Low Ambient**.

- When no longer applicable: hide, clear from UI and persisted config, do not remember old value.
- When applicable again: show, reset to **Standard**.
- When visible, it is **required** and must be persisted.

## 2. HVAC Terminology

- **Cooling coil type — DX**: Direct Expansion. The refrigerant evaporates directly inside the coil to absorb heat. A common type of air-conditioning coil.
- **Condenser cooling method — Air-Cooled**: The refrigerant is condensed (turned from hot gas back to liquid) by rejecting heat to outdoor air, usually via a fan and fins.
- **Condenser Type**: A classification for the air-cooled condenser. Affects behavior in cold outdoor conditions.
  - **Standard**: Normal condenser for typical ambient conditions.
  - **Low Ambient**: Designed to operate in colder outdoor temperatures; may include controls, fan cycling, or other measures to keep refrigerant pressure/head pressure high enough when it is cold outside.
- **Persisted unit configuration**: The saved data model for the HVAC unit that the application writes to disk/database.

## 3. Developer Interpretation

Business rules to implement:

- **Visibility rule**: field visible iff `cooling coil type == DX` AND `condenser cooling method == Air-Cooled`.
- **Default behavior**: on first show or re-show after being hidden, set value to `Standard` if no value selected. Previous value must not be restored.
- **Hide/clear rule**: when visibility condition becomes false, remove the field from the UI and set the persisted `condenserType` property to null/empty. Do not cache the old value.
- **Required validation**: if the field is visible, the user must select a value before saving.
- **Persistence**: selected value must be stored as part of the unit config when visible/selected.
- **Dropdown contents**: only `Standard` and `Low Ambient`.

This is conditional UI state tied to two dependent fields, with reset-on-hide and reset-on-show.

## 4. Ambiguities / Missing Information

- **No schema details**: what the persisted field name and data type are, or whether it should be stored as an enum, string, or ID.
- **Low Ambient vs Standard specifics**: no business or engineering description for how each value affects calculations or downstream design.
- **"No value has previously been selected" detection**: unclear how the app tracks whether the user intentionally cleared the field or whether this is a fresh unit.
- **Validation timing/message**: not specified when the required validation fires (on save, on change, on blur) or what error text to show.
- **Transition behavior on loading existing units**: if an old saved unit has a Condenser Type but no longer meets visibility criteria, should the value be cleared immediately or remain hidden until the user edits? Ticket says clear when no longer applicable, but loading behavior is not explicitly stated.
- **Change of DX/Air-Cooled triggering events**: not specified whether the default should be applied during user interaction, on save, or on re-render.


# Ambiguity Risk Assessment

{
  "status": "PASS",
  "blockingAmbiguities": [],
  "rationale": "Visibility, default/reset-on-show, clear-on-hide, required persistence, and allowed values are specified. The listed ambiguities concern schema details, validation UX, downstream effect specifics, and legacy-load transition timing that are either implementation details or covered by the unconditional 'otherwise hide it and clear any saved value' rule, so no human decision is needed to proceed."
}
