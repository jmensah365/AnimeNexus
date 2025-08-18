import express from 'express'
import {fetchUserReactionController, deleteUserReactionController, insertUserReactionController, updateUserReactionController, fetchUserReactionControllerWithAnimeTitles} from '../controllers/userReactionController.js';

const router = express.Router();

router.get('/user-reactions', fetchUserReactionController);
router.get('/user-reactions/with-titles', fetchUserReactionControllerWithAnimeTitles);
router.post('/user-reactions', insertUserReactionController);
router.put('/user-reactions/:reactionId', updateUserReactionController);
router.delete('/user-reactions/:reactionId', deleteUserReactionController);

export default router;