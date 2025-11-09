import express from 'express';
import {deleteUser, updateUser, getUserListings, getUser, updateListingOrder} from '../controllers/user.controller.js'
import {verifyToken} from '../utils/verifyUser.js'

const router = express.Router();

router.post('/update/:id',verifyToken ,updateUser);
router.delete('/delete/:id',verifyToken ,deleteUser);
router.get('/listings/:id', verifyToken, getUserListings);
router.get('/:id', verifyToken, getUser);
router.post('/update-order',verifyToken, updateListingOrder);

export default router;