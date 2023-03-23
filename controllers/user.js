import { User } from "../models/user.js";
import bycrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { sendCookie } from "../utils/features.js";
import ErrorHandler from "../middlewares/error.js";


export const login = async (req,res,next)=>{
    
    try {
        const {email,password} = req.body;

        const user = await User.findOne({email}).select("+password");
    
        if (!user) return next(new ErrorHandler("Invalid user or password", 404));
    
    
        const isMatch = await bycrypt.compare(password,user.password);
        if (!isMatch) return next(new ErrorHandler("Invalid user or password", 404));
        sendCookie(user,res,`Welcome back,${user.name}`,201);
    } catch (error) {
        next(error);
    }
};
export const logout = (req,res)=>{
    try {
        return res.status(200).cookie("token","",{
            expire:new Date(Date.now()),
            sameSite:process.env.NODE_ENV === "Development" ? "lax" : "none",
            secure: process.env.NODE_ENV === "Development" ? false : true,
        }).json({
            success:true,
            message:"Logged Out",
        });
    } catch (error) {
        next(error);
    }

};

export const register = async (req,res)=>{
    try {
        const {name,email,password} = req.body;

        let user = await User.findOne({email});
      
          if (user) return next(new ErrorHandler("User Already Exist", 404));
      
          const hashedPassword = await bycrypt.hash(password,10);
          
          user = await User.create({name,email,password:hashedPassword});
      
          sendCookie(user,res,"Registered Successfully",201);
    } catch (error) {
        next(error);
    }
  
};

export const getMyProfile =(req,res)=>{

    return res.status(200).json({
        success:true,
        user:req.user,
    });

};



