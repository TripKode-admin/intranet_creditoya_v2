"use client"

import HeroLoanState from "@/components/dashboard/active/HeroLoanState";
import ActiveSearchInput from "@/components/dashboard/active/SearchInput";
import WarningBanner from "../WarningBanner";
import useActives from "@/hooks/dashboard/useActives";
import ActiveTabNavigation from "./TabNavigation";
import ContentActivePage from "./ContentArea";

function ContentActivesLoans() {
    const {
        activeTab,
        setActiveTab,
        UpdateIndicator,
        error,
        isLoading,
        loanData,
        formatCurrency,
        formatDate,
        searchQuery,
        handlePageChange,
        pagination,
        getPageNumbers,
        clearSearch,
        handleSearchChange
    } = useActives();

    return (
        <div className="pt-20 p-4 sm:p-6 md:p-8 bg-gray-50 min-h-screen overflow-scroll">
            <HeroLoanState />

            {/* Tab navigation */}
            <ActiveTabNavigation
                activeTab={activeTab}
                setActiveTab={setActiveTab}
                UpdateIndicator={UpdateIndicator}
            />

            <ActiveSearchInput
                searchQuery={searchQuery}
                handleSearchChange={handleSearchChange}
                clearSearch={clearSearch} />

            {/* Content area */}
            <ContentActivePage
                error={error}
                isLoading={isLoading}
                loanData={loanData}
                formatCurrency={formatCurrency}
                formatDate={formatDate}
                searchQuery={searchQuery}
                handlePageChange={handlePageChange}
                pagination={pagination}
                getPageNumbers={getPageNumbers}
            />
        </div>
    )
}

export default ContentActivesLoans