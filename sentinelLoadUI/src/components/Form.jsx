import { ErrorMessage } from "./ErrorMessage";

export const Form = ({
    children,
    handleSubmit,
    isLoading,
    errorMessage,
    submitButtonText = "Submit",
}) => {
    return (
        <div
            style={{
                padding: "20px",
                fontFamily: "sans-serif",
                maxWidth: "600px",
            }}
        >
            {errorMessage && <ErrorMessage errorMessage={errorMessage} />}
            <form
                onSubmit={handleSubmit}
                style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "10px",
                }}
            >
                {children}
                <button
                    type="submit"
                    disabled={isLoading}
                    style={{
                        padding: "10px",
                        background: isLoading ? "#8fbbea" : "#007bff",
                        color: "white",
                        border: "none",
                        cursor: "pointer",
                    }}
                >
                    {submitButtonText}
                </button>
            </form>
        </div>
    );
};
