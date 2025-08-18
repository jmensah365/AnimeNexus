import express from 'express';
import { addPreference, delPreference, fetchPreferences, updatePreference, checkPreferenceFormCompletedController, updatePreferenceCheck } from '../controllers/preferenceController.js';

const router = express.Router();

router.get('/preferences', fetchPreferences);
router.get('/checkPreferenceFormCompleted', checkPreferenceFormCompletedController);
router.post('/preferences', addPreference);
router.delete('/preferences/:preferenceId', delPreference);
router.put('/preferences/:preferenceId', updatePreference);
router.put('/preferences', updatePreferenceCheck);


export default router;