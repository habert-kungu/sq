<script setup lang="ts">
import { computed, ref } from 'vue'
import {
  IconCopy,
  IconCheck,
  IconThumbUp,
  IconThumbDown,
  IconSparkles,
} from '@tabler/icons-vue'
import { Button } from '@/components/ui/button'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'

export interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
}

const props = defineProps<{
  message: Message
}>()

const emit = defineEmits<{
  (e: 'copy', content: string): void
  (e: 'feedback', type: 'up' | 'down', messageId: string): void
}>()

const isUser = computed(() => props.message.role === 'user')
const copied = ref(false)
const feedbackGiven = ref<'up' | 'down' | null>(null)

function copyToClipboard() {
  navigator.clipboard.writeText(props.message.content)
  emit('copy', props.message.content)
  copied.value = true
  setTimeout(() => {
    copied.value = false
  }, 2000)
}

function handleFeedback(type: 'up' | 'down') {
  feedbackGiven.value = type
  emit('feedback', type, props.message.id)
}
</script>

<template>
  <TooltipProvider :delay-duration="300">
    <!-- User Message -->
    <div v-if="isUser" class="flex items-start justify-end gap-3">
      <div 
        class="max-w-[85%] rounded-2xl bg-primary px-5 py-3.5 text-sm leading-relaxed text-primary-foreground shadow-sm"
      >
        {{ message.content }}
      </div>
      
      <!-- Copy Button -->
      <Tooltip>
        <TooltipTrigger as-child>
          <Button
            variant="ghost"
            size="icon-sm"
            class="size-9 shrink-0 text-muted-foreground/40 hover:text-foreground hover:bg-muted/50 transition-all"
            aria-label="Copy message"
            @click="copyToClipboard"
          >
            <IconCheck v-if="copied" class="size-4 text-green-500" />
            <IconCopy v-else class="size-4" />
          </Button>
        </TooltipTrigger>
        <TooltipContent side="left">
          <p>{{ copied ? 'Copied!' : 'Copy' }}</p>
        </TooltipContent>
      </Tooltip>
    </div>
    
    <!-- Assistant Message -->
    <div v-else class="flex items-start gap-4">
      <!-- Avatar -->
      <div class="flex size-9 shrink-0 items-center justify-center rounded-full border bg-background shadow-sm">
        <IconSparkles class="size-4 text-foreground" />
      </div>
      
      <!-- Content -->
      <div class="flex flex-1 flex-col gap-3 min-w-0">
        <div class="text-sm leading-relaxed text-foreground">
          {{ message.content }}
        </div>
        
        <!-- Actions -->
        <div class="flex items-center gap-1 opacity-60 hover:opacity-100 transition-opacity">
          <Tooltip>
            <TooltipTrigger as-child>
              <Button
                variant="ghost"
                size="icon-sm"
                class="size-8 text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-all"
                aria-label="Copy response"
                @click="copyToClipboard"
              >
                <IconCheck v-if="copied" class="size-4 text-green-500" />
                <IconCopy v-else class="size-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>{{ copied ? 'Copied!' : 'Copy' }}</p>
            </TooltipContent>
          </Tooltip>
          
          <Tooltip>
            <TooltipTrigger as-child>
              <Button
                variant="ghost"
                size="icon-sm"
                class="size-8 transition-all"
                :class="[
                  feedbackGiven === 'up' 
                    ? 'text-green-500 hover:text-green-600' 
                    : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
                ]"
                aria-label="Good response"
                @click="handleFeedback('up')"
              >
                <IconThumbUp class="size-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Good response</p>
            </TooltipContent>
          </Tooltip>
          
          <Tooltip>
            <TooltipTrigger as-child>
              <Button
                variant="ghost"
                size="icon-sm"
                class="size-8 transition-all"
                :class="[
                  feedbackGiven === 'down' 
                    ? 'text-red-500 hover:text-red-600' 
                    : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
                ]"
                aria-label="Bad response"
                @click="handleFeedback('down')"
              >
                <IconThumbDown class="size-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Bad response</p>
            </TooltipContent>
          </Tooltip>
        </div>
      </div>
    </div>
  </TooltipProvider>
</template>
