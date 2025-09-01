// src/app/contexts/AuthContext.tsx
'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export interface Funcion {
  nombreFuncion: string;
  icono: string;
}

export interface Rol {
  nombreRol: string;
  funciones: Funcion[];
}

export interface Usuario {
  idUsuario: number;
  usuario: string;
  nombre: string;
  apellido: string;
  roles: Rol[];
}

interface AuthResponse {
  mensaje: string;
  usuario: Usuario;
}

interface AuthContextType {
  usuario: Usuario | null;
  rolActual: Rol | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
  cambiarRol: (nombreRol: string) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth debe ser usado dentro de un AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [usuario, setUsuario] = useState<Usuario | null>(null);
  const [rolActual, setRolActual] = useState<Rol | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Recuperar datos de localStorage al cargar
  useEffect(() => {
    const storedUser = localStorage.getItem('usuario');
    const storedRole = localStorage.getItem('rolActual');
    
    if (storedUser) {
      const user = JSON.parse(storedUser);
      setUsuario(user);
      
      if (storedRole) {
        const role = JSON.parse(storedRole);
        setRolActual(role);
      } else {
        // Si no hay rol almacenado, usar el primer rol (Socio por defecto)
        const socioRole = user.roles.find((rol: Rol) => rol.nombreRol === 'Socio');
        if (socioRole) {
          setRolActual(socioRole);
          localStorage.setItem('rolActual', JSON.stringify(socioRole));
        }
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (username: string, password: string): Promise<boolean> => {
    try {
      setIsLoading(true);
      
      // Aquí harías la llamada real a tu API
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      if (response.ok) {
        const authResponse: AuthResponse = await response.json();
        const { usuario: userData } = authResponse;
        
        setUsuario(userData);
        
        // Establecer rol inicial como "Socio" (todos son socios)
        const socioRole = userData.roles.find(rol => rol.nombreRol === 'Socio');
        if (socioRole) {
          setRolActual(socioRole);
          localStorage.setItem('rolActual', JSON.stringify(socioRole));
        }
        
        // Guardar en localStorage
        localStorage.setItem('usuario', JSON.stringify(userData));
        
        return true;
      }
      
      return false;
    } catch (error) {
      console.error('Error en login:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUsuario(null);
    setRolActual(null);
    localStorage.removeItem('usuario');
    localStorage.removeItem('rolActual');
  };

  const cambiarRol = (nombreRol: string) => {
    if (!usuario) return;
    
    const nuevoRol = usuario.roles.find(rol => rol.nombreRol === nombreRol);
    if (nuevoRol) {
      setRolActual(nuevoRol);
      localStorage.setItem('rolActual', JSON.stringify(nuevoRol));
    }
  };

  const value: AuthContextType = {
    usuario,
    rolActual,
    isAuthenticated: !!usuario,
    isLoading,
    login,
    logout,
    cambiarRol,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};