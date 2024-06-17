import './App.css';
import EuropeMain from './pages/EuropeMain';
import PlotSwitcher from './pages/PlotSwitcher';
import FilePage from './pages/FilePage';
import React from 'react';
import { Route, BrowserRouter, Routes, Navigate } from 'react-router-dom';
import MetricsPage from './pages/MetricsPage';
import FiveStarRetrievalDifficultyPage from './pages/FiveStarRetrievalDifficultyPage';
import AboutPage from './pages/AboutPage';
import Layout from './components/Layout';

function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<Navigate to="/map" />} />
          <Route path="/map" element={<EuropeMain />} />
          <Route path="/plots/:country" element={<PlotSwitcher />} />
          <Route path="/document/:country/:filename" element={<FilePage />} />
          <Route path="/information/metrics" element={<MetricsPage />} />
          <Route path="/information/five-star-retrieval-difficulty" element={<FiveStarRetrievalDifficultyPage />} />
          <Route path="/about" element={<AboutPage />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}

export default App;
