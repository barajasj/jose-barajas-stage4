## 1. Requirement Summary

Add a `Condenser Type` dropdown to unit configuration. It appears only when cooling coil type = `DX` and condenser cooling method = `Air-Cooled`. Allowed values: `Standard`, `Low Ambient`; default `Standard`. When hidden, clear the value from UI and persisted config. When visible again, reset to `Standard`. Value is required when visible and must be persisted.

## 2. HVAC Terminology

- **DX (Direct Expansion)**: Cooling coil where refrigerant expands and evaporates directly inside the coil to absorb heat.
- **Condenser**: Component that rejects absorbed heat from refrigerant to the outdoors.
- **Air-Cooled Condenser**: Uses ambient air to remove heat; common in rooftop units and split systems.
- **Condenser Type**: Selection that determines performance/capability of the air-cooled condenser, typically for low-temperature operation.
  - **Standard**: Normal ambient operation.
  - **Low Ambient**: Allows unit to operate efficiently at lower outdoor temperatures, often with head pressure control.
- **Unit configuration**: The persisted set of parameters defining an HVAC unit.

## 3. Developer Interpretation

### Primary requirements

1. Add a `Condenser Type` field to the unit configuration.
2. Field is a dropdown with values `Standard` and `Low Ambient`.
3. Field is visible only if:
   - `cooling coil type` == `DX`, and
   - `condenser cooling method` == `Air-Cooled`.
4. Default value is `Standard` when the field first becomes visible and no prior value exists.
5. Value is required when the field is visible.
6. Persist the selected value with the unit configuration.

### Secondary / state behavior requirements

1. When visibility conditions become false:
   - Hide the field.
   - Clear the value from UI and persisted config.
   - Do not retain or restore the prior value.
2. When visibility conditions become true again:
   - Show the field.
   - Set value to `Standard` (default), regardless of prior value.

## 4. Ambiguities / Missing Information

1. **Clearing semantics**: "Clear the previously selected value from persisted unit configuration" may mean set to `null`/empty, or remove the field entirely. Ticket does not specify.
2. **Re-show default**: "Set Condenser Type to the default value of Standard" when becoming applicable again implies a reset, even if a previous value existed before it was hidden. This may be intentional but should be confirmed.
3. **No validation error message format specified**: Only that a value is required; not how the UI should display the error.
4. **No mention of API/backend field existence**: Ticket assumes the field can be added; unclear if backend schema already supports it.
5. **No definition of "unit configuration" scope**: Is this per unit model, project, or job? Not specified.
