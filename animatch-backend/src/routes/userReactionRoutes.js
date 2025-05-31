import express from 'express'
import {fetchUserReactionController, deleteUserReactionController, insertUserReactionController, updateUserReactionController, fetchUserReactionControllerWithAnimeTitles} from '../controllers/userReactionController.js';

const router = express.Router();

router.get('/', fetchUserReactionController);
router.get('/with-titles', fetchUserReactionControllerWithAnimeTitles);
router.post('/', insertUserReactionController);
router.put('/:reactionId', updateUserReactionController);
router.delete('/:reactionId', deleteUserReactionController);

export default router;