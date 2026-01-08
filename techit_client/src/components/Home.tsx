import { FunctionComponent, useEffect, useState } from "react";
import Navbar from "./Navbar";
import { getAllProducts } from "../services/productsService";
import Product from "../interfaces/Product";
import UpdateProductModal from "./UpdateProductModal";
import DeleteProductModal from "./DeleteProductModal";
import AddProductModal from "./AddProductModal";
import { getUserFromToken } from "../services/usersService";
import { getUserCart, addToCart, updateCartQuantity } from "../services/cartsService";
import User from "../interfaces/User";
import Cart, { CartProduct } from "../interfaces/Cart";
import "./Home.css";

interface HomeProps {}

const Home: FunctionComponent<HomeProps> = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [userCart, setUserCart] = useState<Cart | null>(null);
  const [cartProducts, setCartProducts] = useState<CartProduct[]>([]);
  const [showUpdateModal, setShowUpdateModal] = useState<boolean>(false);
  const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false);
  const [showAddModal, setShowAddModal] = useState<boolean>(false);
  const [selectedProductId, setSelectedProductId] = useState<string>("");
  const [updatingQuantity, setUpdatingQuantity] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch products
        const productsResponse = await getAllProducts();
        console.log("Products from API:", productsResponse.data);
        setProducts(productsResponse.data);
        
        // Fetch current user if logged in
        const token = sessionStorage.getItem("token");
        console.log("Token found:", token ? "Yes" : "No");
        if (token) {
          const userFromToken = getUserFromToken();
          if (userFromToken) {
            setCurrentUser(userFromToken);
            
            // Fetch user cart
            try {
              const cartResponse = await getUserCart();
              if (cartResponse.data && cartResponse.data.length > 0) {
                setUserCart(cartResponse.data[0]);
                setCartProducts(cartResponse.data[0].products || []);
              }
            } catch (cartErr) {
              setCartProducts([]);
            }
          }
        }
        
        setLoading(false);
      } catch (err: any) {
        setError("Failed to fetch products");
        setLoading(false);
        console.error("Error fetching products:", err);
        console.error("Error details:", err.response?.data);
      }
    };

    fetchData();
  }, []);

  // Helper function to get product quantity in cart
  const getProductQuantityInCart = (productId: string): number => {
    const cartProduct = cartProducts.find(cp => cp.productId === productId);
    const quantity = cartProduct ? cartProduct.quantity : 0;
    console.log(`🔍 Getting quantity for ${productId}:`, quantity, "from cart:", cartProducts);
    return quantity;
  };

  // Add to cart functionality
  const handleAddToCart = async (product: Product) => {
    if (!currentUser) {
      return;
    }
    
    const productId = product._id || product.id!;
    console.log("🛒 Adding to cart - Product ID:", productId);
    setUpdatingQuantity(productId);
    
    try {
      const response = await addToCart(productId, 1);
      console.log("✅ Add to cart API success:", response.data);
      
      // Update local cart state using functional update
      setCartProducts(prevCartProducts => {
        console.log("📦 Previous cart products:", prevCartProducts);
        const existingIndex = prevCartProducts.findIndex(cp => cp.productId === productId);
        console.log("🔍 Existing index for", productId, ":", existingIndex);
        
        if (existingIndex > -1) {
          // Update existing product quantity
          const updatedCartProducts = [...prevCartProducts];
          updatedCartProducts[existingIndex].quantity += 1;
          console.log("📈 Updated existing product quantity");
          return updatedCartProducts;
        } else {
          // Add new product to cart
          const newCartProducts = [...prevCartProducts, { productId, quantity: 1 }];
          console.log("➕ Added new product to cart:", newCartProducts);
          return newCartProducts;
        }
      });
    } catch (error) {
      console.error("❌ Error adding to cart:", error);
    } finally {
      setUpdatingQuantity(null);
    }
  };

  // Increase quantity
  const handleIncreaseQuantity = async (product: Product) => {
    const productId = product._id || product.id!;
    const currentQuantity = getProductQuantityInCart(productId);
    
    // Check stock limit
    if (currentQuantity >= (product.quantity || 0)) {
      return;
    }
    
    setUpdatingQuantity(productId);
    try {
      await updateCartQuantity(productId, currentQuantity + 1);
      
      // Update local state using functional update
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
      // Remove from cart if quantity would be 0
      await handleRemoveFromCart(productId);
      return;
    }
    
    setUpdatingQuantity(productId);
    try {
      await updateCartQuantity(productId, currentQuantity - 1);
      
      // Update local state using functional update
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
      
      // Update local state using functional update
      setCartProducts(prevCartProducts => 
        prevCartProducts.filter(cp => cp.productId !== productId)
      );
    } catch (error) {
      console.error("Error removing from cart:", error);
    } finally {
      setUpdatingQuantity(null);
    }
  };

  const handleEditProduct = (productId: string) => {
    setSelectedProductId(productId);
    setShowUpdateModal(true);
  };

  const handleDeleteProduct = (productId: string) => {
    setSelectedProductId(productId);
    setShowDeleteModal(true);
  };

  const handleAddProduct = () => {
    setShowAddModal(true);
  };

  const refreshProducts = async () => {
    try {
      const response = await getAllProducts();
      setProducts(response.data);
    } catch (err: any) {
      console.error("Error refreshing products:", err);
    }
  };

  const handleModalClose = () => {
    setShowUpdateModal(false);
    setShowDeleteModal(false);
    setShowAddModal(false);
    setSelectedProductId("");
    refreshProducts();
  };

  return (
    <>
      <Navbar />
      <div className="container-fluid px-3 px-md-4 mt-4">
        <div className="row">
          <div className="col-12">
            <div className="d-flex justify-content-between align-items-center mb-3 mb-md-4">
              <h2 className="mb-0 text-center text-md-start">Our Products</h2>
              {currentUser?.isAdmin && (
                <button
                  className="btn btn-success btn-sm"
                  onClick={handleAddProduct}
                >
                  <i className="bi bi-plus-circle me-1"></i>
                  Add Product
                </button>
              )}
            </div>
          </div>
        </div>
        
        {loading && (
          <div className="loading-container">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        )}

        {error && (
          <div className="alert alert-danger" role="alert">
            {error}
          </div>
        )}

        <div className="row g-3 g-md-4">
          {products.map((product) => (
            <div key={product.id} className="col-12 col-sm-6 col-lg-4 col-xl-3">
              <div className="card product-card h-100">
                <img
                  src={product.image || "https://via.placeholder.com/300x200?text=No+Image"}
                  className="card-img-top product-image"
                  alt={product.name}
                />
                <div className="card-body d-flex flex-column p-3 p-md-4">
                  <h5 className="card-title mb-2 fs-6 fs-md-5">{product.name}</h5>
                  <p className="card-text product-category text-muted mb-2">{product.category}</p>
                  <p className="card-text product-description text-secondary flex-grow-1 mb-3 small">
                    {product.description?.length > 80 
                      ? product.description.substring(0, 80) + "..."
                      : product.description}
                  </p>
                  <div className="mt-auto">
                    <div className="d-flex justify-content-between align-items-center mb-3">
                      <span className="product-price text-primary mb-0 fw-bold">${product.price.toFixed(2)}</span>
                      {product.quantity !== undefined && (
                        <small className="product-stock text-muted">Stock: {product.quantity}</small>
                      )}
                    </div>
                    
                    {(() => {
                      const productId = product._id || product.id!;
                      const cartQuantity = getProductQuantityInCart(productId);
                      const isUpdating = updatingQuantity === productId;
                      
                      if (cartQuantity === 0) {
                        // Show Add to Cart button
                        return (
                          <div className="d-flex gap-2">
                            <button
                              className="btn btn-primary btn-add-to-cart flex-grow-1 btn-sm btn-md-regular"
                              onClick={() => handleAddToCart(product)}
                              disabled={product.quantity === 0 || isUpdating}
                            >
                              {product.quantity === 0 ? "Out of Stock" : "Add to Cart"}
                            </button>
                            {currentUser?.isAdmin && (
                              <>
                                <button
                                  className="btn btn-outline-secondary btn-sm"
                                  onClick={() => handleEditProduct(productId)}
                                  title="Edit Product"
                                >
                                  <i className="bi bi-pencil"></i>
                                </button>
                                <button
                                  className="btn btn-outline-danger btn-sm"
                                  onClick={() => handleDeleteProduct(productId)}
                                  title="Delete Product"
                                >
                                  <i className="bi bi-trash"></i>
                                </button>
                              </>
                            )}
                          </div>
                        );
                      } else {
                        // Show quantity controls
                        return (
                          <div className="d-flex gap-2">
                            <div className="d-flex align-items-center border rounded flex-grow-1">
                              <button
                                className="btn btn-outline-secondary btn-sm border-0"
                                onClick={() => handleDecreaseQuantity(product)}
                                disabled={isUpdating}
                                style={{ borderRadius: '0.375rem 0 0 0.375rem' }}
                              >
                                <i className="bi bi-dash"></i>
                              </button>
                              <span className="px-3 text-center" style={{ minWidth: '40px', backgroundColor: '#f8f9fa' }}>
                                {isUpdating ? '...' : cartQuantity}
                              </span>
                              <button
                                className="btn btn-outline-secondary btn-sm border-0"
                                onClick={() => handleIncreaseQuantity(product)}
                                disabled={isUpdating || cartQuantity >= (product.quantity || 0)}
                                style={{ borderRadius: '0 0.375rem 0.375rem 0' }}
                              >
                                <i className="bi bi-plus"></i>
                              </button>
                            </div>
                            {currentUser?.isAdmin && (
                              <>
                                <button
                                  className="btn btn-outline-secondary btn-sm"
                                  onClick={() => handleEditProduct(productId)}
                                  title="Edit Product"
                                >
                                  <i className="bi bi-pencil"></i>
                                </button>
                                <button
                                  className="btn btn-outline-danger btn-sm"
                                  onClick={() => handleDeleteProduct(productId)}
                                  title="Delete Product"
                                >
                                  <i className="bi bi-trash"></i>
                                </button>
                              </>
                            )}
                          </div>
                        );
                      }
                    })()}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {!loading && !error && products.length === 0 && (
          <div className="empty-state text-center">
            <h4 className="text-muted">No products available</h4>
            <p className="text-muted">Check back later for new products!</p>
          </div>
        )}
      </div>
      
      {/* Admin Modals */}
      {currentUser?.isAdmin && (
        <>
          <UpdateProductModal
            show={showUpdateModal}
            onHide={handleModalClose}
            productId={selectedProductId}
          />
          <DeleteProductModal
            show={showDeleteModal}
            onHide={handleModalClose}
            productId={selectedProductId}
          />
          <AddProductModal
            show={showAddModal}
            onHide={handleModalClose}
          />
        </>
      )}
    </>
  );
};

export default Home;