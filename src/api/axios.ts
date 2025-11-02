/**
 * Instancia personalizada de Axios para comunicarse con el backend.
 *
 * Esta configuración establece la URL base para todas las peticiones HTTP,
 * y habilita el envío automático de cookies (incluyendo cookies HTTP-only)
 * en cada solicitud.
 *
 * Esto es necesario para mantener la sesión autenticada mediante cookies,
 * ya que el token de autenticación se almacena como cookie HTTP-only,
 * la cual no es accesible vía JavaScript.
 *
 * Uso:
 * import api from '../api/axios';
 * 
 * // Ejemplo: hacer una petición GET que incluirá automáticamente las cookies
 * api.get('/ruta-protegida')
 *    .then(response => console.log(response.data));
 */

import axios from 'axios';

const ruta = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  withCredentials: true,
});

export default ruta;
