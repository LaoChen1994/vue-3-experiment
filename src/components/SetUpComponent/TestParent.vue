<template>
  <div class="father">
    <div>{{ title }}</div>
    <test-son
      parentAge="60"
      parentName="西瓜太郎"
      @scream="handleScream"
      v-model:modelValue="fatherVal"
      v-model:model2="model2"
      v-model:model3="model3"
      ref="sonRef"
    >
      <template v-slot:title="params">
        <h1>这是标题的slot, {{ params.text }}</h1>
      </template>

      <template v-slot:subTitle="params">
        <h2>这是子标题的slot, {{ params.text }}</h2>
      </template>
    </test-son>
    <button @click="changeFathVal">改变值</button>
    <button @click="onParentCall">父组件调用</button>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import TestSon from "./TestSon.vue";

const title = ref("Parent Node");
const fatherVal = ref("father Value");
const model2 = ref("model2");
const model3 = ref("model3");

const sonRef = ref<any>(null);

const handleScream = (e) => {
  console.log(e);
};

const changeFathVal = () => {
  fatherVal.value = `father => ${Math.random().toString(16)}`;
  model2.value = `father => ${Math.random().toString(16)}`;
  model3.value = `father => ${Math.random().toString(16)}`;
};

const onParentCall = () => {
  sonRef.value.plzParentCall();
};
</script>

<style>
.father {
  padding: 20px;
  border: 1px solid #f44;
}
</style>
