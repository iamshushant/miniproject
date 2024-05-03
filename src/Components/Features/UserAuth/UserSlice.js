// redux import
import { createSlice } from "@reduxjs/toolkit";

export const userSlice = createSlice({
    name: "user",       // name of the var used
    initialState: {     // init state of the var
        user: null,
    },
    reducers: {         // reducer funcs
        login: (state, action) => {
            state.user = action.payload;
        },
        logout: (state) => {
            state.user = null;
        }
    }
});

export const { login, logout } = userSlice.actions;

export const selectUser = (state) => state.user.user;

export default userSlice.reducer;