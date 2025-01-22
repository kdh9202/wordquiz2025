import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './index.css'
import Home from './pages/Home'
//import Home2 from './pages/Home2'
import WordQuiz1 from './pages/WordQuiz1'
import WordQuiz2 from './pages/WordQuiz2'
import WordQuiz3 from './pages/WordQuiz3'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/wordquiz1" element={<WordQuiz1 />} />
        <Route path="/wordquiz2" element={<WordQuiz2 />} />
        <Route path="/wordquiz3" element={<WordQuiz3 />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
)
