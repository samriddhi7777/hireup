export const validateRequest = (req, res, next) => {
  // This is a simplified version that just passes through
  // In a real app, you'd check validation results here
  next();
};
