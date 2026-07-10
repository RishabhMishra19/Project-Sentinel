import AppRouter from "./app/router/AppRouter";
import useRestoreSession from "./features/auth/hooks/useRestoreSession";

export default function App() {
    useRestoreSession();
    return <AppRouter/>;
}