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
  <div class="btc-eth-card-wrapper eth-card-border-top">
    <div id="eth-card-ledgers">
      <div class="btc-eth-names">
        <span class="crypto-icon eth-icon" aria-hidden="true">Ξ</span>
        <div>
          <h4>{{ name }}</h4>
          <h4 class="abbreviations">{{ symbol }}</h4>
        </div>
      </div>
      <h4>30%</h4>
    </div>
    <h4>ALLOCATED</h4>
    <div v-if="ethAllocatedUSD" class="crypto-holding-value">
      <h4>{{ ethAllocatedUSD }}</h4>
      <h5>{{ ethQuantityOwned }} {{ symbol }}</h5>
    </div>
    <div v-else class="crypto-holding-value">
      <span class="empty-value">—</span>
      <div class="crypto-empty-quantity">
        <span class="empty-value" id="eth-crypto-empty-quantity">—</span>
        <span class="abbreviations">{{ symbol }}</span>
      </div>
    </div>
    <hr />
    <div class="current-rate-statement">
      <h5>Current Rate 1</h5>
      <h5 class="btc-eth-current-rate">
        {{ symbol }} = {{ formattedEthPriceInUSD }}
      </h5>
    </div>
  </div>
</template>
