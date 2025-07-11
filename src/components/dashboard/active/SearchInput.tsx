import { FiSearch, FiX } from "react-icons/fi"

interface ActiveSearchInputProps {
    searchQuery: string;
    handleSearchChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    clearSearch: () => void;
}

function ActiveSearchInput({ 
    searchQuery, 
    handleSearchChange, 
    clearSearch 
}: ActiveSearchInputProps) {
    return (
        <div className="relative mb-6">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FiSearch className="h-5 w-5 text-gray-400" />
            </div>
            <input
                type="text"
                className="block w-full pl-10 pr-10 py-3 border border-gray-200 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                placeholder="Busca por Numero de documento / Nombre completo / ID solicitud"
                value={searchQuery}
                onChange={handleSearchChange}
            />
            {searchQuery && (
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                    <button
                        onClick={clearSearch}
                        className="text-gray-400 hover:text-gray-600"
                        aria-label="Limpiar búsqueda"
                    >
                        <FiX className="h-5 w-5" />
                    </button>
                </div>
            )}
        </div>
    )
}

export default ActiveSearchInput