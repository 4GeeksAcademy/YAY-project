import React, { useEffect, useState, useContext } from "react";
import { Context } from "../../store/appContext";
import { useParams, Link, useNavigate } from "react-router-dom";
import { MisEventos } from "./misEventos";
import GetUserPerfilImage from "../getUserPerfilImage";
import GetUserImages from "../getUserImagens";
import { Mapa } from "../mapa";

import "../../../styles/profile.css";
import UserInterest from "../userInterest";

const styles = {
    buttonRemove: {
        backgroundColor: 'transparent',
        color: 'black',
        fontWeight: 'bold',
        padding: '10px 15px',
        border: 'none',
        borderRadius: '4px',
        cursor: 'pointer',
        fontSize: '16px',
        marginRight: '10px',
        marginBottom: '10px',
    },
    interestButton: {
        color: 'black',
        padding: '10px 15px',
        border: 'none',
        borderRadius: '4px',
        cursor: 'pointer',
        fontSize: '16px',
        marginRight: '10px',
        marginBottom: '10px',
    },
    selectedtButton: {
        backgroundColor: '#444',
        color: 'white',
        padding: '10px 15px',
        border: 'none',
        borderRadius: '4px',
        cursor: 'pointer',
        fontSize: '16px',
        marginRight: '10px',
        marginBottom: '10px',
    },

    buttonSaveStyle: {
        backgroundColor: '#7c488f',
        color: 'white',
        padding: '10px 15px',
        border: 'none',
        borderRadius: '4px',
        cursor: 'pointer',
        fontSize: '16px',
    },
    profileHeader: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: '20px',
    },
    profileImageContainer: {
        display: 'flex',
        alignItems: 'center',
    },
    profileImage: {
        width: '50px',
        height: '50px',
        borderRadius: '50%',
        marginRight: '10px',
    },
};

export const Perfil_Usuario = () => {
    const { store, actions } = useContext(Context);
    const { userId } = useParams();
    const navigate = useNavigate();

    const [profile, setProfile] = useState({
        nombre: '',
        apellidos: '',
        fecha_nacimiento: '',
        direccion: '',
        latitud: '',
        longitud: '',
        breve_descripcion: '',
        telefono: '',
        genero: 'otro',
        email: '',
    });

    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [deleteCheckboxChecked, setDeleteCheckboxChecked] = useState(false);
    const [interesesSeleccionados, setInteresesSeleccionados] = useState(new Set());
    const [misIntereses, setMisIntereses] = useState([]); // Lista de intereses seleccionados
    const [interesesDisponibles, setInteresesDisponibles] = useState([]);
    const [activeSection, setActiveSection] = useState("informacionPersonal");
    const [showAlert, setShowAlert] = useState(false);
    const [alertMessage, setAlertMessage] = useState('');
    const [showSuccessMessage, setShowSuccessMessage] = useState(false);


    const [direccionActual, setDireccionActual] = useState('');
    const [latitudActual, setLatitudActual] = useState(null);
    const [longitudActual, setLongitudActual] = useState(null);

    useEffect(() => {
        const idToUse = userId || localStorage.getItem("userId") || store.user_id;
        if (idToUse) {
            actions.getProfile(idToUse)
                .then((data) => {
                    if (data) {
                        setProfile({ ...data, latitud: data.latitud || null, longitud: data.longitud || null, telefono: data.telefono || '', genero: data.genero || 'otro' });
                        setDireccionActual(data.direccion);
                        setLatitudActual(data.latitud);
                        setLongitudActual(data.longitud);
                        setMisIntereses(data.intereses.map(i => i.id));
                    }
                }).catch(error => console.error("Error al obtener el perfil:", error));

            // Obtener todos los intereses
            actions.getInteres()
                .then(data => {
                    setInteresesDisponibles(Array.isArray(data) ? data.map(interes => ({ ...interes, selected: false })) : []); // Marcar los intereses como no seleccionados
                })

            actions.obtenerIntereses()
                .then(data => {
                    const userInterests = Array.isArray(data) ? data.map(i => i.id) : [];
                    setMisIntereses(userInterests);
                });
        }
    }, [userId, store.user_id]);


    const handleInteresChange = (interesId) => {
        setMisIntereses(prev => {
            if (prev.includes(interesId)) {
                return prev.filter(id => id !== interesId);
            } else {
                return [...prev, interesId];
            }
        });
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setProfile({ ...profile, [name]: value });

        if (name === 'direccion') {
            setShowMap(true);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const { nombre, apellidos, fecha_nacimiento, direccion, latitud, longitud, breve_descripcion, telefono, genero } = profile;

        try {
            const response = await actions.updateProfile(
                userId,
                nombre,
                apellidos,
                fecha_nacimiento,
                direccion,
                latitud,
                longitud,
                breve_descripcion,
                telefono,
                genero,
                misIntereses
            );
            if (response) {
                setAlertMessage("¡Cambios guardados exitosamente!");
            }
        } catch (error) {
            console.error("Error al actualizar el perfil:", error);
            setAlertMessage("Hubo un error al guardar los cambios.");
        } finally {
            setShowAlert(true);
            setTimeout(() => setShowAlert(false), 5000);
        }
    };

    const confirmDeleteAccount = () => {
        setAlertMessage("Cuenta eliminada con éxito.");
        setShowAlert(true);
        setTimeout(() => {
            navigate("/logout", { state: { from: true } });
        }, 2500);
    };


    const handleCheckboxChange = (event) => {
        setDeleteCheckboxChecked(event.target.checked);
    };


    const handleCancel = () => {
        setActiveSection("informacionPersonal");
    };

    const [isTwoFactorEnabled, setIsTwoFactorEnabled] = useState(false);

    const [notificationsEnabled, setNotificationsEnabled] = useState(true);

    const toggleTwoFactor = async () => {
        try {
            await actions.toggleTwoFactorAuth(userId);
            setIsTwoFactorEnabled(prev => !prev);
        } catch (error) {
            console.error("Error al cambiar la autenticación de dos factores:", error);
        }
    };

    const toggleNotifications = () => {
        setNotificationsEnabled(prev => !prev);
    };


    const handleInteresesChange = (interesId) => {
        setInteresesSeleccionados(prev => {
            const newSet = new Set(prev);
            if (newSet.has(interesId)) {
                newSet.delete(interesId);
                setInteresesDisponibles(prev => [...prev, { id: interesId }]);
            } else {
                newSet.add(interesId);
                setInteresesDisponibles(prev => prev.filter(i => i.id !== interesId));
            }
            return newSet;
        });
    };

    const handleInterestSelect = (interesId) => {
        setInteresesDisponibles(prev =>
            prev.map(interes =>
                interes.id === interesId ? { ...interes, selected: !interes.selected } : interes
            )
        );

        if (misIntereses.includes(interesId)) {
            setMisIntereses(prev => prev.filter(id => id !== interesId));
        } else {
            setMisIntereses(prev => [...prev, interesId]);
        }
    };

    const handleRemoveInterest = (interesId) => {
        setMisIntereses(prev => prev.filter(id => id !== interesId));
        setInteresesDisponibles(prev =>
            prev.map(interes =>
                interes.id === interesId ? { ...interes, selected: false } : interes
            )
        );
    };

    const handleSubmitIntereses = async () => {
        try {
            await actions.editarInteres(misIntereses);
            setAlertMessage("¡Intereses guardados exitosamente!");
            setShowAlert(true);
            setTimeout(() => setShowAlert(false), 5000);
        } catch (error) {
            console.error("Error al guardar intereses:", error);
            setAlertMessage("Hubo un error al guardar los intereses.");
            setShowAlert(true);
            setTimeout(() => setShowAlert(false), 5000);
        }
    };

    const handleDireccionChange = (direccion, lat, lng) => {
        setDireccionActual(direccion);
        setLatitudActual(lat);
        setLongitudActual(lng);
        setProfile(prev => ({ ...prev, direccion, latitud: lat, longitud: lng }));
    };

    const handleSectionChange = (section) => {
        setActiveSection(section);
        if (section === "informacionPersonal") {
            setLatitudActual(profile.latitud || null);
            setLongitudActual(profile.longitud || null);
            setDireccionActual(profile.direccion || '');
        }
    };

    return (
        <>
            <main className="profile-container">

                <header className="profile-header text-center">
                    <h1 className="text-white">Mi Perfil</h1>
                </header>

                <div className="profile-content container">
                    <aside className="profile-sidebar">
                        <div className="profile-card">
                            <GetUserPerfilImage />
                            <h3 className="profile-name fs-3 mb-0 mt-2">{profile.nombre}</h3>
                            <hr className="my-1"></hr>
                            <p className="profile-email fs-5 mt-0">{profile.email}</p>
                            <nav className="profile-nav">
                                <button
                                    className={`nav-link ${activeSection === "informacionPersonal" ? "active" : ""}`}
                                    onClick={() => handleSectionChange("informacionPersonal")}
                                >
                                    Información personal
                                </button>
                                <button
                                    className={`nav-link ${activeSection === "misIntereses" ? "active" : ""}`}
                                    onClick={() => handleSectionChange("misIntereses")}
                                >
                                    Mis Intereses
                                </button>
                                <button
                                    className={`nav-link ${activeSection === "misEventos" ? "active" : ""}`}
                                    onClick={() => handleSectionChange("misEventos")}
                                >
                                    Mis Eventos
                                </button>
                                <button
                                    className={`nav-link ${activeSection === "misFotos" ? "active" : ""}`}
                                    onClick={() => handleSectionChange("misFotos")}
                                >
                                    Mis Fotos
                                </button>
                                <button
                                    className={`nav-link ${activeSection === "seguridad" ? "active" : ""}`}
                                    onClick={() => handleSectionChange("seguridad")}
                                >
                                    Seguridad
                                </button>
                                <button
                                    className={`nav-link ${activeSection === "notificaciones" ? "active" : ""}`}
                                    onClick={() => handleSectionChange("notificaciones")}
                                >
                                    Notificaciones
                                </button>
                            </nav>
                        </div>
                        <UserInterest intereses={misIntereses} />
                    </aside>

                    <section className="profile-details">
                        {activeSection === 'informacionPersonal' && (
                            <>
                                <div className="profile-card">
                                    <h2 className="profile-card-header text-black">Información personal</h2>
                                    <form onSubmit={handleSubmit}>

                                        <div className="row">
                                            <div className="col">
                                                <div className="form-group">
                                                    <label className="fs-5">Nombre</label>
                                                    <input
                                                        type="text"
                                                        name="nombre"
                                                        value={profile.nombre}
                                                        onChange={(e) => setProfile({ ...profile, nombre: e.target.value })}
                                                        className="form-control"
                                                        required
                                                        style={{ fontSize: "1.1rem" }}
                                                    />
                                                </div>
                                            </div>
                                            <div className="col">
                                                <div className="form-group">
                                                    <label className="fs-5">Apellidos</label>

                                                    <input
                                                        type="text"
                                                        name="apellidos"
                                                        value={profile.apellidos}
                                                        onChange={(e) => setProfile({ ...profile, apellidos: e.target.value })}
                                                        className="form-control"
                                                        required
                                                        style={{ fontSize: "1.1rem" }}
                                                    />
                                                </div>
                                            </div>
                                        </div>

                                        <div className="row">
                                            <div className="col">
                                                <div className="form-group">
                                                    <label className="fs-5">Fecha de nacimiento</label>
                                                    <input
                                                        type="date"
                                                        name="fecha_nacimiento"
                                                        value={profile.fecha_nacimiento}
                                                        onChange={(e) => setProfile({ ...profile, fecha_nacimiento: e.target.value })}
                                                        className="form-control"
                                                        style={{ fontSize: "1.1rem" }}
                                                    />
                                                </div>
                                            </div>
                                            <div className="col">
                                                <div className="form-group">
                                                    <label className="fs-5">Teléfono</label>
                                                    <input
                                                        type="tel"  // Tipo de número
                                                        name="telefono"
                                                        value={profile.telefono}
                                                        onChange={(e) => {
                                                            // Filtrar la entrada para permitir solo números y espacios
                                                            const value = e.target.value.replace(/[^0-9 ]/g, ''); // Reemplaza todo lo que no sea número o espacio
                                                            setProfile({ ...profile, telefono: value });
                                                        }}
                                                        className="form-control"
                                                        placeholder="Número de teléfono" // Placeholder informativo
                                                        inputMode="numeric" // Mejora la entrada en dispositivos móviles
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                        <div className="col">
                                            <div className="form-group">
                                                <label className="fs-5">Género</label>
                                                <div className="gender-options">
                                                    <label className="fs-5">
                                                        <input
                                                            type="radio"
                                                            value="masculino"
                                                            name="genero"
                                                            checked={profile.genero === 'masculino'}
                                                            onChange={(e) => setProfile({ ...profile, genero: e.target.value })} // Aplicar lógica de manera específica aquí
                                                        />
                                                        Masculino
                                                    </label>
                                                    <label className="fs-5">
                                                        <input
                                                            type="radio"
                                                            value="femenino"
                                                            name="genero"
                                                            checked={profile.genero === 'femenino'}
                                                            onChange={(e) => setProfile({ ...profile, genero: e.target.value })} // Lógica correcta
                                                        />
                                                        Femenino
                                                    </label>
                                                    <label className="fs-5">
                                                        <input
                                                            type="radio"
                                                            value="otro"
                                                            name="genero"
                                                            checked={profile.genero === 'otro'}
                                                            onChange={(e) => setProfile({ ...profile, genero: e.target.value })} // Lógica correcta
                                                        />
                                                        Otro
                                                    </label>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="form-group">
                                            <label className="fs-5">Breve Descripción (pública)</label>
                                            <textarea
                                                name="breve_descripcion"
                                                value={profile.breve_descripcion}
                                                onChange={(e) => setProfile({ ...profile, breve_descripcion: e.target.value })}
                                                className="form-control"
                                                rows="3"
                                                style={{ fontSize: "1.1rem" }}
                                            />
                                        </div>
                                        <div className="form-group">
                                            <label className="fs-5">Dirección</label>
                                            <Mapa
                                                setDireccion={handleDireccionChange}
                                                initialDireccion={direccionActual}
                                                latitud={latitudActual}
                                                longitud={longitudActual}
                                            />
                                        </div>

                                        <div className="form-actions d-flex justify-content-end">
                                            <button type="button" className="btn btn-secondary me-2">Cancelar</button>
                                            <button type="submit" style={styles.buttonSaveStyle}>Guardar cambios</button>
                                        </div>
                                        {showAlert && (
                                            <div className={`alert alert-success alert-dismissible my-3 fade show`} role="alert">
                                                <i className="fas fa-check me-2"></i>
                                                {alertMessage}
                                                <button type="button" className="btn-close" onClick={() => setShowAlert(false)} aria-label="Close"></button>
                                            </div>
                                        )}
                                    </form>
                                </div>

                            </>
                        )}

                        {activeSection === 'misIntereses' && (
                            <div className="profile-card">
                                <h2 className="profile-card-header text-black">Mis Intereses</h2>

                                <div>
                                    <h5 className="mty-3 fs-4">Intereses disponibles</h5>
                                    <div className="available-interests">
                                        {interesesDisponibles.map(interes => {
                                            // Verificar si el interés está en la lista de misIntereses
                                            const isSelected = misIntereses.includes(interes.id);
                                            return (
                                                <button
                                                    key={interes.id}
                                                    type="button"
                                                    style={isSelected ? styles.buttonRemove : styles.interestButton}  // Usamos styles.buttonRemove si está seleccionado
                                                    onClick={() => handleInterestSelect(interes.id)}
                                                >
                                                    {interes.nombre}
                                                </button>
                                            );
                                        })}
                                    </div>
                                </div>

                                <div>
                                    <h5 className="mt-5 mb-3 fs-4">Intereses seleccionados</h5>
                                    <div style={{ display: 'flex', flexWrap: 'wrap' }}>
                                        {misIntereses.map(interesId => (
                                            <div key={interesId} className="interest-item" style={{ marginRight: '10px', textAlign: 'center' }}>
                                                <span style={styles.selectedtButton}>
                                                    {interesesDisponibles.find(i => i.id === interesId)?.nombre || "Interés no encontrado"}
                                                </span>
                                                <div>
                                                    <button
                                                        type="button"
                                                        style={{ ...styles.buttonRemove, fontSize: '12px' }} // Siempre formato de buttonRemove
                                                        onClick={() => handleRemoveInterest(interesId)}>
                                                        Quitar
                                                    </button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div className="d-flex justify-content-end">
                                    <button type="button" onClick={handleSubmitIntereses} style={styles.buttonSaveStyle}>
                                        Guardar Intereses
                                    </button>
                                </div>
                                {showAlert && (
                                    <div className={`alert alert-success alert-dismissible my-3 fade show`} role="alert">
                                        <i className="fas fa-check me-2"></i>
                                        {alertMessage}
                                        <button type="button" className="btn-close" onClick={() => setShowAlert(false)} aria-label="Close"></button>
                                    </div>
                                )}
                            </div>
                        )}
                        {activeSection === 'misEventos' && (
                            <MisEventos />
                        )}
                        {activeSection === 'misFotos' && (
                            <div>
                                <div className="profile-card">
                                    <h2 className="profile-card-header text-black">Mi foto de perfil</h2>
                                    <GetUserPerfilImage />
                                </div>
                                <div className="profile-card">
                                    <h2 className="profile-card-header text-black">Galería de Imágenes</h2>
                                    <GetUserImages />
                                </div>
                            </div>
                        )}
                        {activeSection === 'seguridad' && (
                            <div className="profile-card">
                                <h2 className={styles.sectionTitle}>Seguridad</h2>
                                <div className="profile-card delete-account mt-5">
                                    <h4 className="profile-card-header">Eliminar tu Cuenta</h4>
                                    <p>Cuando elimines tu cuenta, perderás el acceso a los servicios de YAY y borraremos permanentemente sus datos personales. Puedes cancelar la eliminación de la cuenta si inicias sesión durante los primeros 14 días desde la solicitud.</p>
                                    <div className="form-check">
                                        <input
                                            type="checkbox"
                                            className="form-check-input"
                                            id="deleteAccountCheckbox"
                                            checked={deleteCheckboxChecked}
                                            onChange={handleCheckboxChange}
                                        />
                                        <label className="form-check-label" htmlFor="deleteAccountCheckbox">Confirmo que deseo eliminar mi cuenta en Yay</label>
                                    </div>
                                    <div className="form-actions text-end">
                                        <button
                                            type="button"
                                            className="btn btn-danger"
                                            onClick={() => setShowDeleteConfirm(true)}
                                            disabled={!deleteCheckboxChecked}
                                        >
                                            Eliminar
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}

                        {activeSection === 'notificaciones' && (
                            <div className="profile-card">
                                <h2 className={styles.sectionTitle}>Notificaciones</h2>
                                <div className="form-group mt-2">
                                    <label>Recibir notificaciones por correo</label>
                                    <div>
                                        <button
                                            className={`btn mt-3 ${notificationsEnabled ? 'text-danger' : 'btn-success'}`}
                                            onClick={toggleNotifications}
                                        >
                                            {notificationsEnabled ? "Desactivar Notificaciones" : "Activar Notificaciones"}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}

                    </section>

                </div>
                {showDeleteConfirm && (
                    <div className="modal show" style={{ display: 'block' }}>
                        <div className="modal-dialog modal-dialog-centered" style={{ maxWidth: '600px' }}>
                            <div className="modal-content">
                                <div className="modal-header">
                                    <h5 className="modal-title">Eliminar cuenta</h5>
                                    <button type="button" className="btn-close" onClick={() => setShowDeleteConfirm(false)} aria-label="Close"></button>
                                </div>
                                <div className="modal-body">
                                    <div className="d-flex align-items-start">
                                        <i className="fa-solid fa-circle-exclamation fa-4x mx-2" style={{ color: '#7c488f' }}></i>
                                        <div className="mx-3">
                                            <h4 className="mb-0" style={{ color: '#7c488f' }}>Confirmar eliminación de cuenta</h4>
                                            <hr className="mt-0 mb-1" />
                                            <p>¿Estás seguro/a de que deseas eliminar tu cuenta? Esta acción es irreversible pasados 14 días.</p>
                                        </div>
                                    </div>
                                    {showAlert && alertMessage && (
                                        <div className={`alert alert-success alert-dismissible fade show`} role="alert">
                                            <i className="fas fa-check me-2"></i>
                                            {alertMessage}
                                            <button type="button" className="btn-close" onClick={() => { setShowAlert(false); setAlertMessage(''); }} aria-label="Close"></button>
                                        </div>
                                    )}
                                </div>
                                <div className="modal-footer">
                                    <button type="button" className="btn btn-secondary" onClick={() => setShowDeleteConfirm(false)}>Cancelar</button>
                                    <button type="button" className="btn text-white" style={{ backgroundColor: "#7c488f" }} onClick={confirmDeleteAccount}>Eliminar cuenta</button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </main>
        </>
    );
};