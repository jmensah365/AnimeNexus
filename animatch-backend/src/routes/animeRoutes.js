import express from 'express';
import { fetchAnimeListByAgeRating, fetchAnimeListByCategory, fetchAnimeListByName, fetchAnimeListBySeasonYear, fetchAnimeListByStatus, fetchAnimeListBySeason, addAnimeMetadata, getAnimeData } from '../controllers/animeController.js';

//this file exposes the API endpoints
const router = express.Router();

router.get("/category/:category", fetchAnimeListByCategory);
router.get("/name/:name", fetchAnimeListByName);
router.get("/ageRating/:ageRating", fetchAnimeListByAgeRating);
router.get("/seasonYear/:year", fetchAnimeListBySeasonYear);
router.get("/status/:status", fetchAnimeListByStatus); //types of statuses: current, upcoming, or finished
router.get("/season/:season", fetchAnimeListBySeason);
router.post("/insertMetadata", addAnimeMetadata );
router.get("/getAnime", getAnimeData);

export default router;