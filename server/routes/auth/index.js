// auth routes

const express = require('express');
const {authMiddleware, registerUser, loginUser, logoutUser, refreshToken} = require('../../controller/auth');

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/logout', logoutUser);
router.post('/refresh-token', refreshToken);
router.get('/check-auth', authMiddleware, (req, res) => {
    const user = req.user;
    res.status(200).json({
        success: true,
        message: 'User authenticated',
        user: user,
    })
})

module.exports = router;