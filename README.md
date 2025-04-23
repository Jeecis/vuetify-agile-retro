# Agile board frontend
This is agile retrospective frontend that must be used together with agile retro backend.

## Build

* Must have installed `pnpm` and `node`

clone this repo.
run `pnpm i` to install dependencies
run `pnpm dev` to run development server

## Docker build

Simply run 
`docker compose up -d`

### Used frameworks/libraries
This project is based on Vue.js and adapted from vuetify component framework
Furthermore, it uses `vuedraggable` for the ability to drag notes from one column to another.
Axios for request fetching and connecting to API.
