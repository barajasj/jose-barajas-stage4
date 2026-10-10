1. Requirement Summary
- Add a `Condenser Type` dropdown to the unit configuration.
- Show it only when:
  - Cooling coil type = `DX`
  - Condenser cooling method = `Air-Cooled`
- For all other configurations, hide it.
- Dropdown values: `Standard`, `Low Ambient`.
- Default value when first shown: `Standard`.
- When the field becomes hidden due to configuration changes, clear any selected value.
- When the field is visible, it is required and must be persisted with the unit configuration.

2. HVAC Terminology
- DX (Direct Expansion): The cooling coil is fed directly with refrigerant. The refrigerant evaporates inside the coil and absorbs heat from the air passing over it. This is common in packaged rooftop units and split systems.
- Condenser: The part of the refrigeration cycle that removes the absorbed heat and condenses the refrigerant back into a liquid.
- Air-Cooled: Heat is rejected from the condenser to the surrounding outdoor air using fans and fins.
- Condenser Type: A classification of how the condenser handles outdoor air temperatures. `Standard` is for normal operating conditions. `Low Ambient` means the condenser is designed to operate in low outdoor temperatures, typically with features like head pressure control, fan cycling, or variable-speed condenser fans to keep refrigerant pressures high enough for reliable operation.

3. Developer Interpretation
- This is a conditional UI field driven by two other field values.
- Business logic:
  - Visibility rule: `visible = (coolingCoilType == DX) AND (condenserCoolingMethod == Air-Cooled)`
  - When `visible` flips from false to true and no value is set, set the value to `Standard`.
  - When `visible` flips from true to false, clear the value.
  - When `visible` is true, the field is a required selection; validation should fail if it is empty.
  - Save the selected value with the unit configuration record.
- No behavior is specified for `Low Ambient` beyond being an allowed label. Do not implement additional logic unless directed later.

4. Ambiguities / Missing Information
- It is unclear whether `Low Ambient` changes any calculations, equipment selection, pricing, or performance curves.
- The ticket does not define where the value is persisted (database column, JSON config, settings object, etc.).
- It is ambiguous whether the cleared value should also be removed from persistent storage or only from the active form state.
- It is not stated whether a previously saved value should be restored if the user switches back to a configuration that makes the field visible again.
- The list of condenser cooling methods is not provided; the rule only references `Air-Cooled`.
- No guidance on field label, ordering, validation message, or whether this applies to a specific product line or all units.
