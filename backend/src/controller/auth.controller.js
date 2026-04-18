import UserModel from '../models/user.model.js'
import { Config } from '../config/config.js';
import jwt from 'jsonwebtoken';

export const TokenResponse = async (user, res, Message) => {

    const token = jwt.sign({ id: user._id }, Config.JWT_SECRET, { expiresIn: "1d" });

    res.cookie("token", token, { httpOnly: true, secure: true, sameSite: "strict" });

    return res.status(201).json({
        message: Message,
        User: {
            fullname: user.fullname,
            email: user.email,
            contact: user.contact,
            role: user.role
        }
    })

}



export const UserRegisterController = async (req, res) => {
    try {
        const { fullname, email, password, contact, isSeller } = req.body;

        const isAlredayExist = await UserModel.findOne({
            $or: [
                { email },
                { contact }
            ]
        });

        if (isAlredayExist) {
            return res.status(400).json({ message: "User already exists" });
        }



        const user = await UserModel.create({
            fullname,
            email,
            password,
            contact,
            role: isSeller ? "seller" : "buyer"
        })


        await TokenResponse(user, res, "user registered successfully");

    }

    catch (error) {
        return res.status(500).json({ message: error.message });
    }
}

export const UserLoginController = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await UserModel.findOne({ email }).select("+password");

        if (!user) {
            return res.status(404).json({ message: "user not found" });
        }

        const isPasswordValid = await user.comparePassword(password);

        if (!isPasswordValid) {
            return res.status(401).json({ message: "invalid password" });
        }

        await TokenResponse(user, res, "user logged in successfully");

    }
    catch (error) {
        return res.status(500).json({ message: error.message });
    }
}

export const GoogleCallback = async (req, res) => {
    try {
        const { id, displayName, emails, photos } = req.user;
        const email = emails[0].value;
        const avatar = photos[0].value;
        const role = req.query.state || 'buyer';

        let user = await UserModel.findOne({ email });

        if (!user) {
            user = await UserModel.create({
                fullname: displayName,
                email,
                googleId: id,
                googleAvatar: avatar,
                role: role
            });
        }

        const token = jwt.sign({ id: user._id }, Config.JWT_SECRET, { expiresIn: "1d" });
        res.cookie("token", token, { httpOnly: true, secure: true, sameSite: "strict" });

        res.redirect('http://localhost:5173');
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}


