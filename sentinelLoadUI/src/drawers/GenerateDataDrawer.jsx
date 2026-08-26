import GenerateDataForm from "../components/GenerateDataForm";
import Drawer from "../molecules/Drawer";

export const GenerateDataDrawer = ({ open, onClose }) => {
    return (
        <Drawer open={open} onClose={onClose} title={"Generate Data"}>
            <GenerateDataForm onClose={onClose} />
        </Drawer>
    );
};
