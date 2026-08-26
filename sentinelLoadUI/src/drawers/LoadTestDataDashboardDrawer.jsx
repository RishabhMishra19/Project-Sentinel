import Drawer from "../atoms/Drawer";
import { LoadTestDataDashboard } from "../components/LoadTestDataDashboard";

export default function LoadTestDataDashboardDrawer({ open, onClose, data }) {
    return (
        <Drawer title={"dashboard"} open={open} onClose={onClose} width="800px">
            <div className="max-w-xl mx-auto p-6 bg-white shadow-md rounded-lg">
                <LoadTestDataDashboard data={data} />
            </div>
        </Drawer>
    );
}
