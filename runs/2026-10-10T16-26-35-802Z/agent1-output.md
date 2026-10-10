1. Requirement Summary

Add a "condenser type" option to the unit configuration. It must only be selectable for air-cooled DX systems. If the selected system does not use a DX cooling coil, the condenser type field must be hidden or disabled.

2. HVAC Terminology

- DX (Direct Expansion) cooling coil: A cooling coil where refrigerant evaporates directly inside the coil to absorb heat from the air. Common in packaged rooftop units, split systems, etc.
- Air-cooled DX system: A DX system that rejects heat to outdoor air via an air-cooled condenser.
- Condenser: The part of the refrigeration cycle that releases heat removed from the conditioned space.
- Condenser type: A classification of how the condenser rejects heat (e.g., air-cooled, water-cooled, evaporative-cooled). In this ticket, it appears focused on air-cooled configurations.
- Non-DX systems: Systems that do not use a DX cooling coil, such as chilled-water, hot-water, steam, or other indirect cooling/heating systems.

3. Developer Interpretation

- Add a `condenser type` field to the unit configuration UI/model.
- Enable/show this field only when the selected system is an air-cooled DX system (i.e., it uses a DX cooling coil).
- Hide/disable the field for any system that does not use a DX cooling coil.
- The requirement is about conditional field availability, not about adding HVAC calculation logic.

4. Ambiguities / Missing Information

- The specific condenser type options/values are not listed.
- It is unclear whether the condition is the system type being "air-cooled DX" or just "uses a DX cooling coil" (not all DX systems are air-cooled).
- No details on default value, validation rules, save/load behavior, or where exactly the field lives in the unit configuration.
- Whether the field should be hidden, disabled, or shown as read-only for non-DX systems is not specified.
- No acceptance criteria, mockups, or data model references are provided.
