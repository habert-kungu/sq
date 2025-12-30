<script setup lang="ts">
import { ref, watch, nextTick } from 'vue'
import {
  IconPaperclip,
  IconArrowUp,
  IconSparkles,
  IconMicrophone,
} from '@tabler/icons-vue'
import { Button } from '@/components/ui/button'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'

const props = defineProps<{
  disabled?: boolean
  modelName?: string
}>()

const emit = defineEmits<{
  (e: 'send', message: string): void
}>()

const inputRef = ref<HTMLTextAreaElement | null>(null)
const message = ref('')
const isFocused = ref(false)

function handleSend() {
  if (!message.value.trim() || props.disabled) return
  emit('send', message.value.trim())
  message.value = ''
  nextTick(() => {
    if (inputRef.value) {
      inputRef.value.style.height = 'auto'
    }
  })
}

function handleKeydown(e: KeyboardEvent) {
  if (e.key === 'Enter' && !e.shiftKey) {
    e.preventDefault()
    handleSend()
  }
}

function adjustHeight() {
  if (inputRef.value) {
    inputRef.value.style.height = 'auto'
    inputRef.value.style.height = `${Math.min(inputRef.value.scrollHeight, 200)}px`
  }
}

watch(message, () => {
  nextTick(adjustHeight)
})
</script>

<template>
  <TooltipProvider :delay-duration="300">
    <div class="mx-auto w-full max-w-4xl px-6 pb-6">
      <div 
        class="relative rounded-2xl border bg-background transition-all duration-200"
        :class="[
          isFocused 
            ? 'border-ring ring-2 ring-ring/20 shadow-md' 
            : 'border-border shadow-sm hover:border-border/80'
        ]"
      >
        <textarea
          ref="inputRef"
          v-model="message"
          placeholder="Send a message..."
          rows="1"
          class="w-full resize-none bg-transparent px-4 pt-4 pb-14 text-sm leading-relaxed outline-none placeholder:text-muted-foreground/60"
          :disabled="disabled"
          aria-label="Message input"
          @keydown="handleKeydown"
          @focus="isFocused = true"
          @blur="isFocused = false"
        />
        
        <!-- Bottom Actions -->
        <div class="absolute bottom-3 left-3 right-3 flex items-center justify-between">
          <div class="flex items-center gap-1">
            <Tooltip>
              <TooltipTrigger as-child>
                <Button 
                  variant="ghost" 
                  size="icon-sm" 
                  class="size-9 text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors"
                  aria-label="Attach file"
                >
                  <IconPaperclip class="size-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Attach file</p>
              </TooltipContent>
            </Tooltip>
            
            <Tooltip>
              <TooltipTrigger as-child>
                <Button 
                  variant="ghost" 
                  size="icon-sm" 
                  class="size-9 text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors"
                  aria-label="Voice input"
                >
                  <IconMicrophone class="size-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Voice input</p>
              </TooltipContent>
            </Tooltip>
            
            <div class="ml-2 flex items-center gap-1.5 rounded-md bg-muted/50 px-2.5 py-1.5 text-xs text-muted-foreground">
              <IconSparkles class="size-3.5" />
              <span class="font-medium">{{ modelName || 'Gemini 2.5 Flash Lite' }}</span>
            </div>
          </div>
          
          <Tooltip>
            <TooltipTrigger as-child>
              <Button
                size="icon-sm"
                class="size-9 rounded-full transition-all"
                :class="[
                  message.trim() && !disabled
                    ? 'bg-primary hover:bg-primary/90 text-primary-foreground shadow-sm'
                    : 'bg-muted text-muted-foreground'
                ]"
                :disabled="!message.trim() || disabled"
                aria-label="Send message"
                @click="handleSend"
              >
                <IconArrowUp class="size-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Send message</p>
            </TooltipContent>
          </Tooltip>
        </div>
      </div>
      
      <!-- Helper text -->
      <p class="mt-2 text-center text-[11px] text-muted-foreground/60">
        Press Enter to send, Shift + Enter for new line
      </p>
    </div>
  </TooltipProvider>
</template>
