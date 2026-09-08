<script setup>
const props = defineProps({
  holding: Number,
});

const emit = defineEmits(["update: holding"]);

const handleHoldingChange = (e) => {
  emit("update: holding", Number(e.target.value));
};
</script>
<template>
  <div class="allocate-amount-wrapper">
    <h4 id="amount-label">Amount To Allocate</h4>
    <input :value="holding" @input="handleHoldingChange" />
    <hr />
    <h4 id="split-bar-label">FIXED ALLOCATION</h4>
    <div id="split-bar-content-wrapper">
      <div id="split-bar">
        <div class="split-bar" id="btc-bar"></div>
        <div class="split-bar" id="eth-bar"></div>
      </div>
      <div id="split-bar-ratio">
        <div class="bar-ratio" id="btc-usdallocated-percent">
          <div></div>
          <h4>70% Bitcoin</h4>
        </div>
        <div class="bar-ratio" id="eth-usdallocated-percent">
          <div></div>
          <h4>30% Ethereum</h4>
        </div>
      </div>
    </div>
  </div>
</template>
