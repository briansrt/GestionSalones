import {React, useEffect, useState} from 'react';
import { useParams, Link } from 'react-router';
import { ChevronLeft } from 'lucide-react';
import './styles/salon.css';

export default function Salon(){
    const { id } = useParams();
    const [datosSalon, setDatosSalon] = useState([]);
    const [selectedImage, setSelectedImage] = useState(0);    
    
    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch('https://gestion-salones-back.vercel.app/javeriana/salon', {
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
                                    {Array.isArray(datosSalon.equipamientoTecnologico) && datosSalon.equipamientoTecnologico.length > 0 ? (
                                        datosSalon.equipamientoTecnologico.map((item, index) => (
                                        <li key={index}>{item}</li>
                                        ))
                                    ) : datosSalon.equipamientoTecnologico ? (
                                        <li>{datosSalon.equipamientoTecnologico}</li>
                                    ) : (
                                        <li>No hay datos</li>
                                    )}
                                </ul>
                            </div>
                            <div>
                                <h3 className="info-label">Tipo de Sila:</h3>
                                <p>{datosSalon.tipoSilla || "No hay datos"}</p>
                            </div>
                            <div>
                                <h3 className="info-label">Tipo de Tablero:</h3>
                                <p>{datosSalon.tipoTablero || "No hay datos"}</p>
                            </div>
                            <div>
                                <h3 className="info-label">Tomacorriente:</h3>
                                <p>{datosSalon.tomacorriente || "No hay datos"}</p>
                            </div>
                            <div>
                                <h3 className="info-label">Movilidad:</h3>
                                <p>{datosSalon.movilidad || "No hay datos"}</p>
                            </div>
                        </div>
                    </div>
                </section>

            </main>
                </div>
            </main>
        </div>
    )
}