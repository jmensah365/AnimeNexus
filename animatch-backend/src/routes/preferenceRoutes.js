import express from 'express';
import { addPreference, delPreference, fetchPreferences, updatePreference, checkPreferenceFormCompletedController, updatePreferenceCheck } from '../controllers/preferenceController.js';

const router = express.Router();

router.get('/', fetchPreferences);
router.get('/completed', checkPreferenceFormCompletedController);
router.post('/', addPreference);
router.delete('/:preferenceId', delPreference);
router.put('/:preferenceId', updatePreference);
router.put('/', updatePreferenceCheck);


export default router;