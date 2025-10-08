import 'dotenv/config';
import express from "express";
import cors from "cors";
import animeRoutes from './src/routes/animeRoutes.js';
import authRoutes from './src/routes/authRoutes.js'
import preferenceRoutes from './src/routes/preferenceRoutes.js'
import cookieParser from 'cookie-parser';
import watchlistRoutes from './src/routes/watchlistRoutes.js';
import userReactionRoutes from './src/routes/userReactionRoutes.js';
import reccommendationRoutes from './src/routes/reccommendationRoutes.js';

const app = express();

app.use(cors({origin: process.env.CORS_ORIGIN}));
app.use(express.json());
app.use(cookieParser());





app.use('/api/anime', animeRoutes);

app.use('/auth',authRoutes);

app.use('/preferences',preferenceRoutes);

app.use('/watchlists', watchlistRoutes);

app.use('/user-reactions', userReactionRoutes);

app.use('/recommendations', reccommendationRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
