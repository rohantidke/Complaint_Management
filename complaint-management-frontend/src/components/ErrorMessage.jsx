const ErrorMessage = ({ error }) => {
  if (!error) {
    return null;
  }

  let message = "Something went wrong.";

  if (typeof error === "string") {
    message = error;
  } else if (error?.response?.data) {
    const data = error.response.data;

    if (typeof data === "string") {
      message = data;
    } else {
      message =
        data.message ||
        data.error ||
        data.detail ||
        data.title ||
        `Request failed with status ${error.response.status}`;
    }
  } else if (error?.message) {
    message = error.message;
  }

  return (
    <div className="error-message">
      <strong>Error</strong>
      <span>{message}</span>
    </div>
  );
};

export default ErrorMessage;