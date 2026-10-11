import api from './api';

export const getExecutions = async () => {
  const res = await api.get('/executions');
  return res.data;
};

export const getExecutionById = async (id) => {
  const res = await api.get(`/executions/${id}`);
  return res.data;
};

export const getExecutionsByJobId = async (jobId) => {
  const res = await api.get(`/executions/job/${jobId}`);
  return res.data;
};

export const getExecutionEvents = async (id) => {
  const res = await api.get(`/executions/${id}/events`);
  return res.data;
};
