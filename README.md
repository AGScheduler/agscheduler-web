# agscheduler-web

[![deploy](https://github.com/agscheduler/agscheduler-web/actions/workflows/deploy.yml/badge.svg)](https://github.com/agscheduler/agscheduler-web/actions/workflows/deploy.yml)
[![publish-container-image](https://github.com/agscheduler/agscheduler-web/actions/workflows/publish.yml/badge.svg)](https://github.com/agscheduler/agscheduler-web/actions/workflows/publish.yml)
![GitHub release (with filter)](https://img.shields.io/github/v/release/agscheduler/agscheduler-web)
[![license](https://img.shields.io/github/license/agscheduler/agscheduler)](https://github.com/agscheduler/agscheduler/blob/main/LICENSE)

> Web Client for AGScheduler using [Svelte](https://svelte.dev/) + [SvelteKit](https://kit.svelte.dev/) + [shadcn-svelte](https://shadcn-svelte.com/) + [Tailwind CSS](https://tailwindcss.com/).

## Developing

```bash
pnpm install

pnpm run dev
```

## Building

```bash
pnpm run build

pnpm run preview
```

## Docker

```bash
docker run --rm -p 8080:80 ghcr.io/agscheduler/agscheduler-web:latest
```
