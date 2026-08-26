import Drawer from "../molecules/Drawer";
import { LoadTestDataDashboard } from "../components/LoadTestDataDashboard";
import { LoadTestDataHeader } from "../components/LoadTestDataHeader";

export default function LoadTestDataDashboardDrawer({ open, onClose, data }) {
    const { name, id, status } = data ?? {};
    return (
        <Drawer
            title={<LoadTestDataHeader name={name} id={id} status={status} />}
            open={open}
            onClose={onClose}
            width="1000px"
        >
            <div className="max-w-xl mx-auto p-6 bg-white shadow-md rounded-lg">
                <LoadTestDataDashboard data={data} />
            </div>
        </Drawer>
    );
}
