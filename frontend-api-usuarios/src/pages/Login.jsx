import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [mensaje, setMensaje] = useState('');
    const [cargando, setCargando] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        setCargando(true);
        setMensaje('');

        try {

            const respuesta = await api('/login', {
                method: 'POST',
                body: JSON.stringify({email, password
                })
            });

            const datos = await respuesta.json();

            if (!respuesta.ok) {
                throw new Error(datos.message || 'Correo o contraseña incorrectos');
            }

            localStorage.setItem('token', datos.token);
            localStorage.setItem('usuario', JSON.stringify(datos.usuario));

            navigate('/dashboard');

        }

        catch (error) {

            setMensaje(error.message || 'Correo o contraseña incorrectos');

            setCargando(false);

        }finally {
            setCargando(false);
        }
    };

    return (
    <div className="container-fluid p-0 min-vh-100">
        <div className="row g-0 min-vh-100">
            <div className="col-lg-5 d-none d-lg-flex align-items-center p-5 text-white" style={{ background: 'linear-gradient(135deg, #0f172a 0%, #1e1b4b 100%)' }}>
             <h1 className="fw-bold display-5">Gestión de Usuarios</h1>
            </div>

            <div className="col-lg-7 d-flex align-items-center justify-content-center p-4 bg-white">
                <div className="w-100" style={{ maxWidth: '400px' }}>
                    <h2 className="fw-bold mb-1">Inicia sesión</h2>
                    <p className="text-muted small mb-4">Ingresa tus credenciales para continuar</p>

                    <form onSubmit={handleSubmit}>
                        <div className="mb-3">
                            <label className="form-label small fw-semibold">Correo electrónico</label>
                            <input type="email" className="form-control" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="tucorreo@domi.com" required/>
                        </div>

                        <div className="mb-4">
                            <label className="form-label small fw-semibold">Contraseña</label>
                            <input type="password" className="form-control" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" required/>
                        </div>

                        <button type="submit" className="btn btn-primary w-100 py-2 fw-semibold" disabled={cargando}>
                            {cargando ? 'Verificando...' : 'Iniciar sesión'}
                        </button>
                    </form>

                    {mensaje && (
                        <div className="alert alert-danger mt-3 py-2 text-center small">{mensaje}</div>
                    )}

                    <div className="text-center mt-4 pt-3 border-top">
                        <span className="text-muted small">¿No tienes una cuenta?{' '}</span>
                        <button type="button" className="btn btn-link p-0 small fw-semibold text-decoration-none" onClick={() => navigate('/registro')}>
                            Crear cuenta
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </div>
  );
}

export default Login;
