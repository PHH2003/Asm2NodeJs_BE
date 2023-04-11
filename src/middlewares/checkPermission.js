import Jwt from "jsonwebtoken";
import User from "../models/user";

export const checkPermission = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        const token = authHeader && authHeader.split(" ")[1]  // ["Bearer", "xxx"]
        if (!authHeader) {
            return res.status(401).json({
                message: "bạn chưa đăng nhập",
            })
        }
        Jwt.verify(token, "banThayDat", async (error, payload) => {
            if (error) {
                if (error.name === "JsonWebTokenError") {
                    return res.status.json({
                        message: "token không hợp lệ",
                    })
                }
                if (error.name === "TokenExpireError") {
                    return res.status(400).json({
                        message: "Token đã hết hạn",
                    })
                }
            }

            const user = await User.findById(payload.id);
            if (user.role !== "admin") {
                return res.status(403).json({
                    message: "Bạn không có quyền thực hiện hành động này",
                });
            }
            next()
        })
    } catch (error) {

    }

}

