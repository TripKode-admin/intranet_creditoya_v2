"use client"

import ContentActivePage from "@/components/dashboard/active/ContentArea";
import HeroLoanState from "@/components/dashboard/active/HeroLoanState";
import ActiveSearchInput from "@/components/dashboard/active/SearchInput";
import ActiveTabNavigation from "@/components/dashboard/active/TabNavigation";
import WarningBanner from "../WarningBanner";

function ContentActivesLoans() {
    return (
        <div className="pt-20 p-4 sm:p-6 md:p-8 bg-gray-50 min-h-screen overflow-scroll">
            <HeroLoanState />

            <WarningBanner
                title="Advertencia"
                message="Este módulo podría presentar errores menores. Pronto estará corregido."
            />

            {/* Tab navigation */}
            <ActiveTabNavigation />

            <ActiveSearchInput />

            {/* Content area */}
            <ContentActivePage />
        </div>
    )
}

export default ContentActivesLoans