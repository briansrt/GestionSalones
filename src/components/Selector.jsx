import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import { Search } from 'lucide-react';
import './styles/selector.css';

export default function Selector() {
  const navigate = useNavigate();
  const [selectedSalon, setSelectedSalon] = useState('');

  const handleSelect = (e) => {
    setSelectedSalon(e.target.value);
  };

  const handleButtonClick = () => {
    if (selectedSalon) {
      navigate(`/salon/${selectedSalon}`);
    } else {
      alert("Por favor selecciona un salón.");
    }
  };

  return (
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
            <p className="card-subtitle">Explora información detallada y consulta disponibilidad</p>
          </div>
          <div className="card-body">
            <label htmlFor="salon-select">Selecciona un salón para ver detalles</label>
            <select id="salon-select" className="salon-select" value={selectedSalon}onChange={handleSelect} >
              <option value="">Seleccione un salón</option>
              <option value="SM-1.10">SM-1.10</option>
              <option value="SM-1.2">SM-1.2</option>
              <option value="SM-1.3">SM-1.3</option>
              <option value="SM-1.4">SM-1.4</option>
              <option value="SM-1.5">SM-1.5</option>
              <option value="SM-1.6">SM-1.6</option>
              <option value="SM-1.7">SM-1.7</option>
              <option value="SM-1.8">SM-1.8</option>
              <option value="SM-1.9">SM-1.9</option>
              <option value="SM-2.10">SM-2.10</option>
              <option value="SM-2.11">SM-2.11</option>
              <option value="SM-2.12">SM-2.12</option>
              <option value="SM-2.2">SM-2.2</option>
              <option value="SM-2.3">SM-2.3</option>
              <option value="SM-2.4">SM-2.4</option>
              <option value="SM-2.5">SM-2.5</option>
              <option value="SM-2.6">SM-2.6</option>
              <option value="SM-2.7">SM-2.7</option>
              <option value="SM-2.8">SM-2.8</option>
              <option value="SM-2.9">SM-2.9</option>
              <option value="SM-A.1">SM-A.1</option>
              <option value="SM-AI">SM-AI</option>
            </select>
            <button className="button-select" onClick={handleButtonClick}>
              <Search size={18} />
              Ver Detalles del Salón
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
