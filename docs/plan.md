# Development Plan

## Goal

Build a small Vue 3 application that takes a USD amount and shows how that amount would be split between Bitcoin and Ethereum using a fixed 70 / 30 allocation and live Coinbase exchange rates.

The main user flow is:

```text
Enter USD amount
→ split 70% to Bitcoin / 30% to Ethereum
→ use current Coinbase rates
→ calculate BTC and ETH quantities
→ display the result
```

## Scope

### Required

- Accept a USD amount
- Use a fixed 70% Bitcoin / 30% Ethereum split
- Fetch BTC and ETH exchange rates from Coinbase
- Calculate the quantity of BTC and ETH the user could buy
- Show the current USD value of 1 BTC and 1 ETH
- Handle invalid input
- Handle Coinbase/API failure
- Allow the user to refresh rates
- Show when rates were last successfully refreshed
- Support desktop, tablet, and mobile layouts

### Out of scope

To keep the assignment focused and time-boxed, I did not add:

- authentication
- a backend
- routing
- charts
- trading functionality
- additional cryptocurrencies
- quick amount buttons
- automated tests

## Build Order

I planned the work in this order:

```text
1. Understand the Coinbase response
2. Fetch and validate BTC / ETH rates
3. Build the 70 / 30 calculation
4. Connect the amount input
5. Add empty, valid, and error states
6. Build the main UI
7. Add responsive behavior
8. Add accessibility details
9. Clean up and run a production build
10. Complete final manual QA
```

The priority was to make the required calculation and API behavior work before spending time on visual polish.

## Data Flow

```text
Coinbase API
→ ratesApi.js
→ App.vue
→ computed calculations
→ formatted display values
→ result components
```

`App.vue` holds the main values used across the page:

- USD amount
- BTC rate
- ETH rate
- API error
- last-refreshed time

Values such as the 70% allocation, 30% allocation, BTC quantity, and ETH quantity are calculated from those values rather than stored separately.

## API Plan

The Coinbase request is kept in `ratesApi.js`.

The request flow is:

```text
Fetch Coinbase
→ check response.ok
→ parse JSON
→ keep BTC and ETH rates
→ verify both rates exist
→ return rates or an error
```

Rates are fetched:

- when the app first mounts
- when the user selects Refresh
- when the user retries after an API error

The user's amount does not affect the Coinbase request, so the app does not fetch again on every input change.

## Calculation Plan

Coinbase returns the amount of cryptocurrency that $1 USD can buy.

```text
BTC USD allocation = holding × 0.70
ETH USD allocation = holding × 0.30

BTC quantity = BTC USD allocation × BTC rate
ETH quantity = ETH USD allocation × ETH rate
```

To display the current USD price of one coin:

```text
1 BTC in USD = 1 ÷ BTC rate
1 ETH in USD = 1 ÷ ETH rate
```

Calculation values stay numeric until they are formatted for display.

## Component Structure

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

Handles the main state, API result, calculations, and values shared across components.

### `AmountToAllocate.vue`

Handles:

- USD input
- input validation
- fixed 70 / 30 allocation display
- sending the valid amount to `App.vue`

### `CryptoQuantity.vue`

Groups:

- Bitcoin result card
- Ethereum result card
- total allocated
- last-refreshed information
- Refresh action

### BTC / ETH cards

Bitcoin and Ethereum are kept as separate components because the assignment only supports two coins and the separate files keep the coin-specific values easy to follow.

If the app supported more cryptocurrencies, these could be replaced by one reusable card component.

## UI States

### Empty

Before the user enters an amount, the result cards stay visible with placeholders.

Blank input is allowed and is not treated as an error.

### Valid amount

A positive amount updates the 70 / 30 split and the BTC / ETH quantities.

### Invalid amount

Zero and negative values show a validation error.

Invalid values are not allowed to continue into the parent calculation state.

### API error

If Coinbase cannot be reached or the required rates are missing, the result area shows an error state with a Retry action.

The "Live Coinbase rates" status only appears after both BTC and ETH rates are available.

## UI / UX Plan

The UI design reference was used to guide:

- spacing
- visual hierarchy
- card layout
- Bitcoin and Ethereum colors
- the 70 / 30 allocation bar
- separation between the input and results
- the overall clean financial-tool feel

The design reference was not treated as a required feature list. Optional ideas that were outside the assignment scope were left out.

## Responsive Plan

Two breakpoints are used because the layout runs out of space in two stages.

### Around 900px

The input section and results section stack vertically.

The BTC and ETH cards remain side by side.

### Around 600px

The BTC and ETH cards also stack vertically.

```text
Desktop:
Input | BTC + ETH

Tablet:
Input
BTC | ETH

Mobile:
Input
BTC
ETH
```

## Accessibility Plan

The main accessibility work includes:

- connected input label
- `aria-invalid` for invalid input
- `aria-describedby` for the validation message
- `role="alert"` for validation and API errors
- `aria-hidden="true"` for decorative symbols
- native buttons for Retry and Refresh
- visible keyboard focus with `:focus-visible`
- no native `required` because blank input is intentionally allowed

## Main Tradeoffs

### No separate loading screen

The result cards remain in their empty state while the first API request is loading.

This keeps the UI states simple, but the initial request is less explicit for the short time before the rates return.

### Direct Coinbase request from the frontend

The assignment uses a public read-only endpoint, so a backend was not added.

For a larger production application, a backend could be considered for caching, API control, and centralized failure handling.

### Separate BTC and ETH card components

This creates some duplicated markup, but it keeps the two coin-specific result paths simple for a two-coin assignment.

### Fixed internal input spacing

The `$` prefix and `USD` suffix use fixed internal spacing because they are fixed-size elements. The input itself and the surrounding layout remain responsive.

## Final QA Plan

Before submission:

- verify empty state
- enter a valid amount and confirm 70 / 30 values
- test zero
- test a negative amount
- clear the input
- verify current BTC / ETH rates display
- test Refresh
- verify last-refreshed time updates
- verify API error / Retry behavior
- check desktop, tablet, and mobile widths
- check keyboard focus
- verify there is no horizontal overflow
- run `npm run build`
- run `npm run preview`
- test the production preview
