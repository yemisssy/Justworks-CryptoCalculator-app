<script setup>
import { ref, computed, onMounted } from "vue";
import AmountToAllocate from "./components/AmountToAllocate.vue";
import CryptoQuantity from "./components/CryptoQuantity.vue";
import { fetchCryptoRate } from "./ratesApi.js";

//STATES
const holding = ref(null);
const rates = ref({
  btcRate: null,
  ethRate: null,
});

const error = ref(null);
const lastRefreshed = ref(null);

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

onMounted(loadRates);

//Numeric calculations
const btcAllocatedUSD = computed(() => {
  if (!holding.value) return null;

  return holding.value * 0.7;
});

const ethAllocatedUSD = computed(() => {
  if (!holding.value) return null;

  return holding.value * 0.3;
});

const btcQuantityOwned = computed(() => {
  if (!rates.value.btcRate) return null;
  return btcAllocatedUSD.value * rates.value.btcRate;
});

const ethQuantityOwned = computed(() => {
  if (!rates.value.ethRate) return null;
  return ethAllocatedUSD.value * rates.value.ethRate;
});

// Reusable formmatting Function
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
  return formatUsdAndDeci(btcQuantityOwned.value, "crypto");
});

const formattedEthQuantity = computed(() => {
  return formatUsdAndDeci(ethQuantityOwned.value, "crypto");
});

const formattedHolding = computed(() => {
  return formatUsdAndDeci(holding.value, "usd");
});
</script>

<template>
  <header>
    <p id="product-title">
      <span class="justworks-title">
        Justworks<span class="justworks-dot">.</span>
      </span>
      <span class="title-divider">|</span>
      <span class="crypto-title">Crypto Allocation</span>
    </p>
    <div
      v-if="!error && rates.btcRate && rates.ethRate"
      id="live-coinbase-rate"
    >
      <span class="status-dot" aria-hidden="true"></span>
      <h5>Live Coinbase rates</h5>
    </div>
  </header>
  <h1 id="hero-title">Allocate your USD across Bitcoin & Ethereum</h1>
  <p id="hero-description">
    Enter an amount and we'll split it with a fixed 70 / 30 ratio — 70% to
    Bitcoin, 30% to Ethereum — using live Coinbase exchange rates.
  </p>
  <div id="crypto-calculator-layout">
    <AmountToAllocate :holding="holding" @update:holding="holding = $event" />
    <div v-if="error" id="api-error-div" role="alert">
      <div id="error-message-div">
        <span class="alert-icon" aria-hidden="true">!</span>
        <h4>We couldn't reach Coinbase</h4>
      </div>
      <p>
        The exchange rates couldn't be loaded right now. Your amount is safe —
        try fetching the latest rates again.
      </p>
      <button @click="loadRates" type="button">
        <span aria-hidden="true">↻</span>Retry
      </button>
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
      :holding="formattedHolding"
      :handleRefresh="loadRates"
    />
  </div>

  <h5 id="footer-disclaimer">
    Exchange rates are retrieved from the public Coinbase API; the timestamp
    reflects when this app last fetched them. For demonstration only — not
    financial advice.
  </h5>
</template>
