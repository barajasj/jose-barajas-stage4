# HVAC Test Ticket Interpretation

## 1. Requirement Summary

Primary requirement: add a **condenser type** selection to the unit configuration, intended for **air-cooled DX systems**.

Business rule: the condenser type field must be **conditionally available** — it should only appear/be enabled when the selected system uses a **DX cooling coil**; for non-DX systems, the field must not be available.

## 2. HVAC Terminology

- **DX (Direct Expansion)**: a cooling system in which refrigerant is expanded directly inside an indoor coil to absorb heat from the air.
- **DX cooling coil**: the indoor coil where the refrigerant evaporates and cools the airstream. A unit “uses a DX cooling coil” means it is a refrigerant-based cooling system, not a water/chilled-water system.
- **Condenser**: the outdoor component that rejects the absorbed heat to the environment.
- **Air-cooled**: a condenser that rejects heat to ambient air (as opposed to water-cooled, evaporative, remote, etc.).
- **Condenser type**: a categorical field describing the kind/arrangement of the condenser (e.g., air-cooled, water-cooled, evaporative, remote/condensing unit).

## 3. Developer Interpretation

- **Field addition**: the unit configuration screen/data model needs a new `condenser type` field.
- **Conditional availability rule**: the field is visible/editable only when the selected unit/system type has a DX cooling coil.
- **Non-DX behavior**: if the selected system is not DX (e.g., chilled water, hydronic, non-refrigerant), the condenser type field is hidden or disabled.
- **No calculation/performance rule is specified**: the ticket only describes UI availability; it does not state how the condenser type affects calculations, sizing, or outputs.

## 4. Ambiguities / Missing Information

- **Allowed values/options**: the ticket does not list the valid condenser type choices.
- **Default value**: not specified for when the field first becomes available.
- **Hidden vs. disabled**: whether the field is removed, hidden, or grayed out for non-DX systems is not stated.
- **Data model details**: field name, where it is stored, and whether it is persisted with the unit configuration are not provided.
- **Scope wording mismatch**: the title says “for air-cooled DX systems,” while the description says “when the selected system uses a DX cooling coil.” It is unclear whether the field is restricted to **air-cooled DX only** or any **DX-cooling system**.
- **No acceptance criteria** are provided, so the conditional availability rule is the only verifiable requirement.
