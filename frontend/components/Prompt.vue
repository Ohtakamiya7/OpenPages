<template>
  <div class="container-fluid p-0">
    <div class="header"><h1 class = "title">OpenPages</h1></div>

    <div class="d-flex justify-content-center">
      <div class="prompt w-75 border">Today's Prompt: {{ prompt }}</div>
    </div>

    <div class="justify-content-center d-flex post-button">
      <button style="background-color: #F2D7B9" @click="showDrawer = true">
        <i class="fas fa-plus"></i> Write Your Journal Entry!
      </button>
    </div>

    <h6 class="instruction">Click on a journal to view its entries.</h6>

    <transition name="slide">
      <!-- backdrop + drawer panel -->
      <div
        v-if="showDrawer"
        class="drawer-backdrop d-flex justify-content-center"
        @click.self="closeDrawer"
      >
        <div class="drawer">
          <EntryForm @submitted="handleSubmitted" @cancelled = "closeDrawer" />
        </div>
      </div>
    </transition>

    <div class="row gx-4 gy-2">
      <EntryList :entries="entriesArray" :topicOrder = "topicOrder" @refresh="load" @cancelled = "closeDrawer"/>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import EntryForm from "./EntryForm.vue";
import EntryList from "./EntryList.vue";

const prompt = ref("");
const showDrawer = ref(false);
const today = ref(new Date().toLocaleDateString());
const topicOrder = ref("");
const entriesArray = ref([]);

function handleSubmitted() {
  load();
  showDrawer.value = false;
}

function closeDrawer() {
  showDrawer.value = false;
}

async function load() {
  const res = await fetch("http://localhost:5000/api/topics/today");
  const data = await res.json();
  prompt.value = data.prompt;
  topicOrder.value = data.order;

  const res2 = await fetch(
    `http://localhost:5000/api/entries/${topicOrder.value}`
  );
  entriesArray.value = await res2.json();

}

onMounted(async () => {
  load();
});
</script>

<style scoped>
.drawer-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: flex-end;
  z-index: 1000;
}

.drawer {
  background: floralwhite;
  width: 65%;
  max-width: 100%;
  height: 100%;
  padding: 1rem;
  box-shadow: -4px 0 12px rgba(0, 0, 0, 0.2);
  position: fixed;
  background-image: repeating-linear-gradient(
    to bottom,
    transparent,
    transparent 2em,
    #c8c8c8 2em,
    #c8c8c8 2.1em
  );

  background-position: 0 6rem;
  background-repeat: no-repeat;

  padding-left: 7rem; 
}

.drawer::before {
  content: "";
  position: absolute;
  top: 0;
  bottom: 0;
  left: 6rem;            
  width: 2px;            
  background-color: #e74c3c;
  pointer-events: none;
}

.slide-enter-from,
.slide-leave-to {
  transform: translateX(100%);
}
.slide-enter-to,
.slide-leave-from {
  transform: translateX(0%);
}
.slide-enter-active,
.slide-leave-active {
  transition: transform 0.3s ease;
}
</style>
