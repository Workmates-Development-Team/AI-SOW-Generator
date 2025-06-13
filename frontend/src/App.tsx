import { BrowserRouter, Routes, Route } from 'react-router-dom';
import GeneratePPTPage from "./pages/GeneratePPTPage";
import PPTEditor from "./pages/PPTEditor";
import PresentationViewer from "./pages/PresentationViewer";

function App() {
  return(
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<GeneratePPTPage />} />
        <Route path="/presentation" element={<PresentationViewer />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App;