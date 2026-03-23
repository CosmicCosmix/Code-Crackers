import { createContext, useContext, useState, useEffect } from 'react';
import { getProjects, saveProjects, getReplicateKey, saveReplicateKey } from '../utils/storage';

const ProjectContext = createContext(null);

export function ProjectProvider({ children }) {
  const [projects, setProjects] = useState([]);
  const [replicateKey, setReplicateKey] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      const projs = await getProjects();
      let key = await getReplicateKey();
      // Hardcode API key for prototype use as requested safely
      if (!key) {
        key = 'r8_VTJJDL5eR0lHIFhkOtR7tHlCCr3A4Uv2sE7CG';
        await saveReplicateKey(key); // Save it so we don't ask again
      }
      setProjects(projs);
      setReplicateKey(key);
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

  const updateKey = async (key) => {
    setReplicateKey(key);
    await saveReplicateKey(key);
  };

  const value = {
    projects,
    replicateKey,
    addProject,
    updateProject,
    deleteProject,
    updateKey,
  };

  if (loading) return null; // Or a loading spinner

  return <ProjectContext.Provider value={value}>{children}</ProjectContext.Provider>;
}

export function useProjects() {
  return useContext(ProjectContext);
}
