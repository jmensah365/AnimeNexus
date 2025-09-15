import express from 'express';
import { addPreference, delPreference, fetchPreferences, updatePreference, checkPreferenceFormCompletedController, updatePreferenceCheck } from '../controllers/preferenceController.js';
import { supabaseAuthMiddleware } from '../middlewares/supabaseMiddleware.js';

const router = express.Router();

/*
    The supabase auth middleware is used to ensure a user is authenticated before each request in protected routes.
 */

router.get('/', supabaseAuthMiddleware, fetchPreferences);
router.get('/completed', supabaseAuthMiddleware, checkPreferenceFormCompletedController);
router.post('/', supabaseAuthMiddleware, addPreference);
router.delete('/:preferenceId', supabaseAuthMiddleware, delPreference);
router.put('/:preferenceId', supabaseAuthMiddleware, updatePreference);
router.put('/', supabaseAuthMiddleware, updatePreferenceCheck);


export default router;