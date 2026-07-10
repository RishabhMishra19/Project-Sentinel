import {createSlice, type PayloadAction} from "@reduxjs/toolkit";

import type {CurrentUser} from "./dto/CurrentUser";

export interface AuthState {

    accessToken: string | null;

    user: CurrentUser | null;

    isAuthenticated: boolean;

    isLoading: boolean;

}

const initialState: AuthState = {

    accessToken: null,

    user: null,

    isAuthenticated: false,

    isLoading: true,

};

const authSlice = createSlice({

    name: "auth",

    initialState,

    reducers: {

        authenticate(
            state,
            action: PayloadAction<{
                accessToken: string;
                user: CurrentUser;
            }>
        ) {

            state.accessToken = action.payload.accessToken;
            state.user = action.payload.user;
            state.isAuthenticated = true;
            state.isLoading = false;

        },

        updateAccessToken(
            state,
            action: PayloadAction<string>
        ) {

            state.accessToken = action.payload;

        },

        logout(state) {

            state.accessToken = null;
            state.user = null;
            state.isAuthenticated = false;
            state.isLoading = false;

        },

        finishLoading(state) {

            state.isLoading = false;

        },

    },

});

export const {

    authenticate,

    updateAccessToken,

    logout,

    finishLoading,

} = authSlice.actions;

export default authSlice.reducer;