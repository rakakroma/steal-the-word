export const errorMessage = (message) => {
  return {
    status: 'error',
    message,
  };
};

export const successMessage = (message) => {
  return {
    status: 'success',
    message,
  };
};
