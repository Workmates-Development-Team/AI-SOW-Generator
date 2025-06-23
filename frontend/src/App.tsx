import { BrowserRouter, Routes, Route } from 'react-router-dom';
import GeneratePPTPage from "./pages/GenerateSOWPage";
import SOWViewer from "./pages/SOWViewer";

export default function App() {
  return(
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<GeneratePPTPage />} />
        <Route path="/presentation" element={<SOWViewer />} />
      </Routes>
    </BrowserRouter>
  )
}
