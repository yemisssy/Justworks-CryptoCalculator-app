<script setup>
import { computed } from "vue";
import BtcQuantityCard from "./QuantityCards/BtcQuantityCard.vue";
import EthQuantityCard from "./QuantityCards/EthQuantityCard.vue";

const props = defineProps({
  btcAllocatedUSD: String,
  btcQuantityOwned: String,
  ethAllocatedUSD: String,
  ethQuantityOwned: String,
  btcRate: Number,
  ethRate: Number,
  holding: String,
  lastRefreshed: Date,
  handleRefresh: Function,
});
const emit = defineEmits(["refresh"]);
</script>

<template>
  <div id="crypto-amount-wrapper">
    <div id="crypto-amount-result-wrapper">
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
    </div>

    <div id="total-allocated">
      <h5>Total Allocated</h5>
      <div v-if="holding">
        <h4>{{ holding }}</h4>
      </div>
      <div v-else class="total-allocated-value">
        <span class="empty-value">—</span>
      </div>
    </div>
    <div v-if="lastRefreshed" id="last-refreshed-wrapper">
      <h5>
        <span class="status-dot" aria-hidden="true"></span>
        Rate Last Refreshed {{ lastRefreshed.toLocaleString() }}
      </h5>
      <button @click="handleRefresh">
        <span aria-hidden="true">↻</span> Refresh Rates
      </button>
    </div>
  </div>
</template>
