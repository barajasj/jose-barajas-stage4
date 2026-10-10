1. Requirement Summary
Add a **Condenser Type** field to the unit configuration.

- **Visible only when**:
  - Cooling coil type is **DX**
  - Condenser cooling method is **Air-Cooled**
- **Field type**: dropdown
- **Allowed values**: Standard, Low Ambient
- **Default**: Standard (when shown and no previous selection)
- **Behavior on hide**: clear value from UI and persisted config; do not restore old value
- **Behavior on re-show**: show field, set to Standard
- **Validation**: required while visible
- **Persistence**: save selected value with unit configuration

2. HVAC Terminology

- **Condenser**: the part of a refrigeration cycle that releases heat from the refrigerant into the surrounding environment.
- **DX (Direct Expansion)**: a cooling coil type where refrigerant expands and evaporates directly inside the coil to cool air.
- **Air-Cooled condenser**: a condenser that rejects heat to ambient air, rather than to water or another fluid.
- **Condenser Type**:
  - **Standard**: the normal condenser operating range.
  - **Low Ambient**: a condenser designed or controlled to operate at low outdoor air temperatures, often with features like fan cycling or speed control to keep pressures stable.

3. Developer Interpretation

**Primary requirements**
- Add a new dropdown field named Condenser Type to the unit configuration.
- Show it only if `coolingCoilType == DX` AND `condenserCoolingMethod == Air-Cooled`.
- Populate the dropdown with `Standard` and `Low Ambient`.
- Set the default to `Standard` whenever the field becomes visible and has no value.
- When visibility conditions stop being met:
  - hide the field
  - clear the value from the UI
  - remove the value from persisted unit config
- When visibility conditions are met again:
  - show the field
  - set it to `Standard`
- If visible, require a value.
- Persist the selected value with the unit configuration.

**Secondary / UI requirements**
- The field must be hidden, not just disabled, when not applicable.
- Prior user selections must not be restored when re-showing; always default to Standard.

**Assumptions to verify**
- The application already tracks `coolingCoilType` and `condenserCoolingMethod` in unit config.
- The dropdown should be bound to a persisted property on the unit configuration object.

4. Ambiguities / Missing Information

- **Data model names**: the exact field names for “cooling coil type” and “condenser cooling method” are not specified.
- **UI location**: where the Condenser Type field should appear in the unit configuration form.
- **Validation message**: the exact text or styling for the required-field error is not specified.
- **Existing values on load**: if a saved unit has a Condenser Type value but no longer meets the visibility conditions, the ticket implies it should be cleared, but does not explicitly state behavior on initial load of saved data.
- **Low Ambient side effects**: no details about whether selecting Low Ambient changes other options, calculations, or equipment sizing.
- **Backend/API**: no specifics on how the value is stored, serialized, or validated server-side.
