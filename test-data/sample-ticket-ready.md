# HVAC Test Ticket - Complete Requirements

Add a Condenser Type field to the unit configuration.

## Visibility

The Condenser Type field must be visible only when both of the following conditions are true:

- The selected cooling coil type is DX.
- The selected condenser cooling method is Air-Cooled.

For all other configurations, the Condenser Type field must be hidden.

## Field Type

The Condenser Type field must be a dropdown.## State Behavior

## Allowed Values

The dropdown must contain these values:

- Standard
- Low Ambient

## Default Value

When the field becomes visible and no value has previously been selected, the default value must be Standard.

## State Behavior

If the user changes the unit configuration so that the Condenser Type field is no longer applicable:

- Hide the field.
- Clear the previously selected Condenser Type value from both the UI and the persisted unit configuration.
- Do not retain or restore the previous Condenser Type value.

If the Condenser Type field later becomes applicable again:

- Show the field.
- Set Condenser Type to the default value of Standard.

## Validation

When the Condenser Type field is visible, a value is required.

The selected value must be persisted with the unit configuration.