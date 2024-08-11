import { loginUser, logout, registerUser } from "./auth";
import { loadProductsFromCart } from "./cart/load-products-from-cart.action";
import { getProductBySlug, getProductsByPage } from "./products/";


export const server = {
    //actions

    //? Authentication
    registerUser,
    loginUser,
    logout,

    //? Products
    getProductsByPage,
    getProductBySlug,

    //? Cart
    loadProductsFromCart,
};