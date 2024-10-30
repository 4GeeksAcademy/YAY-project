import React, { useState, useEffect, useContext } from 'react';
import { Context } from '../store/appContext';
import ImageUpload from './imageUpload'; // Asegúrate de que el nombre y la ruta sean correctos
import "../../styles/imagenes.css";

const GetUserImages = () => {
    const [images, setImages] = useState([]);
    const [selectedImage, setSelectedImage] = useState(null); 
    const [isModalOpen, setIsModalOpen] = useState(false); 
    const [isDeleteConfirmModalOpen, setIsDeleteConfirmModalOpen] = useState(false); // Modal para confirmar eliminación
    const [imageToDelete, setImageToDelete] = useState(null); // Imagen seleccionada para eliminar
    const [error, setError] = useState(null);
    const { store, actions } = useContext(Context);

    const fetchImages = async () => {
        try {
            const response = await actions.getUserImages();
            setImages(response.fotos);
        } catch (error) {
            setError(<span style={{ color: 'grey' }}>Completa para que los demás puedan conocerte</span>);
        }
    };

    // Manejador de clic para eliminar imagen
    const handleDeleteClick = (image) => {
        setImageToDelete(image);
        setIsDeleteConfirmModalOpen(true);
    };

    // Confirmación de eliminación de imagen
    const confirmDeleteImage = async () => {
        const usuario_id = store.user_id; 
        const public_id = imageToDelete.split('/').pop().split('.')[0]; 

        try {
            await actions.deleteImage(usuario_id, public_id); // Llama a la API para eliminar la imagen
            
            // Actualiza el estado para eliminar la imagen de la lista
            setImages(images => images.filter((img) => img !== imageToDelete));

            // Cierra el modal de confirmación
            setIsDeleteConfirmModalOpen(false);
            setImageToDelete(null); // Limpia el estado de la imagen a eliminar
        } catch (error) {
            setError("No se pudo eliminar la imagen.");
            console.error("Error al intentar eliminar la imagen:", error);
        }
    };

    // Manejar clic en imagen
    const handleImageClick = (url) => {
        setSelectedImage(url);
        setIsModalOpen(true);
    };

    // Cerrar modal
    const closeModal = () => {
        setIsModalOpen(false);
        setSelectedImage(null);
    };

    useEffect(() => {
        fetchImages();
    }, []);

    return (
        <div className="user-gallery-container">
            <h3 className="user-gallery-title">Tu galería de imágenes</h3>
            {error && <p className="user-gallery-error-message">{error}</p>}
            <div className="user-gallery-wrapper">
                {images.map((url, index) => (
                    <div key={index} className="user-gallery-image-card">
                        <img
                            src={url}
                            alt={`Imagen ${index + 1}`}
                            className="user-gallery-image"
                            onClick={() => handleImageClick(url)} 
                        />
                        <button 
                            onClick={() => handleDeleteClick(url)} 
                            className="user-gallery-delete-button"
                        >
                            X
                        </button>
                    </div>
                ))}
            </div>

            {images.length < 5 && <ImageUpload fetchImages={fetchImages} />}

            {isModalOpen && (
                <div className="user-gallery-modal" onClick={closeModal}>
                    <div className="user-gallery-modal-content" onClick={(e) => e.stopPropagation()}>
                        <span className="user-gallery-modal-close" onClick={closeModal}>&times;</span>
                        <img src={selectedImage} alt="Imagen grande" className="user-gallery-modal-image" />
                    </div>
                </div>
            )}

            {/* Modal de confirmación para eliminar la imagen */}
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
                                        <p>¿Estás seguro/a de que deseas eliminar esta imagen?</p>
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
        </div>
    );
};

export default GetUserImages;