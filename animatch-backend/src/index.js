import 'dotenv/config';
import express from "express";
import cors from "cors";
import animeRoutes from './routes/animeRoutes.js';
import authRoutes from './routes/authRoutes.js'
import preferenceRoutes from './routes/preferenceRoutes.js'
import cookieParser from 'cookie-parser';
import watchlistRoutes from './routes/watchlistRoutes.js';
import userReactionRoutes from './routes/userReactionRoutes.js';
import reccommendationRoutes from './routes/reccommendationRoutes.js';


const app = express();

app.use(cors({origin: process.env.CORS_ORIGIN, credentials: true}));
app.use(express.json());
app.use(cookieParser());



app.use('/api/anime', animeRoutes);
app.use('/auth',authRoutes);
app.use('/preference',preferenceRoutes);
app.use('/watchlist', watchlistRoutes);
app.use('/user-reaction', userReactionRoutes);
app.use('/ai', reccommendationRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
