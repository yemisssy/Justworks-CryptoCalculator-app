<script setup>
import { computed } from "vue";
const props = defineProps({
  name: String,
  symbol: String,
  btcAllocatedUSD: String,
  btcQuantityOwned: String,
  btcRate: Number,
});

const btcPriceInUSD = computed(() => {
  if (!props.btcRate) return null;

  return 1 / props.btcRate;
});

const formattedBtcPriceInUSD = computed(() => {
  if (btcPriceInUSD.value === null) return null;

  return btcPriceInUSD.value.toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
  });
});
</script>

<template>
  <div class="btc-eth-card-wrapper">
    <div id="btc-card-ledgers">
      <div class="btc-eth-names">
        <span class="crypto-icon btc-icon" aria-hidden="true">₿</span>
        <h4>Bitcoin</h4>
        <h4 class="abbreviations">{{ symbol }}</h4>
      </div>
      <h4>70%</h4>
    </div>
    <h4>ALLOCATED</h4>
    <div v-if="btcAllocatedUSD" class="crypto-holding-value">
      <h4>{{ btcAllocatedUSD }}</h4>
      <h5>{{ btcQuantityOwned }} {{ symbol }}</h5>
    </div>
    <div v-else class="crypto-holding-value">
      <span class="empty-value">—</span>
      <span class="empty-value">—</span> {{ symbol }}
    </div>
    <hr />
    <h5>Current Rate 1 {{ symbol }} ={{ formattedBtcPriceInUSD }}</h5>
  </div>
</template>
