<template>
  <div>
    <button class="close-btn" @click="onCancel">✕</button>

    <h1>{{ entry.author }}'s Journal Entry: {{ date }}</h1>
    <h3 class="view-prompt">Prompt: {{ prompt }}</h3>

    <div class="view">
      <h5><strong>Response: </strong>&nbsp;{{ entry.text }}</h5>
    </div>

    <div class="view">
      <h5><strong>Today I am grateful for ... </strong>{{ entry.grateful }}</h5>
    </div>

    <div class="view">
      <h5><strong>Today a small win was ... </strong> {{ entry.win }}</h5>
    </div>

    <div>
      <!-- happy mood -->
      <div class="view mood" v-if="entry.mood === '😢 Sad'">
        <h5>
          <strong>{{ entry.author }}'s mood: </strong> {{ entry.author }} is
          feeling a bit down today, hopefully writing in their journal helped.
          Let’s send them some kind words and remind them they’re not alone.
        </h5>
      </div>

      <!-- meh mood -->
      <div class="view mood" v-else-if="entry.mood === '😐 Meh'">
        <h5>
          <strong>{{ entry.author }}'s mood: </strong> {{ entry.author }} is
          having an okay day today. A little surprise message might brighten
          their afternoon!
        </h5>
      </div>

      <!-- happy mood -->
      <div class="view mood" v-else-if="entry.mood === '😊 Happy'">
        <h5>
          <strong>{{ entry.author }}'s mood: </strong> {{ entry.author }} is
          having a good day today, lets celebrate what’s making them smile!
        </h5>
      </div>

      <!-- Ecstatic mood -->
      <div class="view mood" v-else>
        <h5>
          <strong>{{ entry.author }}'s mood: </strong> {{ entry.author }} is
          having an amazing day today. If in need, reach out and have them share
          their energy!
        </h5>
      </div>

      <div class="bottom-right">
        <button class="delete btn btn-lg" @click="onDelete">Delete</button>
        <button class="edit btn btn-lg" @click="startEditing">Edit</button>
        <button class="close btn btn-lg" @click="onCancel">Close</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, defineEmits } from "vue";

const prompt = ref("");
const date = ref(new Date().toLocaleDateString());
const emit = defineEmits([
  "cancelled",
  "delete",
  "refresh",
  "updated",
  "editing",
]);
const isEditing = ref(false);

const props = defineProps({
  entry: {
    type: Object,
    required: true,
  },
});

function onCancel() {
  emit("cancelled");
}

function onDelete() {
  emit("delete", props.entry._id);
  emit("refresh");
}

function startEditing() {
  emit("editing");
}

onMounted(async () => {
  try {
    const res = await fetch("http://localhost:5000/api/topics");
    const topics = await res.json();
    // find the one with the matching orderNumber
    const topic = topics.find((t) => t.order === props.entry.topicOrder);
    if (topic) {
      prompt.value = topic.prompt;
    } else {
      prompt.value = "No prompt found for this entry.";
    }
  } catch (err) {
    console.error(err);
    prompt.value = "Error loading prompt.";
  }
});
</script>
