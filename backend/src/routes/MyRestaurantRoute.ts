import express from "express";
import multer from "multer";
import MyRestaurantController from "../controllers/MyRestaurantController";
import { jwtCheck, jwtParse } from "../middleware/auth";
import { validationMyRestaurantRequest } from "../middleware/validation";

const restaurantRouter = express.Router();


const storage = multer.memoryStorage();
const upload = multer({
    storage: storage,
    limits: {
        fileSize: 5 * 1024 * 1024,
    },
});

restaurantRouter
    .get("/", jwtCheck, jwtParse, MyRestaurantController.getMyRestaurant)
    .post("/", upload.single("imageFile"), validationMyRestaurantRequest, jwtCheck, jwtParse, MyRestaurantController.createMyRestaurant)
    .put("/", upload.single("imageFile"), validationMyRestaurantRequest, jwtCheck, jwtParse, MyRestaurantController.updatemyRestaurant)
    .get("/order", jwtCheck, jwtParse, MyRestaurantController.getMyRestaurantOrders)
    .patch("/order/:orderId/status", jwtCheck, jwtParse, MyRestaurantController.updateOrderStatus)

export default restaurantRouter;

