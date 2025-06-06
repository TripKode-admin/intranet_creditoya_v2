import { ModalWrapper } from "../Modal";

interface AdjustAmountModalProps {
    newAmount: string;
    adjustReason: string;
    setNewAmount: (value: string) => void;
    setAdjustReason: (value: string) => void;
    handleAdjust: () => void;
    setAdjustModalOpen: (isOpen: boolean) => void;
}

// Función para formatear número a pesos colombianos
const formatToCOP = (value: string): string => {
    // Remover todo excepto números
    const numericValue = value.replace(/[^\d]/g, '');
    
    if (!numericValue) return '';
    
    // Convertir a número y formatear con separadores de miles
    const number = parseInt(numericValue);
    return new Intl.NumberFormat('es-CO', {
        style: 'currency',
        currency: 'COP',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
    }).format(number);
};

// Función para obtener solo el valor numérico
const getNumericValue = (formattedValue: string): string => {
    return formattedValue.replace(/[^\d]/g, '');
};

export const AdjustAmountModal = ({
    newAmount,
    adjustReason,
    setNewAmount,
    setAdjustReason,
    handleAdjust,
    setAdjustModalOpen
}: AdjustAmountModalProps) => {
    
    const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const inputValue = e.target.value;
        const numericValue = getNumericValue(inputValue);
        
        // Guardar solo el valor numérico en el estado
        setNewAmount(numericValue);
    };

    return (
        <ModalWrapper onClose={() => setAdjustModalOpen(false)}>
            <div className="relative bg-white p-6 rounded-lg shadow-lg z-50 w-full max-w-md mx-auto">
                <h2 className="text-lg font-bold mb-4">Ajustar Monto</h2>
                <input
                    type="text"
                    className="w-full border border-gray-300 p-2 rounded mb-4 focus:outline-none focus:border-blue-500"
                    placeholder="Nuevo monto"
                    value={newAmount ? formatToCOP(newAmount) : ''}
                    onChange={handleAmountChange}
                />
                <textarea
                    className="w-full border border-gray-300 p-2 rounded focus:outline-none focus:border-blue-500"
                    placeholder="Motivo del ajuste"
                    value={adjustReason}
                    onChange={(e) => setAdjustReason(e.target.value)}
                />
                <div className="flex justify-end mt-4">
                    <button
                        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
                        onClick={handleAdjust}
                    >
                        Listo
                    </button>
                </div>
            </div>
        </ModalWrapper>
    );
};