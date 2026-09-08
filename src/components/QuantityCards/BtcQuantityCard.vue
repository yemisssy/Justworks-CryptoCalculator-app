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
        <div>
          <h4>{{ name }}</h4>
          <h4 class="abbreviations">{{ symbol }}</h4>
        </div>
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
      <div class="crypto-empty-quantity">
        <span class="empty-value">—</span>
        <span>{{ symbol }}</span>
      </div>
    </div>
    <hr />
    <h5>Current Rate 1 {{ symbol }} ={{ formattedBtcPriceInUSD }}</h5>
  </div>
</template>
