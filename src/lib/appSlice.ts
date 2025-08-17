import { createSlice } from '@reduxjs/toolkit'

export const appSlice = createSlice({
  name: 'app',
  initialState: {
    isAuth: false,
  },
  selectors: {
    selectIsAuth: state => state.isAuth,
  },
  reducers: creators => ({
    setIsAuth: creators.reducer<{ isAuth: boolean }>((state, action) => {
      state.isAuth = action.payload.isAuth
    }),
  }),
})

export const appReducer = appSlice.reducer
export const { setIsAuth } = appSlice.actions
export const { selectIsAuth } = appSlice.selectors
