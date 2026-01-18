<script setup lang="ts">
import { ref } from 'vue'
import { ChatContainer, type ChatMessage } from '@/components/chat'

const messages = ref<ChatMessage[]>([])

function handleNewMessage(newMessages: ChatMessage[]) {
  messages.value = newMessages
}
</script>

<template>
  <div class="flex h-full flex-1 flex-col overflow-hidden">
    <ChatContainer :messages="messages" @new-message="handleNewMessage" />
  </div>
</template>
