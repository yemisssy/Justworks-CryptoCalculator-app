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
const loading = ref(false);
const error = ref(null); //Question: Why is this better to default to null, is it because I am storing the actual error value not the boolean whether or not there is an error
const lastRefreshed = ref(null); // This should be timestamp, date time format

//UseEffect Equivalent

onMounted(async () => {
  //call fetch function & update rates values
  const fetchedRates = await fetchCryptoRate();
  rates.value = {
    btcRate: Number(fetchedRates.BTC),
    ethRate: Number(fetchedRates.ETH),
  };
});

const btcAllocatedUSD = computed(() => {
  if (!holding.value || !rates.value.btcRate) return null; //Question: why return null & not just return?

  return holding.value * 0.7;
});

const ethAllocatedUSD = computed(() => {
  if (!holding.value || !rates.value.ethRate) return null;

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
</script>

<template>
  <header>
    <h3>Justworks. | Crypto Allocation</h3>
    <div id="live-coinbase-rate">
      <icon />
      <h5>Live Coinbase rates</h5>
    </div>
  </header>
  <AmountToAllocate :holding="holding" @update:holding="holding = $event" />
  <CryptoQuantity
    :btcAllocatedUSD="btcAllocatedUSD"
    :btcQuantityOwned="btcQuanityOwned"
    :ethAllocatedUSD="ethAllocatedUSD"
    :ethQuantityOwned="ethQuanityOwned"
    :btcRate="rates.btcRate"
    :ethRate="rates.ethRate"
    :lastRefreshed="lastRefreshed"
    :holding="holding"
  />
  <h5>
    Exchange rates are retrieved from the public Coinbase API; the timestamp
    reflects when this app last fetched them. For demonstration only — not
    financial advice.
  </h5>
</template>
