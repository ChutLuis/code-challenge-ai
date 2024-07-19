import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'

interface Item {
  type: string;
  thickness: string;
  dimensions: string;
  quantity: number;
}

export interface RFQState {
  quoted: Item[];
  available: any;
  to: string;
}

const initialState: RFQState = {
  quoted: [],
  available: [],
  to: ''
}

export const rfqSlice = createSlice({
  name: 'rfq',
  initialState,
  reducers: {
    setRFQState(state, action: PayloadAction<Partial<RFQState>>) {
      return { ...state, ...action.payload };
    },
    resetRFQState() {
      return initialState;
    },
  },
})

// Action creators are generated for each case reducer function
export const { setRFQState, resetRFQState } = rfqSlice.actions

export default rfqSlice.reducer
