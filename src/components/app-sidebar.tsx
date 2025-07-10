import * as React from "react"
import { GalleryVerticalEnd } from "lucide-react"

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarRail,
} from "@/components/ui/sidebar"

// This is sample data.
const data = {
  navMain: [
  
    {
      title: "Agents",
      url: "#",
      items: [
        {
          title: "Tous les Agents",
          url: "#",
        },
        {
          title: "Ajouter un Agent",
          url: "#",
          isActive: false,
        },
      
  
      ],
    },
     {
      title: "Départements",
      url: "#",
      items: [
        {
          title: "Tous les Départements",
          url: "#",
        },
        {
          title: "Ajouter un Département",
          url: "#",
          isActive: false,
        },
      
  
      ],
    },
    {
      title: "Fonctions",
      url: "#",
      items: [
        {
          title: "Toutes les Fonctions",
          url: "#",
        },
        {
          title: "Ajouter une Fonction",
          url: "#",
        },
        
      ],
    },
   
    {
      title: "Community",
      url: "#",
      items: [
        {
          title: "Contribution Guide",
          url: "#",
        },
      ],
    },
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <a href="#">
                <div className=" text-sidebar-primary-foreground flex aspect-square size-32 items-center justify-center rounded-xl p-4">
                  {/* <GalleryVerticalEnd className="size-4" /> */}
                  <img src="/Advans_Congo_Logo.svg" alt="" />
                </div>
                <div className="flex flex-col gap-0.5 leading-none text-sidebar-primary-foreground">
                  {/* <span className="font-medium">ADVANS Congo</span> */}
                  <span className="text-sidebar-primary">Gestion profil Agents</span>
                </div>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarMenu>
            {data.navMain.map((item) => (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton asChild>
                  <a href={item.url} className="font-medium">
                    {item.title}
                  </a>
                </SidebarMenuButton>
                {item.items?.length ? (
                  <SidebarMenuSub>
                    {item.items.map((item) => (
                      <SidebarMenuSubItem key={item.title}>
                        <SidebarMenuSubButton asChild isActive={item.isActive}>
                          <a href={item.url}>{item.title}</a>
                        </SidebarMenuSubButton>
                      </SidebarMenuSubItem>
                    ))}
                  </SidebarMenuSub>
                ) : null}
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  )
}
