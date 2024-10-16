import React, { useState, useEffect, useContext } from 'react';
import { Context } from '../store/appContext';
import ImageUploadPerfil from './imagePerfilUpload'; 
import "../../styles/imagenes.css";

const GetUserPerfilImage = () => {
    const [image, setImage] = useState(null);
    const [error, setError] = useState(null);
    const [selectedImage, setSelectedImage] = useState(null); 
    const [isModalOpen, setIsModalOpen] = useState(false); 
    const { store, actions } = useContext(Context);

    const fetchPerfilImage = async () => {
        try {
            const response = await actions.getUserPerfilImage();
            setImage(response.foto_perfil);
        } catch (error) {
            setError(<span style={{ color: 'grey' }}>Sube una imagen de perfil</span>);
        }
    };

    const handleDeleteClick = async (image) => {
        const usuario_id = store.user_id; 
        const public_id = image.split('/').pop().split('.')[0]; 
        
        // Verifica los valores
        console.log("Usuario ID:", usuario_id);
        console.log("Public ID:", public_id);
        
        try {
            await actions.deleteImage(usuario_id, public_id);
            setImage(null); // Clear the image after deletion
        } catch (error) {
            setError("No se pudo eliminar la imagen.");
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
                        onClick={() => handleDeleteClick(image)} 
                        className="delete-button"
                    >
                        x
                    </button>
                </div>
            ) : (
                <ImageUploadPerfil fetchPerfilImage={fetchPerfilImage} />
            )}
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