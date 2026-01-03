import { FunctionComponent, useEffect, useState } from "react";
import Navbar from "./Navbar";
import Product from "../interfaces/Product";
import { getUserCart } from "../services/cartsService";

interface CartProps {}

const Cart: FunctionComponent<CartProps> = () => {
  const [productsInCart, setProductsInCart] = useState<Product[]>([]);

  useEffect(() => {
    getUserCart()
      .then((res) => {
        setProductsInCart(res.data[0].products);
      })
      .catch((err) => console.log(err));
  }, []);

  return (
    <>
      <Navbar />
      <div className="container">
        <h4 className="display-4 text-center">CART</h4>
        {productsInCart.length ? (
          <table className="table table-striped">
            <thead>
              <tr>
                <th>Name</th>
                <th>Category</th>
                <th>Description</th>
                <th>Image</th>
                <th>Price</th>
              </tr>
            </thead>
            <tbody>
              {productsInCart.map((product: Product) => (
                <tr key={product.id}>
                  <td>{product.name}</td>
                  <td>{product.category}</td>
                  <td>{product.description}</td>
                  <td>
                    <img width={50} src={product.image} alt={product.name} />
                  </td>
                  <td>{product.price}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>No products in cart </p>
        )}
      </div>
    </>
  );
};

export default Cart;
