<template>
  <div class="son">
    <div>名字：{{ parentName }}</div>
    <div>年纪：{{ parentAge }}</div>
    <button @click="sendMsg">发送信息</button>
    <div>
      <div>标题插槽</div>
      <slot name="title" text="子组件的参数1"></slot>
    </div>
    <div>
      <div>副标题插槽</div>
      <slot name="subTitle" text="子组件的参数2"></slot>
    </div>
    <div>双向绑定的modelValue：{{ modelValue }}</div>
    <div>双向绑定的model2：{{ model2 }}</div>
    <div>双向绑定的model3：{{ model3 }}</div>
    <button @click="onSonChange('modelValue')()">改变modelValue值</button>
    <button @click="onSonChange('model2')()">改变model2值</button>
    <button @click="onSonChange('model3')()">改变model3值</button>
  </div>
</template>

<script lang="ts" setup>
import { defineProps, toRefs, defineEmits, useAttrs, defineExpose } from "vue";

const props = defineProps({
  parentName: {
    type: String,
  },
  parentAge: {
    type: Number,
  },
});

const emit = defineEmits();
const attrs = useAttrs();
const { modelValue, model2, model3 } = toRefs(attrs);

const { parentAge, parentName } = toRefs(props);

const sendMsg = () => {
  emit("scream", parentName?.value);
};

const onSonChange = (event: string) => () => {
  emit(`update:${event}`, `son -> ${Math.random().toString()}`);
};

const plzParentCall = () => {
  console.log("这是父组件在调用我");
};

defineExpose({ plzParentCall });

const onModelValueChange = onSonChange("modelValue");
</script>

<style>
.son {
  border: 1px solid #323233;
}
</style>
