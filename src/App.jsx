import { BrowserRouter, Routes, Route } from 'react-router-dom'
import WordQuiz1 from './pages/WordQuiz1'
import WordQuiz2 from './pages/WordQuiz2'
import WordQuiz3 from './pages/WordQuiz3'
import Home from './pages/Home'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/wordquiz1" element={<WordQuiz1 />} />
        <Route path="/wordquiz2" element={<WordQuiz2 />} />
        <Route path="/wordquiz3" element={<WordQuiz3 />} />
      </Routes>
    </BrowserRouter>
  )
}
