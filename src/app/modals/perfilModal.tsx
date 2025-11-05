'use client'

import React, { useState, Fragment, useRef, useEffect } from 'react';
import { Dialog, DialogPanel, DialogTitle, Transition, TransitionChild } from "@headlessui/react";
import { User, Phone, MapPin, Calendar, Droplet, X } from 'lucide-react';
import { toast } from 'react-hot-toast'
import ruta from '@/api/axios';

interface ModalProps {
    idSocio?: number | null;
    isOpen: boolean;
    onClose: () => void;
}

interface Medidor {
    idMedidor: number;
    ubicacion: {
        direccion: string;
        descripcion: string;
    };
}

interface Rol {
    idRol: number;
    nombreRol: string;
    descripcion: string;
}

interface Socio {
    idUsuario: number;
    nombre: string;
    apellidos: string;
    ci: string;
    telefono: string;
    usuario: string;
    creadoEn: string;
    medidores: Medidor[];
    roles: Rol[];
}

const PerfilUsuarioModal = ({ isOpen, onClose, idSocio }: ModalProps) => {
    const [socio, setSocio] = useState<Socio>({
        idUsuario: 0,
        nombre: '',
        apellidos: '',
        ci: '',
        telefono: '',
        usuario: '',
        creadoEn: '',
        medidores: [],
        roles: []
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!isOpen) return;
        const obtenerDatos = async () => {
            try {
                const { data } = await ruta.post<Socio>('/sesion/perfil-socio', {
                    idSocio
                });
                setSocio(data);
            } catch (err: any) {
                toast.error(err.response.data.mensaje || 'Error al obtener datos.');
            } finally {
                setLoading(false);
            }
        };

        obtenerDatos();
    }, [isOpen, idSocio]);

    useEffect(() => {
  console.log("Efecto ejecutado", { isOpen, idSocio });
}, [isOpen]);


    if (loading) return <p>Cargando datos...</p>;

    const abrirVistaCredencial = () => {
        const data = {
            idUsuario: socio.idUsuario,
            nombre: socio.nombre,
            apellidos: socio.apellidos,
            direcciones: socio.medidores.map(m => m.ubicacion.direccion)
        }

        const params = new URLSearchParams({
            data: JSON.stringify(data)
        })

        window.open(`/otros/credencial?${params.toString()}`, '_blank')
    }

    return (
        <Transition show={isOpen} as={Fragment}>
            <Dialog onClose={onClose} className="relative z-[999]">
                <TransitionChild
                    as={Fragment}
                    enter="ease-out duration-300"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in duration-200"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                >
                    <div className="fixed inset-0 bg-black/50 backdrop-blur-md" aria-hidden="true" />
                </TransitionChild>

                <div className="fixed inset-0 flex items-center justify-center p-4">
                    <TransitionChild
                        as={Fragment}
                        enter="ease-out duration-300"
                        enterFrom="opacity-0 scale-95"
                        enterTo="opacity-100 scale-100"
                        leave="ease-in duration-200"
                        leaveFrom="opacity-100 scale-100"
                        leaveTo="opacity-0 scale-95"
                    >
                        <DialogPanel className="max-w-4xl w-full bg-white rounded-2xl shadow-2xl max-h-[80vh] overflow-hidden flex flex-col">
                            {/* Header */}
                            <div className="sticky top-0 bg-gradient-to-r from-blue-600 to-blue-700 px-8 py-4 flex items-center justify-between border-b border-blue-500">
                                <div className="flex items-center space-x-3">
                                    <div className="p-2 bg-white/20 rounded-xl backdrop-blur-sm">
                                        <User size={28} className="text-white" />
                                    </div>
                                    <DialogTitle className="text-2xl font-bold text-white">
                                        Perfil de Usuario
                                    </DialogTitle>
                                </div>
                                <button
                                    onClick={onClose}
                                    className="text-white hover:bg-white/20 p-2 rounded-xl transition-all duration-200 hover:scale-110"
                                >
                                    <X size={24} />
                                </button>
                            </div>

                            {/* Contenido del modal */}
                            <div className="flex-1 overflow-y-auto bg-gradient-to-br from-gray-50 to-blue-50/30">
                                <div className="p-8 space-y-4">
                                    <div className="flex items-start space-x-6 pb-4 border-b border-gray-200">
                                        <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white text-3xl font-bold shadow-lg flex-shrink-0">
                                            {socio.nombre.charAt(0)}{socio.apellidos.charAt(0)}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <h2 className="text-xl font-bold text-gray-900 mb-3">
                                                {socio.nombre} {socio.apellidos}
                                            </h2>
                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                                {socio.roles.map((r) => (
                                                    <div
                                                        key={r.idRol}
                                                        className="p-3 bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-200"
                                                    >
                                                        <p className="text-gray-900 font-semibold text-lg mb-1">{r.nombreRol}</p>
                                                        <p className="text-gray-600 text-sm leading-relaxed">{r.descripcion}</p>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                                        <div className="bg-gradient-to-r from-gray-50 to-gray-100 px-6 py-4 border-b border-gray-200">
                                            <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                                                <User className="mr-3 text-blue-600" size={22} />
                                                Información Personal
                                            </h3>
                                        </div>
                                        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div className="space-y-2">
                                                <label className="text-sm font-medium text-gray-500 uppercase tracking-wide">CI</label>
                                                <p className="text-gray-900 font-semibold text-lg">{socio.ci}</p>
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-sm font-medium text-gray-500 uppercase tracking-wide">Teléfono</label>
                                                <p className="text-gray-900 font-semibold text-lg flex items-center">
                                                    <Phone size={18} className="mr-3 text-blue-600" />
                                                    {socio.telefono}
                                                </p>
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-sm font-medium text-gray-500 uppercase tracking-wide">Usuario</label>
                                                <p className="text-gray-900 font-semibold text-lg">{socio.usuario}</p>
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-sm font-medium text-gray-500 uppercase tracking-wide">Miembro desde</label>
                                                <p className="text-gray-900 font-semibold text-lg flex items-center">
                                                    <Calendar size={18} className="mr-3 text-blue-600" />
                                                    {new Date(socio.creadoEn).toLocaleDateString('es-BO')}
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                                        <div className="bg-gradient-to-r from-gray-50 to-gray-100 px-6 py-4 border-b border-gray-200">
                                            <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                                                <Droplet className="mr-3 text-blue-600" size={22} />
                                                Medidores
                                            </h3>
                                        </div>
                                        <div className="p-6 space-y-6">
                                            {socio.medidores.map((m) => (
                                                <div key={m.idMedidor} className="border border-gray-200 rounded-xl overflow-hidden hover:shadow-md transition-shadow duration-200">
                                                    <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
                                                        <div className="flex items-center justify-between">
                                                            <div className="flex items-center space-x-3">
                                                                <p className="text-xl font-bold text-gray-900">MED-{m.idMedidor}</p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="p-6 bg-gradient-to-r from-blue-50/50 to-blue-100/30">
                                                        <div className="flex items-start">
                                                            <MapPin className="mr-4 text-blue-600 flex-shrink-0 mt-1" size={20} />
                                                            <div>
                                                                <p className="text-gray-900 font-semibold text-lg mb-1">{m.ubicacion.direccion}</p>
                                                                <p className="text-gray-600 leading-relaxed">{m.ubicacion.descripcion}</p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Footer */}
                            <div className="sticky bottom-0 border-t border-gray-200 bg-white px-8 py-2">
                                <div className="flex justify-end space-x-4">
                                    <button
                                        onClick={abrirVistaCredencial}
                                        className="p-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-medium rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5">
                                        Ver Credencial
                                    </button>
                                    <button
                                        onClick={onClose}
                                        className="px-4 py-3 text-gray-700 font-medium hover:bg-gray-100 rounded-xl transition-all duration-200 border border-gray-300 hover:border-gray-400 hover:shadow-sm"
                                    >
                                        Cerrar
                                    </button>
                                </div>
                            </div>
                        </DialogPanel>
                    </TransitionChild>
                </div>
            </Dialog>
        </Transition>
    );
};

export default PerfilUsuarioModal;