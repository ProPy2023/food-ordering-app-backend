import express, { NextFunction, Request, Response } from "express";
import cors from "cors";
import "dotenv/config"
import mongoose from "mongoose";
import userRouter from "./routes/MyUserRoutes";
import { v2 as cloudinary } from "cloudinary";
import restaurantRouter from "./routes/MyRestaurantRoute";
import restaurantRoute from "./routes/RestaurantRoute";
import orderRoute from "./routes/OrderRoute";


mongoose.connect(process.env.MONGODB_CONNECTION_STRING as string)
    .then(() => console.log("Connected to Database!"));

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

const app = express();
const PORT = 8080;
app.use(cors());


app.use("/api/order/checkout/webhook", express.raw({ type: "*/*" }))

app.use(express.json());



app.use((req: Request, res: Response, next: NextFunction) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    next();
});



app.get("/health", async (req: Request, res: Response) => {

    res.send({ message: "health ok!" });

});

app.use("/api/my/user", userRouter);
app.use("/api/my/restaurant", restaurantRouter);
app.use("/api/restaurant", restaurantRoute);
app.use("/api/order", orderRoute);


app.listen(PORT, () => {
    console.log(`Server Started on ${PORT}`);
})