import api from './api';

export const getWorkers = async () => {
  const res = await api.get('/workers');
  return res.data;
};

export const getWorkerById = async (id) => {
  const res = await api.get(`/workers/${id}`);
  return res.data;
};
