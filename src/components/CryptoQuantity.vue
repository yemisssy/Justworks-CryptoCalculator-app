<script setup>
import { ref } from "vue";
import BtcQuantityCard from "./QuantityCards/BtcQuantityCard.vue";
import EthQuantityCard from "./QuantityCards/EthQuantityCard.vue";

const props = defineProps({
  btcAllocatedUSD: String,
  btcQuantityOwned: String,
  ethAllocatedUSD: String,
  ethQuantityOwned: String,
  btcRate: Number,
  ethRate: Number,
  holding: Number,
  lastRefreshed: Date,
  handleRefresh: Function,
});
const emit = defineEmits(["refresh"]);

const currentDate = ref(new Date());
</script>

<template>
  <div id="crypto-amount-wrapper">
    <BtcQuantityCard
      name="Bitcoin"
      symbol="BTC"
      :percentage="70"
      :btcAllocatedUSD="btcAllocatedUSD"
      :btcQuantityOwned="btcQuantityOwned"
      :btcRate="btcRate"
    />
    <EthQuantityCard
      name="Ethereum"
      symbol="ETH"
      :percentage="30"
      :ethAllocatedUSD="ethAllocatedUSD"
      :ethQuantityOwned="ethQuantityOwned"
      :ethRate="ethRate"
    />
    <div id="total-allocated">
      <h5>Total Allocated</h5>
      <div v-if="holding" class="total-allocated-value">
        <h4>${{ holding }}.00</h4>
      </div>
      <div v-else class="total-allocated-value">
        <icon />
      </div>
    </div>
    <div v-if="lastRefreshed" id="last-refreshed-wrapper">
      <h5>Rate Last Refreshed {{ lastRefreshed.toLocaleString() }}</h5>
      <button @click="handleRefresh"><icon /> Refresh Rates</button>
    </div>
  </div>
</template>
