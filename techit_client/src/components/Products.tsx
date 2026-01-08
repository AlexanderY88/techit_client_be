import { FunctionComponent, useEffect, useState } from "react";
import Navbar from "./Navbar";
import { getAllProducts } from "../services/productsService";
import Product from "../interfaces/Product";
import { getUserById, getUserFromToken } from "../services/usersService";
import AddProductModal from "./AddProductModal";
import DeleteProductModal from "./DeleteProductModal";
import UpdateProductModal from "./UpdateProductModal";
import { addToCart, updateCartQuantity, getUserCart } from "../services/cartsService";
import User from "../interfaces/User";
import Cart, { CartProduct } from "../interfaces/Cart";
import "./Products.css";

interface ProductsProps {}

const Products: FunctionComponent<ProductsProps> = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [productsChanged, setProductsChanged] = useState<boolean>(false);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [showAdd, setShowAdd] = useState<boolean>(false);
  const [showDelete, setShowDelete] = useState<boolean>(false);
  const [showUpdate, setShowUpdate] = useState<boolean>(false);
  const [productId, setProductId] = useState<string>("");
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [cartProducts, setCartProducts] = useState<CartProduct[]>([]);
  const [updatingQuantity, setUpdatingQuantity] = useState<string | null>(null);

  useEffect(() => {
    // Get user info from token
    const token = sessionStorage.getItem("token");
    if (token) {
      const userFromToken = getUserFromToken();
      if (userFromToken) {
        setCurrentUser(userFromToken);
        setIsAdmin(userFromToken.isAdmin);
        
        // Load user cart
        getUserCart()
          .then((cartResponse) => {
            if (cartResponse.data && cartResponse.data.length > 0) {
              setCartProducts(cartResponse.data[0].products || []);
            }
          })
          .catch((err) => console.log("Cart load error:", err));
      }
    }
  }, []);

  useEffect(() => {
    getAllProducts()
      .then((res) => {
        setProducts(res.data);
      })
      .catch((err) => console.log(err));
  }, [productsChanged]);

  const refresh = () => setProductsChanged(!productsChanged);

  // Helper function to get product quantity in cart
  const getProductQuantityInCart = (productId: string): number => {
    const cartProduct = cartProducts.find(cp => cp.productId === productId);
    return cartProduct ? cartProduct.quantity : 0;
  };

  // Add to cart functionality
  const handleAddToCart = async (product: Product) => {
    if (!currentUser) return;
    
    const productId = product._id || product.id!;
    setUpdatingQuantity(productId);
    
    try {
      await addToCart(productId, 1);
      
      // Update local cart state
      setCartProducts(prevCartProducts => {
        const existingIndex = prevCartProducts.findIndex(cp => cp.productId === productId);
        if (existingIndex > -1) {
          const updatedCartProducts = [...prevCartProducts];
          updatedCartProducts[existingIndex].quantity += 1;
          return updatedCartProducts;
        } else {
          return [...prevCartProducts, { productId, quantity: 1 }];
        }
      });
    } catch (error) {
      console.error("Error adding to cart:", error);
    } finally {
      setUpdatingQuantity(null);
    }
  };

  // Increase quantity
  const handleIncreaseQuantity = async (product: Product) => {
    const productId = product._id || product.id!;
    const currentQuantity = getProductQuantityInCart(productId);
    
    if (currentQuantity >= (product.quantity || 0)) return;
    
    setUpdatingQuantity(productId);
    try {
      await updateCartQuantity(productId, currentQuantity + 1);
      
      setCartProducts(prevCartProducts => {
        const updatedCartProducts = [...prevCartProducts];
        const existingIndex = updatedCartProducts.findIndex(cp => cp.productId === productId);
        if (existingIndex > -1) {
          updatedCartProducts[existingIndex].quantity = currentQuantity + 1;
        } else {
          updatedCartProducts.push({ productId, quantity: currentQuantity + 1 });
        }
        return updatedCartProducts;
      });
    } catch (error) {
      console.error("Error updating quantity:", error);
    } finally {
      setUpdatingQuantity(null);
    }
  };

  // Decrease quantity
  const handleDecreaseQuantity = async (product: Product) => {
    const productId = product._id || product.id!;
    const currentQuantity = getProductQuantityInCart(productId);
    
    if (currentQuantity <= 1) {
      await handleRemoveFromCart(productId);
      return;
    }
    
    setUpdatingQuantity(productId);
    try {
      await updateCartQuantity(productId, currentQuantity - 1);
      
      setCartProducts(prevCartProducts => {
        const updatedCartProducts = [...prevCartProducts];
        const existingIndex = updatedCartProducts.findIndex(cp => cp.productId === productId);
        if (existingIndex > -1) {
          updatedCartProducts[existingIndex].quantity = currentQuantity - 1;
        }
        return updatedCartProducts;
      });
    } catch (error) {
      console.error("Error updating quantity:", error);
    } finally {
      setUpdatingQuantity(null);
    }
  };

  // Remove from cart
  const handleRemoveFromCart = async (productId: string) => {
    setUpdatingQuantity(productId);
    try {
      await updateCartQuantity(productId, 0);
      
      setCartProducts(prevCartProducts => 
        prevCartProducts.filter(cp => cp.productId !== productId)
      );
    } catch (error) {
      console.error("Error removing from cart:", error);
    } finally {
      setUpdatingQuantity(null);
    }
  };

  return (
    <>
      <Navbar />
      <div className="container-fluid px-2 px-sm-3 px-md-4 py-3">
        <div className="row">
          <div className="col-12 text-center mb-3 mb-md-4">
            <h2 className="display-6 display-md-4 mb-3">PRODUCTS</h2>
            {isAdmin && (
              <button
                className="btn btn-success mb-3 btn-sm btn-md-regular"
                onClick={() => setShowAdd(true)}
              >
                <i className="fa-solid fa-plus me-1 me-md-2"></i>
                <span className="d-none d-sm-inline">Add </span>Product
              </button>
            )}
          </div>
        </div>
        <div className="row g-2 g-sm-3 g-md-4">
          {products.length ? (
            products.map((product: Product) => (
              <div className="col-12 col-sm-6 col-lg-4 col-xl-3" key={product._id || product.id}>
                <div
                  className="card h-100 shadow-sm border-0 product-card"
                  style={{ borderRadius: '0.75rem', overflow: 'hidden' }}
                >
                  <div className="position-relative">
                    <div className="badge bg-primary position-absolute top-0 start-0 m-2 px-2 py-1" 
                         style={{ fontSize: '0.7rem', zIndex: 1 }}>
                      {product.category}
                    </div>
                    <img
                      src={product.image || "https://via.placeholder.com/300x200?text=No+Image"}
                      className="card-img-top product-image"
                      alt={product.name}
                      style={{ height: '200px', objectFit: 'cover' }}
                    />
                  </div>
                  <div className="card-body d-flex flex-column p-3 p-md-4">
                    <div className="flex-grow-1 mb-3">
                      <h5 className="card-title mb-2 fs-6 fs-md-5 fw-bold text-truncate" title={product.name}>
                        {product.name}
                      </h5>
                      <p className="card-text text-secondary mb-2 small" 
                         style={{ 
                           display: '-webkit-box', 
                           WebkitLineClamp: 2, 
                           WebkitBoxOrient: 'vertical', 
                           overflow: 'hidden',
                           lineHeight: '1.4'
                         }}>
                        {product.description}
                      </p>
                      <div className="d-flex justify-content-between align-items-center mb-2">
                        <span className="h5 mb-0 text-success fw-bold">{product.price}₪</span>
                        {product.quantity !== undefined && (
                          <small className="text-muted">
                            <span className="d-none d-sm-inline">Stock: </span>{product.quantity}
                          </small>
                        )}
                      </div>
                      {!product.quantity && (
                        <div className="alert alert-warning py-1 px-2 mb-2 small text-center">
                          <i className="fa-solid fa-exclamation-triangle me-1"></i>
                          Out of stock!
                        </div>
                      )}
                    </div>
                  
                  {/* Cart functionality */}
                  <div style={{ minHeight: '40px' }} className="d-flex align-items-center justify-content-center mb-2">
                    {(() => {
                      const productId = product._id || product.id!;
                      const cartQuantity = getProductQuantityInCart(productId);
                      const isUpdating = updatingQuantity === productId;
                      
                      if (cartQuantity === 0) {
                        // Show Add to Cart button
                        return (
                          <button
                            className="btn btn-primary w-100"
                            disabled={!product.quantity || isUpdating || !currentUser}
                            onClick={() => handleAddToCart(product)}
                          >
                            <i className="fa-solid fa-cart-shopping"></i> 
                            {!currentUser ? " Login to Add" : " Add to Cart"}
                          </button>
                        );
                      } else {
                        // Show quantity controls
                        return (
                          <div className="d-flex align-items-center justify-content-center w-100">
                            <button
                              className="btn btn-outline-secondary btn-sm"
                              onClick={() => handleDecreaseQuantity(product)}
                              disabled={isUpdating}
                              style={{ width: '36px', height: '36px' }}
                            >
                              <i className="fa-solid fa-minus"></i>
                            </button>
                            <span className="mx-3 fw-bold" style={{ minWidth: '30px', textAlign: 'center' }}>
                              {isUpdating ? '...' : cartQuantity}
                            </span>
                            <button
                              className="btn btn-outline-secondary btn-sm"
                              onClick={() => handleIncreaseQuantity(product)}
                              disabled={isUpdating || cartQuantity >= (product.quantity || 0)}
                              style={{ width: '36px', height: '36px' }}
                            >
                              <i className="fa-solid fa-plus"></i>
                            </button>
                          </div>
                        );
                      }
                    })()}
                  </div>
                  
                  {/* Admin buttons */}
                  {isAdmin && (
                    <div className="mt-2 d-flex gap-1 gap-sm-2">
                      <button
                        className="btn btn-outline-warning btn-sm flex-fill"
                        onClick={() => {
                          setShowUpdate(true);
                          setProductId(product.id as string);
                        }}
                      >
                        <i className="fa-solid fa-pen"></i>
                        <span className="d-none d-sm-inline ms-1">Edit</span>
                      </button>
                      <button
                        className="btn btn-outline-danger btn-sm flex-fill"
                        onClick={() => {
                          setShowDelete(true);
                          setProductId(product.id as string);
                        }}
                      >
                        <i className="fa-solid fa-trash"></i>
                        <span className="d-none d-sm-inline ms-1">Delete</span>
                      </button>
                    </div>
                  )}
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="col-12">
              <div className="text-center py-5 my-4">
                <div className="mb-3">
                  <i className="fa-solid fa-box-open fa-3x text-muted"></i>
                </div>
                <h4 className="text-muted mb-2">No products available</h4>
                <p className="text-muted mb-0">Check back later for new products!</p>
              </div>
            </div>
          )}
        </div>
      </div>
      
      {/* Modals */}
      <AddProductModal
        show={showAdd}
        onHide={() => {
          setShowAdd(false);
          refresh();
        }}
      />
      <DeleteProductModal
        show={showDelete}
        onHide={() => {
          setShowDelete(false);
          refresh();
        }}
        productId={productId}
      />
      <UpdateProductModal
        show={showUpdate}
        onHide={() => {
          setShowUpdate(false);
          refresh();
        }}
        productId={productId}
      />
    </>
  );
};

export default Products;
