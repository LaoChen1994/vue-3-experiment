import { defineComponent, ref, onMounted } from "vue";
import TestSon from "./test-son";

export default defineComponent({
  setup() {
    const title = "Parent Node";
    const fatherVal = ref("father value");
    const model2 = ref("model 2");
    const model3 = ref("model3");
    const sonComponent = ref<any>(null);

    const onParentChange = () => {
      fatherVal.value = `parent -> ${Math.random().toString()}`;
      model2.value = `parent -> ${Math.random().toString()}`;
      model3.value = `parent -> ${Math.random().toString()}`;
    };

    const onParentCall = () => {
      sonComponent.value.plzParentCall();
    };

    const slots = {
      title: (title: string) => <h1>这是标题的slot,{title}</h1>,
      subTitle: (subTitle: string) => <h2>这是子标题的slot, {subTitle}</h2>,
    };

    return () => (
      <>
        <div>{title}</div>
        <TestSon
          parentAge={60}
          parentName="西瓜太郎"
          onScream={(msg: string) => alert(msg)}
          // v-model={fatherVal.value}
          v-models={[
            [fatherVal.value, "modelValue"],
            [model2.value, "model2"],
            [model3.value, "model3"],
          ]}
          ref={sonComponent}
          v-slots={slots}
        />

        <button onClick={onParentChange}>父组件改变值</button>
        <button onClick={onParentCall}>父组件调用</button>
      </>
    );
  },
});
