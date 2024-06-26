import mongoose from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2"

const productSchema = new mongoose.Schema({
    title: String,
    brand: String,
    description: String,
    price: Number,
    stock: Number,
    category: String,
    image: String,
    cart: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Cart'
    },
});

productSchema.plugin(mongoosePaginate);

const Product = mongoose.model("Products", productSchema);

export default Product;