import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'

export interface RFQState {
  value: number
}

const initialState: RFQState = {
  value: 0,
}

export const rfqSlice = createSlice({
  name: 'counter',
  initialState,
  reducers: {
  },
})

// Action creators are generated for each case reducer function
export const {  } = rfqSlice.actions

export default rfqSlice.reducer