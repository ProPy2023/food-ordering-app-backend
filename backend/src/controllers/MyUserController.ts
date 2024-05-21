import { Request, Response } from "express";
import userModel from "../models/user";


const getCurrentUser = async (req: Request, res: Response) => {
    try {
        const currentUser = await userModel.findOne({ _id: req.userId });
        if (!currentUser) {
            return res.status(404).json({ message: "user not found" });
        }
        res.json(currentUser);
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "something went wrong" });

    }
}

const createCurrentUser = async (req: Request, res: Response) => {
    console.log("Hello");
    
    try {

        const { auth0Id } = req.body;
        const existingUser = await userModel.findOne({ auth0Id });

        if (existingUser) {
            return res.status(200).send();
        }

        const newUser = new userModel(req.body);
        await newUser.save();

        res.status(201).json(newUser.toObject());

    } catch (error) {
        console.log(error)
        res.status(500).json({ message: 'Error Creating User' });
    }


};

const updateCurrentUser = async (req:Request, res:Response) => {
    try {
        // Validate request body
        const { name, addressLine1, city, country } = req.body;
        if (!name || !addressLine1 || !city || !country) {
            return res.status(400).json({ message: 'Missing required fields' });
        }

        // Validate user ID
        const userId = req.params.userId;
       

        // Find user
        const user = await userModel.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Update user
        user.name = name;
        user.addressLine1 = addressLine1;
        user.city = city;
        user.country = country;

        // Save updated user
        await user.save();
        
        // Return a success message or relevant data
        res.json({ message: 'User updated successfully', user: user });

    } catch (error) {
        // Log detailed error
        console.error('Error updating user:', error);
        res.status(500).json({ message: 'Error updating user' });
    }
}

export default {
    getCurrentUser,
    createCurrentUser,
    updateCurrentUser,
};