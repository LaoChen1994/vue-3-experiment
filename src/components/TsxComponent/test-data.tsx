import { ref, defineComponent, computed, watch, watchEffect } from "vue";
import TestChild from "./test-parent";

export default defineComponent({
  setup() {
    const count = ref(0);

    const color = ref("red");
    const changeColor = () =>
      (color.value = color.value === "red" ? "green" : "red");

    const addCount = () => {
      count.value = count.value + 1;
    };

    const doubleCount = computed(() => {
      return count.value * 2;
    });

    watch(color, (newVal, oldVal) => {
      console.log(`color is Change -> ${oldVal} -> ${newVal}`);
    });

    watchEffect(() => {
      console.log("current color ->", color.value);
    });

    return () => (
      <div>
        <div style={{ color: color.value }}>{count.value}</div>
        <div>2倍是：{doubleCount.value}</div>
        <button onClick={addCount}>+1</button>
        <button onClick={changeColor}>改变颜色</button>

        <div style={{ margin: "32px" }}>
          ----------------------------------split----------------------------------
        </div>
        <TestChild />
      </div>
    );
  },
});
