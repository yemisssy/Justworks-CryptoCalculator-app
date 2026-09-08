<script setup>
import { ref } from "vue";
const props = defineProps({
  holding: Number,
});

const invalidHolding = ref(false);

const emit = defineEmits(["update:holding"]);

const handleHoldingChange = (e) => {
  const value = e.target.value;

  if (value === "") {
    invalidHolding.value = false;
    emit("update:holding", null);
    return;
  }

  if (Number(value) <= 0 || isNaN(Number(value))) {
    invalidHolding.value = true;
    emit("update:holding", null);
  } else {
    invalidHolding.value = false;
    emit("update:holding", Number(value));
  }
};
</script>
<template>
  <div class="allocate-amount-wrapper">
    <label id="amount-label">Amount To Allocate</label>
    <input
      required
      id="holding-input"
      type="number"
      placeholder="10,000"
      :value="holding"
      @input="handleHoldingChange"
    />
    <div v-if="invalidHolding" id="invalidholding-error">
      <icon />
      <h5>Enter a valid amount greater than $0.</h5>
    </div>
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
