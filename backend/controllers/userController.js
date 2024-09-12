import { User } from "../models/userModel.js";
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"

export const register = async (req , res , next) => {
    try {
        const {username , email , password} = req.body;
        if(!username || !email || !password) {
            return res.status(400).json({success : false ,message : "Please provid all required fields!!"});
        }

        const isUseExist = await User.findOne({email});
        if(isUseExist) {
            return res.status(400).json({success : false ,message : "Email already exist!!"})
        }

        const profilePic = `https://avatar.iran.liara.run/public?${username}`
        const hashedPassword = await bcrypt.hash(password , 10);
        const newUser = new User({username , email , password : hashedPassword , avatar : profilePic});
        await newUser.save();
        const user = {
            id : newUser._id,
            username : newUser.username,
            email : newUser.email,
            avatar : newUser.avatar
        };
        return res.status(201).json({success : true ,message : "User created successfully!!" , user});

    } catch (error) {
        next(error);
    }
}

export const login = async (req, res, next) => {
    try {
      const { email, password } = req.body;
      // console.log("in Login");
      if (!email || !password) {
        return res.status(400).json({ success: false, message: "Please provide email and password" });
      }
  
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(401).json({ success: false, message: "Invalid email or password" });
      }
  
      const isValid = await bcrypt.compare(password, user.password);
      if (!isValid) {
        return res.status(401).json({ success: false, message: "Invalid email or password" });
      }
  
      const token = jwt.sign({ id : user._id }, process.env.JWT_SECRET, {
        expiresIn: '1d', // token expires in 30 days
      });
      console.log("login t : " + JSON.stringify(token));
      res.cookie("jwt" , token , {
        maxAge:  24 * 60 * 60 * 1000 , 
        httpOnly: true, 
      });

      const userX = {
        id: user._id,
        username: user.username,
        email: user.email,
        avatar: user.avatar
      }
      return res.status(200).json({ success: true, message: "Logged in successfully", user : userX });
    } catch (error) {
      next(error);
    }
};


export const logout = (req , res , next) => {
    try {
        res.cookie("jwt" , "" , {maxAge : 0});
        return res.status(200).json({
            success: true,
            message: "User successfully logged out"
        });
    } catch (error) {
        next(error);
    }
}