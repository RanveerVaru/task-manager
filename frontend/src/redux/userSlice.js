import { createSlice } from "@reduxjs/toolkit";

const userSlice = createSlice({
    name : "user",
    initialState : {
        authUser : null,
        task : null,
    },
    reducers : {
        setAuthUser :  (state , action) => {
            state.authUser = action.payload;
        },
        setTask : (state , action) => {
            state.task = action.payload;
        },
        logout : (state) => {
            state.authUser = null;
            state.task = null;
        }
    }
});

export const { setAuthUser , setTask  , logout} = userSlice.actions;
export default userSlice.reducer;