export const Input = ({ label, value, onChange, name, type = "text" }) => {
    return (
        <label>
            {label}:
            <input
                type={type}
                name={name}
                value={value}
                onChange={onChange}
                style={{
                    width: "100%",
                    padding: "8px",
                    marginTop: "4px",
                }}
            />
        </label>
    );
};
