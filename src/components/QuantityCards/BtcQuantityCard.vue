<script setup>
import { computed } from "vue";
const props = defineProps({
  name: String,
  symbol: String,
  btcAllocatedUSD: Number,
  btcQuantityOwned: Number,
  btcRate: Number,
});

const btcPriceInUSD = computed(() => {
  if (!props.btcRate) return null;

  return 1 / props.btcRate;
});
</script>

<template>
  <div class="btc-eth-card-wrapper">
    <div id="btc-card-ledgers">
      <div class="btc-eth-names">
        <icon id="btc-icon" />
        <h4>Bitcoin</h4>
        <h4 class="abbreviations">{{ symbol }}</h4>
      </div>
      <h4>70%</h4>
    </div>
    <h4>ALLOCATED</h4>
    <div v-if="btcAllocatedUSD" class="crypto-holding-value">
      <h4>${{ btcAllocatedUSD }} allocated mount here</h4>
      <h5>{{ btcQuantityOwned }} {{ symbol }} crypto amount & symbol here</h5>
    </div>
    <div v-else class="crypto-holding-value">
      <icon />
      <icon /> {{ symbol }} here should be icon & btc symbol since no allocated
      usd yet
    </div>
    <hr />
    <h5>Current Rate 1 {{ symbol }}=${{ btcPriceInUSD }}</h5>
  </div>
</template>
