import {Navigate, Outlet} from "react-router-dom";

import Loader from "@/common/components/loader/Loader";
import {useAppSelector} from "@/common/hooks/useAppSelector";

import {ROUTES} from "./routes";

export default function ProtectedRoute() {

    const {

        isAuthenticated,

        isLoading,

    } = useAppSelector(state => state.auth);

    if (isLoading) {

        return <Loader/>;

    }

    if (!isAuthenticated) {

        return (
            <Navigate
                to={ROUTES.LOGIN}
                replace
            />
        );

    }

    return <Outlet/>;

}