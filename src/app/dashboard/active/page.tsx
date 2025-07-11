"use client";

import ActiveLoansLoading from "@/components/dashboard/active/Loading";
import ContentActivesLoans from "@/components/dashboard/active/SupraContent";
import SidebarLayout from "@/components/gadgets/sidebar/LayoutSidebar";
import { Suspense } from "react";

function ActiveSection() {
    return (
        <SidebarLayout>
            <Suspense fallback={<ActiveLoansLoading />}>
                <ContentActivesLoans />
            </Suspense>
        </SidebarLayout>
    );
}

export default ActiveSection;