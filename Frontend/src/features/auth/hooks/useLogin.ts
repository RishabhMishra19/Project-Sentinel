import {useMutation} from "@tanstack/react-query";
import {useNavigate} from "react-router-dom";

import authApi from "../api/authApi";
import {authenticate} from "../authSlice";

import {ROUTES} from "@/app/router/routes";
import {authStorage} from "@/common/storage/authStorage";
import {useAppDispatch} from "@/common/hooks/useAppDispatch";

export default function useLogin() {

    const dispatch = useAppDispatch();

    const navigate = useNavigate();

    return useMutation({

        mutationFn: authApi.login,

        onSuccess(response) {

            authStorage.saveRefreshToken(
                response.refreshToken
            );

            dispatch(
                authenticate({
                    accessToken: response.accessToken,
                    user: response.user,
                })
            );

            navigate(ROUTES.DASHBOARD);

        },

    });

}