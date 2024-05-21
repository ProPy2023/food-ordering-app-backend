import { Request, Response } from "express";
import Stripe from "stripe";
import Restaurant, { MenuItemType } from "../models/restaurant";
import Order, { OrderDocument } from "../models/Order";

const STRIPE = new Stripe(process.env.STRIPE_API_KEY as string);
const FRONTEND_URL = process.env.FRONTEND_URL as string;
const STRIPE_ENDPOINT_SECRET = process.env.STRIPE_WEBHOOK_SECRET as string;

const getMyOrder = async (req: Request, res: Response) => {
    try {
        const orders = await Order.find({ user: req.userId }).populate("restaurant").populate("user");
        res.json(orders);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "something went wrong" });
    }
};

type CheckoutSessionRequest = {
    carItems: {
        menuItemId: string;
        name: string;
        quantity: string;
    }[];
    deliveryDetails: {
        email: string;
        name: string;
        addressLine1: string;
        city: string;
    };
    restaurantId: string;
};

const stripeWebhookHandler = async (req: Request, res: Response) => {
    let event;
    try {
        const sig = req.headers["stripe-signature"];
        event = STRIPE.webhooks.constructEvent(req.body, sig as string, STRIPE_ENDPOINT_SECRET);
    } catch (error: any) {
        console.log(error);
        return res.status(400).send(`webhook error: ${error.message}`);
    }

    if (event.type === "checkout.session.completed") {
        const order = await Order.findById(event.data.object.metadata?.orderId) as OrderDocument;

        if (!order) {
            return res.status(404).json({ message: "Order not found" });
        }

        const amount_total = event.data.object.amount_total;
        if (amount_total !== null) {
            order.totalAmount = amount_total;
        }

        order.status = "paid";

        await order.save();
    }

    res.status(200).send();
};

const createLineItems = (checkoutSessionRequest: CheckoutSessionRequest, menuItems: MenuItemType[]) => {
    const lineItems = checkoutSessionRequest.carItems.map((cartItem) => {
        const menuItem = menuItems.find((item) => String(item?._id) === String(cartItem.menuItemId));
        if (!menuItem) {
            throw new Error(`Menu item not found: ${cartItem.menuItemId}`);
        }

        const unit_amount = menuItem?.price ?? 0;
        const name = menuItem?.name ?? "Unknown";

        const line_item: Stripe.Checkout.SessionCreateParams.LineItem = {
            price_data: {
                currency: "gbp",
                unit_amount: unit_amount,
                product_data: {
                    name: name,
                },
            },
            quantity: parseInt(cartItem.quantity),
        };

        return line_item;
    });

    return lineItems;
};

const createCheckOutSession = async (req: Request, res: Response) => {
    try {
        const checkoutSessionRequest: CheckoutSessionRequest = req.body;

        const restaurant = await Restaurant.findById(checkoutSessionRequest.restaurantId);
        if (!restaurant) {
            throw new Error("Restaurant not found");
        }
        const newOrder = new Order({
            restaurant: restaurant._id,
            user: req.userId,
            status: "placed",
            deliveryDetails: checkoutSessionRequest.deliveryDetails,
            cartItems: checkoutSessionRequest.carItems,
            createdAt: new Date(),
            totalAmount: 0, // Initial value, will be updated later
        });

        const lineItems = createLineItems(checkoutSessionRequest, restaurant.menuItems);

        if (typeof restaurant.deliveryPrice !== 'number') {
            throw new Error("Delivery price is not defined for the restaurant");
        }
        const session = await createSession(lineItems, newOrder._id.toString(), restaurant.deliveryPrice, restaurant._id.toString());

        if (!session.url) {
            return res.status(500).json({ message: "Error creating stripe Session" });
        }
        await newOrder.save();

        res.json({ url: session.url });
    } catch (error: any) {
        console.log(error);
        res.status(500).json({ message: error.raw.message });
    }
};

const createSession = async (lineItems: Stripe.Checkout.SessionCreateParams.LineItem[], orderId: string, deliveryPrice: number, restaurantId: string) => {
    const sessionData = await STRIPE.checkout.sessions.create({
        line_items: lineItems,
        shipping_options: [
            {
                shipping_rate_data: {
                    display_name: "Delivery",
                    type: "fixed_amount",
                    fixed_amount: {
                        amount: deliveryPrice,
                        currency: "gbp",
                    },
                },
            },
        ],
        mode: "payment",
        metadata: {
            orderId,
            restaurantId,
        },
        success_url: `${FRONTEND_URL}/order-status?success=true`,
        cancel_url: `${FRONTEND_URL}/details/${restaurantId}?cancelled=true`,
    });
    return sessionData;
};

export default {
    createCheckOutSession,
    stripeWebhookHandler,
    getMyOrder,
};
