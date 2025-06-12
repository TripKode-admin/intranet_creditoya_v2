"use client";

import ContentActivesLoans from "@/components/dashboard/active/SupraContent";
import SidebarLayout from "@/components/gadgets/sidebar/LayoutSidebar";

function ActiveSection() {
    return (
        <SidebarLayout>
            <ContentActivesLoans />
        </SidebarLayout>
    );
}

export default ActiveSection;