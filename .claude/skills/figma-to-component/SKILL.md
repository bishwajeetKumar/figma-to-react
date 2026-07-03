---
name: figma-to-component
description: Turn a Figma frame/selection into a React + Tailwind component in this project, with a matching Jest unit test and a Playwright component test. Use whenever the user gives a Figma link, node-id, or says a design/screen is "ready" and should become code.
---

# Figma → React component generator

This project turns Figma designs into working, tested React components. Given a
Figma frame (link, node-id, or "the current selection in Figma Desktop"),
produce three files per component and wire them into the app.

## Prerequisites

- The `figma-dev-mode` MCP server must be reachable (Figma desktop app → the file
  is open → Dev Mode MCP Server enabled in Preferences). See the project
  [README](../../../README.md#figma-mcp-setup) if tools like `get_code` or
  `get_image` aren't available.
- A frame or layer must be selected in Figma, or the user supplies a Figma URL
  containing a `node-id`.

## Steps

1. **Resolve the target node.** If given a Figma URL, extract the `node-id`
   query param. If given "the current selection," rely on Figma MCP tools that
   read the active selection directly (no node-id needed).

2. **Pull design context from the Figma MCP server:**
   - `get_metadata` — get the node tree (names, types, bounding boxes) so you
     know what components/sections exist and can pick a sensible component
     name from the frame/layer name.
   - `get_code` — get Figma's generated code representation of the node (best
     starting point for structure, text content, and layout).
   - `get_variable_defs` — get bound design tokens (colors, spacing, type)
     used in the selection, so hardcoded values can be mapped to Tailwind
     classes/theme tokens instead of magic numbers.
   - `get_screenshot` (or `get_image`) — get a visual reference to sanity
     check the generated markup against the actual design.

3. **Derive a component name** in PascalCase from the frame/layer name (e.g.
   a frame called "Pricing Card" → `PricingCard`). Ask the user only if the
   name is ambiguous (e.g. the layer is named "Frame 42").

4. **Generate the component** at
   `src/components/<Name>/<Name>.tsx`:
   - Functional component, typed props (derive props from any text/content
     that looks like it varies — labels, image src, counts — rather than
     hardcoding every string).
   - Tailwind utility classes for layout/spacing/color, translated from the
     values in `get_code` / `get_variable_defs` (prefer Tailwind's default
     scale over arbitrary values like `w-[173px]` when a close-enough
     standard class exists; use arbitrary values when fidelity matters more
     than the scale).
   - No business logic — this is presentational. If the design implies
     interaction (buttons, inputs), expose it via callback props
     (`onSubmit`, `onClick`), don't invent state management.
   - Export the component from `src/components/<Name>/index.ts` if the
     project's other components follow that pattern (check first).

5. **Generate the Jest unit test** at
   `src/components/<Name>/<Name>.test.tsx` using
   `@testing-library/react` + `@testing-library/jest-dom` (already
   configured — see `jest.config.cjs`). At minimum:
   - Renders and shows the expected text/content from the design.
   - Exercises every callback prop (e.g. clicking a button fires `onClick`).
   - Covers visible conditional states shown in the Figma frame (e.g. an
     error/empty/disabled variant), if the frame includes more than one
     state.

6. **Generate the Playwright component test** at
   `src/components/<Name>/<Name>.ct.tsx` using
   `@playwright/experimental-ct-react` (config: `playwright-ct.config.ts`,
   run via `npm run test:ct`). Use this for things Jest+jsdom can't verify:
   layout/visual rendering, hover/focus states, and (once more than one
   component exists) a `expect(component).toHaveScreenshot()` visual
   regression baseline. If the `playwright` MCP server is connected, use its
   browser tools to open the Figma screenshot and the rendered component
   side-by-side and visually compare them before finalizing the test.

7. **Wire it in** — if the user wants it visible immediately, import and
   render the new component from `src/App.tsx` (or ask where it should go if
   the app already has multiple routes/screens).

8. **Verify before reporting done:**
   - `npm test -- <Name>` (Jest)
   - `npm run test:ct -- <Name>` (Playwright CT)
   Fix failures rather than reporting the component as generated if either
   fails.

## Notes

- One Figma frame can map to multiple components if it's clearly composed of
  reusable pieces (e.g. a "Pricing Section" frame containing three repeated
  "Pricing Card" instances) — generate the repeated piece as its own
  component and compose it, rather than one monolithic component with
  duplicated JSX.
- Prefer fidelity to the design over guessing intent: if spacing/colors in
  `get_code` don't cleanly map to Tailwind's scale, use arbitrary-value
  classes rather than rounding to the nearest standard class.
- Don't fabricate content. Use the real text/images from the Figma frame; use
  props (not hardcoded strings) for anything that looks like sample/lorem
  content meant to be replaced by real data.
