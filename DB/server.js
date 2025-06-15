import app from './app.js';
import dotenv from 'dotenv';

dotenv.config();

const PORT = process.env.PORT || 5000;
const ENV = process.env.NODE_ENV || 'development';

app.listen(PORT, () => {
  console.log(`Server running in ${ENV} mode on port ${PORT}`);
  console.log("DB_USER:", process.env.DB_USER); // فقط للتأكد، إحذفها لاحقًا

});