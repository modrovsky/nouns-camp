# Nouns Camp

[nouns.camp](https://www.nouns.camp/)

## Development

Set `NEXT_PUBLIC_RPC_URL` in `.env.local` to a full HTTP(S) Ethereum JSON-RPC
endpoint for `NEXT_PUBLIC_CHAIN_ID`. It takes precedence over
`NEXT_PUBLIC_ALCHEMY_API_KEY`, which remains supported as a fallback. GraphQL
subgraph URLs belong in `NOUNS_SUBGRAPH_URL` and `PROPDATES_SUBGRAPH_URL`.
The RPC URL is included in browser code; use a client-safe provider credential.

```bash
# Install dependencies
pnpm install

# Build required workspace dependencies
pnpm --filter @shades/common build
pnpm --filter @shades/ui-web build

# OR run in dev mode to watch for changes
pnpm --filter @shades/common dev
pnpm --filter @shades/ui-web dev

# Run dev server
pnpm --filter nouns-camp dev

# Run tests if you’re into that kind of thing
pnpm --filter nouns-camp test
```
