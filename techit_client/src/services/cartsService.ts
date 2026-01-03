import axios from "axios";
import Product from "../interfaces/Product";

const api: string = process.env.REACT_APP_API + "/carts";

// create cart
// register
export function createCart(userId: string) {
  return axios.post(api, { userId, products: [], active: true });
}

// add to cart
export async function addToCart(product: Product) {
  try {
    // get userId from session
    const userId = sessionStorage.getItem("userId");

    // get user cart according to userId
    const userCart = await axios.get(`${api}?userId=${userId}&&active=true`);

    // userCart.data[0] - user cart
    // add to products array the wanted product
    userCart.data[0].products.push(product);

    // decrease product quantity

    // update cart in db.json
    return axios.patch(`${api}/${userCart.data[0].id}`, {
      products: userCart.data[0].products,
    });
  } catch (error) {
    console.log(error);
  }
}

// get user cart
export function getUserCart() {
  // get userId from session
  const userId = sessionStorage.getItem("userId");

  // get user cart according to userId
  return axios.get(`${api}?userId=${userId}&&active=true`);
}
