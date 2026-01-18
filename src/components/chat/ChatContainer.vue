<script setup lang="ts">
import { ref, nextTick, onMounted } from 'vue'
import {
  IconLayoutSidebar,
  IconChevronDown,
  IconLock,
  IconWorld,
  IconLoader2,
  IconSparkles,
} from '@tabler/icons-vue'
import { Button } from '@/components/ui/button'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import ChatSidebar from './ChatSidebar.vue'
import ChatMessage, { type Message } from './ChatMessage.vue'
import ChatInput from './ChatInput.vue'
import { useChatStream } from '@/composables/useChatStream'

const showSidebar = ref(true)
const messagesContainer = ref<HTMLDivElement | null>(null)
const { text: streamedText, sources, isStreaming, error, send, cancel } = useChatStream()
const isLoading = isStreaming
const visibility = ref<'private' | 'public'>('private')

// Mock conversations for history
const conversations = ref([
  { id: '1', title: 'Next.js Advantages', createdAt: new Date(Date.now() - 86400000 * 2) },
  { id: '2', title: 'Advantages of Next.js', createdAt: new Date(Date.now() - 86400000 * 2) },
  { id: '3', title: 'Essay on Silicon Valley', createdAt: new Date(Date.now() - 86400000 * 5) },
  { id: '4', title: 'Advantages of Next.js', createdAt: new Date(Date.now() - 86400000 * 10) },
  { id: '5', title: 'Greeting', createdAt: new Date(Date.now() - 86400000 * 15) },
])

const activeConversationId = ref('1')

// Messages state
const messages = ref<Message[]>([])

function scrollToBottom() {
  nextTick(() => {
    if (messagesContainer.value) {
      messagesContainer.value.scrollTo({
        top: messagesContainer.value.scrollHeight,
        behavior: 'smooth'
      })
    }
  })
}

async function handleSendMessage(content: string) {
  // Add user message
  const userMessage: Message = {
    id: Date.now().toString(),
    role: 'user',
    content,
    timestamp: new Date(),
  }
  messages.value.push(userMessage)

  scrollToBottom()
  isLoading.value = true

  try {
    // Create assistant message placeholder
    const assistantMessage: Message = {
      id: (Date.now() + 1).toString(),
      role: 'assistant',
      content: '',
      timestamp: new Date(),
    }
    messages.value.push(assistantMessage)

    // Start streaming from backend SSE using composable
    await send(content, { endpoint: '/api/v1/chat' })
    // While streaming, the composable accumulates text
    assistantMessage.content = streamedText.value
    assistantMessage.sources = sources.value

  } catch (error) {
    console.error('Error sending message:', error)
    // Add error message
    messages.value.push({
      id: (Date.now() + 2).toString(),
      role: 'assistant',
      content: `Sorry, I encountered an error: ${error instanceof Error ? error.message : 'Unknown error'}`,
      timestamp: new Date(),
    })
  } finally {
    isLoading.value = false
    scrollToBottom()
  }
}

function handleNewChat() {
  messages.value = []
  activeConversationId.value = ''
}

function handleSelectConversation(id: string) {
  activeConversationId.value = id
  // In real app, load messages for this conversation
}

function handleDeleteConversation(id: string) {
  conversations.value = conversations.value.filter(c => c.id !== id)
  if (activeConversationId.value === id) {
    handleNewChat()
  }
}

function handleCopy(content: string) {
  // Toast notification would go here
  console.log('Copied:', content)
}

function handleFeedback(type: 'up' | 'down', messageId: string) {
  console.log('Feedback:', type, messageId)
}

onMounted(scrollToBottom)
</script>

<template>
  <TooltipProvider :delay-duration="300">
    <div class="flex h-full bg-background">
      <!-- Chat History Sidebar -->
      <transition
        enter-active-class="transition-all duration-200 ease-out"
        enter-from-class="opacity-0 -translate-x-4"
        enter-to-class="opacity-100 translate-x-0"
        leave-active-class="transition-all duration-150 ease-in"
        leave-from-class="opacity-100 translate-x-0"
        leave-to-class="opacity-0 -translate-x-4"
      >
        <ChatSidebar
          v-if="showSidebar"
          :conversations="conversations"
          :active-id="activeConversationId"
          @select="handleSelectConversation"
          @new="handleNewChat"
          @delete="handleDeleteConversation"
        />
      </transition>

      <!-- Divider between sidebar and chat -->
      <div v-if="showSidebar" class="w-px bg-border" />

      <!-- Main Chat Area -->
      <div class="flex flex-1 flex-col min-w-0">
        <!-- Header -->
        <header class="border-b">
          <div class="w-full px-6 md:px-10 lg:px-14 py-3 flex items-center justify-between">
            <div class="flex items-center gap-2">
            <Tooltip>
              <TooltipTrigger as-child>
                <Button
                  variant="ghost"
                  size="icon-sm"
                  class="size-9 transition-colors"
                  aria-label="Toggle sidebar"
                  @click="showSidebar = !showSidebar"
                >
                  <IconLayoutSidebar class="size-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="bottom">
                <p>{{ showSidebar ? 'Hide' : 'Show' }} sidebar</p>
              </TooltipContent>
            </Tooltip>

            <DropdownMenu>
              <DropdownMenuTrigger as-child>
                <Button
                  variant="ghost"
                  size="sm"
                  class="gap-1.5 text-muted-foreground hover:text-foreground"
                >
                  <IconLock v-if="visibility === 'private'" class="size-4" />
                  <IconWorld v-else class="size-4" />
                  <span class="text-xs font-medium capitalize">{{ visibility }}</span>
                  <IconChevronDown class="size-3.5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" class="w-40">
                <DropdownMenuItem @click="visibility = 'private'">
                  <IconLock class="size-4" />
                  Private
                </DropdownMenuItem>
                <DropdownMenuItem @click="visibility = 'public'">
                  <IconWorld class="size-4" />
                  Public
                </DropdownMenuItem>
              </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </header>

         <!-- Messages Area (stretched, larger readable width) -->
         <div
           ref="messagesContainer"
           class="flex-1 overflow-y-auto scroll-smooth"
         >
            <div class="w-full px-6 md:px-10 lg:px-14 py-8">
            <!-- Messages -->
            <TransitionGroup
              name="message"
              tag="div"
              class="flex flex-col gap-8"
            >
              <div
                v-for="msg in messages"
                :key="msg.id"
                class="group"
              >
                <ChatMessage
                  :message="msg"
                  @copy="handleCopy"
                  @feedback="handleFeedback"
                />
              </div>
            </TransitionGroup>

             <!-- Streaming Indicator -->
             <transition
               enter-active-class="transition-all duration-200"
               enter-from-class="opacity-0 translate-y-2"
               enter-to-class="opacity-100 translate-y-0"
               leave-active-class="transition-all duration-150"
               leave-from-class="opacity-100"
               leave-to-class="opacity-0"
             >
               <div v-if="isStreaming" class="flex items-start gap-4">
                 <div class="flex size-9 shrink-0 items-center justify-center rounded-full border bg-background shadow-sm">
                   <IconLoader2 class="size-4 animate-spin text-muted-foreground" />
                 </div>
                 <div class="flex items-center gap-1 pt-2">
                   <span class="size-2 animate-bounce rounded-full bg-muted-foreground/40 [animation-delay:-0.3s]" />
                   <span class="size-2 animate-bounce rounded-full bg-muted-foreground/40 [animation-delay:-0.15s]" />
                   <span class="size-2 animate-bounce rounded-full bg-muted-foreground/40" />
                 </div>
               </div>
             </transition>

            <!-- Empty State -->
            <div v-if="messages.length === 0 && !isLoading" class="flex flex-col items-center justify-center py-16 text-center">
              <div class="mb-4 rounded-full bg-muted p-4">
                <IconSparkles class="size-8 text-muted-foreground" />
              </div>
              <h3 class="text-lg font-medium text-foreground">Start a conversation</h3>
              <p class="mt-1 max-w-sm text-sm text-muted-foreground">
                Ask me anything about legal documents, contracts, or compliance matters.
              </p>
            </div>
          </div>
        </div>

        <!-- Input Area: sticky footer aligned to content -->
        <div class="sticky bottom-0 border-t bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div class="w-full px-6 md:px-10 lg:px-14 py-4">
            <ChatInput
              :disabled="isStreaming"
              model-name="Gemini 2.5 Flash Lite"
              @send="handleSendMessage"
            />
          </div>
        </div>
      </div>
    </div>
  </TooltipProvider>
</template>

<style scoped>
.message-enter-active {
  transition: all 0.3s ease-out;
}

.message-leave-active {
  transition: all 0.2s ease-in;
}

.message-enter-from {
  opacity: 0;
  transform: translateY(10px);
}

.message-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}
</style>
