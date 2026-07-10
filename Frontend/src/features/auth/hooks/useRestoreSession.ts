import {useEffect} from "react";

import authApi from "../api/authApi";
import {authenticate, finishLoading, logout,} from "../authSlice";

import {authStorage} from "@/common/storage/authStorage";
import {useAppDispatch} from "@/common/hooks/useAppDispatch";

export default function useRestoreSession() {

    const dispatch = useAppDispatch();

    useEffect(() => {

        async function restoreSession() {

            const refreshToken =
                authStorage.getRefreshToken();

            if (!refreshToken) {

                dispatch(finishLoading());

                return;

            }

            try {

                const response =
                    await authApi.refreshAccessToken({
                        refreshToken,
                    });

                authStorage.saveRefreshToken(
                    response.refreshToken
                );

                dispatch(
                    authenticate({
                        accessToken: response.accessToken,
                        user: response.user,
                    })
                );

            } catch {

                authStorage.removeRefreshToken();

                dispatch(logout());

            }

        }

        restoreSession();

    }, [dispatch]);

}