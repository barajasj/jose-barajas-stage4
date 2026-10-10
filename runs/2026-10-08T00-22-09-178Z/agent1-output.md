## HVAC Ticket Interpretation

### 1. Requirement Summary

Add a **condenser type** selection option to the unit configuration, but only for **air-cooled DX (direct expansion) cooling systems**. For systems that do not use DX cooling, the condenser type field must be hidden or unavailable.

Primary requirement: allow users to choose a condenser type for air-cooled DX units.
Secondary/conditional requirement: the condenser type field is conditional on the system having a DX cooling coil.

---

### 2. HVAC Terminology

- **DX (Direct Expansion) cooling coil**: A type of cooling coil where refrigerant expands directly inside the coil to absorb heat from the air. Common in packaged air conditioners and heat pumps. The refrigerant is the medium that cools the air directly.

- **Air-cooled DX system**: A DX cooling system that rejects heat to the outside air via a condenser, rather than to water (e.g., cooling tower) or ground. The condenser coil is cooled by ambient air blown across it.

- **Condenser**: The part of the refrigeration cycle where hot, high-pressure refrigerant gives up its heat and condenses back into a liquid. The condenser type affects how the system rejects heat (e.g., air-cooled, water-cooled, evaporative-cooled).

- **Condenser type**: A configuration attribute describing the kind of condenser used by the unit. In an air-cooled DX context, this may refer to specific options like split remote condenser, packaged condenser, or other product-line variants, depending on the application.

---

### 3. Developer Interpretation

Expected software behavior:

1. In the unit configuration UI/screen, add a field for **condenser type**.
2. The condenser type field is **only enabled/visible** when the selected unit/system uses a **DX cooling coil** AND is **air-cooled**.
3. If the selected system is not DX-cooled (for example, chilled water, evaporative, or non-DX systems), the condenser type field must **not be shown or editable** — it should be hidden, disabled, or removed.
4. The condenser type value must be saved/stored as part of the unit configuration when applicable.
5. The business rule is conditional: availability of the condenser type field is a function of the system's cooling coil type.

This is a typical conditional UI/validation rule:
- Field: `condenserType`
- Condition: `coolingCoilType == "DX" && condensingMedium == "AirCooled"` (or equivalent domain model)

---

### 4. Ambiguities / Missing Information

- **Condenser type options are not listed.** The ticket does not specify the valid enum values for condenser type (e.g., packaged, remote, split, etc.).
- **Air-cooled scope is mentioned in the title but not the body.** The description says "for air-cooled DX systems," but the acceptance criteria only say "when the selected system uses a DX cooling coil." It is unclear whether condenser type should also be available for water-cooled or evaporative DX systems.
- **Field behavior for non-DX is vague.** Should the field be hidden, disabled, or cleared when the system is non-DX?
- **Data model implications.** Should the condenser type be nullable, or should it default to a value when DX is selected?
- **Validation rules.** Are there any invalid combinations (e.g., certain condenser types only valid with specific unit types or capacities)?
- **Where to expose the field.** The ticket mentions "unit configuration" but does not specify the exact screen, panel, or API endpoint.
- **Persistence and reporting.** Should the condenser type affect energy calculations, sizing, reports, or downstream systems?
