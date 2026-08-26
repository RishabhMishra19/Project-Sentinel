import Drawer from "../molecules/Drawer";
import { LoadTestDataDashboard } from "../components/LoadTestDataDashboard";
import { LoadTestDataHeader } from "../components/LoadTestDataHeader";
import { useLoadContext } from "../hooks/useLoadContext";

export default function LoadTestDataDashboardDrawer({
    open,
    onClose,
    loadTestDataId,
}) {
    const { getLoadTest } = useLoadContext();
    const data = getLoadTest(loadTestDataId) ?? {};
    return (
        <Drawer
            title={
                <LoadTestDataHeader
                    name={data.name}
                    id={data.id}
                    status={data.status}
                />
            }
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
