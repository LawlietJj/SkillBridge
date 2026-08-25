import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

export const login = (email, password) =>
  api.post('/login', { email, password });

export const signup = (name, email, password) =>
  api.post('/signup', { name, email, password });

export const getCareers = () => api.get('/careers');

export const getProjects = () => api.get('/projects');

export const getStudent = (id) => api.get(`/students/${id}`);

export const getPathToGoal = (studentId, careerName) =>
  api.get('/path-to-goal', { params: { studentId, careerName } });

export const getMentorCoverage = (skillIds) =>
  api.get('/mentor-coverage', { params: { skillIds: skillIds.join(',') } });

export default api;