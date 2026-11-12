import api from "./api.js";

const getRoleByUserId = async (userId) => {
  const response = await api.get(`/rest/v1/user_roles`, {
    params: { user_id: `eq.${userId}`, select: "role" },
  });
  return response.data[0]?.role ?? null;
};

export default getRoleByUserId;