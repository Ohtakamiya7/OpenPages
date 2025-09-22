<template>
  <div class="container-fluid p-0">
    <div class="header"><h1 class="title">OpenPages</h1></div>

    <!-- Pager + Prompt -->
    <div class="d-flex justify-content-center align-items-center my-3">
      <button class="btn btn-link arrow-btn me-2" @click="goBack" :disabled="currentOrder <= 1">←</button>

      <div class="prompt border text-center p-3">
        <h4>{{ headerDateLabel }} Prompt </h4>
        <h3>{{ prompt }}</h3>
      </div>

      <button class="btn btn-link arrow-btn ms-2" @click="goForward" :disabled="currentOrder >= maxOrder">→</button>
    </div>

    <div v-if="currentOrder === maxOrder" class="text-center mb-3">
      <button class="post-button" @click="showDrawer = true" style="background-color: rgb(242, 215, 185)">
        + Write Your Journal Entry!
      </button>
    </div>

    <h6 class="instruction text-center">Click on a journal to view its entries.</h6>

    <div class="row gx-4 gy-2">
      <EntryList :entries="entriesArray" :topicOrder="currentOrder" @refresh="() => loadTopic(currentOrder)" />
    </div>

    <transition name="slide">
      <div v-if="showDrawer" class="drawer-backdrop justify-content-center" @click.self="closeDrawer">
        <div class="drawer">
          <EntryForm :topicOrder="currentOrder" @submitted="handleSubmitted" @cancelled="closeDrawer" />
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from "vue";
import EntryForm from "./EntryForm.vue";
import EntryList from "./EntryList.vue";

const prompt = ref("");
const entriesArray = ref([]);
const maxOrder = ref(0);        // “today”’s topic order (1-based from API)
const currentOrder = ref(0);    // what page we’re viewing
const showDrawer = ref(false);

// NEW: keep two separate labels
const todayDateLabel = ref("…");
const topicDateLabel = ref("…");

// What the header shows
const headerDateLabel = computed(() =>
  currentOrder.value === maxOrder.value ? todayDateLabel.value : topicDateLabel.value
);

// Fetch prompt + entries by numeric order (NEVER touch todayDateLabel here)
async function loadTopic(order) {
  try {
    const tRes = await fetch(`/api/topics/${order}`);
    if (!tRes.ok) throw new Error(`topics/${order} → ${tRes.status}`);
    const { prompt: p, date: d } = await tRes.json();
    prompt.value = p;

    // this is the stored topic date (for non-today pages)
    topicDateLabel.value = formatNYDateLabel(d);

    const eRes = await fetch(`/api/entries/${order}`);
    if (!eRes.ok) throw new Error(`entries/${order} → ${eRes.status}`);
    entriesArray.value = await eRes.json();
  } catch (err) {
    console.error("loadTopic failed:", err);
    prompt.value = "[no prompt]";
    entriesArray.value = [];
  }
}

// ← one day, never below 1
function goBack() {
  if (currentOrder.value > 1) {
    currentOrder.value--;
    loadTopic(currentOrder.value);
  }
}

// → one day, never past “today”
function goForward() {
  if (currentOrder.value < maxOrder.value) {
    currentOrder.value++;
    loadTopic(currentOrder.value);
  }
}

function formatNYDateLabel(dateStr /* 'YYYY-MM-DD' */) {
  const [y, m, d] = dateStr.split("-").map(Number);
  const localMidnight = new Date(y, m - 1, d);
  return localMidnight.toLocaleDateString("en-US", {
    timeZone: "America/New_York",
    month: "short",
    day: "numeric",
  });
}

// On mount: get today’s topic order, then load it
onMounted(async () => {
  const today = await fetch("/api/topics/today").then((r) => r.json());
  maxOrder.value = today.order;         // 1-based from your updated API
  currentOrder.value = today.order;

  // Set the header’s “today” date ONCE and never let loadTopic overwrite it
  todayDateLabel.value = formatNYDateLabel(today.date);

  // Load prompt & entries; this will set topicDateLabel, but header uses todayDateLabel
  await loadTopic(today.order);
});

// After creating/editing an entry, reload this page
function handleSubmitted() {
  showDrawer.value = false;
  loadTopic(currentOrder.value);
}

// Close the entry‐form drawer
function closeDrawer() {
  showDrawer.value = false;
}
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
.slide-enter-from, .slide-leave-to { transform: translateX(100%); }
.slide-enter-to, .slide-leave-from { transform: translateX(0%); }
.slide-enter-active, .slide-leave-active { transition: transform 0.3s ease; }
</style>
