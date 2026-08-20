import { Router } from 'express';
import { createEnquiry, getEnquiries } from '../controllers/enquiryController.js';

const router = Router();

router.post('/', createEnquiry);
router.get('/', getEnquiries);

export default router;
