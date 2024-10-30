import React, { useState, useEffect, useContext } from 'react';
import { Context } from '../store/appContext';
import ImageUploadPerfil from './imagePerfilUpload'; 
import "../../styles/imagenes.css";

const GetUserPerfilImage = () => {
    const [image, setImage] = useState(null);
    const [error, setError] = useState(null);
    const [selectedImage, setSelectedImage] = useState(null); 
    const [isModalOpen, setIsModalOpen] = useState(false); 
    const [isDeleteConfirmModalOpen, setIsDeleteConfirmModalOpen] = useState(false); // Modal de confirmación
    const { store, actions } = useContext(Context);

    const fetchPerfilImage = async () => {
        try {
            const response = await actions.getUserPerfilImage();
            setImage(response.foto_perfil);
        } catch (error) {
            setError(<span style={{ color: 'grey' }}>Sube una imagen de perfil</span>);
        }
    };

    const handleDeleteClick = () => {
        // Abre el modal de confirmación
        setIsDeleteConfirmModalOpen(true);
    };

    const confirmDeleteImage = async () => {
        const usuario_id = store.user_id; 
        
        try {
            await actions.deletePerfilImage(usuario_id); // Llamar a la acción sin public_id
            setImage(null); // Limpiar la imagen después de la eliminación
            setIsDeleteConfirmModalOpen(false); // Cierra el modal de confirmación
        } catch (error) {
            setError("No se pudo eliminar la imagen.");
            setIsDeleteConfirmModalOpen(false); // Cierra el modal en caso de error
        }
    };

    const handleImageClick = (url) => {
        setSelectedImage(url); 
        setIsModalOpen(true); 
    };

    const closeModal = () => {
        setIsModalOpen(false); 
        setSelectedImage(null); 
    };

    useEffect(() => {
        fetchPerfilImage();
    }, []);

    return (
        <div className="perfil-image-container">
            {error && <p className="error-message">{error}</p>}
            {image ? (
                <div className="image-wrapper">
                    <img
                        src={image}
                        alt="Imagen de Perfil"
                        className="perfil-image"
                        onClick={() => handleImageClick(image)} 
                    />
                    <button 
                        onClick={handleDeleteClick}  // Abre el modal de confirmación
                        className="delete-button"
                    >
                        X
                    </button>
                </div>
            ) : (
                <ImageUploadPerfil fetchPerfilImage={fetchPerfilImage} />
            )}
            
            {/* Modal de eliminar imagen */}
            {isDeleteConfirmModalOpen && (
                <div className="modal show" style={{ display: 'block' }}>
                    <div className="modal-dialog modal-dialog-centered" style={{ maxWidth: '600px' }}>
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">Eliminar Imagen</h5>
                                <button type="button" className="btn-close" onClick={() => setIsDeleteConfirmModalOpen(false)} aria-label="Close"></button>
                            </div>
                            <div className="modal-body">
                                <div className="d-flex align-items-start">
                                    <i className="fa-solid fa-circle-exclamation fa-4x mx-2" style={{ color: '#7c488f' }}></i>
                                    <div className="mx-3">
                                        <h4 className="mb-0" style={{ color: '#7c488f' }}>Confirmar eliminación de imagen</h4>
                                        <hr className="mt-0 mb-1" />
                                        <p>¿Estás seguro/a de que deseas eliminar esta imagen de perfil?</p>
                                    </div>
                                </div>
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-secondary" onClick={() => setIsDeleteConfirmModalOpen(false)}>Cancelar</button>
                                <button type="button" className="btn text-white" style={{ backgroundColor: "#7c488f" }} onClick={confirmDeleteImage}>Eliminar</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Modal para mostrar la imagen */}
            {isModalOpen && (
                <div className="user-gallery-modal" onClick={closeModal}>
                    <div className="user-gallery-modal-content" onClick={(e) => e.stopPropagation()}>
                        <span className="user-gallery-modal-close" onClick={closeModal}>&times;</span>
                        <img src={selectedImage} alt="Imagen grande" className="user-gallery-modal-image" />
                    </div>
                </div>
            )}
        </div>
    );
};

export default GetUserPerfilImage;