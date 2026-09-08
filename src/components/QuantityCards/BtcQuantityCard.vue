<script setup>
const props = defineProps({
  name: String,
  symbol: String,
  btcAllocatedUSD: Number,
  btcQuantityOwned: Number,
  btcRate: Number,
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
  </div>
</template>
