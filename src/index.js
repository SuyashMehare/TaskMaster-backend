import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import connectDB from './config/db.js';
import { organisationRouter, userRouter,organizationUserRouter, productRouter, epicRouter } from './routes/index.js';


dotenv.config();

const app = express();
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  credentials: true
}));
app.use(express.json());



app.use('/api/v1/users', userRouter);
app.use('/api/v1/organisations', organisationRouter);
app.use('/api/v1/product', productRouter);
app.use('/api/v1/epic', epicRouter);
app.use('/api/v1/organisationUser', organizationUserRouter);

const PORT = process.env.PORT || 5000;

connectDB()
.then(() => {
  app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
  });
})
.catch((error) => {
  console.error('❌ Database connection failed:', error.message);
  process.exit(1);
});

