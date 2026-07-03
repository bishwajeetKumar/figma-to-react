# figma-to-react

A Vite + React + TypeScript + Tailwind app whose components are generated
from Figma designs via the Figma Dev Mode MCP server, with Jest unit tests
and Playwright component tests generated alongside each one.

## Stack

- **App**: Vite, React 19, TypeScript, Tailwind CSS v4
- **Unit tests**: Jest, `@testing-library/react`, `@testing-library/jest-dom`
- **Component tests**: `@playwright/experimental-ct-react`
- **MCP servers**: Figma Dev Mode MCP (design source), Playwright MCP
  (browser-driven verification of generated components)

## Getting started

```bash
npm install
npm run dev        # app at http://localhost:5173
npm test           # Jest unit tests
npm run test:ct    # Playwright component tests
```

## How the design → code pipeline works

1. Open the Figma file in the Figma desktop app and select a frame (or copy
   its link).
2. In Claude Code, ask it to turn that frame into a component — this
   triggers the [`figma-to-component`](.claude/skills/figma-to-component/SKILL.md)
   skill, which:
   - Pulls structure, code, design tokens, and a screenshot from the frame
     via the `figma-dev-mode` MCP server.
   - Generates `src/components/<Name>/<Name>.tsx` (React + Tailwind).
   - Generates `src/components/<Name>/<Name>.test.tsx` (Jest unit test).
   - Generates `src/components/<Name>/<Name>.ct.tsx` (Playwright component
     test), optionally using the `playwright` MCP server to visually compare
     the rendered component against the Figma screenshot.
3. Review the generated component, run the tests, and wire it into `App.tsx`
   or wherever it belongs.

## Figma MCP setup

The Figma Dev Mode MCP Server runs locally inside the Figma desktop app:

1. Open the Figma desktop app (not the browser version) and open the file
   you want to work from.
2. Go to **Figma menu → Preferences → Enable Dev Mode MCP Server**.
3. Figma starts a local server (by default `http://127.0.0.1:3845/mcp`,
   already configured in [`.mcp.json`](.mcp.json)). Restart Claude Code (or
   run `/mcp` to reconnect) after enabling it so it picks up the server.
4. Select a frame/layer in Figma before asking Claude to generate a
   component from it — the MCP tools read your current selection.

If the port differs on your machine, update the `url` in `.mcp.json`
accordingly (check Figma's Dev Mode MCP Server settings panel for the exact
address it's listening on).

## Playwright MCP

`.mcp.json` also registers the [`@playwright/mcp`](https://github.com/microsoft/playwright-mcp)
server, which gives Claude Code browser-automation tools (navigate, click,
screenshot, snapshot) independent of the `test:ct` script. This is used by
the `figma-to-component` skill to visually sanity-check a generated
component against the original Figma screenshot before finalizing it. No
extra setup is required beyond having Node/npx available — the server is
started on demand via `npx -y @playwright/mcp@latest`.

## Project layout

```
src/
  components/
    Example/
      Example.tsx        # component
      Example.test.tsx   # Jest unit test
      Example.ct.tsx      # Playwright component test
  App.tsx
playwright/               # mount harness for Playwright CT (index.html/index.tsx)
playwright-ct.config.ts    # Playwright component-testing config
jest.config.cjs            # Jest config (ts-jest, jsdom)
.claude/skills/figma-to-component/SKILL.md   # the generation skill
.mcp.json                  # Figma + Playwright MCP server config
```

`src/components/Example` is a reference implementation showing the expected
shape (component + Jest test + Playwright CT test) for anything the skill
generates — delete it once real generated components exist, or keep it as a
template.
