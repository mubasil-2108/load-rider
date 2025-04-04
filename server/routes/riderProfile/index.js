
const express = require('express');
const {createClientProfile,getClientProfile,updateClientProfile} = require('../../controller/riderProfile');

const router = express.Router();

router.post('/create-profile', createClientProfile);
router.get('/get-profile', getClientProfile);
router.put('/update-profile', updateClientProfile);

module.exports = router;