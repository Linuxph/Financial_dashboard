export const buildResponse = (success: boolean, message: string, data?: unknown) => {
  if (data === undefined) {
    return { success, message };
  }
  return { success, message, data };
};
