import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

import Token from '../model/token.js'
import User from '../model/user.js';

dotenv.config();

export const singupUser = async (request, response) => {
    try {
        // const salt = await bcrypt.genSalt();
        // const hashedPassword = await bcrypt.hash(request.body.password, salt);
        const hashedPassword = await bcrypt.hash(request.body.password, 10);

        const user = { username: request.body.username, name: request.body.name, password: hashedPassword }

        const newUser = new User(user);
        await newUser.save();

        return response.status(200).json({ msg: 'Signup successfull' });
    } catch (error) {
        return response.status(500).json({ msg: 'Error while signing up user' });
    }
}


export const loginUser = async (request, response) => {
    let user = await User.findOne({ username: request.body.username });
    if (!user) {
        return response.status(400).json({ msg: 'Username does not exist' });
    }

    try {
        let match = await bcrypt.compare(request.body.password, user.password);
        if (match) {
            // Create access token
            const accessToken = jwt.sign({ id: user._id }, process.env.ACCESS_SECRET_KEY, { expiresIn: '15m' });
            // Create refresh token
            const refreshToken = jwt.sign({ id: user._id }, process.env.REFRESH_SECRET_KEY);

            // Save refresh token in database (optional step for refresh token handling)
            const newToken = new Token({ token: refreshToken });
            await newToken.save();

            // Send tokens and user details back to frontend
            response.status(200).json({
                accessToken: accessToken,
                refreshToken: refreshToken,
                name: user.name,
                username: user.username
            });
        } else {
            response.status(400).json({ msg: 'Password does not match' });
        }
    } catch (error) {
        response.status(500).json({ msg: 'Error while logging in the user' });
    }
};

export const logoutUser = async (request, response) => {
    const token = request.body.token;
    await Token.deleteOne({ token: token });

    response.status(204).json({ msg: 'logout successfull' });
}