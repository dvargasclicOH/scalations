import { createContext, useState, useEffect } from "react";

export const KustomerContext = createContext();  // ✅ Exporta el contexto correctamente

export const KustomerProvider = ({ children }) => {
    const [context, setContext] = useState(null);

    useEffect(() => {
        const checkKustomer = () => {
            if (window.Kustomer) {
                console.log("✅ Kustomer está disponible.");
                window.Kustomer.initialize((contextData) => {
                    if (contextData) {
                        console.log("📩 Contexto recibido:", contextData);
                        setContext((prev) => prev || contextData);
                    } else {
                        console.warn("⚠️ Kustomer.initialize devolvió NULL.");
                    }
                });
            } else {
                console.warn("⚠️ Kustomer no disponible. Reintentando...");
                setTimeout(checkKustomer, 1000);
            }
        };

        checkKustomer();
    }, []);

    return (
        <KustomerContext.Provider value={{ context }}>
            {children}
        </KustomerContext.Provider>
    );
};

export default KustomerProvider;
