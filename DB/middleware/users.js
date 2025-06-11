// middleware/users.js
export const logUserRequest=(req, res, next)=> {
  console.log(`[${new Date().toISOString()}] User Route Accessed: ${req.method} ${req.originalUrl}`);
  next();
}

export default logUserRequest;