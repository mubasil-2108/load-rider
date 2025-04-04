const express = require('express');
const {createBooking, getBookings} = require('../../controller/booking');

const router = express.Router();

router.post('/create', createBooking);
router.get('/get', getBookings);

module.exports = router;
