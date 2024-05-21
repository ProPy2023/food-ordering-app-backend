import mongoose, { Document, Schema } from 'mongoose';

interface OrderDocument extends Document {
    user: mongoose.Types.ObjectId;
    restaurant: mongoose.Types.ObjectId;
    deliveryDetails: {
        email: string;
        name: string;
        addressLine1: string;
        city: string;
    };
    cartItems: {
        menuItemId: string;
        name: string;
        quantity: string;
    }[];
    totalAmount: number;
    status: 'placed' | 'paid';
    createdAt: Date;
}

const OrderSchema: Schema = new Schema({
    user: { type: mongoose.Types.ObjectId, ref: 'User', required: true },
    restaurant: { type: mongoose.Types.ObjectId, ref: 'Restaurant', required: true },
    deliveryDetails: {
        email: { type: String, required: true },
        name: { type: String, required: true },
        addressLine1: { type: String, required: true },
        city: { type: String, required: true },
    },
    cartItems: [{
        menuItemId: { type: String, required: true },
        name: { type: String, required: true },
        quantity: { type: String, required: true },
    }],
    totalAmount: { type: Number, required: true },
    status: { type: String, enum: ['placed', 'paid'], required: true },
    createdAt: { type: Date, default: Date.now },
});

const Order = mongoose.model<OrderDocument>('Order', OrderSchema);

export default Order;
export type { OrderDocument };
