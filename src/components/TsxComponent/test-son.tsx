import { defineComponent, toRefs, defineExpose } from "vue";

export default defineComponent({
  props: {
    parentName: {
      type: String,
    },
    parentAge: {
      type: Number,
    },
    onScream: {
      type: Function,
    },
  },
  methods: {
    plzParentCall() {
      console.log("这是父组件在调用我");
    },
  },
  setup(props, { emit, attrs, slots }) {
    const { parentAge, parentName } = toRefs(props);

    const handleClick = () => {
      emit("scream", "father");
    };

    const onSonChange = (event: string) => () => {
      emit(`update:${event}`, `son -> ${Math.random().toString()}`);
    };

    return () => (
      <div style={{ border: "1px solid #f44" }}>
        <div>名字：{parentName.value}</div>
        <div>年纪：{parentAge.value}</div>
        <div>标题插槽：{slots?.title?.("子组件的参数1")}</div>
        <div>副标题插槽：{slots?.subTitle?.("子组件的参数2")}</div>
        <button onClick={handleClick}>发送信息</button>
        <div>双向绑定的值modelValue：{attrs.modelValue}</div>
        <div>双向绑定的值model2：{attrs.model2}</div>
        <div>双向绑定的值model3：{attrs.model3}</div>
        <button onClick={onSonChange("modelValue")}>
          子组件modelValue改变
        </button>
        <button onClick={onSonChange("model2")}>子组件model2改变</button>
        <button onClick={onSonChange("model3")}>子组件model3改变</button>
      </div>
    );
  },
});
