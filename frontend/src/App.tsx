import { BrowserRouter, Routes, Route } from 'react-router-dom';
import GeneratePPTPage from "./pages/GenerateSOWPage";
import SOWViewer from "./pages/SOWViewer";
import Layout from "./components/Layout";

export default function App() {
  return(
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<GeneratePPTPage />} />
          <Route path="/presentation" element={<SOWViewer />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  )
}
