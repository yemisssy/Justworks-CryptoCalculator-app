<script setup>
import { ref } from "vue";
import BtcQuantityCard from "./QuantityCards/BtcQuantityCard.vue";
import EthQuantityCard from "./QuantityCards/EthQuantityCard.vue";

const props = defineProps({
  btcAllocatedUSD: Number,
  btcQuantityOwned: Number,
  ethAllocatedUSD: Number,
  ethQuantityOwned: Number,
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
        <h4>${{ holding }}</h4>
      </div>
      <div v-else class="total-allocated-value">
        <icon />
      </div>
    </div>
    <div id="last-refreshed-wrapper">
      <div v-if="lastRefreshed">
        <h5>Rate Last Refreshed {{ lastRefreshed }}</h5>
      </div>
      <div v-else>
        <h5>Rate Last Refreshed {{ currentDate.toLocaleString() }}</h5>
      </div>
      <button @click="handleRefresh"><icon /> Refresh Rates</button>
    </div>
  </div>
</template>
