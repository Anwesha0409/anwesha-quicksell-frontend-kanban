import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import KanbanPage from "./Components/KanbanPage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='*' element={<KanbanPage />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App;
