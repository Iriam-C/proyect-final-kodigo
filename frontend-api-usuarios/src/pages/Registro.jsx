import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

function Registro() {
    const [nombre, setNombre] = useState('');
    const [apellido, setApellido] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [mensaje, setMensaje] = useState('');

    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMensaje('');

        try {

            const respuesta = await api('/register', {
                method: 'POST',
                body: JSON.stringify({
                    name: nombre,
                    apellido,
                    email,
                    password
                })
            });

            const datos = await respuesta.json();

            if (!respuesta.ok) {
                throw new Error(datos.message || 'No se pudo crear el usuario');
            }

            localStorage.setItem('token', datos.token);
            localStorage.setItem('usuario', JSON.stringify(datos.usuario));

            setMensaje('Usuario creado correctamente');

            setTimeout(() => {
                navigate('/dashboard');
            }, 1000);
            
        } catch (error) {

            console.error('Error al registrar usuario:', error);

            setMensaje(error.message || 'No se pudo crear el usuario');

        }
    };

    return (
        <div className="min-vh-100 d-flex align-items-center justify-content-center bg-light py-4">
            <div className="card shadow p-4" style={{ width: '100%', maxWidth: '450px' }}>
                <div className="text-center mb-4">
                    <h1 className="fw-bold">Gestión de Usuarios</h1>
                    <p className="text-muted mb-0">Crea tu cuenta</p>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                        <label className="form-label">Nombre</label>
                        <input type="text" className="form-control"value={nombre} onChange={(e) => setNombre(e.target.value)} placeholder="Ingresa tu nombre" required/>
                    </div>

                    <div className="mb-3">
                        <label className="form-label">Apellido</label>
                        <input type="text" className="form-control" value={apellido} onChange={(e) => setApellido(e.target.value)} placeholder="Ingresa tu apellido" required />
                    </div>

                    <div className="mb-3">
                        <label className="form-label">Correo electrónico</label>
                        <input type="email" className="form-control" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="ejemplo@correo.com" required/>
                    </div>

                    <div className="mb-3">
                        <label className="form-label">Contraseña</label>
                        <input type="password" className="form-control" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Ingresa una contraseña" required />
                    </div>

                    <button type="submit" className="btn btn-primary w-100">Crear usuario</button>
                </form>

                {mensaje && (<div className="alert alert-info mt-3 mb-0">{mensaje}</div>)}

                <div className="text-center mt-3">
                    <span className="text-muted">¿Ya tienes una cuenta? </span>
                    <button type="button" className="btn btn-link p-0" onClick={() => navigate('/login')}>Iniciar sesión</button>
                </div>
            </div>
        </div>
    );
}

export default Registro;

