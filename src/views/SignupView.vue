<script setup lang="ts">
import { IconScale } from '@tabler/icons-vue'
import SignupForm from '@/components/new-york-v4/blocks/signup-02/components/SignupForm.vue'
</script>

<template>
  <div class="grid min-h-svh lg:grid-cols-2">
    <div class="flex flex-col gap-4 p-6 md:p-10">
      <div class="flex justify-center gap-2 md:justify-start">
        <a href="#" class="flex items-center gap-2 font-medium">
          <div class="flex h-6 w-6 items-center justify-center rounded-md bg-primary text-primary-foreground">
            <IconScale class="size-4" />
          </div>
           Legal
        </a>
      </div>
      <div class="flex flex-1 items-center justify-center">
        <div class="w-full max-w-xs">
          <SignupForm />
        </div>
      </div>
    </div>
    <div class="relative hidden bg-muted lg:block">
      <div class="absolute inset-0 flex items-center justify-center">
        <div class="flex h-32 w-32 items-center justify-center rounded-full bg-muted-foreground/10">
          <IconScale class="h-16 w-16 text-muted-foreground/40" />
        </div>
      </div>
    </div>
  </div>
</template>
