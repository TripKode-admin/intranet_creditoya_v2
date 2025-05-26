"use client"

import FormDataClient from "@/components/dashboard/client/FormDataClient";
import ListLoansClient from "@/components/dashboard/client/ListLoansClient";
import SidebarLayout from "@/components/gadgets/sidebar/LayoutSidebar";

function InfoClient({ params }: { params: Promise<{ client_id: string }> }) {

    return (
        <SidebarLayout>
            <div className="p-4 md:p-12 overflow-y-auto h-full pt-20 overflow-scroll">
                <header className="mb-8">
                    <h1 className="text-xl sm:text-2xl font-medium text-gray-800">Información General</h1>
                    <p className="text-gray-500 text-sm mt-1">Investiga datos personales, historial de prestamos, edita su informacion y toma control sobre sus cuentas</p>
                </header>

                {/* Main container with improved layout */}
                <FormDataClient params={params} />
                <ListLoansClient params={params} />
            </div>
        </SidebarLayout>
    );
}

export default InfoClient;