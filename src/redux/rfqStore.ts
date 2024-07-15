import { configureStore } from '@reduxjs/toolkit'
import rfqReducer from './rfqReducer'

export const store = configureStore({
  reducer: {
    rfq:rfqReducer
  },
})

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch