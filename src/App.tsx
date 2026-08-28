import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { Layout } from './components/Layout';
import { ProgressProvider } from './context/ProgressContext';
import { Home } from './pages/Home';
import { PracticeIndex } from './pages/PracticeIndex';
import { PracticeSession } from './pages/PracticeSession';
import { Review } from './pages/Review';
import { ExamSimulation } from './pages/ExamSimulation';
import { Stats } from './pages/Stats';

export default function App() {
  return (
    <ProgressProvider>
      <Routes>
        <Route element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="ova" element={<PracticeIndex />} />
          <Route path="ova/:subTest" element={<PracticeSession />} />
          <Route path="repetition" element={<Review />} />
          <Route path="prov" element={<ExamSimulation />} />
          <Route path="statistik" element={<Stats />} />
        </Route>
      </Routes>
    </ProgressProvider>
  );
}
