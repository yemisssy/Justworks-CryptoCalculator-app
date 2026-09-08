# Technical Structure and Data Flow

This is a literal breakdown of how I structured the app and how data moves through it.

The app is small, so I did not add a state library, router, backend, database, or extra architecture that the assignment does not need.

---

## 1. Main structure

```text
Coinbase API
     ↓
ratesApi.js
     ↓
   App.vue
  ↙       ↘
input     results
component components
```

A slightly more detailed version:

```text
User types amount
      ↓
AmountToAllocate.vue
      ↓ emit update:holding
App.vue
      ↓
computed 70 / 30 allocations
      ↓
computed BTC / ETH quantities
      ↓
formatted display values
      ↓
CryptoQuantity.vue
      ↓
BTC card + ETH card
```

For rates:

```text
App.vue mounts / user clicks Refresh / user clicks Retry
      ↓
loadRates()
      ↓
ratesApi.js
      ↓
Coinbase
      ↓
BTC + ETH rates or an error
      ↓
App.vue
```

---

## 2. What each file is responsible for

### `App.vue`

I treat `App.vue` as the main source of truth for values used across the page.

It owns:

```text
holding
btcRate
ethRate
error
lastRefreshed
```

It also calculates:

```text
btcAllocatedUSD
ethAllocatedUSD
btcQuantityOwned
ethQuantityOwned
formatted display values
```

It decides whether the result section or the API error section should render.

### `ratesApi.js`

This file only deals with getting and checking Coinbase data.

It does not know anything about the page layout.

It:

```text
fetches
checks response.ok
parses JSON
gets data.data.rates
filters to BTC / ETH
checks both exist
returns rate or error
```

### `AmountToAllocate.vue`

This file owns the input interaction.

It has local validation UI and emits a normalized value back to the parent.

```text
blank           → emit null, no error
<= 0 / invalid  → emit null, show error
positive number → emit Number(value), clear error
```

### `CryptoQuantity.vue`

This file groups the result area.

It receives already-calculated/formatted values and passes coin-specific values to the two card components.

It also shows:

- total allocated
- last refreshed
- Refresh button

### `BtcQuantityCard.vue` and `EthQuantityCard.vue`

These components handle the coin-specific display.

They also invert the raw Coinbase rate so the UI can show the familiar price of one BTC or one ETH in USD.

---

## 3. State I store vs values I calculate

### Stored state

```text
holding: number | null
rates.btcRate: number | null
rates.ethRate: number | null
error: Error | null
lastRefreshed: Date | null
```

### Values I do not store separately

```text
btcAllocatedUSD
ethAllocatedUSD
btcQuantityOwned
ethQuantityOwned
formatted strings
```

I calculate these with `computed` because they come directly from the stored values.

That means I only have to update the source values and Vue keeps the results in sync.

---

## 4. Calculation direction

Coinbase's USD-base endpoint returns how much of each currency **$1 USD can buy**.

So:

```text
BTC quantity = (holding × 0.70) × BTC rate
ETH quantity = (holding × 0.30) × ETH rate
```

For the current-rate text:

```text
BTC USD price = 1 ÷ BTC rate
ETH USD price = 1 ÷ ETH rate
```

---

## 5. Why I validate the response after `response.ok`

`response.ok` only tells me the HTTP request succeeded.

My screen specifically needs BTC and ETH.

So after parsing the data, I also check:

```text
Does BTC exist?
Does ETH exist?
```

If either one is missing, I treat the request as a failure for this app because I cannot calculate the required result correctly.

---

## 6. Why I keep numbers separate from formatted text

My calculation path is:

```text
number
→ calculation
→ number
→ formatting
→ text shown in UI
```

I do not want this:

```text
$7,000.00
→ remove $ and commas
→ turn back into a number
→ continue calculating
```

Keeping raw values numeric makes the logic simpler and reduces formatting-related bugs.

---

## 7. Main UI states

### Empty state

```text
No positive holding yet
Result cards still render
Allocation / quantity values show placeholders
```

This is not treated as an error.

### Populated state

```text
Positive holding
Rates available
Calculated USD allocations and crypto quantities display
```

### Invalid amount

```text
Zero / negative / invalid input
Local validation appears
Parent holding becomes null
```

### Coinbase error

```text
Request fails or required rates are missing
Result area is replaced by error UI
Retry calls the same loadRates function
```

---

## 8. When I fetch

I fetch rates:

```text
1. when the app mounts
2. when the user clicks Refresh
3. when the user retries after an API error
```

I do not fetch when the holding changes because the holding is not part of the Coinbase request.

---

## 9. How the live-rate status should be shown

The “Live Coinbase rates” status should only appear when usable BTC and ETH rates are available and there is not currently an API error.

A direct Vue check can be:

```vue
<div
  v-if="!error && rates.btcRate && rates.ethRate"
  id="live-coinbase-rate"
>
  ...
</div>
```

I would not use:

```vue
v-if="{ ...rates }"
```

because `{ ...rates }` creates an object, and an object is truthy even if `btcRate` and `ethRate` inside it are still `null`.

---

## 10. Responsive layout

### Desktop

```text
[ Amount card ] [ BTC card | ETH card ]
                [ Total / Refresh       ]
```

### At 900px and below

```text
[ Amount card       ]
[ BTC card | ETH    ]
[ Total / Refresh   ]
```

### At 600px and below

```text
[ Amount card ]
[ BTC card    ]
[ ETH card    ]
[ Total       ]
[ Refresh     ]
```

I chose the breakpoints based on when my actual content started feeling compressed, not because those numbers represent a specific device model.

---

## 11. Accessibility structure

### Input label

```html
<label for="holding-input">Amount to allocate</label>
<input id="holding-input" />
```

### Invalid state

```vue
<input
  :aria-invalid="invalidHolding"
  :aria-describedby="invalidHolding ? 'invalidholding-error' : undefined"
/>
```

### Validation description

```html
<div id="invalidholding-error" role="alert">
  Enter a valid amount greater than $0.
</div>
```

The `aria-describedby` value is the **ID** of the error element, not the error sentence itself.

### Focus

```text
:focus         → general focus, including mouse or keyboard
:focus-visible → browser shows the stronger focus indicator when it is useful,
                 especially for keyboard navigation
```

### Decorative icons

Symbols that do not add extra meaning use:

```html
aria-hidden="true"
```

---

## 12. Design reference vs final implementation

The saved UI image in `docs/assets/claude-ui-design-reference.png` is a design reference.

It is useful for showing the intended visual direction, but it should not be read as a screenshot proving that every pictured control exists in the app.

For example, it includes quick amount buttons. Those were not part of the required functionality and were intentionally left out of the time-boxed implementation.

---

## 13. Decisions and tradeoffs

### Separate BTC and ETH components

**What I chose:** two card components.

**Why:** there are only two coins and it was easier for me to follow while working quickly in a framework I was less familiar with.

**Tradeoff:** there is duplicated markup.

**If the app grew:** I would probably make one reusable card component driven by props or an array of coin configuration.

### Function prop for Refresh

**What I chose:** pass `loadRates` down as a prop.

**Why:** it was direct and easy for me to follow under the time limit.

**Tradeoff:** emitting a refresh event would make the child-to-parent communication style more consistent with the input component and more typical of Vue.

### Direct frontend Coinbase call

**What I chose:** browser → Coinbase directly.

**Why:** public read-only endpoint, no authentication, and no backend requirement.

**Tradeoff:** the frontend depends directly on Coinbase availability and response shape.

### No dedicated loading state

**What I chose:** keep the result cards in their empty presentation during the initial request.

**Why:** fewer states and less extra UI to build/test.

**Tradeoff:** less explicit initial loading feedback.

### No quick amount buttons

**What I chose:** leave them out even though they exist in the design reference.

**Why:** they are a convenience feature, not part of the required calculation flow.

**Tradeoff:** fewer shortcuts for the user, but more time spent on required behavior and quality.
