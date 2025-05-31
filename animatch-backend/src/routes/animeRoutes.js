import express from 'express';
import { fetchAnimeListByAgeRating, fetchAnimeListByCategory, fetchAnimeListByName, fetchAnimeListBySeasonYear, fetchAnimeListByStatus, fetchAnimeListBySeason, addAnimeMetadata } from '../controllers/animeController.js';

//this file exposes the API endpoints
const router = express.Router();

router.get("/category/:category", fetchAnimeListByCategory);
router.get("/name/:name", fetchAnimeListByName);
router.get("/ageRating/:ageRating", fetchAnimeListByAgeRating);
router.get("/seasonYear/:year", fetchAnimeListBySeasonYear);
//current, upcoming, or finished
router.get("/status/:status", fetchAnimeListByStatus);
router.get("/season/:season", fetchAnimeListBySeason);
router.post("/insertMetadata/:category", addAnimeMetadata );

export default router;