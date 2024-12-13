import React, { useContext, useEffect, useState } from 'react';
import ListGroup from 'react-bootstrap/ListGroup';
import { Helmet } from 'react-helmet-async';
import { Store } from '../../Store';
import MessageBox from '../../components/MessageBox';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { Link, useNavigate } from 'react-router-dom';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import axios from 'axios';
import { toast } from 'react-toastify';

export default function CartScreen() {
  const navigate = useNavigate();
  const { state, dispatch: ctxDispatch } = useContext(Store);
  const { userInfo } = state;

  const [userCarts, setUserCarts] = useState(userInfo.carts || []);
  const [activeCartId, setActiveCartId] = useState(userInfo.carts[0]?.id || null);
  // ctxDispatch({ type: 'SET_CART_ID', payload: userInfo.carts[0]?.id || null });
  const [cartItems, setCartItems] = useState([]);

  useEffect(() => {
    const fetchCartItems = async () => {
      if (!activeCartId) return;
      try {
        const cart = userCarts.find((cart) => cart.id === activeCartId);
        if (!cart) return;

        const detailedCartItems = await Promise.all(
          cart.cartItems.map(async (cartItem) => {
            const { data } = await axios.get(
              `http://localhost:10000/api/v1/cart-item/${cartItem.id}`,
              {
                headers: { Authorization: `Bearer ${userInfo.access_token}` },
              }
            );
            return data.data;
          })
        );

        setCartItems(detailedCartItems);
      } catch (err) {
        toast.error('Error fetching cart items');
      }
    };

    fetchCartItems();
  }, [activeCartId, userCarts, userInfo.access_token]);

  const updateCartHandler = async (item, quantity) => {
    if (quantity < 1) {
      toast.error("Quantity must be at least 1");
      return;
    }
    // console.log(item.id);
    // console.log({
    //   variantId: item.variant.id,
    //   quantity,
    // });
    try {
      // Update the quantity in the backend
      
     const response= await axios.patch(
        `http://localhost:10000/api/v1/cart-item/${item.id}`,
        {
          variantId: item.variant.id, // Pass the variant ID
          quantity,
        },
        {
          headers: { Authorization: `Bearer ${userInfo.access_token}`,
            'Content-Type': 'application/JSON',
           },
        }
      );
      console.log(response);
      // Update the `cartItems` state
      const updatedCartItems = cartItems.map((cartItem) =>
        cartItem.id === item.id ? { ...cartItem, quantity } : cartItem
      );
      setCartItems(updatedCartItems);
  
      // Update the cart in `userCarts`
      const updatedCarts = userCarts.map((cart) =>
        cart.id === activeCartId
          ? { ...cart, cartItems: updatedCartItems }
          : cart
      );
      setUserCarts(updatedCarts);
  
      // Update `userInfo` in the global state and localStorage
      const updatedUserInfo = { ...userInfo, carts: updatedCarts };
      ctxDispatch({ type: "USER_SIGNIN", payload: updatedUserInfo });
      localStorage.setItem("userInfo", JSON.stringify(updatedUserInfo));
  
      toast.success("Cart item updated successfully");
    } catch (err) {
      toast.error("Error updating cart item");
    }
  };
  
  const removeItemHandler = async (item) => {
    try {
      await axios.delete(`http://localhost:10000/api/v1/cart-item/${item.id}`, {
        headers: { Authorization: `Bearer ${userInfo.access_token}` },
      });

      setCartItems(cartItems.filter((cartItem) => cartItem.id !== item.id));

        // Update userInfo in Store and localStorage
        const updatedCarts = userCarts.map((cart) => {
          if (cart.id === activeCartId) {
            return {
              ...cart,
              cartItems: cart.cartItems.filter(
                (cartItem) => cartItem.id !== item.id
              ),
            };
          }
          return cart;
        });
  
        const updatedUserInfo = { ...userInfo, carts: updatedCarts };
        ctxDispatch({ type: "USER_SIGNIN", payload: updatedUserInfo });
        localStorage.setItem("userInfo", JSON.stringify(updatedUserInfo));

      toast.success('Cart item removed');
    } catch (err) {
      toast.error('Error removing cart item');
    }
  };

  const removeCartHandler = async (cartId) => {
    try {
      await axios.delete(`http://localhost:10000/api/v1/cart/${cartId}`, {
        headers: { Authorization: `Bearer ${userInfo.access_token}` },
      });

      // Update userInfo and local storage
      const updatedCarts = userCarts.filter((cart) => cart.id !== cartId);
      const updatedUserInfo = { ...userInfo, carts: updatedCarts };
      localStorage.setItem('userInfo', JSON.stringify(updatedUserInfo));
      ctxDispatch({ type: 'USER_SIGNIN', payload: updatedUserInfo });

      setUserCarts(updatedCarts);

      if (cartId === activeCartId) {
        const remainingCartId = updatedCarts[0]?.id || null;
        setActiveCartId(remainingCartId);
        setCartItems([]);
        ctxDispatch({ type: 'SET_CART_ID', payload: remainingCartId });
      }

      toast.success('Cart removed successfully');
    } catch (err) {
      toast.error('Error removing cart');
    }
  };

  const checkoutHandler = () => {
    if (cartItems.length === 0) {
      toast.error('Your cart is empty');
      return;
    }
    navigate('/signin?redirect=/shipping');
  };

  const switchCartHandler = (cartId) => {
    setActiveCartId(cartId);
    ctxDispatch({ type: 'SET_CART_ID', payload: cartId });
  };

  return (
    <div>
      <Helmet>
        <title>Shopping Cart</title>
      </Helmet>
      <h1>Shopping Cart</h1>
      <Row>
        <Col md={4}>
          <h3>Your Carts</h3>
          {userCarts.length === 0 ? (
            <MessageBox>No carts available.</MessageBox>
          ) : (
            <ListGroup>
              {userCarts.map((cart) => (
                <ListGroup.Item
                  key={cart.id}
                  active={cart.id === activeCartId}
                  className="d-flex justify-content-between align-items-center"
                >
                  <span onClick={() => switchCartHandler(cart.id)}>
                    Cart ID: {cart.id}
                  </span>
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => removeCartHandler(cart.id)}
                  >
                    Remove
                  </Button>
                </ListGroup.Item>
              ))}
            </ListGroup>
          )}
        </Col>
        <Col md={8}>
          <h3>Items in Current Cart</h3>
          {cartItems.length === 0 ? (
            <MessageBox>
              Cart is empty. <Link to="/">Go Shopping</Link>
            </MessageBox>
          ) : (
            <ListGroup>
              {cartItems.map((item) => (
                <ListGroup.Item key={item.id} className="my-3">
                  <Row className="align-items-center justify-content-between">
                    <Col md={4}>
                      <img
                        src={`http://localhost:10000/${item.variant.mainImage}`}
                        alt={item.variant.name}
                        className="img-fluid rounded img-thumbnail"
                      ></img>{' '}
                      <Link to={`/product/${item.variant.product.id}`}>
                        {item.variant.name}
                      </Link>
                    </Col>
                    <Col md={2}>
                      <Button
                        variant="light"
                        onClick={() => updateCartHandler(item, item.quantity - 1)}
                        disabled={item.quantity === 1}
                      >
                        <i className="fas fa-minus-circle"></i>
                      </Button>{' '}
                      <span>{item.quantity}</span>{' '}
                      <Button
                        variant="light"
                        onClick={() => updateCartHandler(item, item.quantity + 1)}
                      >
                        <i className="fas fa-plus-circle"></i>
                      </Button>
                    </Col>
                    <Col md={3}>
                      {item.variant.prices[0]?.price.toLocaleString('vi-VN', {
                        style: 'currency',
                        currency: 'VND',
                      })}
                    </Col>
                    <Col md={2}>
                      <Button
                        variant="danger"
                        size="sm"
                        onClick={() => removeItemHandler(item)}
                      >
                        <i className="fas fa-trash"></i>
                      </Button>
                    </Col>
                  </Row>
                </ListGroup.Item>
              ))}
            </ListGroup>
          )}
          <Card className="mt-3">
            <Card.Body>
              <ListGroup variant="flush">
                <ListGroup.Item>
                  <h3>
                    Subtotal ({cartItems.reduce((a, c) => a + c.quantity, 0)} items):{' '}
                    {cartItems
                      .reduce(
                        (a, c) => a + c.variant.prices[0]?.price * c.quantity,
                        0
                      )
                      .toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}
                  </h3>
                </ListGroup.Item>
                <ListGroup.Item>
                  <Button
                    type="button"
                    variant="primary"
                    onClick={checkoutHandler}
                    disabled={cartItems.length === 0}
                  >
                    Proceed to Checkout
                  </Button>
                </ListGroup.Item>
              </ListGroup>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  );
}
