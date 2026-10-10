1. Requirement Summary

Add a **Condenser Type** dropdown to unit configuration.  
Primary: show it only when **cooling coil type = DX** and **condenser cooling method = Air-Cooled**; otherwise hide and clear it.  
Secondary: dropdown values are `Standard` and `Low Ambient`; default is `Standard`; required when visible; persisted with unit config.

2. HVAC Terminology

- **Condenser**: part of a refrigeration cycle that rejects heat from the refrigerant.
- **DX (Direct Expansion)**: cooling coil where refrigerant expands and absorbs heat directly. Only relevant for this check.
- **Air-Cooled condenser**: rejects heat to outdoor air (vs. water-cooled).
- **Condenser Type**: distinguishes operating capability — `Standard` for typical conditions, `Low Ambient` for operation at low outdoor-air temperatures.

3. Developer Interpretation

Visibility rule:

```
show Condenser Type iff
  coolingCoilType == "DX" AND
  condenserCoolingMethod == "Air-Cooled"
```

State behavior:

- When visible and no prior value: set to `Standard`.
- When hidden due to config change:
  - hide UI field
  - clear value from UI and persisted config
  - do not restore old value later
- When made visible again: reset to `Standard`.

Validation/persistence:

- Required when visible.
- Selected value must be saved with unit configuration.

Acceptance criteria are fully covered by visibility, dropdown content, default, state cleanup, validation, and persistence.

4. Ambiguities / Missing Information

None significant. The ticket does not specify UI location, field order, or backend migration approach, but those are implementation details, not HVAC requirement gaps.
