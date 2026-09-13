# Rundown — Ecommerce Frontend

A storefront built with React + Vite + Tailwind CSS + React Router +
Axios. Product data comes from the free [Fake Store API](https://fakestoreapi.com)
for now — you'll point it at your own backend in Week 11.

---

## 1. Setup, run, test, deploy

### Open in VS Code
1. Unzip `ecommerce-frontend.zip`.
2. VS Code → `File > Open Folder…` → select the folder.
3. Open terminal: `` Ctrl+` `` (Win/Linux) or `` Cmd+` `` (Mac).

### Install & run
```bash
npm install
npm run dev
```
Open the printed `localhost` URL. You'll see a product grid pulled live
from the Fake Store API, with category filter buttons, a product detail
page, and a working cart.

### Test
```bash
npm run test
```
Runs the Vitest + React Testing Library suite for the cart logic
(`src/context/CartContext.test.jsx`).

### Push to GitHub
```bash
git init
git add .
git commit -m "Ecommerce frontend: initial build"
git remote add origin https://github.com/<your-username>/ecommerce-frontend.git
git branch -M main
git push -u origin main
```

### Deploy to Vercel
Dashboard route (easiest): vercel.com → sign in with GitHub → **Add New
Project** → import this repo → framework auto-detects as **Vite** →
**Deploy**.

CLI route:
```bash
vercel login
vercel
vercel --prod
```

---

## 2. Code walkthrough — what every file does and why

### `index.html`
The single HTML page Vite serves. It loads the Space Grotesk + Inter
fonts and has one `<div id="root">` — React takes over everything
inside that div. `src/main.jsx` is loaded as a `<script type="module">`.

### `src/main.jsx`
The entry point. It finds the `#root` div and tells React to render
`<App />` into it, wrapped in `React.StrictMode` (a development-only
helper that double-invokes some functions to help you catch side-effect
bugs early — it has no effect in production).

### `src/index.css`
Pulls in Tailwind's three layers (`base`, `components`, `utilities`) so
every `className="..."` utility class in the components actually
resolves to real CSS. The `body` rule sets the default background,
text color, and font for the whole app.

### `src/App.jsx`
The root component. Two things happen here:
1. `<CartProvider>` wraps everything — this makes the cart's state
   (items, totals, add/remove functions) available to *any* component
   in the tree without manually passing props down through each layer
   ("prop drilling"). This is the Context API pattern from Week 3.
2. `<BrowserRouter>` + `<Routes>` set up client-side routing. Each
   `<Route>` maps a URL path to a page component:
   - `/` → `Home` (product grid)
   - `/product/:id` → `ProductDetail` (the `:id` is a dynamic segment —
     whatever's in the URL there becomes available as a route param)
   - `/cart` → `Cart`

   Because this is *client-side* routing, navigating between these
   doesn't reload the page — React just swaps which component is shown.

### `src/api/products.js`
All network calls live in one file. It creates one configured Axios
instance (`client`) with a `baseURL`, so every function below just
calls `client.get('/products')` instead of repeating the full URL
everywhere. Three exported functions: `fetchProducts`,
`fetchProductById`, `fetchCategories` — each `async function` that
awaits the request and returns just the `data` (Axios wraps that in
a response object with headers/status/etc., so we unwrap it here once
instead of in every component).

**Why this matters:** when you swap in your own backend in Week 11,
you change the `baseURL` in this one file — nothing in `Home.jsx` or
`ProductDetail.jsx` needs to know or care where the data came from.

### `src/context/CartContext.jsx`
This is the state-management core of the app. Broken into pieces:

- **`cartReducer(state, action)`** — a pure function that takes the
  current cart state and an "action" (a plain object describing what
  happened, e.g. `{ type: 'ADD_ITEM', payload: product }`) and returns
  the *new* state. It never mutates the old state directly — it always
  returns a new object/array. This is the `useReducer` pattern from
  Week 3, and it's what React Query/Redux-style state management is
  built on. The four action types:
  - `ADD_ITEM` — if the product's already in the cart, increment its
    quantity; otherwise add it with quantity 1.
  - `REMOVE_ITEM` — filter it out by id.
  - `SET_QUANTITY` — set an exact quantity; if it drops below 1, treat
    that as "remove."
  - `CLEAR_CART` — empty the cart.

- **`loadInitialState()`** — reads any previously saved cart from
  `localStorage` when the app first loads, so a page refresh doesn't
  wipe out someone's cart. Wrapped in `try/catch` because
  `localStorage` can throw (e.g. in private browsing mode) or contain
  malformed JSON if it was tampered with.

- **`CartProvider`** — the component that actually holds the state
  (`useReducer(cartReducer, undefined, loadInitialState)` — the third
  argument is a lazy initializer, so `loadInitialState` only runs once
  on mount, not every render). A `useEffect` re-saves to `localStorage`
  every time `state` changes. It computes `itemCount` and `subtotal`
  by reducing over the items array, then packages everything —state
  plus action functions — into `value`, which it hands to every
  descendant via `<CartContext.Provider>`.

- **`useCart()`** — a custom hook that wraps `useContext(CartContext)`.
  Any component calls `const { items, addItem } = useCart()` instead of
  importing `CartContext` directly. The thrown error if it's used
  outside a `<CartProvider>` catches a common setup mistake early with
  a clear message instead of a cryptic `undefined` bug later.

### `src/components/Navbar.jsx`
Reads `itemCount` from `useCart()` and shows it as a badge next to the
"Cart" link. Uses React Router's `NavLink` (not plain `Link`) because
`NavLink` knows which route is currently active and lets you style it
differently (`isActive` in the `className` function).

### `src/components/ProductCard.jsx`
One product tile in the grid. Wrapping the image and title in `<Link
to={`/product/${product.id}`}>` is what makes clicking through to the
detail page work — React Router intercepts that click and swaps the
page instead of doing a full browser navigation. The "Add to cart"
button calls `addItem(product)` from `useCart()` directly — it doesn't
need to know anything about how the cart is implemented.

### `src/pages/Home.jsx`
Fetches all products and categories once when the page mounts
(`useEffect` with an empty `[]` dependency array = "run once on
mount"). Key details:
- `Promise.all([...])` runs both API calls in parallel instead of
  waiting for one before starting the other.
- `status` state (`'loading' | 'ready' | 'error'`) drives which UI
  shows — this is a simple, explicit way to handle the three states
  every data-fetching component has to deal with.
- The `cancelled` flag in the `useEffect` cleanup prevents a "set state
  on an unmounted component" warning/bug if the user navigates away
  before the fetch finishes.
- `activeCategory` is local UI state — filtering happens entirely in
  the browser on the already-fetched `products` array, no extra
  network call needed.

### `src/pages/ProductDetail.jsx`
`useParams()` reads the `:id` from the current URL. The `useEffect`
dependency array is `[id]` (not `[]`) — meaning it re-fetches
automatically if you navigate from one product detail page straight to
another. Same loading/error/ready pattern as `Home.jsx`.

### `src/pages/Cart.jsx`
Renders `items` from `useCart()`, with +/- buttons calling
`setQuantity(id, quantity ± 1)` and a subtotal computed already in the
context. The "Checkout" button is a placeholder `alert()` — that's the
seam where your Week 11 backend integration plugs in later (a real
`POST /orders` call).

### `src/context/CartContext.test.jsx`
Rather than testing the reducer in isolation, this renders a small
`CartHarness` component through `CartProvider` and interacts with it
the way a user would (clicking buttons), then asserts on what's shown
on screen. This is the React Testing Library philosophy: test behavior
users can see, not internal implementation details.

### `tailwind.config.js`
Defines the custom color palette (`graphite`, `paper`, `citrus`,
`rust`) and fonts used throughout — this is why classes like
`bg-graphite` or `font-display` work in the components above.

### `.gitignore`
Keeps `node_modules/`, build output, and local env files out of git —
without this, `git add .` would try to commit hundreds of megabytes of
installed packages.

---

## 3. What to log for Week 4

- Built the ecommerce storefront frontend: routing (`react-router-dom`)
  across product list / detail / cart pages, cart state via Context API
  + `useReducer`, and live data fetching with Axios against a REST API.
- Cart persists across refreshes via `localStorage`.
- Component tests written with Vitest + React Testing Library.
