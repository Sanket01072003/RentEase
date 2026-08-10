export const getToken = () => localStorage.getItem('token');
export const getRole  = () => localStorage.getItem('role');
export const getId    = () => localStorage.getItem('id');
export const getName  = () => localStorage.getItem('name');

export const saveAuth = (token, role, id, name) => {
  localStorage.setItem('token', token);
  localStorage.setItem('role',  role);
  localStorage.setItem('id',    String(id));
  localStorage.setItem('name',  name);
};

export const clearAuth = () => {
  ['token','role','id','name'].forEach(k => localStorage.removeItem(k));
};

export const isLoggedIn = () => !!getToken();
export const isOwner    = () => getRole() === 'OWNER';
export const isRenter   = () => getRole() === 'RENTER';
export const isAdmin    = () => getRole() === 'ADMIN';
