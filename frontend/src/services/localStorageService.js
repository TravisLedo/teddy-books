export const getLocalUser = async () => {
  return localStorage.getItem('user')
};

export const setLocalUser = async (userData) => {
  localStorage.setItem('user', JSON.stringify(userData))
};