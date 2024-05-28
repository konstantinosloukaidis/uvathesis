import './App.css';
import EuropeMain from './pages/EuropeMain';
import PlotSwitcher from './pages/PlotSwitcher';
import FilePage from './pages/FilePage';
import React from 'react';
import { Route, BrowserRouter, Routes, Navigate } from 'react-router-dom';
import MetricsPage from './pages/MetricsPage';
import FiveStarRetrievalDifficultyPage from './pages/FiveStarRetrievalDifficultyPage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/map" />} />
        <Route path="/map" element={<EuropeMain />} />
        <Route path="/plots/:country" element={<PlotSwitcher />} />
        <Route path="/document/:country/:filename" element={<FilePage />} />
        <Route path="/information/metrics" element={<MetricsPage />} />
        <Route path="/information/five-star-retrieval-difficulty" element={<FiveStarRetrievalDifficultyPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
