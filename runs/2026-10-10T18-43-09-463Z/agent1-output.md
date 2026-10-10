## 1. Requirement Summary

**Primary:** Add a "condenser type" selection to the unit configuration UI for **air-cooled DX systems**.

**Secondary:** Show that field **only when** the selected system uses a **DX cooling coil**. For **non-DX systems**, the field must be hidden/disabled.

---

## 2. HVAC Terminology

- **DX system** — "Direct Expansion." The refrigerant expands directly in the cooling coil to absorb heat from the airstream. Common in rooftop units, split systems, package units.
- **DX cooling coil** — The coil (evaporator) inside the unit where DX refrigerant boils off to cool air. Presence of this coil means the system is a DX cooling system.
- **Condenser** — The part of the refrigeration cycle that rejects heat to the outside. In air-cooled units it uses outdoor air; in water-cooled units it uses water.
- **Condenser type** — The category or configuration of the condenser (e.g., air-cooled, water-cooled, evaporative, remote, integral). The ticket focuses on **air-cooled DX systems**, so the selectable condenser type likely is or includes an air-cooled option.
- **Non-DX systems** — Any HVAC system that does **not** use a DX cooling coil (e.g., chilled-water, hot-water, steam, non-refrigerant systems).

---

## 3. Developer Interpretation

- The unit configuration screen needs a new **condenser type** field.
- The field is **conditionally displayed**: enabled/visible when the unit's selected cooling system is a DX type with a DX cooling coil.
- When the unit does **not** have a DX cooling coil, the condenser type field must not appear or must be disabled/inaccessible.
- The ticket mentions "air-cooled DX systems," implying the condenser type selection is relevant for those specific DX configurations. Other condenser categories may or may not apply.
- This is a UI/conditional visibility rule driven by the selected cooling coil type. No specific storage, validation, or workflow logic is described beyond availability.

---

## 4. Ambiguities / Missing Information

- What are the **valid condenser type options**? Is it a list of predefined values, free text, or derived from equipment metadata?
- What happens when the user switches **from** a DX system to a non-DX system after a condenser type was selected? Should the value be cleared, preserved, or ignored?
- Does "DX cooling coil" mean **any** coil with DX refrigerant, or only certain coil types (e.g., cooling-only vs. heat-pump)?
- Should the condenser type field also be **hidden for DX systems with non-air-cooled condensers**? The first sentence limits this to air-cooled DX systems.
- Where in the **unit configuration** flow should the field appear? What is its label, control type (dropdown, radio, etc.), and default value?
- Are there **validation rules** or required/optional rules when the field is visible?
- Is the condenser type to be persisted as part of the unit model, and if so, which data field/entity?
