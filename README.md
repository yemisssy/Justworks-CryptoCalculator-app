# Justworks. | Crypto Allocation

A small Vue 3 app that takes a USD amount and shows how that amount would be split **70% into Bitcoin and 30% into Ethereum** using live Coinbase exchange rates.

## What the app does

The main question I wanted the app to answer is:

> If I have a certain amount of USD and I want to keep a fixed 70 / 30 Bitcoin and Ethereum split, how much BTC and ETH would that amount buy right now?

The app:

- fetches live USD-based exchange rates from Coinbase
- splits the user's amount into 70% BTC and 30% ETH
- calculates the amount of BTC and ETH the user could buy
- shows the current USD price of 1 BTC and 1 ETH
- supports an empty state before the user enters an amount
- validates zero and negative values
- has an API error state with Retry
- lets the user manually refresh rates
- shows when the rates were last successfully refreshed
- responds to desktop, tablet, and mobile screen widths

## UI / UX design reference

![Claude UI design reference](docs/assets/claude-ui-design-reference.png)

This image is a **design reference**, not a screenshot of my final implementation.

I used it to guide things like spacing, card layout, visual hierarchy, Bitcoin / Ethereum colors, the 70 / 30 allocation bar, and the general fintech feel of the page.

I did **not** treat every item in the reference as a requirement. For example, the quick amount buttons shown in the reference were not part of the original assignment, so I chose not to spend time adding them. My priority was to finish the required calculation, API behavior, error handling, responsiveness, accessibility, and a clear UI first.

## Tech used

- Vue 3 with `<script setup>`
- Vite
- JavaScript
- CSS
- Coinbase public exchange-rates API

## How I structured the app

I kept the app small and split responsibilities based on what each file needs to do.

```text
src/
├── App.vue
├── main.js
├── ratesApi.js
├── style.css
└── components/
    ├── AmountToAllocate.vue
    ├── CryptoQuantity.vue
    └── QuantityCards/
        ├── BtcQuantityCard.vue
        └── EthQuantityCard.vue
```

### `App.vue`

This is the main source of truth for the page. It holds:

- the USD holding
- BTC and ETH rates
- API error state
- last-refreshed time

It also contains the main calculations and formatting values that are passed down to the result components.

### `ratesApi.js`

I kept the Coinbase fetch in a separate helper instead of putting the full request inside `App.vue`.

The helper:

1. calls Coinbase
2. checks that the response succeeded
3. parses the JSON
4. keeps only BTC and ETH
5. checks that both rates actually exist
6. returns either the rates or the error

### `AmountToAllocate.vue`

This component handles the amount input and its validation.

It sends a valid numeric value back to `App.vue`. If the field is blank or invalid, it sends `null` so an invalid amount does not continue into the calculations.

### `CryptoQuantity.vue`

This groups the result area together, including:

- Bitcoin card
- Ethereum card
- total allocated
- last-refreshed information
- Refresh button

### BTC and ETH cards

I kept Bitcoin and Ethereum as separate card components. They share similar styling, but this kept the coin-specific values easy for me to read and work with during the time-boxed assignment.

## Calculation logic

Coinbase returns the amount of a cryptocurrency that **$1 USD can buy**.

Because of that, the calculation is:

```text
BTC USD allocation = holding × 0.70
ETH USD allocation = holding × 0.30

BTC quantity = BTC USD allocation × BTC rate
ETH quantity = ETH USD allocation × ETH rate
```

To show the more familiar USD price of one coin:

```text
1 BTC in USD = 1 ÷ BTC rate
1 ETH in USD = 1 ÷ ETH rate
```

I keep the calculation values as numbers and only format them when I am ready to display them. I did this so I never have to turn a formatted value like `$7,000.00` back into a number before doing another calculation.

## Main decisions I made

### Fetch rates on mount and on Refresh, not on every input change

The Coinbase response does not depend on the amount the user types. Because of that, I fetch the rates when the page mounts and again only when the user explicitly refreshes them.

The USD allocation and BTC / ETH quantity calculations then update locally through Vue `computed` values.

### Blank input is an empty state, not an error

I wanted the page to be usable before the user types anything, so blank input clears the parent holding to `null` without showing an error.

Zero and negative numbers are invalid.

### No separate loading screen

I kept the result cards visible in their empty state while the first API request is happening rather than adding another dedicated loading UI.

That kept the number of UI states smaller. The tradeoff is that the initial fetch is less explicit to the user for the short time before the rates return.

### Direct Coinbase request from the browser

For this assignment I call Coinbase directly from the frontend because it is a public read-only endpoint and the app does not need a backend.

For a larger production app I would consider whether the API request should go through a backend for things like caching, more control over failures, or changes to the third-party API.

### Two responsive breakpoints

I used two breakpoints because the layout runs out of space in two different places:

- around **900px**, the input side and result side stack vertically
- around **600px**, the Bitcoin and Ethereum cards also stack vertically

This lets the two result cards stay side by side on tablet instead of switching to a full mobile layout too early.

### Pixel padding inside the amount input

I used fixed pixel padding around the `$` and `USD` text inside the input because those are fixed-size UI elements and the rest of the component spacing already uses pixels.

The input itself is still responsive because it uses `width: 100%` and sits inside flexible responsive containers.

## Accessibility choices

- the amount `<label>` is connected to the input with `for="holding-input"`
- decorative symbols use `aria-hidden="true"`
- invalid input uses `aria-invalid`
- the validation message is connected to the input through `aria-describedby`
- validation and API errors can use `role="alert"`
- keyboard users get a stronger visible focus state through `:focus-visible`
- the input also keeps its normal `:focus` border state
- blank input is intentionally allowed, so native `required` is not used
- interactive actions use real `<button>` elements

## Run locally

```bash
npm install
npm run dev
```

Production build:

```bash
npm run build
npm run preview
```

## More detail

- [Development process and decision log](docs/plan.md)
- [Technical structure and data flow](docs/spec.md)
