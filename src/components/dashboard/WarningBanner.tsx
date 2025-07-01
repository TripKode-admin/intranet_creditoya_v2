import { AlertTriangle } from "lucide-react";

interface WarningBannerProps {
    title?: string;
    message?: string;
    className?: string;
}

function WarningBanner({ 
    title = "Advertencia", 
    message = "Este módulo podría presentar errores menores. Estamos trabajando en solucionarlo.",
    className = ""
}: WarningBannerProps) {
    return (
        <div className={`bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-4 ${className}`}>
            <div className="flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 text-yellow-600 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                    <span className="text-sm font-medium text-yellow-800">{title}: </span>
                    <span className="text-sm text-yellow-700">{message}</span>
                </div>
            </div>
        </div>
    );
}

export default WarningBanner;