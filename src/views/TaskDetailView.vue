<script setup lang="ts">
import { ref, computed, type Component } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import {
  IconArrowLeft,
  IconArrowRight,
  IconArrowUp,
  IconArrowDown,
  IconCalendar,
  IconCheck,
  IconChevronDown,
  IconCircle,
  IconCircleCheck,
  IconCircleDot,
  IconClock,
  IconCopy,
  IconDots,
  IconEdit,
  IconEye,
  IconFile,
  IconFolder,
  IconMessage,
  IconPaperclip,
  IconPlus,
  IconPoint,
  IconSend,
  IconSubtask,
  IconTrash,
  IconUser,
  IconUserPlus,
} from '@tabler/icons-vue'

import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

const route = useRoute()
const router = useRouter()

interface StatusOption {
  value: string
  label: string
  icon: Component
  color: string
}

interface PriorityOption {
  value: string
  label: string
  icon: Component
  color: string
}

const statuses: StatusOption[] = [
  { value: 'Todo', label: 'To Do', icon: IconCircle, color: 'text-slate-400' },
  { value: 'In Progress', label: 'In Progress', icon: IconCircleDot, color: 'text-blue-500' },
  { value: 'Done', label: 'Done', icon: IconCircleCheck, color: 'text-emerald-500' },
  { value: 'Backlog', label: 'Backlog', icon: IconCircle, color: 'text-amber-500' },
  { value: 'Canceled', label: 'Canceled', icon: IconCircle, color: 'text-slate-300' },
]

const priorities: PriorityOption[] = [
  { value: 'High', label: 'High', icon: IconArrowUp, color: 'text-red-500' },
  { value: 'Medium', label: 'Medium', icon: IconArrowRight, color: 'text-amber-500' },
  { value: 'Low', label: 'Low', icon: IconArrowDown, color: 'text-slate-400' },
]

const task = ref({
  id: route.params.id as string,
  taskId: 'TASK-8782',
  title: "You can't compress the program without quantifying the open-source SSD panel!",
  description: 'This task involves compressing program data while ensuring we accurately quantify the open-source SSD panel metrics. Need to review current compression algorithms and propose improvements.',
  type: 'Documentation',
  status: 'In Progress',
  priority: 'Medium',
  assignee: 'Ahmed Hassan',
  reporter: 'Sarah Ahmed',
  matterId: '1',
  matterTitle: 'Employment Contracts - Al Fahad Construction',
  createdAt: 'Dec 15, 2025',
  dueDate: 'Jan 5, 2026',
  lastUpdated: 'Dec 28, 2025',
  timeEstimate: '4h',
  timeLogged: '1h 30m',
  timePercent: 37,
})

const comments = ref([
  { id: '1', author: 'Sarah Ahmed', content: 'Please prioritize this task as it blocks other documentation work.', date: 'Dec 20, 2:30 PM' },
  { id: '2', author: 'Ahmed Hassan', content: 'Working on it. Should have initial draft ready by end of week.', date: 'Dec 22, 10:00 AM' },
])

const activityLog = ref([
  { id: '1', type: 'status', action: 'changed status to', value: 'In Progress', user: 'Ahmed Hassan', date: 'Dec 18' },
  { id: '2', type: 'assign', action: 'assigned to', value: 'Ahmed Hassan', user: 'Sarah Ahmed', date: 'Dec 16' },
  { id: '3', type: 'create', action: 'created this task', value: '', user: 'Sarah Ahmed', date: 'Dec 15' },
])

const activeTab = ref<'comments' | 'activity' | 'files'>('comments')
const newComment = ref('')
const isCommentFocused = ref(false)

const getInitials = (name: string) => name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
const goBack = () => router.push('/tasks')

const defaultStatus: StatusOption = { value: 'Todo', label: 'To Do', icon: IconCircle, color: 'text-slate-400' }
const defaultPriority: PriorityOption = { value: 'Medium', label: 'Medium', icon: IconArrowRight, color: 'text-amber-500' }

const currentStatus = computed((): StatusOption => statuses.find(s => s.value === task.value.status) || defaultStatus)
const currentPriority = computed((): PriorityOption => priorities.find(p => p.value === task.value.priority) || defaultPriority)

const changeStatus = (status: string) => { task.value.status = status }
const changePriority = (priority: string) => { task.value.priority = priority }

const addComment = () => {
  if (newComment.value.trim()) {
    comments.value.push({
      id: String(Date.now()),
      author: 'You',
      content: newComment.value,
      date: 'Just now',
    })
    newComment.value = ''
    isCommentFocused.value = false
  }
}

const getTypeClass = (type: string) => {
  switch (type) {
    case 'Feature': return 'bg-blue-100 text-blue-600'
    case 'Bug': return 'bg-orange-100 text-orange-600'
    case 'Documentation': return 'bg-slate-100 text-slate-600'
    default: return 'bg-slate-100 text-slate-600'
  }
}
</script>

<template>
  <div class="h-full flex flex-col bg-background">
    <!-- Header -->
    <header class="h-16 px-6 flex items-center justify-between border-b bg-background shrink-0 shadow-sm z-10">
      <div class="flex items-center gap-4">
        <button @click="goBack" class="p-2 text-slate-500 hover:text-slate-700 transition-colors rounded-lg hover:bg-slate-100">
          <IconArrowLeft class="size-5" />
        </button>
        
        <div class="flex items-center gap-3">
          <span class="font-bold text-lg text-slate-900">{{ task.taskId }}</span>
          <Badge variant="outline" :class="getTypeClass(task.type)" class="font-medium px-2.5 py-0.5">
            {{ task.type }}
          </Badge>
          <div class="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-slate-50" :class="currentStatus.color">
            <component :is="currentStatus.icon" class="size-4" />
            <span class="text-sm font-medium">{{ currentStatus.label }}</span>
          </div>
          <div class="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-slate-50" :class="currentPriority.color">
            <component :is="currentPriority.icon" class="size-4" />
            <span class="text-sm font-medium">{{ currentPriority.label }}</span>
          </div>
        </div>
      </div>

      <div class="flex items-center gap-2">
        <Button variant="outline" size="sm" class="gap-2 h-9">
          <IconEye class="size-4" />
          Watch
        </Button>
        <Button variant="outline" size="sm" class="gap-2 h-9">
          <IconEdit class="size-4" />
          Edit
        </Button>
        <DropdownMenu>
          <DropdownMenuTrigger as-child>
            <Button variant="ghost" size="icon" class="size-9 hover:bg-slate-100">
              <IconDots class="size-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem class="gap-2">
              <IconCopy class="size-4" /> Clone Task
            </DropdownMenuItem>
            <DropdownMenuItem class="gap-2">
              <IconSubtask class="size-4" /> Add Subtask
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem class="gap-2 text-destructive">
              <IconTrash class="size-4" /> Delete Task
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>

    <!-- Main Content -->
    <div class="flex-1 flex overflow-hidden">
      <!-- Left Panel - Content -->
      <main class="flex-1 overflow-auto">
        <div class="p-8 max-w-3xl">
          <!-- Title & Description -->
          <div class="space-y-6 mb-10 pb-8 border-b">
            <h1 class="text-3xl font-bold leading-[1.3] tracking-tight text-slate-900 group">
              {{ task.title }}
              <button class="opacity-0 group-hover:opacity-100 ml-2 text-slate-400 hover:text-slate-600 transition-opacity rounded p-1 hover:bg-slate-100">
                <IconEdit class="size-4 inline" />
              </button>
            </h1>
            
            <div class="relative group">
              <p class="text-base leading-[1.8] text-slate-600 max-w-[70ch]">
                {{ task.description }}
              </p>
              <button class="opacity-0 group-hover:opacity-100 mt-2 text-sm text-blue-600 hover:text-blue-700 transition-opacity flex items-center gap-1">
                <IconEdit class="size-3.5" />
                Edit description
              </button>
            </div>
          </div>

          <!-- Tabs -->
          <div class="flex items-center gap-1 border-b-2 border-slate-200 mb-8">
            <button 
              @click="activeTab = 'comments'"
              class="flex items-center gap-2 px-4 py-3 text-sm font-semibold border-b-2 transition-all -mb-0.5"
              :class="activeTab === 'comments' ? 'border-blue-600 text-blue-600 bg-blue-50/50' : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'"
            >
              <IconMessage class="size-4" />
              Comments
              <span class="text-xs bg-slate-200 text-slate-700 px-2 py-0.5 rounded-full font-medium">{{ comments.length }}</span>
            </button>
            <button 
              @click="activeTab = 'activity'"
              class="flex items-center gap-2 px-4 py-3 text-sm font-semibold border-b-2 transition-all -mb-0.5"
              :class="activeTab === 'activity' ? 'border-blue-600 text-blue-600 bg-blue-50/50' : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'"
            >
              <IconClock class="size-4" />
              Activity
              <span class="text-xs bg-slate-200 text-slate-700 px-2 py-0.5 rounded-full font-medium">{{ activityLog.length }}</span>
            </button>
            <button 
              @click="activeTab = 'files'"
              class="flex items-center gap-2 px-4 py-3 text-sm font-semibold border-b-2 transition-all -mb-0.5"
              :class="activeTab === 'files' ? 'border-blue-600 text-blue-600 bg-blue-50/50' : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'"
            >
              <IconPaperclip class="size-4" />
              Files
              <span class="text-xs bg-slate-200 text-slate-700 px-2 py-0.5 rounded-full font-medium">0</span>
            </button>
          </div>

          <!-- Comments Tab -->
          <div v-if="activeTab === 'comments'" class="space-y-5">
            <!-- Comment Input -->
            <div class="space-y-2">
              <div 
                class="flex items-start gap-3 p-3 rounded-lg border bg-white transition-all"
                :class="isCommentFocused ? 'border-slate-300 ring-1 ring-slate-200' : 'border-slate-200'"
              >
                <Avatar class="size-8 shrink-0">
                  <AvatarFallback class="bg-slate-100 text-slate-600 text-xs font-medium">U</AvatarFallback>
                </Avatar>
                <div class="flex-1 min-w-0">
                  <Input
                    v-model="newComment"
                    placeholder="Add a comment..."
                    class="border-0 bg-transparent p-0 h-auto shadow-none focus-visible:ring-0 text-sm placeholder:text-slate-400"
                    @focus="isCommentFocused = true"
                    @blur="!newComment && (isCommentFocused = false)"
                    @keydown.enter.prevent="addComment"
                  />
                </div>
              </div>
              <div v-if="isCommentFocused || newComment" class="flex items-center justify-between">
                <Button variant="ghost" size="sm" class="gap-2 text-slate-500 hover:text-slate-700 h-8">
                  <IconPaperclip class="size-4" />
                  Attach
                </Button>
                <Button 
                  size="sm" 
                  class="gap-2 h-8"
                  :disabled="!newComment.trim()"
                  @click="addComment"
                >
                  <IconSend class="size-3.5" />
                  Comment
                </Button>
              </div>
            </div>

            <!-- Comments List -->
            <div class="space-y-5">
              <div 
                v-for="(comment, index) in comments" 
                :key="comment.id"
              >
                <div class="flex gap-3 group">
                  <Avatar class="size-8 shrink-0">
                    <AvatarFallback class="bg-slate-100 text-slate-600 text-xs font-medium">
                      {{ getInitials(comment.author) }}
                    </AvatarFallback>
                  </Avatar>
                  <div class="flex-1 min-w-0">
                    <div class="flex items-center gap-2 mb-0.5">
                      <span class="text-sm font-medium text-slate-900">{{ comment.author }}</span>
                      <span class="text-xs text-slate-400">{{ comment.date }}</span>
                    </div>
                    <p class="text-sm leading-relaxed text-slate-600">{{ comment.content }}</p>
                    <div class="flex items-center gap-3 mt-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button variant="ghost" size="sm" class="h-7 text-xs text-slate-500 hover:text-slate-700">
                        Reply
                      </Button>
                      <Button variant="ghost" size="sm" class="h-7 text-xs text-slate-500 hover:text-red-600">
                        Delete
                      </Button>
                    </div>
                  </div>
                </div>
                <!-- Separator between comments -->
                <div v-if="index < comments.length - 1" class="h-px bg-slate-100 mt-5"></div>
              </div>
            </div>
          </div>

          <!-- Activity Tab -->
          <div v-if="activeTab === 'activity'" class="space-y-4">
            <div 
              v-for="activity in activityLog" 
              :key="activity.id"
              class="flex items-start gap-3 py-3"
            >
              <Avatar class="size-7 shrink-0 mt-0.5">
                <AvatarFallback class="bg-slate-100 text-slate-600 text-[11px] font-medium">
                  {{ getInitials(activity.user) }}
                </AvatarFallback>
              </Avatar>
              <div class="flex-1 min-w-0 text-sm">
                <span class="text-slate-900 font-medium">{{ activity.user }}</span>
                <span class="text-slate-600"> {{ activity.action }}</span>
                <span v-if="activity.value" class="text-slate-900 font-medium"> {{ activity.value }}</span>
              </div>
              <span class="text-xs text-slate-500 shrink-0">{{ activity.date }}</span>
            </div>
          </div>

          <!-- Files Tab -->
          <div v-if="activeTab === 'files'">
            <div class="flex flex-col items-center justify-center py-16 text-center">
              <div class="size-14 rounded-full bg-slate-100 flex items-center justify-center mb-4">
                <IconFile class="size-7 text-slate-400" />
              </div>
              <p class="text-sm text-slate-500 mb-4">No files attached</p>
              <Button variant="outline" size="sm" class="gap-2">
                <IconPlus class="size-4" />
                Add File
              </Button>
            </div>
          </div>
        </div>
      </main>

      <!-- Right Sidebar -->
      <aside class="w-72 shrink-0 overflow-y-auto border-l bg-white">
        <div class="py-6 px-5">
          
          <!-- PEOPLE -->
          <div class="text-[11px] font-semibold text-blue-600 uppercase tracking-wider mb-4">
            People
          </div>
          
          <div class="flex items-center gap-3 mb-2">
            <Avatar class="size-8">
              <AvatarFallback class="bg-slate-100 text-slate-600 text-xs font-medium">
                {{ getInitials(task.assignee) }}
              </AvatarFallback>
            </Avatar>
            <div>
              <div class="text-[11px] text-slate-400 mb-0.5">Assignee</div>
              <div class="text-sm text-slate-900 font-medium">{{ task.assignee }}</div>
            </div>
          </div>
          
          <div class="flex items-center gap-3 mb-8">
            <Avatar class="size-8">
              <AvatarFallback class="bg-slate-100 text-slate-600 text-xs font-medium">
                {{ getInitials(task.reporter) }}
              </AvatarFallback>
            </Avatar>
            <div>
              <div class="text-[11px] text-slate-400 mb-0.5">Reporter</div>
              <div class="text-sm text-slate-900">{{ task.reporter }}</div>
            </div>
          </div>

          <!-- DETAILS -->
          <div class="text-[11px] font-semibold text-blue-600 uppercase tracking-wider mb-4">
            Details
          </div>
          
          <div class="mb-3">
            <div class="text-[11px] text-slate-400 mb-1">Due Date</div>
            <div class="flex items-center gap-2 text-sm text-slate-900">
              <IconCalendar class="size-4 text-slate-400" />
              <span class="font-medium">{{ task.dueDate }}</span>
            </div>
          </div>
          
          <div class="mb-3">
            <div class="text-[11px] text-slate-400 mb-1">Status</div>
            <DropdownMenu>
              <DropdownMenuTrigger as-child>
                <button class="flex items-center gap-1.5 text-sm">
                  <component :is="currentStatus.icon" class="size-4" :class="currentStatus.color" />
                  <span :class="currentStatus.color">{{ currentStatus.label }}</span>
                  <IconChevronDown class="size-3 text-slate-300 ml-0.5" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" class="w-[160px]">
                <DropdownMenuItem 
                  v-for="status in statuses" 
                  :key="status.value" 
                  @click="changeStatus(status.value)"
                  class="gap-2"
                >
                  <component :is="status.icon" class="size-4" :class="status.color" />
                  {{ status.label }}
                  <IconCheck v-if="task.status === status.value" class="size-3.5 ml-auto" />
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          
          <div class="mb-8">
            <div class="text-[11px] text-slate-400 mb-1">Priority</div>
            <DropdownMenu>
              <DropdownMenuTrigger as-child>
                <button class="flex items-center gap-1.5 text-sm">
                  <component :is="currentPriority.icon" class="size-4" :class="currentPriority.color" />
                  <span :class="currentPriority.color">{{ currentPriority.label }}</span>
                  <IconChevronDown class="size-3 text-slate-300 ml-0.5" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" class="w-[160px]">
                <DropdownMenuItem 
                  v-for="priority in priorities" 
                  :key="priority.value" 
                  @click="changePriority(priority.value)"
                  class="gap-2"
                >
                  <component :is="priority.icon" class="size-4" :class="priority.color" />
                  {{ priority.label }}
                  <IconCheck v-if="task.priority === priority.value" class="size-3.5 ml-auto" />
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          <!-- PROGRESS -->
          <div class="text-[11px] font-semibold text-blue-600 uppercase tracking-wider mb-4">
            Progress
          </div>
          
          <div class="flex items-baseline justify-between mb-2">
            <span class="text-sm text-slate-900 font-medium">{{ task.timeLogged }}</span>
            <span class="text-sm text-slate-400">/ {{ task.timeEstimate }}</span>
          </div>
          
          <div class="h-1.5 rounded-full bg-slate-100 overflow-hidden mb-2">
            <div 
              class="h-full rounded-full bg-blue-500"
              :style="{ width: `${task.timePercent}%` }"
            ></div>
          </div>
          
          <div class="flex items-center justify-between mb-8">
            <span class="text-xs text-slate-400">{{ task.timePercent }}%</span>
            <button class="text-xs text-slate-500 hover:text-blue-600 transition-colors">
              Log time
            </button>
          </div>

          <!-- CONTEXT -->
          <div class="text-[11px] font-semibold text-blue-600 uppercase tracking-wider mb-4">
            Context
          </div>
          
          <div v-if="task.matterId" class="mb-3">
            <div class="text-[11px] text-slate-400 mb-1">Related</div>
            <RouterLink 
              :to="`/matters/${task.matterId}`"
              class="flex items-center gap-2 text-sm text-slate-600 hover:text-blue-600 transition-colors"
            >
              <IconFolder class="size-4 text-slate-400" />
              <span class="truncate">{{ task.matterTitle }}</span>
            </RouterLink>
          </div>
          
          <div class="mb-8">
            <div class="text-[11px] text-slate-400 mb-2">Timeline</div>
            <div class="space-y-1.5">
              <div class="flex justify-between text-sm">
                <span class="text-slate-400">Created</span>
                <span class="text-slate-900">{{ task.createdAt }}</span>
              </div>
              <div class="flex justify-between text-sm">
                <span class="text-slate-400">Updated</span>
                <span class="text-slate-900">{{ task.lastUpdated }}</span>
              </div>
            </div>
          </div>

          <!-- ACTIONS -->
          <div class="text-[11px] font-semibold text-blue-600 uppercase tracking-wider mb-4">
            Actions
          </div>
          
          <div class="space-y-1">
            <button class="flex items-center gap-3 w-full py-2 text-sm text-slate-600 hover:text-slate-900 transition-colors">
              <IconEdit class="size-4" />
              Edit Task
            </button>
            <button class="flex items-center gap-3 w-full py-2 text-sm text-slate-600 hover:text-slate-900 transition-colors">
              <IconCopy class="size-4" />
              Clone Task
            </button>
            <button class="flex items-center gap-3 w-full py-2 text-sm text-slate-600 hover:text-slate-900 transition-colors">
              <IconEye class="size-4" />
              Watch Updates
            </button>
            <button class="flex items-center gap-3 w-full py-2 text-sm text-red-500 hover:text-red-600 transition-colors">
              <IconTrash class="size-4" />
              Delete Task
            </button>
          </div>
        </div>
      </aside>
    </div>
  </div>
</template>
