import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    avatar: {
        type: String,
        default: "https://cdn.pixabay.com/photo/2020/06/30/10/23/icon-5355896_640.png"
    },
    rentListingOrder:{
        type: [String],
        default: [],
    },
    saleListingOrder:{
        type:[String],
        default: [],
    },
    offerListingOrder: {
        type: [String],
        default: [],
    },
}, {timestamps: true});

const User = mongoose.model("User", userSchema);

export default User;