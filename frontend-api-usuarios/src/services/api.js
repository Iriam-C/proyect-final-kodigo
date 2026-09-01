const API_URL = 'http://127.0.0.1:8000/api';

const api = async (ruta, opciones = {}) => {
    const token = localStorage.getItem('token');

    const respuesta = await fetch(`${API_URL}${ruta}`, {
        ...opciones,
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            ...(token && { 'Authorization': `Bearer ${token}` }),
            ...opciones.headers
        }
    });

    return respuesta;
};

export default api;