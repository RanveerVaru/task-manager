import jwt from 'jsonwebtoken';

export const isAuthenticated = async (req, res, next) => {
    try {
        // Get the token from cookies
        const token = req.cookies.jwt;
        // console.log("Token: " + token);

        // Check if token is provided
        if (!token) {
            return res.status(401).json({ success: false, message: "Not authorized, no token" });
        }

        // Verify the token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        // Check if the token was successfully decoded
        if (!decoded) {
            return res.status(401).json({ success: false, message: "Not authorized, invalid token" });
        }

        // Attach user ID to request object
        req.id = decoded.id;
        // console.log("User ID: " + req.id);

        // Proceed to the next middleware or route handler
        next();
    } catch (error) {
        // Handle any errors during token verification
        return res.status(401).json({ success: false, message: "Not authorized, token verification failed" });
    }
};
