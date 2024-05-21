import express from "express";
import { jwtCheck, jwtParse } from "../middleware/auth";
import OrderController from "../controllers/OrderController";


const orderRoute = express.Router();

orderRoute
    .post('/checkout/create-checkout-session', jwtCheck, jwtParse, OrderController.createCheckOutSession)
    .post('/checkout/webhook', OrderController.stripeWebhookHandler)
    .get("/", jwtCheck, jwtParse, OrderController.getMyOrder)
export default orderRoute;