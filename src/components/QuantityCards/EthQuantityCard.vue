<script setup>
import { computed } from "vue";
const props = defineProps({
  name: String,
  symbol: String,
  ethAllocatedUSD: String,
  ethQuantityOwned: String,
  ethRate: Number,
});

const ethPriceInUSD = computed(() => {
  if (!props.ethRate) return null;

  return 1 / props.ethRate;
});

const formattedEthPriceInUSD = computed(() => {
  if (ethPriceInUSD.value === null) return null;

  return ethPriceInUSD.value.toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
  });
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
      <h4>{{ ethAllocatedUSD }}</h4>
      <h5>{{ ethQuantityOwned }} {{ symbol }}</h5>
    </div>
    <div v-else class="crypto-holding-value">
      <icon />
      <icon /> {{ symbol }}
    </div>
    <hr />
    <h5>Current Rate 1 {{ symbol }} = {{ formattedEthPriceInUSD }}</h5>
  </div>
</template>
