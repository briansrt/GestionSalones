import {React, useEffect, useState, useRef} from 'react';
import { useParams, Link } from 'react-router';
import { ChevronLeft } from 'lucide-react';
import './styles/salon.css';

export default function Salon(){
    const { id } = useParams();
    const [datosSalon, setDatosSalon] = useState([]);
    const [selectedImage, setSelectedImage] = useState(0);
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const scrollAreaRef = useRef();

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (input.trim()) {
          const userMessage = { id: Date.now(), role: 'user', content: input };
          setMessages((prev) => [...prev, userMessage]);
          setInput('');
          setIsLoading(true);
      
          try {
            const response = await fetch('https://gestion-salones-back.vercel.app/salones/chatbot', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                pregunta: input,
                salon: datosSalon,  // Aquí envías los datos del salón
              }),
            });
      
            const data = await response.json();
      
            if (response.ok) {
              const botMessage = {
                id: Date.now() + 1,
                role: 'assistant',
                content: data.respuesta || 'Sin respuesta del servidor.',
              };
              setMessages((prev) => [...prev, botMessage]);
            } else {
              const errorMessage = {
                id: Date.now() + 1,
                role: 'assistant',
                content: 'Error en la respuesta del servidor.',
              };
              setMessages((prev) => [...prev, errorMessage]);
            }
          } catch {
            const errorMessage = {
              id: Date.now() + 1,
              role: 'assistant',
              content: 'Error al conectar con el servidor.',
            };
            setMessages((prev) => [...prev, errorMessage]);
          } finally {
            setIsLoading(false);
          }
        }
      };
      
    
      const handleInputChange = (e) => {
        setInput(e.target.value);
      };
    
      useEffect(() => {
        scrollAreaRef.current?.scrollTo(0, scrollAreaRef.current.scrollHeight);
      }, [messages]);
    
    
    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch('https://gestion-salones-back.vercel.app/salones/salon', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ id }),
                });
                
                if (response.ok) {
                    const data = await response.json();
                    if (data.status === 'salon encontrado') {
                        setDatosSalon(data);
                    } else if (data.status === 'ErrorCredenciales') {
                        alert('Error: Salón no encontrado');
                    } else {
                        alert('Error al obtener datos del salón');
                    }
                      
                } else {
                    alert('Error al conectar a la base de datos');
                }
            } catch (error) {
                console.error('Error:', error);
                alert('Error al conectar con el servidor');
            }
        };
        fetchData();
    }, [id]);

    return(
        <div className="layout">
            <header className="header">
                <div className="header-container">
                <Link to="/" className="back-link">
                    <ChevronLeft /> Volver
                </Link>
                <h1 className="page-title">{datosSalon.salon}</h1>
                </div>
            </header>

            <main className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <main className="main">
                <section className="gallery-section">
                <h2>Galería</h2>
                <div className="gallery-container">
                    <div className="main-image">
                    <img
                        src={Array.isArray(datosSalon.foto)
                            ? datosSalon.foto[selectedImage]
                            : datosSalon.foto || "No disponible"}
                        alt={`Imagen del salon ${datosSalon.salon}`}
                        className="gallery-image"
                    />
                    </div>
                    <div className="thumbnails">
                    {Array.isArray(datosSalon.foto) ? (
                        datosSalon.foto.map((img, index) => (
                            <img
                            key={index}
                            src={img || "No disponible"}
                            alt={`Miniatura del salón ${datosSalon.salon}`}
                            className={`thumbnail ${selectedImage === index ? 'active' : ''}`}
                            onClick={() => setSelectedImage(index)}
                            />
                        ))
                        ) : datosSalon.foto ? (
                        <img
                            src={datosSalon.foto}
                            alt={`Miniatura del salón ${datosSalon.salon}`}
                            className={`thumbnail ${selectedImage === 0 ? 'active' : ''}`}
                            onClick={() => setSelectedImage(0)}
                        />
                        ) : (
                        <p>No hay imágenes disponibles</p>
                        )}

                    </div>
                </div>
                </section>
                <section className="card-salon">
                    <div className="card-header-salon">
                        <h2 className="card-title-salon">Información del Salón</h2>
                    </div>
                    <div className="card-content">
                        <div className="info-grid">
                            <div>
                                <h3 className="info-label">Capacidad:</h3>
                                <p className="info-value">{datosSalon.capacidad} estudiantes</p>
                            </div>
                            <div>
                                <h3 className="info-label">Ubicación:</h3>
                                <p className="info-value">{datosSalon.edificio} - Piso {datosSalon.piso}</p>
                            </div>
                            <div>
                                <h3 className="info-label">Caracteristica:</h3>
                                <p>{datosSalon.caracteristica}</p>
                            </div>
                            <div>
                                <h3 className="info-label">Equipamiento:</h3>
                                <ul className="info-list">
                                    {(Array.isArray(datosSalon.equipamientoTecnologico) ? datosSalon.equipamientoTecnologico : [datosSalon.equipamientoTecnologico])
                                    .map((item, index) => (
                                        <li key={index}>{item}</li>
                                    ))}
                                </ul>
                            </div>
                            <div>
                                <h3 className="info-label">Tipo de Sila:</h3>
                                <p>{datosSalon.tipoSilla}</p>
                            </div>
                            <div>
                                <h3 className="info-label">Tipo de Tablero:</h3>
                                <p>{datosSalon.tipoTablero}</p>
                            </div>
                            <div>
                                <h3 className="info-label">Tomacorriente:</h3>
                                <p>{datosSalon.tomacorriente}</p>
                            </div>
                            <div>
                                <h3 className="info-label">Movilidad:</h3>
                                <p>{datosSalon.movilidad}</p>
                            </div>
                        </div>
                    </div>
                </section>
                <section className="card-bot">
                <header className="card-header-bot">
                    <h2 className="card-title-bot">
                    <div className="status-indicator"></div>
                    Asistente Virtual
                    </h2>
                </header>

                <main className="card-content-bot">
                    <section className="scroll-area" ref={scrollAreaRef}>
                    <div className="messages">
                        {messages.length === 0 ? (
                        <div className="empty-message">
                            <div className="icon-container">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="24"
                                height="24"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                className="icon"
                            >
                                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                            </svg>
                            </div>
                            <h3>¿Cómo puedo ayudarte?</h3>
                            <p>Pregúntame sobre este salón para obtener información</p>
                        </div>
                        ) : (
                        messages.map((message) => (
                            <div key={message.id} className={`message ${message.role === 'user' ? 'user' : 'assistant'}`}>
                            <div className={`message-content ${message.role === 'user' ? 'user-message' : 'assistant-message'}`}>
                                <div className={`avatar ${message.role === 'user' ? 'user-avatar' : 'assistant-avatar'}`}>
                                {message.role === 'user' ? 'U' : 'A'}
                                </div>
                                <div className="message-text">
                                {message.content}
                                </div>
                            </div>
                            </div>
                        ))
                        )}

                        {isLoading && (
                        <div className="message assistant">
                            <div className="message-content assistant-message">
                            <div className="avatar assistant-avatar">A</div>
                            <div className="message-text typing-indicator">
                                <div className="dot"></div>
                                <div className="dot"></div>
                                <div className="dot"></div>
                            </div>
                            </div>
                        </div>
                        )}
                    </div>
                    </section>

                    <footer className="input-area">
                    <form onSubmit={handleSubmit} className="form">
                        <input
                        type="text"
                        value={input}
                        onChange={handleInputChange}
                        placeholder="Pregunta algo sobre este salón..."
                        className="input"
                        disabled={isLoading}
                        />
                        <button type="submit" className="send-button" disabled={isLoading || !input.trim()}>
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="18"
                            height="18"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="send-icon"
                        >
                            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                        </svg>
                        </button>
                    </form>
                    </footer>
                </main>
                </section>

            </main>
                </div>
            </main>
        </div>
    )
}