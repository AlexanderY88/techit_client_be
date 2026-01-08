import { FunctionComponent, useEffect, useState } from "react";
import Navbar from "./Navbar";
import Product from "../interfaces/Product";
import { getUserCart, updateCartQuantity, removeFromCart } from "../services/cartsService";
import { getAllProducts } from "../services/productsService";
import CartInterface, { CartProduct } from "../interfaces/Cart";

interface CartProps {}

const Cart: FunctionComponent<CartProps> = () => {
  const [cart, setCart] = useState<CartInterface | null>(null);
  const [cartProducts, setCartProducts] = useState<CartProduct[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [updatingQuantity, setUpdatingQuantity] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch all products for details
        const productsResponse = await getAllProducts();
        setProducts(productsResponse.data);

        // Fetch user cart
        const cartResponse = await getUserCart();
        if (cartResponse.data && cartResponse.data.length > 0) {
          setCart(cartResponse.data[0]);
          setCartProducts(cartResponse.data[0].products || []);
        }
        
        setLoading(false);
      } catch (error) {
        console.error("Error fetching cart:", error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Get product details by ID
  const getProductDetails = (productId: string): Product | null => {
    return products.find(p => (p._id || p.id) === productId) || null;
  };

  // Calculate total price
  const getTotalPrice = (): number => {
    return cartProducts.reduce((total, cartProduct) => {
      const product = getProductDetails(cartProduct.productId);
      return total + (product ? product.price * cartProduct.quantity : 0);
    }, 0);
  };

  // Increase quantity
  const handleIncreaseQuantity = async (cartProduct: CartProduct) => {
    const product = getProductDetails(cartProduct.productId);
    if (!product) return;

    // Check stock limit
    if (cartProduct.quantity >= (product.quantity || 0)) {
      alert(`Cannot add more items. Only ${product.quantity} available in stock.`);
      return;
    }

    setUpdatingQuantity(cartProduct.productId);
    try {
      await updateCartQuantity(cartProduct.productId, cartProduct.quantity + 1);
      
      // Update local state
      const updatedCartProducts = cartProducts.map(cp =>
        cp.productId === cartProduct.productId
          ? { ...cp, quantity: cp.quantity + 1 }
          : cp
      );
      setCartProducts(updatedCartProducts);
    } catch (error) {
      console.error("Error updating quantity:", error);
      alert("Failed to update quantity");
    } finally {
      setUpdatingQuantity(null);
    }
  };

  // Decrease quantity
  const handleDecreaseQuantity = async (cartProduct: CartProduct) => {
    if (cartProduct.quantity <= 1) {
      // Remove from cart if quantity would be 0
      await handleRemoveFromCart(cartProduct.productId);
      return;
    }

    setUpdatingQuantity(cartProduct.productId);
    try {
      await updateCartQuantity(cartProduct.productId, cartProduct.quantity - 1);
      
      // Update local state
      const updatedCartProducts = cartProducts.map(cp =>
        cp.productId === cartProduct.productId
          ? { ...cp, quantity: cp.quantity - 1 }
          : cp
      );
      setCartProducts(updatedCartProducts);
    } catch (error) {
      console.error("Error updating quantity:", error);
      alert("Failed to update quantity");
    } finally {
      setUpdatingQuantity(null);
    }
  };

  // Remove from cart (when quantity reaches 0)
  const handleRemoveFromCart = async (productId: string) => {
    try {
      await removeFromCart(productId);
      
      // Update local state - remove product from cart
      setCartProducts(cartProducts.filter(cp => cp.productId !== productId));
    } catch (error) {
      console.error("Error removing from cart:", error);
      alert("Failed to remove item from cart");
    }
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="container mt-4">
          <div className="text-center">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="container mt-4">
        <h2 className="mb-4 text-center">Your Shopping Cart</h2>
        
        {cartProducts.length === 0 ? (
          <div className="text-center py-5">
            <h4 className="text-muted">Your cart is empty</h4>
            <p className="text-muted">Add some products to get started!</p>
          </div>
        ) : (
          <>
            <div className="row g-4">
              {cartProducts.map((cartProduct) => {
                const product = getProductDetails(cartProduct.productId);
                if (!product) return null;
                
                const isUpdating = updatingQuantity === cartProduct.productId;
                
                return (
                  <div key={cartProduct.productId} className="col-12">
                    <div className="card">
                      <div className="card-body">
                        <div className="row align-items-center">
                          <div className="col-md-2">
                            <img
                              src={product.image || "https://via.placeholder.com/100x100?text=No+Image"}
                              alt={product.name}
                              className="img-fluid rounded"
                              style={{ maxHeight: '80px', objectFit: 'cover' }}
                            />
                          </div>
                          <div className="col-md-4">
                            <h5 className="card-title mb-1">{product.name}</h5>
                            <p className="text-muted mb-0">{product.category}</p>
                            <small className="text-muted">Stock: {product.quantity}</small>
                          </div>
                          <div className="col-md-2">
                            <strong className="text-primary">${product.price.toFixed(2)}</strong>
                          </div>
                          <div className="col-md-3">
                            <div className="d-flex align-items-center border rounded">
                              <button
                                className="btn btn-outline-secondary btn-sm border-0"
                                onClick={() => handleDecreaseQuantity(cartProduct)}
                                disabled={isUpdating}
                                style={{ borderRadius: '0.375rem 0 0 0.375rem' }}
                              >
                                <i className="bi bi-dash"></i>
                              </button>
                              <span 
                                className="px-3 text-center" 
                                style={{ minWidth: '60px', backgroundColor: '#f8f9fa' }}
                              >
                                {isUpdating ? '...' : cartProduct.quantity}
                              </span>
                              <button
                                className="btn btn-outline-secondary btn-sm border-0"
                                onClick={() => handleIncreaseQuantity(cartProduct)}
                                disabled={isUpdating || cartProduct.quantity >= (product.quantity || 0)}
                                style={{ borderRadius: '0 0.375rem 0.375rem 0' }}
                              >
                                <i className="bi bi-plus"></i>
                              </button>
                            </div>
                          </div>
                          <div className="col-md-1">
                            <strong>${(product.price * cartProduct.quantity).toFixed(2)}</strong>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
            
            <div className="row mt-4">
              <div className="col-md-6 offset-md-6">
                <div className="card">
                  <div className="card-body">
                    <h5 className="card-title">Order Summary</h5>
                    <div className="d-flex justify-content-between">
                      <span>Total Items:</span>
                      <span>{cartProducts.reduce((sum, cp) => sum + cp.quantity, 0)}</span>
                    </div>
                    <hr />
                    <div className="d-flex justify-content-between">
                      <strong>Total Price:</strong>
                      <strong>${getTotalPrice().toFixed(2)}</strong>
                    </div>
                    <button className="btn btn-success w-100 mt-3">
                      Proceed to Checkout
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </>
  );
};

export default Cart;

