# Technical Specification

## Overview

This is a Vue 3 frontend application that takes a USD amount and calculates a fixed allocation of:

- 70% Bitcoin (BTC)
- 30% Ethereum (ETH)

It uses live USD-based exchange rates from the Coinbase public API and displays both the USD allocation and the amount of BTC and ETH the user could buy.

The application is frontend-only. It does not include a backend, database, authentication, routing, or trading functionality.

## Tech Stack

- Vue 3
- Vite
- JavaScript
- CSS
- Coinbase public exchange-rates API

## Application Structure

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

## Component Responsibilities

### `App.vue`

Main application state and shared logic.

Responsible for:

- USD holding value
- BTC and ETH rates
- API error state
- last-refreshed time
- 70 / 30 allocation calculations
- BTC / ETH quantity calculations
- display formatting
- deciding whether to show results or the API error state

### `ratesApi.js`

Responsible for the Coinbase request.

The request:

1. calls the Coinbase exchange-rates endpoint
2. checks that the HTTP response succeeded
3. parses the JSON response
4. keeps the BTC and ETH rates
5. verifies both required rates are present
6. returns either the rates or an error

### `AmountToAllocate.vue`

Responsible for:

- amount input
- local input validation
- fixed 70 / 30 allocation display
- sending a valid numeric amount to `App.vue`

### `CryptoQuantity.vue`

Groups the result area and displays:

- Bitcoin result card
- Ethereum result card
- total allocated amount
- last-refreshed information
- Refresh Rates action

### `BtcQuantityCard.vue`

Displays:

- Bitcoin allocation percentage
- allocated USD
- BTC quantity
- current BTC price in USD

### `EthQuantityCard.vue`

Displays:

- Ethereum allocation percentage
- allocated USD
- ETH quantity
- current ETH price in USD

## Data Flow

### User amount

```text
User input
→ AmountToAllocate.vue
→ App.vue
→ calculated 70 / 30 values
→ calculated BTC / ETH quantities
→ formatted display values
→ result components
```

### Exchange rates

```text
Page mount / Refresh / Retry
→ loadRates()
→ ratesApi.js
→ Coinbase API
→ BTC + ETH rates or error
→ App.vue
```

## State

Stored application state:

```text
holding: number | null

rates:
  btcRate: number | null
  ethRate: number | null

error: Error | null
lastRefreshed: Date | null
```

The 70 / 30 allocations and BTC / ETH quantities are calculated from these values rather than stored separately.

## Calculation Logic

The Coinbase USD-base endpoint returns how much of each cryptocurrency $1 USD can buy.

### USD allocation

```text
BTC allocation = holding × 0.70
ETH allocation = holding × 0.30
```

### Crypto quantity

```text
BTC quantity = BTC allocation × BTC rate
ETH quantity = ETH allocation × ETH rate
```

### Current USD price

To display the USD value of one coin:

```text
1 BTC in USD = 1 ÷ BTC rate
1 ETH in USD = 1 ÷ ETH rate
```

Numeric values remain numbers during calculation and are formatted only for display.

## API Behavior

Rates are fetched:

- when the application first mounts
- when the user selects Refresh Rates
- when the user retries after an API error

The amount entered by the user does not affect the Coinbase request, so changing the amount only recalculates local values.

A successful fetch updates:

- BTC rate
- ETH rate
- last-refreshed time

A failed fetch updates the API error state and does not update the last-refreshed time.

## Input Rules

### Blank

- treated as an empty state
- no validation error
- parent holding is `null`

### Positive number

- accepted
- converted to a number
- used in the calculations

### Zero or negative number

- rejected
- validation message is shown
- parent holding remains `null`

The input uses `type="number"`, so the browser also prevents normal alphabetic input.

## UI States

### Empty state

The result cards remain visible before a valid amount is entered and show placeholder values.

### Result state

A valid positive amount displays:

- 70% BTC USD allocation
- 30% ETH USD allocation
- BTC quantity
- ETH quantity
- current BTC and ETH prices
- total allocated amount

### Input error state

Zero and negative values show a validation message.

### API error state

If Coinbase cannot be reached or the required rates are unavailable, the normal result area is replaced by an error message and Retry action.

## Refresh and Timestamp

The same rate-loading function is used for:

- initial fetch
- Refresh Rates
- Retry

`lastRefreshed` represents the time the application last successfully received and stored rates.

It is not a timestamp returned by Coinbase.

## Responsive Layout

The layout uses two main responsive breakpoints.

### Desktop

```text
Amount input | BTC + ETH results
             | Total / Refresh
```

### 900px and below

```text
Amount input
BTC | ETH
Total / Refresh
```

### 600px and below

```text
Amount input
BTC
ETH
Total
Refresh
```

The breakpoints were chosen based on where the content stopped fitting comfortably.

## Accessibility

The application includes:

- a label connected to the amount input
- `aria-invalid` for invalid input
- `aria-describedby` connecting the input to its validation message
- `role="alert"` for validation and API errors
- `aria-hidden="true"` on decorative symbols
- native `<button>` elements for Retry and Refresh
- visible keyboard focus using `:focus-visible`
- semantic page heading structure

Blank input is intentionally allowed, so native `required` validation is not used.

## UI / UX Reference

The image stored at:

```text
docs/assets/claude-ui-design-reference.png
```

was used as a visual design reference for:

- layout
- spacing
- card treatment
- visual hierarchy
- BTC / ETH color treatment
- 70 / 30 allocation bar
- overall financial-tool feel

It is a design reference rather than a screenshot of the final implementation.

Optional controls shown in the reference, such as quick amount buttons, were not included because they were outside the required scope.

## Main Technical Decisions

### Frontend-only implementation

The Coinbase endpoint is public and read-only, so no backend was added for this assignment.

### Computed values

Allocation and quantity values are derived from the current amount and exchange rates rather than stored as separate state.

### Separate BTC and ETH card components

The application supports only two cryptocurrencies, so the coin-specific cards remain separate.

If the application were expanded to support more cryptocurrencies, this would be a good place to introduce a reusable card component driven by configuration data.

### No separate loading screen

During the initial request, the result area remains in its empty presentation rather than introducing another dedicated loading layout.

## Build and Production Check

```bash
npm install
npm run build
npm run preview
```

The production preview should be used for the final manual check before submission.
