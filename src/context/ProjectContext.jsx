import { createContext, useContext, useState, useEffect } from 'react';
import { getProjects, saveProjects } from '../utils/storage';

const ProjectContext = createContext(null);

export function ProjectProvider({ children }) {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      const projs = await getProjects();
      setProjects(projs);
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

  const value = {
    projects,
    addProject,
    updateProject,
    deleteProject,
  };

  if (loading) return null; // Or a loading spinner

  return <ProjectContext.Provider value={value}>{children}</ProjectContext.Provider>;
}

export function useProjects() {
  return useContext(ProjectContext);
}
