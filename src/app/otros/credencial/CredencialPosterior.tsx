'use client'

import React from 'react'

const CredencialPosterior = React.forwardRef<HTMLDivElement>((_, ref) => {
    return (
        <div
            ref={ref}
            className="w-[1004px] h-[650px] bg-gradient-to-r from-sky-600 to-blue-800 text-white rounded-xl shadow-2xl p-8 relative font-sans flex flex-col justify-between"
        >

            <div className="text-center mt-4">
                <p className="text-2xl font-medium mb-2 leading-relaxed text-">
                    El portador del presente credencial es miembro autorizado del Comité de Agua Potable &quot;Catachilla Alta&quot;.
                    Se compromete a cumplir con las normas y reglamentos de la asociación, garantizando el uso responsable del agua potable.
                    La gestión eficiente y segura del recurso hídrico es responsabilidad de todos los socios.
                </p>
            </div>

            <div className="flex flex-col items-center mt-6">
                <div className="border-t-2 border-white w-1/3 my-4"></div>
                <p className="text-sm">Presidente</p>
            </div>

            <div className="flex justify-around mt-12 mb-4">
                <div className="flex flex-col items-center">
                    <div className="border-t-2 border-white w-64 my-2"></div>
                    <p className="text-sm">Operador</p>
                </div>
                <div className="flex flex-col items-center">
                    <div className="border-t-2 border-white w-64 my-2"></div>
                    <p className="text-sm">Cajero</p>
                </div>
            </div>

        </div>
    )
}
)

CredencialPosterior.displayName = 'CredencialPosterior'
export default CredencialPosterior
