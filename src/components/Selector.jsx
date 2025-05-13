import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router";
import { Search } from "lucide-react";
import ReactMarkdown from "react-markdown";

import "./styles/selector.css";

export default function Selector() {
  const navigate = useNavigate();
  const [todosSalones, setTodosSalones] = useState([]);
  const [selectSalon, setSelectSalon] = useState([]);
  const [selectedEdificio, setSelectedEdificio] = useState('');
  const [selectedSalon, setSelectedSalon] = useState("");
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingSalones, setIsLoadingSalones] = useState(false);
  const scrollAreaRef = useRef();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (input.trim()) {
      const userMessage = { id: Date.now(), role: "user", content: input };
      setMessages((prev) => [...prev, userMessage]);
      setInput("");
      setIsLoading(true);

      try {
        const response = await fetch(
          "https://gestion-salones-back.vercel.app/javeriana/chatbot",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              pregunta: input,
              salon: todosSalones, // Aquí envías los datos del salón
            }),
          }
        );

        const data = await response.json();

        if (response.ok) {
          const botMessage = {
            id: Date.now() + 1,
            role: "assistant",
            content: data.respuesta || "Sin respuesta del servidor.",
          };
          setMessages((prev) => [...prev, botMessage]);
        } else {
          const errorMessage = {
            id: Date.now() + 1,
            role: "assistant",
            content: "Error en la respuesta del servidor.",
          };
          setMessages((prev) => [...prev, errorMessage]);
        }
      } catch {
        const errorMessage = {
          id: Date.now() + 1,
          role: "assistant",
          content: "Error al conectar con el servidor.",
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

  const handleButtonClick = () => {
    if (selectedSalon) {
      navigate(`/salon/${selectedSalon}`);
    } else {
      alert("Por favor selecciona un salón.");
    }
  };

  const edificiosUnicos = [...new Map(
    selectSalon.map(salon => [
      salon.edificio_info[0]._id,
      salon.edificio_info[0]
    ])
  ).values()];

  const salonesFiltrados = selectSalon.filter(
    salon => salon.edificio_id === selectedEdificio
  );

  useEffect(() => {
    scrollAreaRef.current?.scrollTo(0, scrollAreaRef.current.scrollHeight);
  }, [messages]);

  useEffect(() => {
    const getSalones = async () => {
      setIsLoadingSalones(true);
      try {
        const response = await fetch(
          "https://gestion-salones-back.vercel.app/javeriana/GetAllsalones"
        );
        const data = await response.json();
        setTodosSalones(data);
        setSelectSalon(data.salones);
      } catch (error) {
        console.error("Error fetching salones:", error);
      } finally {
        setIsLoadingSalones(false);
      }
    };
    getSalones();
  }, []);

  return (
    <>
      {isLoadingSalones && (
        <div className="loading-modal">
          <div className="loading-content">
            <div className="loading-spinner"></div>
            <p>Cargando Chatbot...</p>
          </div>
        </div>
      )}

      <div className="layout">
        <header className="header">
        <div className="header-container">
          <h1 className="title">Sistema de Gestión de Salones</h1>
        </div>
      </header>

      <main className="main">
        <div className="card">
          <div className="card-header">
            <h2 className="card-title">Selecciona un Salón</h2>
            <p className="card-subtitle">
              Explora información detallada y consulta disponibilidad
            </p>
          </div>
          <div className="card-body">
            <label htmlFor="salon-select">
              Selecciona un salón para ver detalles
            </label>
            <select
              id="edificio-select"
              className="salon-select"
              value={selectedEdificio}
              onChange={(e) => {
                setSelectedEdificio(e.target.value);
                setSelectedSalon('');
              }}
            >
              <option value="">Seleccione un Edificio</option>
              {edificiosUnicos.map((edificio) => (
                <option key={edificio._id} value={edificio._id}>
                  {edificio.edificio}
                </option>
              ))}
              
            </select>
            <select 
              id="salon-select"
              className="salon-select"
              value={selectedSalon}
              onChange={(e) => setSelectedSalon(e.target.value)}
              disabled={!selectedEdificio}
            >
              <option value="">Seleccione un Salon</option>
              {salonesFiltrados.map((salon) => (
              <option key={salon._id} value={salon.salon}>
                {salon.salon}
              </option>
              ))}
            </select>
            <button className="button-select" onClick={handleButtonClick}>
              <Search size={18} />
              Ver Detalles del Salón
            </button>
          </div>
        </div>
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
                    <div
                      key={message.id}
                      className={`message ${
                        message.role === "user" ? "user" : "assistant"
                      }`}
                    >
                      <div
                        className={`message-content ${
                          message.role === "user"
                            ? "user-message"
                            : "assistant-message"
                        }`}
                      >
                        <div
                          className={`avatar ${
                            message.role === "user"
                              ? "user-avatar"
                              : "assistant-avatar"
                          }`}
                        >
                          {message.role === "user" ? "U" : "A"}
                        </div>
                        <div className="message-text">
                          {message.role === "assistant" ? (
                            <ReactMarkdown>{message.content}</ReactMarkdown>
                          ) : (
                            message.content
                          )}
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
                <button
                  type="submit"
                  className="send-button"
                  disabled={isLoading || !input.trim()}
                >
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
    </>
  );
}
