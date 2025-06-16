import { BrowserRouter, Routes, Route } from 'react-router-dom';
import GeneratePPTPage from "./pages/GeneratePPTPage";
import PresentationViewer from "./pages/PresentationViewer";

export default function App() {
  return(
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<GeneratePPTPage />} />
        <Route path="/presentation" element={<PresentationViewer />} />
      </Routes>
    </BrowserRouter>
  )
}
