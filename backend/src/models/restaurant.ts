
import mongoose, { InferSchemaType } from "mongoose";

const menuItemSchema = new mongoose.Schema({
    _id : {
        type:mongoose.Schema.Types.ObjectId, 
        require : true,
        default: () => new mongoose.Types.ObjectId(),
    },
    name: {
        type: String,
        require: true,
    },
    price: {
        type: Number,
        require: true,
    },
});

export type MenuItemType = InferSchemaType<typeof menuItemSchema>;

const restaurantSchema = new mongoose.Schema({
    // _id: ObjectId,

    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    restaurantName: {
        type: String,
        require: true,
    },
    city: {
        type: String,
        require: true,
    },
    country: {
        type: String,
        require: true,
    },
    deliveryPrice: {
        type: Number,
        require: true,
    },
    estimatedDeliveryTime: {
        type: Number,
        require: true
    },
    cuisines: [{
        type: String,
        require: true,
    }],
    menuItems: [menuItemSchema],
    imageUrl: {
        type: String,
        require: true,
    },
    lastUpdated: {
        type: Date,
        require: true,
    }

});

const Restaurant = mongoose.model("Restaurant", restaurantSchema);
export default Restaurant;