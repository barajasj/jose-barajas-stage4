1. **Requirement Summary**

- Add a new unit configuration option: a **condenser type** selector.
- This selector is relevant only for **air-cooled DX systems**.
- The selector must be **visible/enabled only when the selected system uses a DX cooling coil**.
- For all **non-DX systems**, the condenser type field must be **hidden or disabled**.

2. **HVAC Terminology**

- **DX cooling coil / DX system**: "DX" stands for **Direct Expansion**. It refers to a cooling system where refrigerant expands (evaporates) directly inside a coil to absorb heat. Examples: standard split air conditioners, packaged rooftop units. **Non-DX systems** would include chilled-water coils, evaporative cooling, or other systems without on-site refrigerant evaporation in the coil.
- **Condenser**: A heat exchanger that removes heat from the refrigerant after compression, converting hot high-pressure refrigerant gas into liquid.
- **Condenser type**: The method/mechanism used to reject heat from the condenser. Common types include:
  - **Air-cooled**: Rejects heat to outdoor air using a fan and fins.
  - **Water-cooled**: Rejects heat to circulating water.
  - **Evaporative-cooled**: Uses water evaporation to enhance heat rejection.
- **Air-cooled DX system**: A direct-expansion cooling system whose condenser is cooled by ambient air (the most common type for small-to-medium commercial and residential units).

3. **Developer Interpretation**

- Introduce a new UI/config field called **"Condenser type"**.
- Make the field's availability conditional on the selected **cooling coil type**.
- Business rule:
  - If `coolingCoilType == DX` ΓåÆ show/enable condenser type field.
  - If `coolingCoilType != DX` ΓåÆ hide/disable condenser type field.
- The ticket specifically mentions "air-cooled DX systems," so the condenser type may default to, or include, **Air-Cooled** as a selectable value. However, the exact list of valid condenser types is not specified in the ticket.
- This is likely a **frontend validation/visibility rule** tied to an existing system-type or coil-type model.

4. **Ambiguities / Missing Information**

- **Which condenser types are selectable?** The ticket says "select a condenser type" but does not list the allowed values (e.g., Air-Cooled, Water-Cooled, Evaporative-Cooled, Remote, Split, etc.).
- **Does "condenser type" apply to all DX systems or only air-cooled DX systems?** The first sentence says "for air-cooled DX systems," but the second sentence says "when the selected system uses a DX cooling coil." These two statements may describe slightly different scopes. Is the intent to allow condenser type selection for all DX systems, or only for a subset that is explicitly air-cooled?
- **Field behavior for non-DX systems:** Should the field be hidden, disabled (grayed out), or reset/cleared? The ticket says "should not be available," but does not specify the exact UX.
- **Default value:** What should the condenser type default to when the system is DX? Should it default to "Air-Cooled"? Should it persist across coil-type changes?
- **Validation/saving behavior:** Should the value be cleared if the user switches from DX to non-DX? Should invalid combinations be blocked at save time?
