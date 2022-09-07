<template>
  <div class="module">
    <input
      class="input"
      ref="input"
      type="file"
      value=""
      name="image[]"
      accept=".png, .jpg, .jpeg"
      multiple
      @change="handleSolve"
    />
    <ul class="list">
      <li class="list__item" v-for="(item, index) in renderList" :key="index">
        <div class="list__item--left">
          <img :src="item.url" alt="" />
          <ul class="resolved" :style="{ backgroundColor: item.legend.bgColor }">
            <li
              class="resolved__item"
              :style="{ backgroundColor: v.color }"
              v-for="(v, i) in item.legend.legend"
              :key="i"
            >
              {{ v.label }}
            </li>
          </ul>
        </div>
        <p @click="() => handleClick(item.text)">{{ item.text }}</p>
      </li>
    </ul>
  </div>
</template>
<script setup lang="ts">
import { onMounted, ref, watch } from "vue";
import pickUpLegend, { LegendType } from "./pickUpLegend";

interface RenderListItemType {
  url: string;
  legend: LegendType;
  text: string;
}

const input = ref<HTMLInputElement>();
const renderList = ref<Array<RenderListItemType>>([]);
const handleSolve = () => {
  renderList.value = [];
  if (!input.value?.files) return;
  Array.prototype.forEach.call(input.value.files, v => {
    const url = URL.createObjectURL(v);
    pickUpLegend(url)
      .then(legend => {
        renderList.value.push({
          url,
          legend,
          text: JSON.stringify(legend),
        });
      })
      .catch(err => {
        alert(err);
      });
  });
};
const handleClick = (text: string) => {
  navigator.clipboard.writeText(text);
  // ElMessage.success("复制成功");
};
onMounted(() => {
  document.addEventListener("keydown", async e => {
    e.preventDefault();
    if (e.key.toLocaleLowerCase() === "v") {
      console.log(e.key);
      const text = await navigator.clipboard.read();
      console.log(text);
    }
  });
});
</script>
<style lang="less" scoped>
.module {
  height: 100%;
  font-size: 20px;
  text-align: center;
  font-size: 14px;
}
.input {
  position: sticky;
  top: 20px;
  left: 50%;
  transform: translateX(-50%);
  padding: 50px 0;
}
.list {
  margin: 0 10%;
  &__item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    border: 5px solid #37d828;
    border-radius: 10px;
  }
}
.resolved {
  display: flex;
  padding: 12px;
  border-radius: 3px;
  &__item {
    width: 100%;
    height: 20px;
  }
}
</style>
