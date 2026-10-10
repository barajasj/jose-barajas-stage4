## 1. Requirement Summary

Add a **condenser type** field to the unit configuration. Make it selectable **only for systems with a DX cooling coil**. Hide or disable it for all other (non-DX) systems.

## 2. HVAC Terminology

- **DX cooling coil** — a cooling coil in which refrigerant expands and evaporates directly to absorb heat (direct-expansion). Common in unitary / packaged air conditioners.
- **Air-cooled DX system** — a DX system that rejects heat to outdoor air through a condenser (as opposed to water-cooled, which uses a cooling tower or water loop).
- **Condenser type** — the configuration or category of the heat-rejection side of the DX refrigeration cycle. In the ticket it is tied to air-cooled DX units.
- **Non-DX system** — any system that does not use a direct-expansion cooling coil (e.g., chilled water, hydronic, evaporative, or non-refrigerant systems).

## 3. Developer Interpretation

**Primary requirement**

- Expose a `condenser type` option in the unit configuration UI/model when the selected cooling coil type is **DX**.

**Secondary / supporting requirement**

- Conditionally remove, hide, or disable that same field when the selected system does **not** use a DX cooling coil.

**Expected behavior**

- The field’s visibility or editability depends on the value of another field (cooling coil type = DX vs. non-DX).
- There is no requirement to change any other unit configuration fields or to calculate performance.

## 4. Ambiguities / Missing Information

- **Condenser type values**: the ticket does not list the allowed options (e.g., `Air-Cooled`, `Water-Cooled`, `Evaporative`, etc.).
- **Air-cooled scope**: the title says condenser type is “for air-cooled DX systems,” but the body says it applies to “DX cooling coil” systems generally. It is unclear whether it should appear for **all** DX systems or only **air-cooled** DX systems.
- **Field behavior for non-DX**: “not available” could mean hidden, disabled/grayed out, or cleared/removed.
- **Default value**: no guidance on what the field defaults to when a DX system is selected or when it becomes hidden.
- **When the coil changes**: no rule stated for whether the condenser type value is preserved, cleared, or reset when the user switches from DX to non-DX.
- **No acceptance criteria**: the ticket contains no formal acceptance criteria, title metadata, or discussion to clarify the above.
