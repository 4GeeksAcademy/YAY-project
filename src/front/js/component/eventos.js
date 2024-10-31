import React, { useState, useEffect, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Context } from "../store/appContext";
import { Inscripciones } from "./inscripciones";
import { GetEventoImage } from "./getEventoImage";

export const Eventos = () => {
  const { store, actions } = useContext(Context);
  const [loading, setLoading] = useState(true);
  const [inscripcionIds, setInscripcionIds] = useState({});
  const [chatMessages, setChatMessages] = useState([]);
  const [selectedInterest, setSelectedInterest] = useState("");
  const [interests, setInterests] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const loadData = async () => {
      try {
        await actions.loadEventosConUsuarios(); 
        const interesData = await actions.getInteres(); 
        setInterests(interesData);
        setLoading(false);
      } catch (error) {
        setLoading(false);
        console.error("Error:", error);
      }
    };

    loadData();
  }, []);

  const setInscripcionIdForEvento = (eventoId, id, userId) => {
    setInscripcionIds(prev => ({ ...prev, [eventoId]: id }));
  };

  const handleInterestChange = (interestId) => {
    setSelectedInterest(interestId);
  };

  const filteredEventos = selectedInterest
    ? store.eventos.filter(evento => evento.interes_id === parseInt(selectedInterest, 10))
    : store.eventos;

  const userId = localStorage.getItem("user_id");

  return (
    <div className="container m-5 mx-auto w-75">
      <div className="d-flex justify-content-between align-items-center mb-3">
      <div className="dropdown">
      <button className="btn btn-lg dropdown-toggle" style={{border: '1px solid #7c488f'}} type="button" data-bs-toggle="dropdown" aria-expanded="false">
        {selectedInterest ? interests.find(interest => interest.id === selectedInterest)?.nombre : "Filtrar por interés"}
      </button>
      <ul className="dropdown-menu" style={{ minWidth: '100%' }}>
        <li>
          <a className="dropdown-item" onClick={() => handleInterestChange("")}>
            Sin filtros
          </a>
        </li>
        {interests.map((interest) => (
          <li key={interest.id}>
            <a className="dropdown-item" onClick={() => handleInterestChange(interest.id)}>
              {interest.nombre}
            </a>
          </li>
        ))}
      </ul>
    </div>
        <button className="custom-button btn btn-lg mb-3 fs-4"
          onClick={() => navigate(`/eventos-mapa/${userId}`)}
          style={{
            borderColor: '#ffc107',
            color: '#494949',
            backgroundColor: '#7c488f26'
          }}
        >
          Ver en Mapa <i className="fa-solid fa-map-location-dot" style={{ color: '#7c488f' }}></i>
        </button>
      </div>
      {loading ? (
        <p className="text-secondary text-center fs-3">Cargando eventos...</p>
      ) : (
        <>
          {filteredEventos.length === 0 ? (
            <p className="text-danger text-center fs-3">
              Ahora mismo, no existen eventos acordes con el interés seleccionado. <br/>Por favor, seleccione otro interés o quite el filtro.
            </p>
          ) : (
            <ul className="list-group">
              {filteredEventos.map((evento) => (
                <li key={evento.id} className="list-group-item d-flex justify-content-between" style={{ boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)', border: 'none', marginBottom: '10px' }}>
                  <div className="d-flex justify-content-between flex-grow-1">
                    <div style={{ width: '300px', height: 'auto', margin: '0' }}>
                      <GetEventoImage eventoId={evento.id} setImagenUrl={(url) => evento.foto_evento = url} partnerId={evento.partner_id === parseInt(localStorage.getItem("partner_id"))} />
                    </div>
                    <ul className="ms-5 flex-grow-1" style={{ listStyle: 'none', padding: 0 }}>
                      <li className="fs-3" style={{ color: '#7c488f' }}>{evento.nombre}</li>
                      <li className="text-muted fs-5">
                        <i className="fa-solid fa-calendar-days" style={{ color: '#7c488f' }}></i> {evento.fecha}
                      </li>
                      <li className="text-muted fs-6">
                        <i className="fa-solid fa-clock" style={{ color: '#7c488f' }}></i> {evento.horario}
                      </li>
                      <li className="text-muted fs-7">
                        <i className="fa-solid fa-location-dot" style={{ color: '#7c488f' }}></i> {evento.direccion}
                      </li>
                      <li>
                        <Link to={`/evento/${evento.id}`} className="btn my-2" style={{ backgroundColor: '#7c488f', color: 'white' }}>Saber más</Link>
                      </li>
                    </ul>
                  </div>
                  <Inscripciones
                    usuarioId={actions.getUserId()}
                    eventoId={evento.id}
                    nombreEvento={evento.nombre}
                    inscripcionId={inscripcionIds[evento.id]}
                    setInscripcionId={(id) => setInscripcionIdForEvento(evento.id, id, actions.getUserId())}
                  />
                </li>
              ))}
            </ul>
          )}
        </>
      )}

      {chatMessages.length > 0 && (
        <div className="chat-messages">
          {chatMessages.map((message, index) => (
            <div key={index}>{message}</div>
          ))}
        </div>
      )}
    </div>
  );
};