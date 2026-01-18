<script setup lang="ts">
import { ref, watch } from 'vue'
import { knowledgeAPI } from '@/services/knowledgeApi'
import { useToast } from '@/composables/useToast'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import {
  IconUpload,
  IconFile,
  IconX,
} from '@tabler/icons-vue'

const props = defineProps<{
  open: boolean
}>()

const emit = defineEmits<{
  close: []
  success: []
}>()

const { success: showSuccess, error: showError } = useToast()

// Form data
const selectedFiles = ref<File[]>([])
const fileInputRef = ref<HTMLInputElement | null>(null)
const title = ref('')
const category = ref('')
const description = ref('')
const tags = ref('')
const uploading = ref(false)
const uploadProgress = ref(0)

// Categories
const categories = [
  'Contracts',
  'Case Law',
  'Legal Briefs',
  'Court Filings',
  'Legal Opinions',
  'Regulations',
  'Statutes',
  'Legal Research',
  'Client Documents',
  'Other',
]

// Handle file selection
const handleFileSelect = (event: Event) => {
  const target = event.target as HTMLInputElement
  if (target.files && target.files.length > 0) {
    const newFiles = Array.from(target.files).filter(file => {
      if (!isValidFileType(file)) {
        showError('Invalid file type', `${file.name}: Please upload PDF, DOCX, TXT, or CSV files`)
        return false
      }
      if (file.size > 500 * 1024 * 1024) {
        showError('File too large', `${file.name}: Maximum file size is 500MB`)
        return false
      }
      return true
    })
    
    selectedFiles.value = [...selectedFiles.value, ...newFiles]
    
    // If this is the first file, auto-populate title and category
    if (selectedFiles.value.length === newFiles.length && newFiles.length > 0) {
      title.value = newFiles[0].name.replace(/\.[^/.]+$/, '')
      suggestCategory(newFiles[0].name)
    }
  }
}

// Validate file type
const isValidFileType = (file: File): boolean => {
  const validTypes = [
    'application/pdf',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'text/plain',
    'text/csv'
  ]
  return validTypes.includes(file.type)
}

// Suggest category based on filename
const suggestCategory = (filename: string) => {
  const lower = filename.toLowerCase()
  if (lower.includes('contract')) category.value = 'Contracts'
  else if (lower.includes('brief')) category.value = 'Legal Briefs'
  else if (lower.includes('filing')) category.value = 'Court Filings'
  else if (lower.includes('case') || lower.includes('ruling')) category.value = 'Case Law'
  else if (lower.includes('regulation')) category.value = 'Regulations'
  else if (lower.includes('statute')) category.value = 'Statutes'
  else if (lower.includes('opinion')) category.value = 'Legal Opinions'
  else if (lower.includes('research')) category.value = 'Legal Research'
  else if (lower.includes('client')) category.value = 'Client Documents'
  else category.value = 'Other'
}

// Remove selected file
const removeFile = (index: number) => {
  selectedFiles.value.splice(index, 1)
  if (fileInputRef.value) {
    fileInputRef.value.value = ''
  }
}

// Format file size
const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i]
}

// Handle form submission
const handleUpload = async () => {
  if (selectedFiles.value.length === 0) {
    showError('No files selected', 'Please select at least one file to upload')
    return
  }

  if (!category.value) {
    showError('Category required', 'Please select a category')
    return
  }

  try {
    uploading.value = true
    uploadProgress.value = 0

    // Simulate progress
    const progressInterval = setInterval(() => {
      if (uploadProgress.value < 90) {
        uploadProgress.value += 10
      }
    }, 200)

    const tagsArray = tags.value
      .split(',')
      .map((tag) => tag.trim())
      .filter((tag) => tag !== '')

    // Use bulk upload if multiple files, single upload if one file
    if (selectedFiles.value.length === 1) {
      await knowledgeAPI.uploadDocument(selectedFiles.value[0], {
        title: title.value || selectedFiles.value[0].name.replace(/\.[^/.]+$/, ''),
        description: description.value || '',
        category: category.value,
        tags: tagsArray,
      })
    } else {
      await knowledgeAPI.bulkUploadDocuments(selectedFiles.value, {
        category: category.value,
        tags: tagsArray,
      })
    }

    clearInterval(progressInterval)
    uploadProgress.value = 100

    const message = selectedFiles.value.length === 1 
      ? 'Document uploaded successfully'
      : `${selectedFiles.value.length} documents uploaded successfully`
    
    showSuccess(message)
    emit('success')
    handleClose()
  } catch (error: any) {
    showError('Upload failed', error.message)
  } finally {
    uploading.value = false
    uploadProgress.value = 0
  }
}

// Handle close
const handleClose = () => {
  selectedFiles.value = []
  title.value = ''
  category.value = ''
  description.value = ''
  tags.value = ''
  if (fileInputRef.value) {
    fileInputRef.value.value = ''
  }
  emit('close')
}

// Watch for dialog close
watch(() => props.open, (newValue) => {
  if (!newValue) {
    setTimeout(() => {
      selectedFiles.value = []
      title.value = ''
      category.value = ''
      description.value = ''
      tags.value = ''
    }, 300)
  }
})
</script>

<template>
  <Dialog :open="open" @update:open="(val) => !val && handleClose()">
    <DialogContent class="max-w-2xl">
      <DialogHeader class="pb-3">
        <DialogTitle>Upload Document</DialogTitle>
        <DialogDescription>
          Add a new document to your knowledge base
        </DialogDescription>
      </DialogHeader>

      <div class="space-y-5 py-4">
        <!-- File Upload -->
        <div class="space-y-2">
          <Label class="text-sm font-medium">Document Files</Label>
          <p class="text-xs text-muted-foreground">
            Upload PDF, DOCX, TXT, or CSV files (max 500MB each, up to 10 files)
          </p>
          
          <!-- File Input -->
          <div>
            <label class="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer hover:bg-muted/50 transition-colors">
              <div class="flex flex-col items-center justify-center py-4">
                <IconUpload class="size-8 text-muted-foreground mb-2" />
                <p class="text-sm text-muted-foreground">
                  <span class="font-medium">Click to upload</span> or drag and drop
                </p>
                <p class="text-xs text-muted-foreground mt-1">
                  PDF, DOCX, TXT or CSV (max 500MB each)
                </p>
                <p v-if="selectedFiles.length > 0" class="text-xs text-primary mt-2 font-medium">
                  {{ selectedFiles.length }} file(s) selected
                </p>
              </div>
              <input
                ref="fileInputRef"
                type="file"
                class="hidden"
                accept=".pdf,.docx,.txt,.csv"
                multiple
                @change="handleFileSelect"
              />
            </label>
          </div>

          <!-- Selected Files Display -->
          <div v-if="selectedFiles.length > 0" class="space-y-2 mt-3">
            <div v-for="(file, index) in selectedFiles" :key="index" class="flex items-center gap-3 p-3 border rounded-lg bg-muted/50">
              <div class="flex size-10 items-center justify-center rounded-md bg-primary/10">
                <IconFile class="size-5 text-primary" />
              </div>
              <div class="flex-1 min-w-0">
                <p class="text-sm font-medium truncate">{{ file.name }}</p>
                <p class="text-xs text-muted-foreground">{{ formatFileSize(file.size) }}</p>
              </div>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                class="size-8 flex-shrink-0"
                @click="removeFile(index)"
              >
                <IconX class="size-4" />
              </Button>
            </div>
          </div>
        </div>

        <!-- Title and Category Row -->
        <div class="grid grid-cols-2 gap-4">
          <!-- Title -->
          <div class="space-y-2">
            <Label for="upload-title" class="text-sm font-medium">Document Title (Optional)</Label>
            <Input
              id="upload-title"
              v-model="title"
              placeholder="Enter document title"
            />
            <p class="text-xs text-muted-foreground">
              Auto-generated from filename if empty (for single files)
            </p>
          </div>

          <!-- Category -->
          <div class="space-y-2">
            <Label for="upload-category" class="text-sm font-medium">Category</Label>
            <Select v-model="category">
              <SelectTrigger id="upload-category">
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem v-for="cat in categories" :key="cat" :value="cat">
                  {{ cat }}
                </SelectItem>
              </SelectContent>
            </Select>
            <p class="text-xs text-muted-foreground">
              Choose the document category
            </p>
          </div>
        </div>

        <!-- Description -->
        <div class="space-y-2">
          <Label for="upload-description" class="text-sm font-medium">Description (Optional)</Label>
          <Textarea
            id="upload-description"
            v-model="description"
            placeholder="Enter a brief description"
            rows="3"
          />
          <p class="text-xs text-muted-foreground">
            {{ description.length }}/500 characters
          </p>
        </div>

        <!-- Tags -->
        <div class="space-y-2">
          <Label for="upload-tags" class="text-sm font-medium">Tags (Optional)</Label>
          <Input
            id="upload-tags"
            v-model="tags"
            placeholder="contract, important, client-name"
          />
          <p class="text-xs text-muted-foreground">
            Comma-separated tags for easy searching
          </p>
        </div>
      </div>

      <!-- Progress Bar -->
      <div v-if="uploading" class="pb-4">
        <div class="h-2 bg-muted rounded-full overflow-hidden">
          <div 
            class="h-full bg-primary transition-all duration-300"
            :style="{ width: `${uploadProgress}%` }"
          />
        </div>
        <p class="text-xs text-muted-foreground mt-2 text-center">
          Uploading... {{ uploadProgress }}%
        </p>
      </div>

      <DialogFooter class="pt-3">
        <Button type="button" variant="outline" @click="handleClose" :disabled="uploading">
          Cancel
        </Button>
        <Button type="button" @click="handleUpload" :disabled="selectedFiles.length === 0 || uploading">
          {{ uploading ? 'Uploading...' : `Upload ${selectedFiles.length > 0 ? `(${selectedFiles.length})` : 'Documents'}` }}
        </Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
</template>
