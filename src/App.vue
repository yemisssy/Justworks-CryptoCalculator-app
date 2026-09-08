<script setup>
import { ref, computed, onMounted } from "vue";
import AmountToAllocate from "./components/AmountToAllocate.vue";
import CryptoQuantity from "./components/CryptoQuantity.vue";
import { fetchCryptoRate } from "./ratesApi.js";

//STATES
const holding = ref(null);
const rates = ref({
  btcRate: null, //Used an object instead of array although they are only two because they are meant to be unqiqe and avoid re-ordering indexing error
  ethRate: null,
});

const error = ref(null); //Question: Why is this better to default to null, is it because I am storing the actual error value not the boolean whether or not there is an error
const lastRefreshed = ref(null); // This should be timestamp, date time format

const loadRates = async () => {
  //call fetch function & update rates values
  const fetchedRates = await fetchCryptoRate();

  if (fetchedRates.error) {
    error.value = fetchedRates.error;
    return;
  }

  rates.value = {
    btcRate: Number(fetchedRates.rate.BTC),
    ethRate: Number(fetchedRates.rate.ETH),
  };
  error.value = null;
  lastRefreshed.value = new Date();
};

//UseEffect Equivalent
onMounted(loadRates);

//Numeric calculations
const btcAllocatedUSD = computed(() => {
  if (!holding.value) return null; //Question: why return null & not just return?

  return holding.value * 0.7;
});

const ethAllocatedUSD = computed(() => {
  if (!holding.value) return null;

  return holding.value * 0.3;
});

const btcQuanityOwned = computed(() => {
  if (!rates.value.btcRate) return null;
  return btcAllocatedUSD.value * rates.value.btcRate;
});

const ethQuanityOwned = computed(() => {
  if (!rates.value.ethRate) return null;
  return ethAllocatedUSD.value * rates.value.ethRate;
});

//Formmatting Function
const formatUsdAndDeci = (value, type) => {
  if (value === null) return null;

  if (type === "crypto") {
    return value.toLocaleString("en-US", {
      maximumFractionDigits: 8,
    });
  }

  return value.toLocaleString("en-us", {
    style: "currency",
    currency: "USD",
  });
};

//Formatted values
const formattedBtcAllocatedUSD = computed(() => {
  return formatUsdAndDeci(btcAllocatedUSD.value, "usd");
});

const formattedEthAllocatedUSD = computed(() => {
  return formatUsdAndDeci(ethAllocatedUSD.value, "usd");
});

const formattedBtcQuantity = computed(() => {
  return formatUsdAndDeci(btcQuanityOwned.value, "crypto");
});

const formattedEthQuantity = computed(() => {
  return formatUsdAndDeci(ethQuanityOwned.value, "crypto");
});
</script>

<template>
  <header>
    <h3>Justworks. | Crypto Allocation</h3>
    <div id="live-coinbase-rate">
      <span class="status-dot" aria-hidden="true"></span>
      <h5>Live Coinbase rates</h5>
    </div>
  </header>
  <h1>Allocate your USD across Bitcoin & Ethereum</h1>
  <p>
    Enter an amount and we'll split it with a fixed 70 / 30 ratio — 70% to
    Bitcoin, 30% to Ethereum — using live Coinbase exchange rates.
  </p>
  <AmountToAllocate :holding="holding" @update:holding="holding = $event" />
  <div v-if="error" id="api-error-div">
    <div id="error-message-div">
      <span class="alert-icon" aria-hidden="true">!</span>
      <h4>We couldn't reach Coinbase</h4>
    </div>
    <p>
      The exchange rates couldn't be loaded right now. Your amount is safe — try
      fetching the latest rates again.
    </p>
    <button @click="loadRates"><span aria-hidden="true">↻</span>Retry</button>
  </div>
  <CryptoQuantity
    v-else
    :btcAllocatedUSD="formattedBtcAllocatedUSD"
    :btcQuantityOwned="formattedBtcQuantity"
    :ethAllocatedUSD="formattedEthAllocatedUSD"
    :ethQuantityOwned="formattedEthQuantity"
    :btcRate="rates.btcRate"
    :ethRate="rates.ethRate"
    :lastRefreshed="lastRefreshed"
    :holding="holding"
    :handleRefresh="loadRates"
  />
  <h5>
    Exchange rates are retrieved from the public Coinbase API; the timestamp
    reflects when this app last fetched them. For demonstration only — not
    financial advice.
  </h5>
</template>
