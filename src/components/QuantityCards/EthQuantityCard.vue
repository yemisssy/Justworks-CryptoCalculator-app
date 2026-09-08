<script setup>
import { computed } from "vue";
const props = defineProps({
  name: String,
  symbol: String,
  ethAllocatedUSD: Number,
  ethQuantityOwned: Number,
  ethRate: Number,
});

const ethPriceInUSD = computed(() => {
  if (!props.ethRate) return null;

  return 1 / props.ethRate;
});
</script>

<template>
  <div class="btc-eth-card-wrapper">
    <div id="eth-card-ledgers">
      <icon id="eth-icon" />
      <div class="btc-eth-names">
        <h4>{{ name }}</h4>
        <h4 class="abbreviations">{{ symbol }}</h4>
      </div>
      <h4>30%</h4>
    </div>
    <h4>ALLOCATED</h4>
    <div v-if="ethAllocatedUSD" class="crypto-holding-value">
      <h4>${{ ethAllocatedUSD }} allocated mount here</h4>
      <h5>{{ ethQuantityOwned }} {{ symbol }} crypto amount & symbol here</h5>
    </div>
    <div v-else class="crypto-holding-value">
      <icon />
      <icon /> {{ symbol }} here should be -- icon & eth symbol since no
      allocated usd yet
    </div>
    <hr />
    <h5>Current Rate 1 {{ symbol }} = ${{ ethPriceInUSD }}</h5>
  </div>
</template>
