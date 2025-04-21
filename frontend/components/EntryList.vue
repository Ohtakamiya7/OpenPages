<template>
  <div class="row">
    <transition name="slide">
      <div
        v-if="showView"
        class="drawer-backdrop d-flex justify-content-center"
        @click.self="closeView"
      >
        <div class="drawer">
          <EntryView
            v-if="!isEditing"
            :entry="selectedEntry"
            @cancelled="closeView"
            @delete="deleteEntry"
            @refresh="closeView"
            @updated="refresh"
            @editing="editEntry"
          />

          <EntryForm
            v-else
            :key="selectedEntry._id" 
            :initialEntry="selectedEntry"
            @submitted="saveEdit"
            @cancel="isEditing = false"
          />
        </div>
      </div>
    </transition>

    <div v-for="entry in entries" :key="entry._id" class="col-md-3 mb-4">
      <div class="card journal-cover" @click="openView(entry)">
        <h3 class="journal-title">{{ entry.author }}'s Journal</h3>
      </div>
    </div>
  </div>
</template>

<script setup>
import EntryView from "./EntryView.vue";
import EntryForm from './EntryForm.vue'


import { defineProps, defineEmits, ref } from "vue";

const showView = ref(false);
const selectedEntry = ref("");
const emit = defineEmits(["refresh"]);
const isEditing = ref(false);

const props = defineProps({
  entries: {
    type: Array,
    default: () => [],
  },
  topicOrder: {
    type: [Number, String],
    required: true,
  },
});

function editEntry() {
  const ok = window.confirm(
    "Please only edit entries you created yourself.\n\n" +
    "Are you sure you want to proceed?"
  )
  if (!ok) return
  isEditing.value = true
}

async function saveEdit(editedPayload) {

  const res = await fetch(
    `/api/entries/${props.topicOrder}`,
    {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        id:       editedPayload._id,
        author:   editedPayload.author,
        text:     editedPayload.text,
        grateful: editedPayload.grateful,
        win:      editedPayload.win,
        mood:     editedPayload.mood
      })
    }
  )
  if (!res.ok) {
    console.error('Update failed', await res.text())
    return
  }

  const updatedEntry = await res.json()
  selectedEntry.value = updatedEntry
  isEditing.value = false
  emit('refresh')
}


function closeView() {
  showView.value = false;
}

function openView(entry) {
  selectedEntry.value = entry;
  isEditing.value = false; 
  showView.value = true;
}

async function deleteEntry(id) {
  if (!confirm("Delete this entry? Please only delete your entries! ")) return;

  const res = await fetch(
    `/api/entries/${props.topicOrder}`,
    {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    }
  );

  const body = await res.json().catch(() => "no JSON");

  if (res.ok) {
    emit("refresh");
  }
}

function refresh() {
  emit("refresh");
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
