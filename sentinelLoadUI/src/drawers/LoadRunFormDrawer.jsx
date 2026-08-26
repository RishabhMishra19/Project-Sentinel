import { LoadRunForm } from "../components/LoadRunForm";
import Drawer from "../molecules/Drawer";

export const LoadRunFormDrawer = ({ loadTestRunId, open, onClose }) => {
    return (
        <Drawer
            open={open}
            onClose={onClose}
            title="Run Load Test"
            width="550px"
        >
            <LoadRunForm loadTestRunId={loadTestRunId} onClose={onClose} />
        </Drawer>
    );
};
