import express from 'express';
import { addPreference, delPreference, fetchPreferences, updatePreference } from '../controllers/preferenceController.js';

const router = express.Router();

router.get('/', fetchPreferences);
router.post('/insertPreference', addPreference);
router.delete('/deletePreference/:preferenceId', delPreference);
router.put('/updatePreference/:preferenceId', updatePreference);

export default router;