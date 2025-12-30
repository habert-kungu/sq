<script setup lang="ts">
import { ref, watch } from 'vue'
import {
  IconDots,
  IconPlus,
  IconTrash,
  IconMessage,
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

interface ChatHistory {
  id: string
  title: string
  createdAt: Date
}

const props = defineProps<{
  conversations: ChatHistory[]
  activeId?: string
}>()

const emit = defineEmits<{
  (e: 'select', id: string): void
  (e: 'new'): void
  (e: 'delete', id: string): void
}>()

function formatDate(date: Date): string {
  const now = new Date()
  const diff = now.getTime() - date.getTime()
  const days = Math.floor(diff / (1000 * 60 * 60 * 24))
  
  if (days < 3) return `${days} days ago`
  if (days < 7) return `${days} days ago`
  if (days < 14) return 'Last week'
  return 'Older than last month'
}

function groupByDate(conversations: ChatHistory[]) {
  const groups: Record<string, ChatHistory[]> = {}
  
  for (const conv of conversations) {
    const label = formatDate(conv.createdAt)
    if (!groups[label]) groups[label] = []
    groups[label].push(conv)
  }
  
  return groups
}

const groupedConversations = ref(groupByDate(props.conversations))

watch(() => props.conversations, (newConvs) => {
  groupedConversations.value = groupByDate(newConvs)
}, { deep: true })
</script>

<template>
  <TooltipProvider :delay-duration="300">
    <div class="flex h-full w-56 flex-col bg-background">
      <!-- Header -->
      <div class="flex items-center justify-between px-4 py-4">
        <span class="text-sm font-medium tracking-tight">Chatbot</span>
        <div class="flex items-center gap-0.5">
          <Tooltip>
            <TooltipTrigger as-child>
              <Button 
                variant="ghost" 
                size="icon-sm" 
                class="size-8 text-muted-foreground hover:text-foreground transition-colors"
                aria-label="Clear all conversations"
                @click="emit('delete', '')"
              >
                <IconTrash class="size-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="bottom">
              <p>Clear all</p>
            </TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger as-child>
              <Button 
                variant="ghost" 
                size="icon-sm" 
                class="size-8 text-muted-foreground hover:text-foreground transition-colors"
                aria-label="New conversation"
                @click="emit('new')"
              >
                <IconPlus class="size-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="bottom">
              <p>New chat</p>
            </TooltipContent>
          </Tooltip>
        </div>
      </div>
      
      <!-- Chat History -->
      <div class="flex-1 overflow-y-auto px-3 scrollbar-thin">
        <template v-for="(convs, dateLabel) in groupedConversations" :key="dateLabel">
          <div class="mb-3">
            <!-- Date Group Header -->
            <div class="sticky top-0 bg-background/95 backdrop-blur-sm px-1 py-2">
              <span class="text-xs font-normal text-muted-foreground/60">
                {{ dateLabel }}
              </span>
            </div>
            
            <!-- Conversation Items -->
            <div class="space-y-0">
              <button
                v-for="conv in convs"
                :key="conv.id"
                class="group relative flex w-full items-center rounded-md px-2 py-1.5 text-left transition-colors duration-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                :class="[
                  conv.id === activeId 
                    ? 'bg-muted font-medium text-foreground' 
                    : 'text-muted-foreground hover:bg-muted/50 hover:text-foreground'
                ]"
                @click="emit('select', conv.id)"
              >
                <span class="flex-1 truncate text-sm">{{ conv.title }}</span>
                
                <!-- Actions Menu -->
                <DropdownMenu>
                  <DropdownMenuTrigger as-child>
                    <Button
                      variant="ghost"
                      size="icon-sm"
                      class="size-6 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity"
                      aria-label="Conversation options"
                      @click.stop
                    >
                      <IconDots class="size-3.5" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" class="w-40">
                    <DropdownMenuItem 
                      class="text-destructive focus:text-destructive"
                      @click="emit('delete', conv.id)"
                    >
                      <IconTrash class="size-4" />
                      Delete chat
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </button>
            </div>
          </div>
        </template>
        
        <!-- Empty State -->
        <div v-if="conversations.length === 0" class="flex flex-col items-center justify-center px-4 py-12 text-center">
          <div class="mb-3 rounded-full bg-muted p-3">
            <IconMessage class="size-5 text-muted-foreground" />
          </div>
          <p class="text-sm font-medium text-foreground">No conversations yet</p>
          <p class="mt-1 text-xs text-muted-foreground">Start a new chat to begin</p>
        </div>
        
        <!-- End of History -->
        <div v-else class="px-2 py-6 text-center">
          <p class="text-[11px] text-muted-foreground/50">
            You have reached the end of your chat history.
          </p>
        </div>
      </div>
    </div>
  </TooltipProvider>
</template>
