import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import HomePage from './pages/HomePage';
import RecipeBookPage from './pages/RecipeBookPage';
import UploadPage from './pages/UploadPage';
import RankingPage from './pages/RankingPage';
import SettingsPage from './pages/SettingsPage';
import AuthPage from './pages/AuthPage';
import HungryPage from './pages/HungryPage';

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/recipe-book" element={<RecipeBookPage />} />
          <Route path="/upload" element={<UploadPage />} />
          <Route path="/ranking/:period" element={<RankingPage />} />
          <Route path="/settings" element={<SettingsPage />} />
          <Route path="/auth" element={<AuthPage />} />
          <Route path="/hungry" element={<HungryPage />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;