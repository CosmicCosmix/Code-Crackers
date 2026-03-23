import { createContext, useContext, useState, useEffect } from 'react';
import { getProjects, saveProjects, getHfToken, saveHfToken } from '../utils/storage';

const ProjectContext = createContext(null);

export function ProjectProvider({ children }) {
  const [projects, setProjects] = useState([]);
  const [hfToken, setHfToken] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      const projs = await getProjects();
      let key = await getHfToken();
      setProjects(projs);
      setHfToken(key);
      setLoading(false);
    }
    loadData();
  }, []);

  const addProject = async (project) => {
    const newProjects = [project, ...projects];
    setProjects(newProjects);
    await saveProjects(newProjects);
  };

  const updateProject = async (updatedProject) => {
    const newProjects = projects.map(p => p.id === updatedProject.id ? updatedProject : p);
    setProjects(newProjects);
    await saveProjects(newProjects);
  };

  const deleteProject = async (id) => {
    const newProjects = projects.filter(p => p.id !== id);
    setProjects(newProjects);
    await saveProjects(newProjects);
  };

  const updateToken = async (key) => {
    setHfToken(key);
    await saveHfToken(key);
  };

  const value = {
    projects,
    hfToken,
    addProject,
    updateProject,
    deleteProject,
    updateToken,
  };

  if (loading) return null; // Or a loading spinner

  return <ProjectContext.Provider value={value}>{children}</ProjectContext.Provider>;
}

export function useProjects() {
  return useContext(ProjectContext);
}
