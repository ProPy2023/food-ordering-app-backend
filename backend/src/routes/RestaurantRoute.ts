import exppress from "express";
import { param } from "express-validator";
import { getRestaurant, searchRestaurant } from "../controllers/RestaurantController";

const restaurantRoute = exppress.Router();
restaurantRoute
    .get("/search/:city", param("city").isString().trim().notEmpty().withMessage("City parameter must be a valid string"), searchRestaurant)
    .get( 
        "/:restaurantId",
        param("restaurantId")
            .isString()
            .trim()
            .notEmpty()
            .withMessage("RestaurantId paramenter must be a valid string"),
        getRestaurant
    );

export default restaurantRoute;