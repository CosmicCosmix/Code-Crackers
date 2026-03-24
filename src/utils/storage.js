export const STORAGE_KEYS = {
  PROJECTS: 'cc_projects'
};

const MAX_HISTORY = 20;

// Async wrappers for localStorage to simulate non-blocking I/O
export async function getProjects() {
  return new Promise((resolve) => {
    setTimeout(() => {
      try {
        const data = localStorage.getItem(STORAGE_KEYS.PROJECTS);
        resolve(data ? JSON.parse(data) : []);
      } catch (e) {
        console.error("Failed to parse projects from localStorage", e);
        resolve([]);
      }
    }, 0);
  });
}

export async function saveProjects(projects) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      try {
        // Enforce max history length for each project
        const limitedProjects = projects.map(p => {
          if (p.history && p.history.length > MAX_HISTORY) {
            console.warn(`Project ${p.id} hit max history cap. Dropping oldest snapshot... Storing base64 is RAM intensive.`);
            return {
              ...p,
              history: p.history.slice(-MAX_HISTORY)
            };
          }
          return p;
        });
        localStorage.setItem(STORAGE_KEYS.PROJECTS, JSON.stringify(limitedProjects));
        resolve();
      } catch (e) {
        console.error("Failed to save projects to localStorage. Storage might be full.", e);
        reject(e);
      }
    }, 0);
  });
}


