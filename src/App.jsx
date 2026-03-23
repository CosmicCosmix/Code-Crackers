import { HashRouter, Routes, Route } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';
import HomePage from './pages/HomePage';
import UploadPage from './pages/UploadPage';
import DesignPage from './pages/DesignPage';
import ProjectsPage from './pages/ProjectsPage';

function App() {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<MainLayout />}>
          <Route index element={<HomePage />} />
          <Route path="upload" element={<UploadPage />} />
          <Route path="projects" element={<ProjectsPage />} />
          <Route path="design/:id" element={<DesignPage />} />
        </Route>
      </Routes>
    </HashRouter>
  );
}

export default App;
