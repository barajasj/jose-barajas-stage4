## 1. Requirement Summary

Add a **Condenser Type** dropdown to the unit configuration screen. It only appears when the unit uses a **DX cooling coil** and an **Air-Cooled condenser**. Available options are **Standard** and **Low Ambient**, defaulting to **Standard** when first shown. If the user changes the configuration so the conditions are no longer met, the field must be hidden and its value cleared. When visible, the field is required and must be saved with the unit configuration.

## 2. HVAC Terminology

- **DX (Direct Expansion):** A cooling coil type where refrigerant expands directly inside the coil to absorb heat from the air. The term describes the refrigeration cycle method.
- **Condenser:** The part of the refrigeration system that releases heat removed from the conditioned space to the outdoors.
- **Air-Cooled:** A condenser heat-rejection method that uses ambient air, as opposed to water or another fluid.
- **Condenser Type:** A classification for the condenser's operating design. In this ticket it distinguishes between normal operation and low-temperature operation.
- **Standard:** The default condenser type, suitable for normal operating conditions.
- **Low Ambient:** A condenser designed to operate properly in low outdoor air temperatures, where a standard condenser may not function correctly or efficiently.

## 3. Developer Interpretation

Primary requirements (derived directly from the ticket):

- A new `Condenser Type` field must be added to the unit configuration model/view.
- Visibility rule: show the field only when `cooling coil type == DX` **and** `condenser cooling method == Air-Cooled`; hide it in all other combinations.
- Field type: dropdown.
- Dropdown options: `Standard`, `Low Ambient`.
- Default value: `Standard` when the field becomes visible and no value was previously set.
- State change behavior: if the user changes configuration so the field is hidden, clear any selected value.
- Validation: the field is required whenever it is visible.
- Persistence: the selected value must be saved with the unit configuration data.

Implicit behavior to consider (without inferring implementation):

- A visibility or dependency engine likely already governs conditional fields based on `cooling coil type` and `condenser cooling method`.
- Defaulting and clearing should be applied when the visibility condition transitions, not merely on initial load.
- "Required when visible" means client-side and/or server-side validation should block saving if the dropdown is shown and no value is selected.
- "Persisted with the unit configuration" means the value must be stored and reloaded alongside other unit settings.

## 4. Ambiguities / Missing Information

- It is not specified whether the default `Standard` applies every time the field becomes visible with no value, or only the first time a unit is created. For example, if a user hides the field by changing the configuration, then restores the same configuration, should `Condenser Type` reset to `Standard` or remain empty until selected?
- The ticket does not state whether `Low Ambient` has any additional side effects, validation rules, or downstream impact on other fields, equipment sizing, or reports.
- It is unclear whether the field's value should be retained (but hidden) when the conditions are no longer met, or cleared and lost. The "State Behavior" section explicitly says to clear the value, so this is an explicit requirement, but the expected user experience for undo/redo or configuration reversal is not described.
- The data model for unit configuration is not specified, so the exact storage location and schema for the new field are unknown.
- There is no mention of migration behavior for existing units that may not have a `Condenser Type` value.
