import GenerateDataForm from "../components/GenerateDataForm";
import Drawer from "../atoms/Drawer";

export const GenerateDataDrawer = ({ open, onClose }) => {
    return (
        <Drawer open={open} onClose={onClose} title={"Generate Data"}>
            <GenerateDataForm />
        </Drawer>
    );
};
