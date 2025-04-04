// auth controller

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../../models/user');

const ACCESS_SECRET = 'CLIENT_SECRET_KEY';
const REFRESH_SECRET = 'REFRESH_SECRET_KEY';
const refreshTokens = [];

const registerUser = async (req, res) => {
    const { fullName, email, password, role } = req.body;
    try {
        const checkUser = await User.findOne({ email });
        if (checkUser) {
            return res.status(400).json({
                success: false,
                message: 'User already exists with this email! Please try another email',
            })
        }
        const hashPassword = await bcrypt.hash(password, 12);
        const newUser = new User({
            fullName,
            email,
            password: hashPassword,
            role
        })
        await newUser.save();
        res.status(200).json({
            success: true,
            message: 'User created successfully',
            userRole:{
                role
            } 
        })


    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: 'Something went wrong',
        })
    }
}

const loginUser = async (req, res) => {
    const { email, password } = req.body;
    try {
        const checkUser = await User.findOne({ email });
        if (!checkUser) {
            return res.status(400).json({
                success: false,
                message: 'User not found with this email! Please register first',
            })
        }
        const checkPassword = await bcrypt.compare(password, checkUser.password);
        if (!checkPassword) {
            return res.status(400).json({
                success: false,
                message: 'Invalid password',
            })
        }
        const accessToken = jwt.sign({
            id: checkUser._id,
            role: checkUser.role,
            email: checkUser.email,
            fullName: checkUser.fullName
        }, 'CLIENT_SECRET_KEY', { expiresIn: '60m' });

        const refreshToken = jwt.sign(
            { id: checkUser._id },
            'REFRESH_SECRET_KEY',
            { expiresIn: '7d' } // Long-lived refresh token
        );
        await refreshTokens.push(refreshToken);

        res.status(200).json({
            success: true,
            message: 'Login successful',
            accessToken,
            refreshToken,
            user: {
                id: checkUser._id,
                fullName: checkUser.fullName,
                email: checkUser.email,
                role: checkUser.role,
            }
        })
    } catch (error) {
        console.log(error, 'Error');
        res.status(500).json({
            success: false,
            message: 'Something went wrong',
        })
    }
}

const refreshToken = async (req, res) => {
    // const { token } = req.body;

    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ success: false, message: 'Unauthorized' });
        }
        const token = authHeader.split(' ')[1];
        if (!token || token.split(".").length !== 3) {
            return res.status(401).json({ success: false, message: 'Invalid token format!' });
        }
        jwt.verify(token, 'REFRESH_SECRET_KEY', (err, user) => {
            if (err) {
                return res.status(401).json({ success: false, message: 'Invalid token' });
            }
            res.json({ success: true, user });
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: 'Something went wrong',
        })
    }
};


const logoutUser = (req, res) => {
    const { token } = req.body;
    const index = refreshTokens.indexOf(token);
    if (index > -1) refreshTokens.splice(index, 1);
    res.status(200).json({ success: true, message: 'Logged out successfully' });
};

const authMiddleware = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({
            success: false,
            message: 'Unauthorised user!',
        })
    }

    const token = authHeader.split(' ')[1];
    if (!token || token.split(".").length !== 3) {
        return res.status(401).json({
            success: false,
            message: 'Invalid token format!'
        });
    }
    jwt.verify(token, 'CLIENT_SECRET_KEY', (err, user) => {
        if (err) {
            return res.status(401).json({
                success: false,
                message: 'Unauthorised user!',
            })
        }
        req.user = user;
        next();
    })
}

module.exports = {
    registerUser,
    loginUser,
    logoutUser,
    authMiddleware,
    refreshToken
}