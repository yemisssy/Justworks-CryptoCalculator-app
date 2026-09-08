# My Development Process and Decision Log

This document is my running explanation of how I approached the assignment, what I changed while building it, what I learned in Vue, and why I made certain choices.

I am intentionally writing this in the way I would explain the work in an interview rather than trying to make it sound more complicated than it was.

---

## React → Vue translation I used while building

I am more familiar with React, so one of the ways I kept myself grounded was translating the Vue syntax back to the React concepts I already knew.

| What I know from React | Vue 3 equivalent I used | How I used it |
| --- | --- | --- |
| `useState` | `ref` | holding, rates, error, last refreshed |
| `useEffect(..., [])` | `onMounted` | initial Coinbase fetch |
| derived values | `computed` | USD allocations, crypto quantities, formatted values |
| props | `defineProps` | passing values into result/card components |
| child callback to parent | `defineEmits` | sending the holding value back to `App.vue` |
| event handler | `@input`, `@click` | input and buttons |
| conditional JSX | `v-if`, `v-else` | empty, result, validation, API error states |
| JSX prop binding | `:` | passing reactive prop values |
| state/computed access in JS | `.value` | reading/writing refs inside `<script setup>` |

### Vue rules I had to keep reminding myself of

- Vue templates automatically unwrap refs, but inside script logic I use `.value`.
- `computed` is useful for a value that can always be calculated from other reactive values.
- I do not need another piece of state for something that can already be calculated from `holding` and `rates`.
- A normal helper function is not reactive by itself, but a `computed` value that calls the helper will update when its reactive inputs change.
- `event.target.value` from an `<input type="number">` is still a string, so I convert it before sending it to the parent.
- `:` is shorthand for `v-bind`.
- `@` is shorthand for `v-on`.

---

## My priority order

Because this was a time-boxed assignment, I kept coming back to this order:

```text
1. Make the calculation work
2. Make sure I understand the Vue/data flow
3. Make the UI clear and polished
4. Make it responsive and accessible
5. Clean up the code and document my choices
6. Only then consider extras
```

I also used a rule from my coding-assessment practice: **one data step at a time**.

For this project that meant:

```text
fetch rates
→ verify the response
→ parse the response
→ keep BTC + ETH
→ save the rates
→ calculate the split
→ calculate the quantities
→ format the values
→ display them
```

That helped me avoid trying to debug the API, calculations, and UI at the same time.

---

## 1. I clarified what the Coinbase rate actually means first

The endpoint uses USD as the base currency.

That means a rate is telling me how much of a cryptocurrency **$1 USD can buy**.

So I use:

```text
allocated USD × rate = crypto quantity
```

For the current-rate text people are more used to seeing, I invert that rate:

```text
1 ÷ BTC rate = USD price of 1 BTC
1 ÷ ETH rate = USD price of 1 ETH
```

I wanted to be sure about this before building more UI because getting the direction of the calculation wrong would make the rest of the app look correct while returning the wrong answer.

---

## 2. I moved the Coinbase request into `ratesApi.js`

I could have fetched directly inside `App.vue`, but I wanted the request code to be in one clear place.

The helper does the following:

- fetches the Coinbase endpoint
- checks `response.ok`
- parses the JSON
- filters the large rates object down to BTC and ETH
- checks that BTC and ETH were actually returned
- returns either the rates or an error

I added the BTC / ETH check even after a successful HTTP response because a successful request does not automatically mean the exact data my screen needs is present.

---

## 3. I kept the main state in `App.vue`

`App.vue` holds the values that affect more than one part of the page:

```text
holding
BTC rate
ETH rate
API error
last refreshed time
```

I did not create separate state for the 70% amount, 30% amount, BTC quantity, or ETH quantity because all of those can be calculated from the state I already have.

---

## 4. I used `computed` for values that come from other values

Examples:

```text
BTC allocated USD = holding × .70
ETH allocated USD = holding × .30
BTC quantity = BTC allocated USD × BTC rate
ETH quantity = ETH allocated USD × ETH rate
```

This made sense to me as the Vue version of keeping derived values out of state when they can always be recreated from the current source values.

---

## 5. I separated calculation values from formatted display values

I keep the calculation as numbers.

Then I create formatted versions for display, such as:

```text
70        → $70.00
0.0009015 → 0.0009015
```

I did not want to calculate from strings like `$70.00` because then I would have to strip the formatting back out later.

I created a small formatter that handles USD differently from crypto decimals.

---

## 6. I defined the input behavior before adding more UI

I decided the input should have three clear cases:

### Blank

```text
no validation error
holding in parent = null
results show empty placeholders
```

### Zero / negative / invalid

```text
show validation message
holding in parent = null
```

### Positive number

```text
clear validation
send Number(value) to App.vue
calculate and display results
```

I intentionally do not send invalid values into the parent calculation state.

---

## 7. I fetch rates on mount and on Refresh, not on every keystroke

The user amount does not change the Coinbase response.

So there is no reason to call Coinbase every time the user types another digit.

I fetch once when the page mounts and reuse the same fetch function for Refresh and Retry.

Then Vue recalculates the quantities locally when the holding changes.

---

## 8. I used one fetch path for initial load, Retry, and Refresh

I kept the request logic inside one `loadRates` function.

On success it:

- saves numeric BTC / ETH rates
- clears the API error
- sets `lastRefreshed` to the current time

On failure it:

- stores the error
- does not update `lastRefreshed`

This prevents the screen from claiming the rates were refreshed when the request actually failed.

---

## 9. I kept the initial pending state visually simple

I did not build a separate loading screen.

While the first request is happening, the cards can stay in their empty state.

I chose this because the assignment is small and the request should normally be quick. It also meant I did not add another state and another design that I would need to test.

The tradeoff is that the page gives less explicit feedback during the first request.

---

## 10. I treated the Claude screen as a design reference, not a list of required features

The design reference helped me decide:

- page hierarchy
- spacing
- card shape
- Bitcoin orange / Ethereum blue
- allocation bar treatment
- how to separate the input side from the result side
- how much information should be visible without making it look like a trading dashboard

The reference also includes quick amount buttons.

I did not implement those because they were not required by the assignment and I did not want an extra convenience feature to take time away from functionality, responsiveness, accessibility, error handling, and cleanup.

That is a deliberate scope choice, not an accidental missing feature.

---

## 11. I used separate Bitcoin and Ethereum card components

The cards are very similar, so I know they could eventually become one reusable `CryptoQuantityCard` component with props.

I kept them separate for this assignment because:

- I only have two coins
- I could follow each coin's logic quickly
- it reduced the chance of adding abstraction while I was still learning the Vue syntax

The tradeoff is some duplicated markup.

If the app needed more cryptocurrencies, I would refactor this.

---

## 12. Refresh is a function prop instead of an emitted event

For the amount input I use an emitted event to send the value upward.

For Refresh, I pass `loadRates` down as a function prop.

I know emitting a refresh event would be a more typical Vue pattern. I kept the function prop because it was simple for me to follow under the time limit and it does not create a problem at this size.

If I were cleaning the app further, this is one thing I could make more consistent.

---

## 13. I used native symbols instead of installing an icon library

I used simple symbols for:

- BTC
- ETH
- success/status dot
- warning/error
- refresh
- empty state

This avoided adding a dependency just for a few small visual elements.

I mark decorative symbols with `aria-hidden="true"` where the surrounding text already explains the meaning.

---

## 14. I used two responsive breakpoints because the layout breaks in two stages

At larger widths, the input card and results sit beside each other.

At around **900px**, that overall two-column layout becomes too compressed, so I stack the input section above the results.

The BTC and ETH cards can still fit side by side at that point.

At around **600px**, the two result cards also become too narrow, so I stack them.

That gives me:

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

I preferred this over switching the whole page to a single column too early.

---

## 15. I kept fixed pixel padding around `$` and `USD` inside the input

I considered whether the padding around the prefix and suffix needed to scale with the viewport.

I decided it did not.

The `$` and `USD` text are fixed-size elements inside the input, so I only need to reserve enough space so the user's number does not overlap them.

The input itself still uses `width: 100%`, and the surrounding layout is flexible and responsive.

I also kept the spacing in pixels because the rest of this stylesheet already uses pixels for component-level spacing, so changing only this part to `rem` would have been inconsistent without giving me a real benefit.

---

## 16. Accessibility decisions

### Label

The input label uses:

```html
<label for="holding-input">...</label>
<input id="holding-input" ... />
```

so the label and field are connected.

### Validation message

The custom error message is connected to the input by its ID:

```html
<input
  :aria-invalid="invalidHolding"
  :aria-describedby="invalidHolding ? 'invalidholding-error' : undefined"
/>

<div id="invalidholding-error" role="alert">
  Enter a valid amount greater than $0.
</div>
```

`aria-describedby` contains the ID of the element with the description. It does not contain the actual message text.

### Focus vs focus-visible

I keep the normal input border change on `:focus`.

I use the stronger outline on `:focus-visible` so keyboard users have an obvious focus indicator without forcing the stronger outline on every mouse click.

### Native required validation

Blank is a valid empty state in my app, so I removed native `required` rather than having the browser show “Please fill out this field” while my own logic says blank is allowed.

---

# What I learned / reinforced

- Vue `ref` vs React state
- `.value` in Vue script logic
- `computed` for derived values
- `onMounted` for initial side effects
- `defineProps` and `defineEmits`
- `:` and `@` shorthand
- keeping invalid input out of parent calculation state
- separating raw values from formatted strings
- why a successful HTTP response still needs response-shape validation
- how `aria-describedby` connects an input to another element by ID
- the practical difference between `:focus` and `:focus-visible`
- responsive breakpoints can come from where the content stops fitting, not just common device sizes

---

# Questions I would expect to be asked about this project

## Product / UX

1. Why did you keep the cards visible before an amount is entered?
2. Why did you make blank different from zero or a negative number?
3. Why did you not add a dedicated loading screen?
4. Why did you leave the quick amount buttons from the design reference out?
5. Why did you choose 900px and 600px for the layout changes?
6. What would you improve if you had more time?

## Engineering

1. Why is `App.vue` holding most of the state?
2. Why did you use `computed` instead of more refs?
3. Why is the API call in its own file?
4. What does the Coinbase USD rate mean and why do you multiply by it?
5. Why do you invert the Coinbase rate to display the current price of one coin?
6. Why do you fetch on mount / Refresh instead of every input change?
7. Why do invalid values emit `null`?
8. Why are the Bitcoin and Ethereum cards separate components?
9. Why did you use an emit for the holding but a function prop for Refresh?
10. What accessibility work did you add?
11. What would need to change if this supported ten cryptocurrencies instead of two?
12. What would you do differently for a production app that depends heavily on Coinbase?

---

# Final checklist

## Functionality

- [x] fetch Coinbase rates
- [x] check BTC and ETH exist
- [x] calculate 70 / 30 USD split
- [x] calculate BTC / ETH quantities
- [x] show current coin prices in USD
- [x] empty state
- [x] invalid amount state
- [x] API error state
- [x] Retry
- [x] Refresh
- [x] last-refreshed time

## UI

- [x] desktop layout
- [x] tablet layout
- [x] mobile layout
- [x] BTC / ETH visual difference
- [x] 70 / 30 allocation bar
- [x] result cards
- [x] total / refresh area
- [x] hero / header / footer
- [x] input prefix / suffix

## Accessibility

- [x] label connected to input
- [x] decorative symbols hidden where appropriate
- [ ] verify `aria-invalid` is in final local code
- [ ] verify `aria-describedby` is in final local code
- [ ] verify validation/API errors use `role="alert"`
- [ ] verify `:focus-visible` on input and buttons
- [ ] verify final heading order

## Cleanup / delivery

- [ ] remove learning/question comments from production code
- [ ] fix remaining spelling / naming typos
- [ ] remove unused imports / emits
- [ ] update browser `<title>`
- [ ] run `npm run build`
- [ ] test a fresh `npm install` + run
- [ ] final manual QA
- [ ] zip the project
