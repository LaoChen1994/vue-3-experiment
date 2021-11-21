<template>
  <div class="home">
    <div class="tsx-component">
      <h1>TSX 写法</h1>
      <test-data />
    </div>
    <div class="setup-component">
      <h1>Setup 写法</h1>
      <setup-component />
    </div>
  </div>
</template>

<script lang="ts" setup>
import TestData from "../components/TsxComponent/test-data";
import SetupComponent from "../components/SetUpComponent/TestParent.vue";
</script>

<style>
.tsx-component {
  border: 3px dashed blue;
  padding: 10px;
  margin-bottom: 32px;
}

.setup-component {
  border: 3px dashed orangered;
  padding: 10px;
}
</style>
