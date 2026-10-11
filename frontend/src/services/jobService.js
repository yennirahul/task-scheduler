import api from './api';

export const getJobs = async () => {
  const res = await api.get('/jobs');
  return res.data;
};

export const getJobById = async (id) => {
  const res = await api.get(`/jobs/${id}`);
  return res.data;
};

export const createJob = async (jobData) => {
  const res = await api.post('/jobs', jobData);
  return res.data;
};

export const updateJobStatus = async (id, status) => {
  const res = await api.patch(`/jobs/${id}/status?status=${status}`);
  return res.data;
};

export const deleteJob = async (id) => {
  await api.delete(`/jobs/${id}`);
};
