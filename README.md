# Vue 3 Composition API 使用指南

## 0. 为什么要写这个东西

**原因**：在哪吒项目中使用Vue + tsx 确实踩了不少坑，最近看了一些相关的使用总结，帮助大家了解Vue 3改了哪些东西，让大家Vue 3用得更加丝滑，这里将对比Vue 3 + setup script 与 Vue 3 + tsx之间写法得差异。

**本文主要参考**：

[Vue 官方文档](https://v3.cn.vuejs.org/api/)

[vue jsx plugin插件](https://www.npmjs.com/package/@vue/babel-plugin-jsx)

## 1. 视图层的写法

目前Vue 3推荐的写法有3种：

1. 依然导出一个vue的对象，中间通过setup返回变量的方式来返回响应式变量
2. 使用setup标签对应的变量不需要返回，直接可以在template中使用（**推荐的写法**）
3. 使用jsx的写法，这里需要通过defineComponent包一层（**vant已经全面拥抱**）
4. Class组件的方式（好像用的比较少，目前还没有调研过）


```vue
<template>
  <div class="home">
    <!--- vue在模板编译的时候会把ref.value自动解构 --->
    <div>{{ count }}</div>
    <button @click="addCount">+1</button>
  </div>
</template>

<script lang="ts" setup>
// 使用setup script的写法
// 这里就不用export default一个vue的实例对象了
// 这里创建的变量可以直接在vue源码中进行使用
import { ref } from "vue";

// 方法直接在setup中定义
// 变量直接在setup中定义
const count = ref(0);
const addCount = () => (count.value = count.value + 1);
</script>

<!--- <script lang="ts">
// 不使用 setup script标签
import { defineComponent, ref } from "vue";

export default defineComponent({
  setup() {
    const count = ref(0);
    // vue 2中需要定义在methods中
    const addCount = () => (count.value = count.value + 1);

    return {
      count,
      addCount,
    };
  },
});
</script> --->

```

```react
import { ref, defineComponent } from "vue";

export default defineComponent({
  setup() {
    const count = ref(0);
    // jsx的写法和非setup标签写法一样，因为都是defineComponent包一层
    const addCount = () => {
      count.value = count.value + 1;
    };

    return () => (
      <div>
        {/* react中需要自己通过count.value进行解构赋值 */}
        <span>{count.value}</span>
        <button onClick={addCount}>+1</button>
      </div>
    );
  },
});
```



## 2. 使用setup标签写法的一个骚东西

**效果**：可以通过v-bind来动态绑定css变量

**实现**：利用style和css var实现

```vue
<template>
  <div class="home">
    <div class="color">{{ count }}</div>
    <button @click="changeColor">改变颜色</button>
  </div>
</template>

<script lang="ts" setup>
import { ref } from "vue";
const color = ref("red");
const changeColor = () =>
  (color.value = color.value === "red" ? "green" : "red");
</script>

<style>
.color {
  color: v-bind(color);
}
</style>
```

如果是在jsx中,我们只能动态改变style了

```javascript
import { ref, defineComponent, computed } from "vue";

export default defineComponent({
  setup() {
    const count = ref(0);

    const color = ref("red");
    const changeColor = () =>
      (color.value = color.value === "red" ? "green" : "red");

    return () => (
      <div>
        <div style={{ color: color.value }}>{count.value}</div>
        <button onClick={changeColor}>改变颜色</button>
      </div>
    );
  },
});

```



## 3. computed和watch

### 3.1 computed

```react
import { ref, defineComponent, computed } from "vue";

export default defineComponent({
  setup() {
    const count = ref(0);
    const addCount = () => {
      count.value = count.value + 1;
    };

    // 直接使用computed这个钩子函数就可以
    const doubleCount = computed(() => {
      return count.value * 2;
    });

    return () => (
      <div>
        <div>{count.value}</div>
        <div>2倍是：{doubleCount.value}</div>
        <button onClick={addCount}>+1</button>
      </div>
    );
  },
});

```

```vue
<script lang="ts" setup>
import { ref, computed } from "vue";

const count = ref(0);
const color = ref("red");
const addCount = () => (count.value = count.value + 1);
const changeColor = () =>
  (color.value = color.value === "red" ? "green" : "red");

// 利用computed这个函数进行注册
const doubleCount = computed(() => {
  return count.value * 2;
});
</script>
```

### 3.2 watch和watchEffect

和computed一样都是直接调用watch和watchEffect这两个方法就可以

**Q1: watch和watchEffect之间的区别?**

A1: watch可以知道变化前后的值的区别,但是watchEffect是一个副作用是在**变化后**的回调

**Q2: watch和watchEffect实现上的不同?**

这里再effect中注册调度任务的时候,回去判断是否为watch的场景,如果是watch的话,会把新老的值赋给watch的回调,这里主要是通过判断第二个参数是不是回调,如果调用的是watchEffect,源码里面直接传的null

由于`jsx`和`setup`用法之间没有差异,只上一份代码

**用法如下:**

```jsx
import { ref, defineComponent, computed, watch, watchEffect } from "vue";

export default defineComponent({
  setup() {
    const count = ref(0);

    const color = ref("red");
    const changeColor = () =>
      (color.value = color.value === "red" ? "green" : "red");

    // 需要监听的proxy对象,以及需要调用的回调
    // 这里因为其实是要在对应的proxy中去做操作,所以只能指定color
    // 无法直接通过执行过程来绑定
    watch(color, (newVal, oldVal) => {
      console.log(`color is Change -> ${oldVal} -> ${newVal}`);
    });

    // 可以通过proxy的get方法来进行绑定
    // 因为不带参数(QAQ,我的理解hhhh)
    watchEffect(() => {
      console.log("current color ->", color.value);
    });

    return () => (
      <div>
        <div style={{ color: color.value }}>{count.value}</div>
        <button onClick={changeColor}>改变颜色</button>
      </div>
    );
  },
});

```

## 4. 组件的传值和组件的引用

### 4.1 组件的注册

在setup和jsx的写法中直接通过import的方式引入即可使用,不需要单独调用components来对组件进行注册

需要注意的点:如果是.vue文件中,组件必须是小写,不能用驼峰,然后通过`-`加小写字母来代替大写

在jsx的写法中可以通过驼峰组件的方式引入

### 4.2 父子数据的交互

具体操作**vue 2中一致**

父 -> 子：目前是`props`

子 -> 父：目前是`emit`的方式来触发

#### 4.2.1 JSX中的写法

注意点：

1. 父组件监听的方式从`v-on` -> JSX中的`onXXX`
2. 子组件中需要增加==props：onXXX==不然ts会报错（这里主要是他的ts和props绑定，当然也可以重置attrs的参数）
3. 

```jsx
import { defineComponent, toRefs } from "vue";

// 子组件
export default defineComponent({
  // 定义props的方法和vue 2中一样
  props: {
    parentName: {
      type: String,
    },
    parentAge: {
      type: Number,
    },
  },
  setup(props) {
    // 这里如果是proxy类型的对象必须通过toRefs来将每个变量变成ref
    // 官方说这里可能解构会导致响应式丢失
    const { parentAge, parentName } = toRefs(props);

    return () => (
      <div>
        <div>名字：{parentName.value}</div>
        <div>年纪：{parentAge.value}</div>
      </div>
    );
  },
});


// 父组件
import { defineComponent } from "vue";
import TestSon from "./test-son";

export default defineComponent({
  setup() {
    const title = "Parent Node";

    return () => (
      <>
        <div>{title}</div>
        <TestSon parentAge={60} parentName="西瓜太郎" />
      </>
    );
  },
});

```

#### 4.2.2 vue setup写法

注意点：

+ props在setup中需要通过defineProps来进行定义
+ emit可以通过defineEmits来定义
+ 父组件监听事件是相同的依然通过`v-on`



**可能会碰到参数解构的坑！**

因为目前vue 3中是通过Proxy对象去做深度的包装的，所以直接解构出来的proxy可能会出现奇怪的问题（**响应式丢失**），建议通过toRefs的方式将`reactive`转换为`multiple refs`，这样就保留了响应式

```vue
<!---子组件--->
<template>
  <div>
    <div>名字：{{ parentName }}</div>
    <div>年纪：{{ parentAge }}</div>
    <button @click="sendMsg">发送信息</button>
  </div>
</template>

<script lang="ts" setup>
import { defineProps, toRefs, defineEmits } from "vue";

// 通过defineProps来接收参数
const props = defineProps({
  parentName: {
    type: String,
  },
  parentAge: {
    type: Number,
  },
});

// 使用defineEmits的方式来引入emit
const emit = defineEmits();

// 使用toRefs对Proxy进行解构
const { parentAge, parentName } = toRefs(props);

const sendMsg = () => {
  emit("scream", parentName?.value);
};
</script>

<!---父组件--->
<template>
  <div>
    <div>{{ title }}</div>
    <test-son parentAge="60" parentName="西瓜太郎" @scream="handleScream" />
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import TestSon from "./TestSon.vue";

const title = ref("Parent Node");

const handleScream = (e) => {
  console.log(e);
};
</script>

```

### 4.3 双向绑定的操作

#### 4.3.1 表单组件v-model绑定

jsx和setup的写法中都是使用v-model来进行操作，这个没有啥不一样的

#### 4.3.2 自定义v-model组件

vue 2 和vue 3中 v-model是一个break changing

**vue 2**中的`v-model`是 `value`和`update`的语法糖。

**vue 3**中`v-model`是`modelValue`和`update:modelValue`的语法糖



#### 4.3.3 JSX写法

使用的方法：

1. ==父组件通过v-model==直接绑定对应的响应式变量
2. 子组件中直接通过`attrs`来获取对应绑定的`modelValue`
3. ==子组件变更==数据的时候`emit`触发`update:modelValue`事件即可

```react
// 父组件
import { defineComponent, ref } from "vue";
import TestSon from "./test-son";

export default defineComponent({
  setup() {
    const fatherVal = ref("father value");
    const onParentChange = () => {
      fatherVal.value = `parent -> ${Math.random().toString()}`;
    };

    return () => (
      <>
        <TestSon v-model={fatherVal.value}/>
        <button onClick={onParentChange}>父组件改变值</button>
      </>
    );
  },
});

```

```react
import { defineComponent, toRefs } from "vue";

export default defineComponent({
  props: {},
  setup(props, { emit, attrs }) {
    const onSonChange = () => {
      emit("update:modelValue", `son -> ${Math.random().toString()}`);
    };

    return () => (
      <div style={{ border: "1px solid #f44" }}>
        <div>双向绑定的值：{attrs.modelValue}</div>
        <button onClick={onSonChange}>子组件改变</button>
      </div>
    );
  },
});

```

#### 4.3.4 setup中的写法

注意点：

和jsx写法一样需要将vue 2中的`value`和`update`相应的替换为`modelValue`和`upodate:ModelValue`

```vue
<template>
  <div class="father">
    <test-son v-model="fatherVal"/>
    <button @click="changeFathVal">改变值</button>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import TestSon from "./TestSon.vue";

const fatherVal = ref("father Value");

const changeFathVal = () => {
  fatherVal.value = `father => ${Math.random().toString(16)}`;
};
</script>

<style>
.father {
  padding: 20px;
  border: 1px solid #f44;
}
</style>

```

```vue
<template>
  <div class="son">
    <div>双向绑定的参数：{{ modelValue }}</div>
    <button @click="changeSonVal">改变子组件值</button>
  </div>
</template>

<script lang="ts" setup>
import { defineProps, toRefs, defineEmits } from "vue";

const props = defineProps({
  modelValue: {
    type: String,
  },
});
const emit = defineEmits();
const changeSonVal = () => {
  emit("update:modelValue", `son -> ${Math.random().toString(16)}`);
};
</script>

<style>
.son {
  border: 1px solid #323233;
}
</style>

```



### 4.4 v-models用法

#### 4.4.1 JSX写法

作用：一个组件同时绑定多个双向绑定的元素

注意点：

1. **JSX的写法**中用到了`v-models`标签和`二维数组`的传参解构，我觉得有点反人类
2. 推荐使用attr的方式避免props中出现未定义参数的情况

```react
// 父组件
import { defineComponent, ref } from "vue";
import TestSon from "./test-son";

export default defineComponent({
  setup() {
    const fatherVal = ref("father value");
    const model2 = ref("model 2");
    const model3 = ref("model3");

    const onParentChange = () => {
      fatherVal.value = `parent -> ${Math.random().toString()}`;
      model2.value = `parent -> ${Math.random().toString()}`;
      model3.value = `parent -> ${Math.random().toString()}`;
    };

    return () => (
      <>
        <TestSon
          v-models={[
            [fatherVal.value, "modelValue"],
            [model2.value, "model2"],
            [model3.value, "model3"],
          ]}
        />

        <button onClick={onParentChange}>父组件改变值</button>
      </>
    );
  },
});

// 子组件
import { defineComponent, toRefs, nextTick } from "vue";

export default defineComponent({
  props: {},
  setup(props, { emit, attrs }) {
    const onSonChange = (event: string) => () => {
      emit(`update:${event}`, `son -> ${Math.random().toString()}`);
    };

    return () => (
      <div style={{ border: "1px solid #f44" }}>
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

```

#### 4.4.2 setup写法

注意点：

1. 使用`v-model:xxx`的写法来传入多个双向绑定的变量
2. 回调函数要注意如果是装饰器函数，可能需要立即执行

写法：

```vue
<template>
  <div class="father">
    <test-son
      v-model:modelValue="fatherVal"
      v-model:model2="model2"
      v-model:model3="model3"
    />
    <button @click="changeFathVal">改变值</button>
  </div>
</template>

<script setup lang="ts">
// 父组件
import { ref } from "vue";
import TestSon from "./TestSon.vue";

const fatherVal = ref("father Value");
const model2 = ref("model2");
const model3 = ref("model3");
    
const changeFathVal = () => {
  fatherVal.value = `father => ${Math.random().toString(16)}`;
  model2.value = `father => ${Math.random().toString(16)}`;
  model3.value = `father => ${Math.random().toString(16)}`;
};
</script>

<style>
.father {
  padding: 20px;
  border: 1px solid #f44;
}
</style>

```

```vue
<template>
  <div class="son">
    <div>双向绑定的modelValue：{{ modelValue }}</div>
    <div>双向绑定的model2：{{ model2 }}</div>
    <div>双向绑定的model3：{{ model3 }}</div>
    <button @click="onSonChange('modelValue')()">改变modelValue值</button>
    <button @click="onSonChange('model2')()">改变model2值</button>
    <button @click="onSonChange('model3')()">改变model3值</button>
  </div>
</template>

<script lang="ts" setup>
import { toRefs, defineEmits, useAttrs } from "vue";

const emit = defineEmits();
const attrs = useAttrs();
const { modelValue, model2, model3 } = toRefs(attrs);

const onSonChange = (event: string) => () => {
  emit(`update:${event}`, `son -> ${Math.random().toString()}`);
};

const onModelValueChange = onSonChange("modelValue");
</script>

<style>
.son {
  border: 1px solid #323233;
}
</style>

```

## 5 子组件ref和defineExpose

**作用**：用于暴露子组件的方法和数据

**不一样的点：**

**vue 2**中会将整个组件的数据和方法都暴露给父组件

**vue 3 script-setup**的写法中，目前需要通过defineExpose来暴露，不然拿到的是一个空的Proxy

**jsx**的写法中，依然会拿到对应的虚拟dom的vnode节点，放在`methods`中暴露的方法会直接挂在暴露出的ref的顶层，直接使用即可



### 5.1 JSX的写法

```react
// 父组件
import { defineComponent, ref } from "vue";
import TestSon from "./test-son";

export default defineComponent({
  setup() {
    const sonComponent = ref<any>(null);

    const onParentCall = () => {
      sonComponent.value.plzParentCall();
    };

    return () => (
      <>
        <TestSon ref={sonComponent}/>
        <button onClick={onParentCall}>父组件调用</button>
      </>
    );
  },
});

// 子组件
import { defineComponent, toRefs, defineExpose } from "vue";

export default defineComponent({
  methods: {
    plzParentCall() {
      console.log("这是父组件在调用我");
    },
  },
  setup(props) {

    return () => (
      <div style={{ border: "1px solid #f44" }}>Hello World</div>
    );
  },
});

```



### 5.2 vue setup标签的写法

```vue
<!---父组件--->
<template>
  <div class="father">
    <test-son ref="sonRef" />
    <button @click="onParentCall">父组件调用</button>
  </div>
</template>

<script setup lang="ts">
import { ref, watchEffect } from "vue";
import TestSon from "./TestSon.vue";
    
const sonRef = ref(null);
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

<!--- 子组件 --->
<template>
  <div class="son">
      Hello World
  </div>
</template>

<script lang="ts" setup>
import { defineExpose } from "vue";

const plzParentCall = () => {
  console.log("这是父组件在调用我");
};
    
defineExpose({ plzParentCall });
    
</script>

<style>
.son {
  border: 1px solid #323233;
}
</style>

```



## 6. slot的写法

注意点：

1. **slot**和**children**的区别，slot这个插槽在有多个地方需要插入的时候，其实是比children的概念更灵活的，如果是default的插槽和children其实是差不多的
2. **JSX**的写法中，需要将slots作为一个对象传入，返回的是一个render函数，参数为slot 的context
3. **setup script**的写法和vue 2 一样没有特别的



### 6.1 JSX写法

注意：

1. context直接作为==render函数的参数==传入
2. slot通过`setup`中的`context`中的`slots`中==对应的插槽的名字==的函数进行执行即可

```react
// 父组件
import { defineComponent, ref, onMounted } from "vue";
import TestSon from "./test-son";

export default defineComponent({
  setup() {
    const slots = {
      title: (title: string) => <h1>这是标题的slot,{title}</h1>,
      subTitle: (subTitle: string) => <h2>这是子标题的slot, {subTitle}</h2>,
    };

    return () => (
      <>
        <TestSon v-slots={slots}/>
      </>
    );
  },
});

// 子组件
import { defineComponent, toRefs, defineExpose } from "vue";

export default defineComponent({
  setup(props, { slots }) {

    return () => (
      <div style={{ border: "1px solid #f44" }}>
        <div>标题插槽：{slots?.title?.("子组件的参数1")}</div>
        <div>副标题插槽：{slots?.subTitle?.("子组件的参数2")}</div>
      </div>
    );
  },
});

```



### 6.2 setup script写法

**注意点：**

1. context通过`v-slot:xxx`来获取对应的从子组件中传过来的数据
2. 子组件利用slot标签的name来插入对应插槽的元素

```vue
<!--- 父组件 --->
<template>
  <div class="father">
    <test-son>
      <template v-slot:title="params">
        <h1>这是标题的slot, {{ params.text }}</h1>
      </template>

      <template v-slot:subTitle="params">
        <h2>这是子标题的slot, {{ params.text }}</h2>
      </template>
    </test-son> 
  </div>
</template>

<script setup lang="ts">
import TestSon from "./TestSon.vue";
</script>

<style>
.father {
  padding: 20px;
  border: 1px solid #f44;
}
</style>

```







