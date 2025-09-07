import axios from "axios";
const API_URL = import.meta.env.VITE_API_URL;

export const getRooms = async (token: string) => {
  return axios.get(`${API_URL}/rooms?limit=99`, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

export const createRoom = async (formData: FormData, token: string) => {
  return axios.post(`${API_URL}/rooms`, formData, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "multipart/form-data",
    },
  });
};

export const updateRoom = async (roomId: string, formData: FormData, token: string) => {
  return axios.patch(`${API_URL}/rooms/${roomId}`, formData, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "multipart/form-data",
    },
  });
};

export const deleteRoom = async (roomId: string, token: string) => {
  return axios.delete(`${API_URL}/rooms/${roomId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
};
