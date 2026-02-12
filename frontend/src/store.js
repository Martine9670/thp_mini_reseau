import { configureStore, createSlice } from '@reduxjs/toolkit';

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    token: localStorage.getItem('token') || null,
    // Sécurité pour le JSON.parse : on vérifie si l'item existe avant de parser
    user: localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')) : null,
  },
  reducers: {
    loginSuccess: (state, action) => {
      state.token = action.payload.jwt;
      state.user = action.payload.user;
      localStorage.setItem('token', action.payload.jwt);
      localStorage.setItem('user', JSON.stringify(action.payload.user));
    },
    logout: (state) => {
      state.token = null;
      state.user = null;
      localStorage.clear();
    },
    updateUser: (state, action) => {
      state.user = action.payload;
      localStorage.setItem('user', JSON.stringify(action.payload));
    }
  }
}); // <-- L'accolade de fin du createSlice était ici

export const { loginSuccess, logout, updateUser } = authSlice.actions;

export const store = configureStore({ 
  reducer: { 
    auth: authSlice.reducer 
  } 
});