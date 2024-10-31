import React, { useContext, useState, useEffect } from 'react';
import { Context } from '../store/appContext';
import { useNavigate } from 'react-router-dom';
import { Mapa } from './mapa';
import { Autocomplete } from '@react-google-maps/api';
import '../../styles/completarDatosUsuarios.css'

const CompletarDatosUsuario = () => {
    const { actions } = useContext(Context);
    const [step, setStep] = useState(1);
    const [nombre, setNombre] = useState("");
    const [apellidos, setApellidos] = useState("");
    const [fecha_nacimiento, setFechaNacimiento] = useState("");
    const [direccion, setDireccion] = useState("");
    const [latitud, setLatitud] = useState(null);
    const [longitud, setLongitud] = useState(null);
    const [breve_descripcion, setDescripcion] = useState("");
    const [misIntereses, setMisIntereses] = useState([]);
    const [interesesSeleccionados, setInteresesSeleccionados] = useState(new Set());
    const [interesesDisponibles, setInteresesDisponibles] = useState([]);
    const navigate = useNavigate();
    const userId = sessionStorage.getItem('userId');
    const [errors, setErrors] = useState({});

    useEffect(() => {
        let isMounted = true;
        const fetchIntereses = async () => {
            try {
                const data = await actions.getInteres();
                if (isMounted) {
                    setInteresesDisponibles(data);
                }
            } catch (error) {
                console.error("Error al cargar los intereses:", error);
            }
        };
        fetchIntereses();
        return () => {
            isMounted = false; // Limpiar cuando el componente se desmonta
        };
    }, [actions]);

    const handleNextStep = () => {
        let newErrors = {};
        const currentDate = new Date();
        const birthDate = new Date(fecha_nacimiento);
        const age = currentDate.getFullYear() - birthDate.getFullYear();

        // Verificación de la edad y la fecha de nacimiento
        if (step === 3) {
            if (!fecha_nacimiento) {
                newErrors.fecha = "*Por favor, introduzca su fecha de nacimiento.";
            } else if (age < 60) {
                newErrors.fecha = "*Debe ser mayor de 60 años para registrarse.";
            }
        }

        // Otras validaciones
        if (step === 1 && !nombre) {
            newErrors.nombre = "*Por favor, rellene este campo.";
        }
        if (step === 1 && !apellidos) {
            newErrors.apellidos = "*Por favor, rellene este campo.";
        }
        if (step === 2 && (latitud === null || longitud === null)) {
            newErrors.ubicacion = "*Por favor, selecciona una ubicación en el mapa.";
        }

        // Manejo de errores antes de avanzar
        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return; // Evita continuar si hay errores
        }

        // Si no hay errores, continúa al siguiente paso
        setErrors({});
        setStep(step + 1);
    };

    const handlePreviousStep = () => {
        setStep(step - 1);
    };

    const handleSubmit = async (e) => {
        e.preventDefault(); // Prevenir envío de formulario
        if (latitud === null || longitud === null) {
            // Puedes manejar este caso de error también si deseas
            setErrors({ ...errors, ubicacion: "*Por favor, selecciona una ubicación en el mapa." });
            return;
        }

        const result = await actions.completarDatos(
            localStorage.getItem('user_id'),
            nombre,
            apellidos,
            fecha_nacimiento,
            direccion,
            latitud,
            longitud,
            breve_descripcion
        );

        if (result) {
            // Guardar los intereses seleccionados
            await actions.agregarInteres(Array.from(interesesSeleccionados));
            navigate('/redirect-login'); // Redirige solo si el registro se completó correctamente
        } else {
            console.error("Error al completar los datos");
        }
    };


    const handleInteresesChange = (interesId) => {
        setInteresesSeleccionados(prev => {
            const newSet = new Set(prev);
            const exists = newSet.has(interesId);

            if (exists) {
                newSet.delete(interesId); // Si el interés ya está, quítalo
                setErrors({ ...errors, interest: "*Pulsa de nuevo para quitar interés" }); // Setea el error para quitar interés
            } else {
                newSet.add(interesId); // Si no está, añade
                // Limpiar el mensaje de error al agregar un interés
                setErrors({ ...errors, interest: null });
            }

            // Mantener la lista de intereses disponibles
            setInteresesDisponibles(prev => exists ? [...prev, { id: interesId }] : prev.filter(i => i.id !== interesId));

            return newSet; // Devuelve el nuevo Set
        });
    };
    return (
        <div className="cd-container">
            <h2 className='display-3 mb-4 heading'>Completa tu Perfil</h2>
            <form className='w-100' onSubmit={handleSubmit}>
                {step === 1 && (
                    <div>
                        <label className="cd-label">*Nombre</label>

                        <input
                            type="text"
                            className='cd-input'
                            value={nombre}
                            onChange={(e) => setNombre(e.target.value)}
                            placeholder="Introduzca su nombre..."
                            required
                        />
                        {errors.nombre && <span className='cd-text-danger float-end mb-0'>{errors.nombre}</span>}


                        <label className='mt-5 cd-label'>*Apellidos</label>
                        <input
                            type="text"
                            className='cd-input'
                            value={apellidos}
                            onChange={(e) => setApellidos(e.target.value)}
                            placeholder="Introduzca sus apellidos..."
                            required
                        />
                        {errors.apellidos && <span className='cd-text-danger float-end mb-0'>{errors.apellidos}</span>}
                        <div className="d-flex justify-content-end w-100 mt-3 px-5">
                            <button className="custom-button btn btn-lg pt-3"
                                style={{ borderColor: '#7c488f', backgroundColor: '#7c488f26', borderWidth: '2px', color: '#494949', fontWeight: '500' }}
                                onClick={handleNextStep}
                            >
                                <h5>Siguiente <i className="fa-solid fa-chevron-right small ms-1"></i></h5></button>
                        </div>
                    </div>
                )}

                {step === 2 && (
                    <div>
                        <label className='ms-1 cd-label'> *Dirección</label>
                        <Mapa
                            setDireccion={(direccion, latitud, longitud) => {
                                setDireccion(direccion);
                                setLatitud(latitud);
                                setLongitud(longitud);
                            }}
                        />
                        {errors.ubicacion && <span className='cd-text-danger float-end mb-1'>{errors.ubicacion}</span>}
                        <div className="d-flex justify-content-between w-100 mt-3 px-5">
                            <button className="custom-button btn btn-lg pt-3"
                                style={{ borderColor: '#7c488f', backgroundColor: '#7c488f26', borderWidth: '2px', color: '#494949', fontWeight: '500' }}
                                onClick={handlePreviousStep}
                            >
                                <h5><i className="fa-solid fa-chevron-left small ms-1"></i> Anterior</h5></button>
                            <button className="custom-button btn btn-lg pt-3"
                                style={{ borderColor: '#7c488f', backgroundColor: '#7c488f26', borderWidth: '2px', color: '#494949', fontWeight: '500' }}
                                onClick={handleNextStep}
                            >
                                <h5>Siguiente <i className="fa-solid fa-chevron-right small ms-1"></i></h5></button>
                        </div>
                    </div>
                )}
                {step === 3 && (
                    <div>
                        <label className="cd-label">*Fecha de Nacimiento</label>
                        <input
                            type="date"
                            className='cd-input' // Cambié errors.nombre a errors.fecha
                            value={fecha_nacimiento}
                            onChange={(e) => setFechaNacimiento(e.target.value)}
                            placeholder="Introduzca su fecha de nacimiento..."
                            required
                        />
                        {errors.fecha && <span className='cd-text-danger float-end mb-0'>{errors.fecha}</span>}
                        <label className="cd-label">Algo sobre ti <span className='text-muted'>(opcional)</span></label>
                        <textarea
                            className='cd-textarea'
                            value={breve_descripcion}
                            onChange={(e) => setDescripcion(e.target.value)}
                            placeholder="Breve descripción, una frase de una canción, una cita de una película..."
                        />
                        <div className="d-flex justify-content-between mt-3 px-5 w-100 ">
                            <button className="custom-button btn btn-lg pt-3"
                                style={{ borderColor: '#7c488f', backgroundColor: '#7c488f26', borderWidth: '2px', color: '#494949', fontWeight: '500' }}
                                onClick={handlePreviousStep}
                            >
                                <h5><i className="fa-solid fa-chevron-left small ms-1"></i> Anterior</h5>
                            </button>
                            <button className="custom-button btn btn-lg pt-3"
                                type="button"
                                onClick={handleNextStep}
                                style={{ borderColor: '#7c488f', backgroundColor: '#7c488f26', borderWidth: '2px', color: '#494949', fontWeight: '500' }}
                            >
                                <h5>Siguiente <i className="fa-solid fa-chevron-right small ms-1"></i></h5>
                            </button>
                        </div>
                    </div>
                )}
                {step === 4 && (
                    <div>
                        <label className="cd-label">Selecciona algunos de tus intereses</label>
                        <div>
                            {interesesDisponibles.map(interes => (
                                <button
                                    key={interes.id}
                                    type="button"
                                    className={interesesSeleccionados.has(interes.id) ? 'cd-button-remove' : 'cd-interest-button'}
                                    onClick={() => handleInteresesChange(interes.id)}
                                >
                                    {interes.nombre}
                                </button>
                            ))}
                        </div>
                        <br />
                        <label className='mt-5 cd-label'>Tus intereses seleccionados</label>
                        <div style={{ display: 'flex', flexWrap: 'wrap' }}>
                            {Array.from(interesesSeleccionados).map(interesId => {
                                const interes = interesesDisponibles.find(i => i.id === interesId);
                                return (
                                    <div key={interesId} style={{ marginRight: '10px', textAlign: 'center' }}>
                                        <span className="cd-selected-button">{interes?.nombre}</span>
                                        <div>
                                            <button
                                                type="button"
                                                className='bg-transparent cd-button-remove'
                                                onClick={() => handleInteresesChange(interesId)}
                                            >
                                                Quitar
                                            </button>
                                        </div>
                                    </div>
                                );
                            })}
                            {errors.interest && <span className='cd-text-danger float-end mb-0'>{errors.interest}</span>}
                        </div>
                        <div className="d-flex justify-content-between mt-3 px-5 w-100">
                            <button className="btn btn-lg custom-button pt-3 my-5 me-2"
                                style={{
                                    borderColor: '#7c488f',
                                    backgroundColor: '#7c488f26',
                                    borderWidth: '2px',
                                    color: '#494949',
                                    fontWeight: '500'
                                }}
                                onClick={handlePreviousStep}
                            >
                                <h5><i className="fa-solid fa-chevron-left small ms-1"></i> Anterior</h5>
                            </button>

                            <button type="submit" className="btn btn-lg my-5"
                                style={{ backgroundColor: '#7c488f', color: 'white', fontWeight: '500' }}
                            >
                                Completar Registro
                            </button>
                        </div>
                    </div>
                )}
            </form>
        </div>
    );
};

export default CompletarDatosUsuario;
