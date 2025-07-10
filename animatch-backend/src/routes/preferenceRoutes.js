import express from 'express';
import { addPreference, delPreference, fetchPreferences, updatePreference, checkPreferenceFormCompletedController, updatePreferenceCheck } from '../controllers/preferenceController.js';

const router = express.Router();

router.get('/', fetchPreferences);
router.get('/checkPreferenceFormCompleted', checkPreferenceFormCompletedController);
router.post('/insertPreference', addPreference);
router.delete('/deletePreference/:preferenceId', delPreference);
router.put('/updatePreference/:preferenceId', updatePreference);
router.put('/updatePreferenceCheck', updatePreferenceCheck);


export default router;