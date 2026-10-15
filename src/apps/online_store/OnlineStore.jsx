import { useState } from 'react';
import { Link } from 'react-router-dom';
import './OnlineStore.css';
import products from './assets/products.json';

const uniqueCategories = [...new Set(products.map(product => product.category))];

function ProductItem({ product, onAddToCart }) {
    return (
        <div className="product-card">
            <img src={product.image} alt={product.title} className="product-image" />
            <div className="product-details">
                <span className="product-id">#{product.id}</span>
                <span className="product-category">{product.category}</span>
                <h3 className="product-title">{product.title}</h3>
                <p className="product-price">${product.price.toFixed(2)}</p>
                <p className="product-description">{product.description}</p>
                <button className="add-to-cart-btn" onClick={onAddToCart}>Add to Cart</button>
            </div>
        </div>
    );
}

function SideBar({ productInCart, onRemove, onDecrease, onIncrease }) {
    return (
        <div className="product-in-cart">
            <img src={productInCart.image} alt={productInCart.title} className="product-cart-title" />
            <h4 className="product-cart-title">{productInCart.title}</h4>
            <span className="product-cart-id">#{productInCart.id}</span>
            <span className="product-cart-category">{productInCart.category}</span>
            <span className="product-cart-price">${productInCart.price.toFixed(2)}</span>
            <div className="qty-controls">
                <button onClick={onDecrease}>-</button>
                <span>{productInCart.quantity}</span>
                <button onClick={onIncrease}>+</button>
            </div>
            <button className="remove-product-button" onClick={onRemove}>Remove</button>
        </div>
    );
}

function OnlineStore() {
    const [isSideBarOpen, setIsSideBarOpen] = useState(false);
    const [productsInCart, setProductsInCart] = useState([]);
    const [selectedCategories, setSelectedCategories] = useState([]);
    const [isFilterOpen, setIsFilterOpen] = useState(false);

    const filteredProducts = selectedCategories.length === 0
        ? products
        : products.filter((product) => selectedCategories.includes(product.category));
    const totalCost = productsInCart.reduce((sum, product) => sum + (product.price * product.quantity), 0);

    const handleCategoryToggle = (category) => {
        setSelectedCategories((prevSelected) => {
            if (prevSelected.includes(category)) {
                return prevSelected.filter((c) => c !== category);
            } else {
                return [...prevSelected, category];
            }
        });
    };

    const toggleCart = () => {
        setIsSideBarOpen((prevIsSideBarOpen) => !prevIsSideBarOpen);
    };

    const addToCart = (productToAdd) => {
        setProductsInCart((prevCart) => {
            const existingItem = prevCart.find((item) => item.id === productToAdd.id);

            if (existingItem) {
                return prevCart.map((item) =>
                    item.id === productToAdd.id
                        ? { ...item, quantity: item.quantity + 1 }
                        : item
                );
            } else {
                return [...prevCart, { ...productToAdd, quantity: 1 }];
            }
        });
    };

    const decreaseQuantity = (productId) => {
        const itemToDecrease = productsInCart.find((item) => item.id === productId);

        if (itemToDecrease && itemToDecrease.quantity === 1) {
            const confirmRemove = window.confirm("This will remove the item from your cart. Are you sure?");
            if (!confirmRemove) {
                return;
            }
        }

        setProductsInCart((prevCart) =>
            prevCart
                .map((item) =>
                    item.id === productId ? { ...item, quantity: item.quantity - 1 } : item
                )
                .filter((item) => item.quantity > 0)
        );
    };

    const increaseQuantity = (productId) => {
        setProductsInCart((prevCart) => {
            return prevCart.map((item) => (item.id === productId) ? { ...item, quantity: item.quantity + 1 } : item)
        })
    }

    const removeFromCart = (productId) => {
        setProductsInCart((prevCart) => prevCart.filter((item) => item.id !== productId));
    };

    return (
        <div>
            <nav className='nav-bar'>
                <Link to='/' className='back-button'>
                    ← Back to Dashboard
                </Link>
                <h2 className='nav-title'>Online Store</h2>

                <div className='nav-spacer'></div>
                <button className="cart-button" onClick={toggleCart}>
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                        className="cart-icon"
                    >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 0 0-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 0 0-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Zm12.75 0a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z" />
                    </svg>
                    Cart
                </button>
            </nav>

            <div className={`cart-sidebar ${isSideBarOpen ? 'open' : ''}`}>
                <div className="cart-sidebar-header">
                    <h3>Cart</h3>
                    <button className="close-cart-btn" onClick={toggleCart}>✕</button>
                </div>
                <div className='products-in-cart-container'>
                    {productsInCart.map((product, index) => (
                        <SideBar
                            key={`${product.id}-${index}`}
                            productInCart={product}
                            onDecrease={() => decreaseQuantity(product.id)}
                            onIncrease={() => increaseQuantity(product.id)}
                            onRemove={() => removeFromCart(product.id)}
                        />
                    ))}
                </div>
                <p className='total-cost'>Total: ${totalCost.toFixed(2)}</p>
                <button className='checkout-btn' onClick={() => alert("Proceeding to checkout!")}> Go to Checkout</button>
            </div>

            <div className='store-workspace'>
                <aside className="filter-sidebar">
                    <div className="filter-header" onClick={() => setIsFilterOpen(!isFilterOpen)}>
                        <h3>Categories</h3>
                        <span className="filter-toggle-icon">
                            {isFilterOpen ? '▲' : '▼'}
                        </span>
                    </div>

                    <div className={`filter-options ${isFilterOpen ? 'open' : ''}`}>
                        {uniqueCategories.map((category) => (
                            <label key={category} className="filter-label">
                                <input
                                    type="checkbox"
                                    checked={selectedCategories.includes(category)}
                                    onChange={() => handleCategoryToggle(category)}
                                />
                                {category}
                            </label>
                        ))}
                    </div>
                </aside>

                <div className='products-container'>
                    {filteredProducts.map((product) => (
                        <ProductItem
                            key={product.id}
                            product={product}
                            onAddToCart={() => addToCart(product)}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
}

export default OnlineStore;