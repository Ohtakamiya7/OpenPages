<template>
  <form class="flex-box" @submit.prevent="submitEntry" novalidate>
    <div form-header>
      <button class="close-btn" @click="onCancel">✕</button>
      <h1 class="form-title">Journal Entry – {{ today }}</h1>
      <h3 class="form-prompt">Today's Prompt: {{ prompt }}</h3>
    </div>

    <!-- AUTHOR -->
    <div class="form-row">
      <h5>Author:</h5>
      <input v-model="author" type="text" placeholder="Author Name" required />
    </div>

    <!-- MAIN TEXT -->
    <div class="form-row">
      <label class="form-label">Entry:</label>
      <textarea
        v-model="entryText"
        rows="6"
        placeholder="Your Response…"
        required
      />
    </div>

    <!-- GRATEFUL -->
    <div class="form-row">
      <h5>Today I am grateful for:</h5>
      <textarea v-model="grateful" rows="2" placeholder="…" required />
    </div>

    <!-- WIN -->
    <div class="form-row">
      <h5>A small win today was:</h5>
      <textarea v-model="win" rows="2" placeholder="…" required />
    </div>

    <!-- MOOD -->
    <div class="radio-row">
      <h5>How are you feeling today?</h5>
      <label><input type="radio" value="😢 Sad" v-model="mood" />😢 Sad</label>
      <label><input type="radio" value="😐 Meh" v-model="mood" />😐 Meh</label>
      <label
        ><input type="radio" value="😊 Happy" v-model="mood" />😊 Happy</label
      >
      <label
        ><input type="radio" value="🤩 Ecstatic" v-model="mood" />🤩
        Ecstatic</label
      >
    </div>

    <p v-if="error" class="text-danger">{{ error }}</p>

    <div class="bottom-right">
      <button
        type="button"
        @click="onCancel"
        style="background-color: lightblue"
        class="btn btn-lg"
      >
        Cancel
      </button>
      <button type="submit" class="btn btn-primary submit-btn btn-lg">
        {{ props.initialEntry._id ? "Save Changes" : "Post Entry!" }}
      </button>
    </div>
  </form>
</template>

<script setup>
import { ref, watch, onMounted } from "vue";

const props = defineProps({
  initialEntry: {
    type: Object,
    default: () => ({
      _id: null,
      author: "",
      text: "",
      grateful: "",
      win: "",
      mood: "",
    }),
  },
  topicOrder: {
    type: Number,
    required: true,
  },
});
const emit = defineEmits(["submitted", "cancelled"]);

const author = ref(props.initialEntry.author);
const entryText = ref(props.initialEntry.text);
const grateful = ref(props.initialEntry.grateful);
const win = ref(props.initialEntry.win);
const mood = ref(props.initialEntry.mood);
const prompt = ref("");
const error = ref("");
const today = ref(new Date().toLocaleDateString());

watch(
  () => props.initialEntry,
  (e) => {
    author.value = e.author;
    entryText.value = e.text;
    grateful.value = e.grateful;
    win.value = e.win;
    mood.value = e.mood;
  },
  { immediate: true }
);

onMounted(async () => {
  try {
    const res = await fetch("/api/topics/today");
    const body = await res.json();
    prompt.value = body.prompt;
  } catch {
    prompt.value = "could not load prompt";
  }
});

function onCancel() {
  emit("cancelled");
}

function closeDrawer(){
  emit("drawerClose")
}

async function submitEntry() {
  // 1) Client‑side validation
  if (!author.value || !entryText.value || !grateful.value || !win.value || !mood.value) {
    error.value = "Please fill out all fields before submitting.";
    return;
  }

  try {
    const payload = { author: author.value, text: entryText.value, grateful: grateful.value, win: win.value, mood: mood.value };
    const method = props.initialEntry._id ? "PUT" : "POST";
    const url = `/api/entries/${props.topicOrder}`;

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(method === "PUT" ? { ...payload, id: props.initialEntry._id } : payload)
    });

    // 2) Server‑side error?
    if (!res.ok) {
      const body = await res.json();
      error.value = body.error || res.statusText;
      return;
    }

    // 3) Success path
    const saved = await res.json();
    emit("submitted", saved);

  } catch (networkErr) {
    // 4) Network or unexpected error
    error.value = "Network error—please try again.";
  }
}

</script>
