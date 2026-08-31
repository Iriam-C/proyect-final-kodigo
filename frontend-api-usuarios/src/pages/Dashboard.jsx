import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

function Dashboard() {
    const [usuarios, setUsuarios] = useState([]);
    const [mensaje, setMensaje] = useState('');
    const [form, setForm] = useState({name: '', apellido: '', email: '', password: ''});
    const [idEditando, setIdEditando] = useState(null);
    const [showModal, setShowModal] = useState(false);

    const navigate = useNavigate();

    useEffect(() => {cargarUsuarios();}, []);

    const cargarUsuarios = async () => {
        try {
            const token = localStorage.getItem('token');

            const respuesta = await api.get('/usuarios', {headers: {Authorization: `Bearer ${token}`}});

            setUsuarios(respuesta.data.usuarios);} catch (error) {console.error('Error cargando usuarios:', error);
            setMensaje('No se pudieron cargar los usuarios');
        }
    };

    const handleChange = (e) => {setForm({...form, [e.target.name]: e.target.value});};

    const abrirModalCrear = () => {setIdEditando(null);
        setForm({name: '', apellido: '', email: '', password: ''});
        setMensaje('');
        setShowModal(true);
    };

    const abrirModalEditar = (usuario) => {
        setIdEditando(usuario.id);
        setForm({name: usuario.name, apellido: usuario.apellido, email: usuario.email, password: ''});
        setMensaje('');
        setShowModal(true);
    };

    const cerrarModal = () => {setShowModal(false);};

    const guardarUsuario = async (e) => {e.preventDefault();

        try {
            const token = localStorage.getItem('token');
            const headers = {Authorization: `Bearer ${token}`};

            if (idEditando) {
                await api.put(`/usuarios/${idEditando}`, {name: form.name, apellido: form.apellido, email: form.email}, { headers });

                setMensaje('Usuario actualizado correctamente');
            } else {
                await api.post('/usuarios', form, { headers });
                setMensaje('Usuario creado correctamente');
            }

            cerrarModal();
            cargarUsuarios();
        } 
        catch (error) {console.error('Error en la petición:', error);
            setMensaje(error.response?.data?.message ||'Ocurrió un error al guardar');
        }
    };

    const eliminarUsuario = async (id) => {
        const confirmar = window.confirm('¿Estás seguro de eliminar este usuario?');

        if (!confirmar) return;

        try {
            const token = localStorage.getItem('token');

            await api.delete(`/usuarios/${id}`, {headers: {Authorization: `Bearer ${token}`}});

            setMensaje('Usuario eliminado correctamente');
            cargarUsuarios();
        } 
        catch (error) {setMensaje(error.response?.data?.message ||'No se pudo eliminar');}
    };

    const cerrarSesion = () => {localStorage.removeItem('token'); navigate('/login');};

    return (
        <div className="min-vh-100 bg-light d-flex flex-column">
            <nav className="navbar navbar-dark bg-dark px-4 shadow-sm">
                <span className="navbar-brand fw-bold">Administración de Usuarios</span>

                <button onClick={cerrarSesion} className="btn btn-outline-light btn-sm"> Cerrar sesión</button>
            </nav>

            <div className="container px-4 py-5 flex-grow-1">
                {mensaje && (<div className="alert alert-info py-2 small mb-4">{mensaje}</div>)}

                <div className="d-flex justify-content-between align-items-center mb-4">
                    <h2 className="fw-bold text-dark mb-0">Lista de usuarios</h2>
                    <button type="button" className="btn btn-primary px-4 fw-semibold shadow-sm" onClick={abrirModalCrear}>Nuevo usuario</button>
                </div>

                <div className="card border-0 shadow-sm rounded-3 p-4">
                    {usuarios.length === 0 ? (<p className="text-muted small text-center py-4">No hay usuarios registrados.</p>) : (
                      <div className="table-responsive">
                        <table className="table table-hover align-middle">
                          <thead className="table-light">
                            <tr>
                                <th>Nombre completo</th>
                                <th>Correo electrónico</th>
                                <th className="text-end">Acciones</th>
                            </tr>
                          </thead>

                        <tbody>
                            {usuarios.map((usuario) => (
                                <tr key={usuario.id}>
                                    <td className="fw-semibold">{usuario.name} {usuario.apellido}</td>
                                    <td className="text-muted small">{usuario.email}</td>
                                    <td className="text-end">

                                        <button type="button" className="btn btn-sm btn-outline-primary me-2 px-3" onClick={() => abrirModalEditar(usuario)}>Editar</button>
                                        
                                        <button type="button" className="btn btn-sm btn-outline-danger px-3" onClick={() => eliminarUsuario(usuario.id)}>Eliminar</button>
                                    </td>
                                </tr>
                                    ))}
                        </tbody>
                        </table>
                        </div>
                    )}
                </div>
            </div>

            {showModal && (
                <div className="modal fade show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
                    <div className="modal-dialog modal-dialog-centered">
                      <div className="modal-content border-0 shadow">
                         <div className="modal-header bg-dark text-white">
                            <h5 className="modal-title fw-bold">{idEditando ? 'Editar usuario' : 'Crear nuevo usuario'}</h5>

                                <button type="button" className="btn-close btn-close-white" onClick={cerrarModal}></button>
                         </div>

                            <form onSubmit={guardarUsuario}>
                                <div className="modal-body p-4">
                                    <div className="mb-3">
                                        <label className="form-label small fw-semibold">Nombre</label>
                                        <input type="text" name="name" className="form-control" value={form.name} onChange={handleChange} required/>
                                    </div>

                                    <div className="mb-3">
                                        <label className="form-label small fw-semibold">Apellido</label>
                                        <input type="text" name="apellido" className="form-control" value={form.apellido} onChange={handleChange} required/>
                                    </div>

                                    <div className="mb-3">
                                        <label className="form-label small fw-semibold">Correo electrónico</label>
                                        <input type="email" name="email"className="form-control" value={form.email} onChange={handleChange} required/>
                                    </div>

                                    {!idEditando && (
                                        <div className="mb-3">
                                            <label className="form-label small fw-semibold"> Contraseña</label>
                                            <input type="password" name="password" className="form-control" value={form.password} onChange={handleChange}required/>
                                        </div>
                                    )}
                                </div>

                                <div className="modal-footer bg-light px-4 py-3">
                                    <button type="button"className="btn btn-outline-secondary px-4" onClick={cerrarModal}>Cancelar</button>

                                    <button type="submit" className="btn btn-primary px-4 fw-semibold">{idEditando ? 'Guardar' : 'Crear'}</button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Dashboard;
