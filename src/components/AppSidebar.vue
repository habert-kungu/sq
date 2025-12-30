<script setup lang="ts">
import {
  IconBriefcase,
  IconBuildingBank,
  IconCalendarTime,
  IconChartBar,
  IconChecklist,
  IconCreditCard,
  IconDashboard,
  IconFileDescription,
  IconFolder,
  IconHelp,
  IconInnerShadowTop,
  IconLogout,
  IconMessageChatbot,
  IconReceipt,
  IconReport,
  IconScale,
  IconSearch,
  IconSettings,
  IconShieldCheck,
  IconTarget,
  IconUser,
  IconUsers,
  IconUsersGroup,
} from "@tabler/icons-vue"

import { RouterLink } from 'vue-router'
import NavGroup from '@/components/NavGroup.vue'
import NavMain from '@/components/NavMain.vue'
import NavSecondary from '@/components/NavSecondary.vue'
import NavUser from '@/components/NavUser.vue'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarSeparator,
} from '@/components/ui/sidebar'

const data = {
  user: {
    name: "John Doe",
    email: "john@nathanlegal.com",
    avatar: "/avatars/user.jpg",
  },
    Home:{
      title: "Dashboard",
      url: "/dashboard",
      icon: IconDashboard,
    },
  
  // 📊 Workspace
  workspace: [
    {
      title: "AI Assistant",
      url: "/ai-assistant",
      icon: IconMessageChatbot,
    },
    {
      title: "Contract Review AI",
      url: "/contract-review",
      icon: IconFileDescription,
    },
  ],
  
  // 👥 Client Management
  clientManagement: [
    {
      title: "Leads",
      url: "/leads",
      icon: IconTarget,
    },
    {
      title: "Clients",
      url: "/clients",
      icon: IconBriefcase,
    },
    {
      title: "Matters",
      url: "/matters",
      icon: IconFolder,
    },
    {
      title: "Tasks",
      url: "/tasks",
      icon: IconChecklist,
    },
  ],
  
  // ⚖️ Compliance & Operations
  compliance: [
    {
      title: "KYC Management",
      url: "/kyc",
      icon: IconShieldCheck,
    },
    {
      title: "Knowledge Base",
      url: "/knowledge-base",
      icon: IconScale,
    },
    {
      title: "Reports",
      url: "/reports",
      icon: IconReport,
    },
  ],
  
  // 💰 Financial Management
  financial: [
    {
      title: "Time & Expenses",
      url: "/time-expenses",
      icon: IconCalendarTime,
    },
    {
      title: "Billing",
      url: "#",
      icon: IconCreditCard,
      isActive: false,
      items: [
        {
          title: "Invoices",
          url: "/billing/invoices",
        },
        {
          title: "Payments",
          url: "/billing/payments",
        },
        {
          title: "Trust Accounts",
          url: "/billing/trust-accounts",
          icon: IconBuildingBank,
        },
      ],
    },
  ],
  
  // 🔧 System
  system: [
    {
      title: "Employees",
      url: "/employees",
      icon: IconUsersGroup,
    },
    {
      title: "Admin Panel",
      url: "/admin",
      icon: IconSettings,
    },
  ],
  
  // Secondary navigation
  navSecondary: [
    {
      title: "Settings",
      url: "/settings",
      icon: IconSettings,
    },
    {
      title: "Get Help",
      url: "/help",
      icon: IconHelp,
    },
    {
      title: "Search",
      url: "#",
      icon: IconSearch,
    },
  ],
}
</script>

<template>
  <Sidebar collapsible="icon">
    <SidebarHeader>
      <SidebarMenu>
        <SidebarMenuItem>
          <SidebarMenuButton
            as-child
            class="data-[slot=sidebar-menu-button]:!p-1.5"
          >
            <RouterLink to="/dashboard">
              <IconInnerShadowTop class="!size-5" />
              <span class="text-base font-semibold">Nathan Legal</span>
            </RouterLink>
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarMenu>
    </SidebarHeader>
    
    <SidebarContent>
      <!-- Dashboard -->
      <SidebarGroup>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton as-child tooltip="Dashboard">
              <RouterLink to="/dashboard">
                <IconDashboard />
                <span>Dashboard</span>
              </RouterLink>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarGroup>
      
      <!-- Workspace -->
      <NavGroup label="Workspace" :items="data.workspace" />
      
      <!-- Client Management -->
      <NavGroup label="Client Management" :items="data.clientManagement" />
      
      <!-- Compliance & Operations -->
      <NavGroup label="Compliance" :items="data.compliance" />
      
      <!-- Financial Management -->
      <NavGroup label="Financial" :items="data.financial" />
      
      <SidebarSeparator />
      
      <!-- System -->
      <NavGroup label="System" :items="data.system" />
      
      <!-- Secondary Navigation -->
      <NavSecondary :items="data.navSecondary" class="mt-auto" />
    </SidebarContent>
    
    <SidebarFooter>
      <NavUser :user="data.user" />
    </SidebarFooter>
  </Sidebar>
</template>
