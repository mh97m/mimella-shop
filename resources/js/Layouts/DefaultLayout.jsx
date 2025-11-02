import AppSidebarContent from "@/Components/AppSidebarContent";
import AppTeamManager from "@/Components/AppTeamManager";
import AppUserManager from "@/Components/AppUserManager";

import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
} from "@/Components/shadcn/ui/breadcrumb";
import { Separator } from "@/Components/shadcn/ui/separator";
import {
    Sidebar,
    SidebarFooter,
    SidebarHeader,
    SidebarInset,
    SidebarProvider,
    SidebarRail,
    SidebarTrigger,
} from "@/Components/shadcn/ui/sidebar";
import { Toaster } from "@/Components/shadcn/ui/sonner";
import ExitModal from "@/Components/theme/ExitModal";
import Header from "@/Components/theme/Header";
import NavbarBottom from "@/Components/theme/NavbarBottom";
import NavbarSide from "@/Components/theme/NavbarSide";
import { useSeoMetaTags } from "@/Composables/useSeoMetaTags";
import { usePage } from "@inertiajs/react";

function AppSidebar() {
    const { props } = usePage();

    return (
        <Sidebar collapsible="icon" className="border-r">
            <SidebarHeader>
                {props.jetstream.hasTeamFeatures && <AppTeamManager />}
            </SidebarHeader>
            <AppSidebarContent />
            <SidebarFooter>
                <AppUserManager />
            </SidebarFooter>
            <SidebarRail />
        </Sidebar>
    );
}

export default function AppLayout({ title, children }) {
    useSeoMetaTags({ title });

    return (
        <>
            <Header />
            <div
                className="fixed inset-0 bg-black/60 z-40 opacity-0 pointer-events-none transition-all duration-300"
                id="sidebarOverlay"
            >
            </div>
            <NavbarSide />

            <main
                className="max-w-7xl mx-auto py-4 pb-20 min-h-[calc(100vh-3.5rem)] px-0 mx-0 pr-4"
                id="ajax-content"
            >
                {children}
            </main>

            <NavbarBottom />

            <ExitModal />
        </>
    );
}
