import jwt from "jsonwebtoken";
import UserModel from "../models/user.model.js";
import { Config } from '../config/config.js'


export const AuthenticateSeller = async (req, res, next) => {
    const token = req.cookies.token;

    if (!token) {
        return res.status(401).json({ message: "Unauthorized" })
    }

    const decodedToken = jwt.verify(token, Config.JWT_SECRET);

    const user = await UserModel.findById(decodedToken.id);

    if (!user) {
        return res.status(401).json({ message: "Unauthorized" })
    }

    req.user = user;
    next();
}