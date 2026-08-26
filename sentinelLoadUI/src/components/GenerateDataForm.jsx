import { useCreateTestData } from "../hooks/useCreateTestData";
import { Form } from "../molecules/Form";
import { Input } from "../molecules/Input";

export default function GenerateDataForm({ onClose }) {
    const { loadData, handleChange, handleCreate, result } = useCreateTestData({
        onSuccess: onClose,
    });

    return (
        <Form
            handleSubmit={handleCreate}
            isLoading={result.isLoading}
            errorMessage={result.errorMessage}
            submitButtonText="Generate Data"
        >
            <Input
                label={"Name"}
                type="text"
                name={"name"}
                value={loadData.name}
                onChange={handleChange}
            />

            <Input
                label={"Tenant Count"}
                type="number"
                name="tenantCount"
                value={loadData.tenantCount}
                onChange={handleChange}
            />

            <Input
                label="Products / Tenant"
                type="number"
                name="productsPerTenant"
                value={loadData.productsPerTenant}
                onChange={handleChange}
            />

            <Input
                label="Services / Product"
                type="number"
                name="servicesPerProduct"
                value={loadData.servicesPerProduct}
                onChange={handleChange}
            />

            <Input
                label="Endpoint / Service"
                type="number"
                name="endpointsPerService"
                value={loadData.endpointsPerService}
                onChange={handleChange}
            />
        </Form>
    );
}
