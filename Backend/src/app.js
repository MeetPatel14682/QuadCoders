import express from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import dotenv from 'dotenv';
dotenv.config({ path: './.env' });
const app = express();

app.use(cors({
    origin:process.env.CORS_ORIGIN || 'http://localhost:3000',
    credentials: true,
}))

app.use(express.json()); //Use for parsing JSON bodies
app.use(express.urlencoded({extended:true, limit:'20kb'})); //Use for parsing URL-encoded bodies
app.use(express.static('public')); //Serve static files from the 'public' directory
app.use(cookieParser()); //Use for parsing cookies  

//history routes
import historyRoutes from './routes/history.routes.js';
app.use('/api/history', historyRoutes);

//own_database routes
import own_database from './routes/own_backend.routes.js'
app.use('/api/own_data',own_database)

//register routes
import registers from './routes/register.routes.js'
app.use('/api/register',registers)

//status routes
import status from './routes/status.routes.js'
app.use('/status',status)

//info routes
import info from './routes/information.routes.js'
app.use('/info',info)
export default app;