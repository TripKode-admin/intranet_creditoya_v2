function ActiveLoansLoading() {
    return (
        <div className="pt-20 p-4 sm:p-6 md:p-8 bg-gray-50 min-h-screen">
            <div className="animate-pulse">
                <div className="h-32 bg-gray-200 rounded-lg mb-6"></div>
                <div className="h-12 bg-gray-200 rounded-lg mb-4"></div>
                <div className="h-10 bg-gray-200 rounded-lg mb-6"></div>
                <div className="space-y-4">
                    {[1, 2, 3, 4, 5].map((i) => (
                        <div key={i} className="h-20 bg-gray-200 rounded-lg"></div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default ActiveLoansLoading