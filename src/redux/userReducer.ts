import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'

export interface UserState {
  token: string;
}

const initialState: UserState = {
  token: localStorage.getItem('token')||''
}

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUserToken(state, action: PayloadAction<Partial<UserState>>) {
      localStorage.setItem('token', action.payload.token?action.payload.token:"");
      return { ...state, ...action.payload };
    },
    resetToken() {
      localStorage.removeItem('token');
      return initialState;
    },
  },
})

// Action creators are generated for each case reducer function
export const { setUserToken, resetToken } = userSlice.actions

export default userSlice.reducer
