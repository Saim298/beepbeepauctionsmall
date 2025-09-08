import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { getAuthToken } from '../api/client.js';

const CartContext = createContext();

const cartReducer = (state, action) => {
  switch (action.type) {
    case 'SET_CART':
      return {
        ...state,
        items: action.payload.items || [],
        total: action.payload.total || 0,
        loading: false
      };

    case 'ADD_TO_CART':
      const existingItem = state.items.find(item => item.partId === action.payload.partId);
      let updatedItems;
      
      if (existingItem) {
        updatedItems = state.items.map(item =>
          item.partId === action.payload.partId
            ? { ...item, quantity: item.quantity + action.payload.quantity }
            : item
        );
      } else {
        updatedItems = [...state.items, action.payload];
      }
      
      const newTotal = updatedItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
      
      return {
        ...state,
        items: updatedItems,
        total: newTotal
      };

    case 'REMOVE_FROM_CART':
      const filteredItems = state.items.filter(item => item.partId !== action.payload.partId);
      const updatedTotal = filteredItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
      
      return {
        ...state,
        items: filteredItems,
        total: updatedTotal
      };

    case 'UPDATE_QUANTITY':
      const updatedItemsQty = state.items.map(item =>
        item.partId === action.payload.partId
          ? { ...item, quantity: action.payload.quantity }
          : item
      ).filter(item => item.quantity > 0);
      
      const totalWithUpdatedQty = updatedItemsQty.reduce((sum, item) => sum + (item.price * item.quantity), 0);
      
      return {
        ...state,
        items: updatedItemsQty,
        total: totalWithUpdatedQty
      };

    case 'CLEAR_CART':
      return {
        ...state,
        items: [],
        total: 0
      };

    case 'SET_LOADING':
      return {
        ...state,
        loading: action.payload
      };

    default:
      return state;
  }
};

const initialState = {
  items: [],
  total: 0,
  loading: true
};

export const CartProvider = ({ children }) => {
  const [state, dispatch] = useReducer(cartReducer, initialState);

  // Load cart from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      try {
        const cartData = JSON.parse(savedCart);
        dispatch({ type: 'SET_CART', payload: cartData });
      } catch (error) {
        console.error('Error loading cart from localStorage:', error);
        dispatch({ type: 'SET_LOADING', payload: false });
      }
    } else {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    if (!state.loading) {
      localStorage.setItem('cart', JSON.stringify({
        items: state.items,
        total: state.total
      }));
    }
  }, [state.items, state.total, state.loading]);

  const addToCart = async (part, quantity = 1) => {
    const token = getAuthToken();
    if (!token) {
      throw new Error('Please sign in to add items to cart');
    }

    const cartItem = {
      partId: part._id,
      name: part.name,
      price: part.price,
      quantity: quantity,
      image: part.media?.[0]?.url || null,
      brand: part.brand,
      partNumber: part.partNumber,
      sellerId: part.seller?._id,
      sellerName: part.seller?.username,
      maxQuantity: part.quantity
    };

    dispatch({ type: 'ADD_TO_CART', payload: cartItem });
    
    // You could also sync with backend here
    // await syncCartWithBackend(state.items);
    
    return cartItem;
  };

  const removeFromCart = (partId) => {
    dispatch({ type: 'REMOVE_FROM_CART', payload: { partId } });
  };

  const updateQuantity = (partId, quantity) => {
    if (quantity <= 0) {
      removeFromCart(partId);
    } else {
      dispatch({ type: 'UPDATE_QUANTITY', payload: { partId, quantity } });
    }
  };

  const clearCart = () => {
    dispatch({ type: 'CLEAR_CART' });
  };

  const getItemCount = () => {
    return state.items.reduce((count, item) => count + item.quantity, 0);
  };

  const getItemByPartId = (partId) => {
    return state.items.find(item => item.partId === partId);
  };

  const isInCart = (partId) => {
    return state.items.some(item => item.partId === partId);
  };

  const value = {
    items: state.items,
    total: state.total,
    loading: state.loading,
    itemCount: getItemCount(),
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getItemByPartId,
    isInCart
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
