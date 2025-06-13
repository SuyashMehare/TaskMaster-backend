import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import connectDB from './config/db.js';
import { organisationRouter, userRouter } from './routes/index.js';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());



app.use('/api/v1/users', userRouter);
app.use('/api/v1/organisations', organisationRouter);


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

const PORT = process.env.PORT || 5000;
