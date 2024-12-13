import React, { useContext, useEffect, useReducer, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link, useNavigate } from 'react-router-dom';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import ListGroup from 'react-bootstrap/ListGroup';
import Axios from 'axios';
import { Store } from '../../Store';
import CheckoutSteps from '../../components/CheckoutSteps';
import LoadingBox from '../../components/LoadingBox';
import { toast } from 'react-toastify';
import { getError } from '../../utils';

const reducer = (state, action) => {
  switch (action.type) {
    case 'CREATE_REQUEST':
      return { ...state, loading: true };
    case 'CREATE_SUCCESS':
      return { ...state, loading: false };
    case 'CREATE_FAIL':
      return { ...state, loading: false };
    default:
      return state;
  }
};

export default function PlaceOrderScreen() {
  const navigate = useNavigate();
  const [{ loading }, dispatch] = useReducer(reducer, { loading: false });

  const { state, dispatch: ctxDispatch } = useContext(Store);
  const { cart, userInfo } = state;

  const [cartItems, setCartItems] = useState([]);
  const [shippingAddress] = useState(
    JSON.parse(localStorage.getItem('shippingAddress')) || {
      fullName: 'John Doe',
      address: '123 Main St',
      city: 'New York',
      postalCode: '10001',
      country: 'USA',
    }
  );
  const [paymentMethod] = useState(
    localStorage.getItem('paymentMethod') || 'PayPal'
  );
  const [itemsPrice, setItemsPrice] = useState(0);
  const [shippingPrice, setShippingPrice] = useState(0);
  const [taxPrice, setTaxPrice] = useState(0);
  const [totalPrice, setTotalPrice] = useState(0);
  const hardcodedShipment = {
    carrier: 'UPS',
    trackingCode: 'TRACK12345',
    startDate: new Date(),
    estimatedDate: new Date(new Date().setDate(new Date().getDate() + 5)), // 5 days from now
    status: 'Pending',
  };

  const hardcodedPayment = {
    method: 'PayPal',
    status: 'Pending',
    paymentDate: null,
  };

  useEffect(() => {
    const fetchCartItems = async () => {
      const cartId = localStorage.getItem('cartId');
      if (!cartId) {
        toast.error('Cart is empty.');
        navigate('/cart');
        return;
      }

      try {
        const { data } = await Axios.get(`http://localhost:10000/api/v1/cart/${cartId}`, {
          headers: { Authorization: `Bearer ${userInfo.access_token}` },
        });

        setCartItems(data.data.cartItems || []); // Ensure cartItems is an array
        calculatePrices(data.data.cartItems || []);
      } catch (err) {
        toast.error(getError(err));
      }
    };

    fetchCartItems();
  }, [userInfo, navigate]);

  const calculatePrices = (items) => {
    const itemsPrice = items.reduce(
      (acc, item) => acc + item.variant.prices[0].price * item.quantity,
      0
    );
    setItemsPrice(itemsPrice);
    setShippingPrice(itemsPrice > 100 ? 0 : 10);
    setTaxPrice(itemsPrice * 0.15);
    setTotalPrice(itemsPrice + (itemsPrice > 100 ? 0 : 10) + itemsPrice * 0.15);
  };

   const round2 = (num) => Math.round(num * 100 + Number.EPSILON) / 100;
  cart.itemsPrice = round2(cart.cartItems.reduce((a, c) => a + c.quantity * c.price, 0));
  cart.shippingPrice = cart.itemsPrice > 100 ? round2(0) : round2(10);
  cart.taxPrice = round2(0.15 * cart.itemsPrice);
  cart.totalPrice = cart.itemsPrice + cart.shippingPrice + cart.taxPrice;


  
  const placeOrderHandler = async () => {
    try {
      dispatch({ type: 'CREATE_REQUEST' });
   // Create order items
      // const orderItems = await Promise.all(
      //   cartItems.map(async (item) => {
      //     const { data } = await Axios.post(
      //       'http://localhost:10000/api/v1/order-item',
      //       {
      //         variantId: item.variant.id,
      //         quantity: item.quantity,
      //       },
      //       {
      //         headers: { Authorization: `Bearer ${userInfo.access_token}` },
      //       }
      //     );
      //     return data;
      //   })
      // );

      // Gửi yêu cầu tạo đơn hàng
      const { data: orderData } = await Axios.post(
        'http://localhost:10000/api/v1/order',
        {
          total: totalPrice,
          currency: 'USD',
          status: 'Pending',
        },
        {
          headers: { Authorization: `Bearer ${userInfo.access_token}` },
        }
      );
  
      // Tìm và xóa các cart-items liên quan đến cart hiện tại
      const activeCartId=localStorage.getItem('cartId')
      const activeCart = userInfo.carts.find((cart) => cart.id === activeCartId);
      if (activeCart && activeCart.cartItems.length > 0) {
        await Promise.all(
          activeCart.cartItems.map(async (cartItem) => {
            await Axios.delete(`http://localhost:10000/api/v1/cart-item/${cartItem.id}`, {
              headers: { Authorization: `Bearer ${userInfo.access_token}` },
            });
          })
        );
      }
  
      // Xóa cart hiện tại khỏi backend
      await Axios.delete(`http://localhost:10000/api/v1/cart/${activeCartId}`, {
        headers: { Authorization: `Bearer ${userInfo.access_token}` },
      });
  
      // Cập nhật danh sách carts trong state và localStorage
      const updatedCarts = userInfo.carts.filter((cart) => cart.id !== activeCartId);
      const updatedUserInfo = { ...userInfo, carts: updatedCarts };
      ctxDispatch({ type: 'USER_SIGNIN', payload: updatedUserInfo });
      localStorage.setItem('userInfo', JSON.stringify(updatedUserInfo));
  
      // Xóa cart trong Redux Store và localStorage
      ctxDispatch({ type: 'CART_CLEAR' });
      localStorage.removeItem('cartItems');
  
      // Chuyển hướng tới trang chi tiết đơn hàng
      dispatch({ type: 'CREATE_SUCCESS' });
      navigate(`/order/${orderData.id}`);
    } catch (err) {
      dispatch({ type: 'CREATE_FAIL' });
      toast.error(getError(err));
    }
  };
  
  useEffect(() => {
    if (!paymentMethod) {
      navigate('/payment');
    }
  }, [paymentMethod, navigate]);

  return (
    <div>
      <CheckoutSteps step1 step2 step3 step4></CheckoutSteps>
      <Helmet>
        <title>Preview Order</title>
      </Helmet>
      <h1 className="my-3">Preview Order</h1>
      <Row>
        <Col md={8}>
          <Card className="mb-3">
            <Card.Body>
              <Card.Title>Shipping</Card.Title>
              <Card.Text>
                <strong>Name:</strong> {shippingAddress.fullName} <br />
                <strong>Address:</strong> {shippingAddress.address},{' '}
                {shippingAddress.city}, {shippingAddress.postalCode},{' '}
                {shippingAddress.country}
              </Card.Text>
              <Link to="/shipping">Edit</Link>
            </Card.Body>
          </Card>
          <Card className="mb-3">
            <Card.Body>
              <Card.Title>Payment</Card.Title>
              <Card.Text>
                <strong>Method:</strong> {paymentMethod}
              </Card.Text>
              <Link to="/payment">Edit</Link>
            </Card.Body>
          </Card>
          <Card className="mb-3">
            <Card.Body>
              <Card.Title>Items</Card.Title>
              <ListGroup variant="flush">
                {(cartItems || []).map((item) => (
                  <ListGroup.Item key={item.id}>
                    <Row className="align-items-center">
                      <Col md={6}>
                        <img
                          src={`http://localhost:10000//${item.variant.mainImage}`}
                          alt={item.variant.name}
                          className="img-fluid rounded img-thumbnail"
                        ></img>{' '}
                        <Link to={`/product/${item.variant.product.id}`}>
                          {item.variant.name}
                        </Link>
                      </Col>
                      <Col md={3}>
                        <span>{item.quantity}</span>
                      </Col>
                      <Col md={3}>
                        {item.variant.prices[0].price.toLocaleString('vi-VN', {
                          style: 'currency',
                          currency: 'VND',
                        })}
                      </Col>
                    </Row>
                  </ListGroup.Item>
                ))}
              </ListGroup>
              <Link to="/cart">Edit</Link>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card>
            <Card.Body>
              <Card.Title>Order Summary</Card.Title>
              <ListGroup variant="flush">
                <ListGroup.Item>
                  <Row>
                    <Col>Items</Col>
                    <Col>
                      {itemsPrice.toLocaleString('vi-VN', {
                        style: 'currency',
                        currency: 'VND',
                      })}
                    </Col>
                  </Row>
                </ListGroup.Item>
                <ListGroup.Item>
                  <Row>
                    <Col>Shipping</Col>
                    <Col>
                      {shippingPrice.toLocaleString('vi-VN', {
                        style: 'currency',
                        currency: 'VND',
                      })}
                    </Col>
                  </Row>
                </ListGroup.Item>
                <ListGroup.Item>
                  <Row>
                    <Col>Tax</Col>
                    <Col>
                      {taxPrice.toLocaleString('vi-VN', {
                        style: 'currency',
                        currency: 'VND',
                      })}
                    </Col>
                  </Row>
                </ListGroup.Item>
                <ListGroup.Item>
                  <Row>
                    <Col>
                      <strong>Order Total</strong>
                    </Col>
                    <Col>
                      <strong>
                        {totalPrice.toLocaleString('vi-VN', {
                          style: 'currency',
                          currency: 'VND',
                        })}
                      </strong>
                    </Col>
                  </Row>
                </ListGroup.Item>
                <ListGroup.Item>
                  <div className="d-grid">
                    <Button
                      type="button"
                      onClick={placeOrderHandler}
                      disabled={cartItems.length === 0}
                    >
                      Place Order
                    </Button>
                  </div>
                  {loading && <LoadingBox></LoadingBox>}
                </ListGroup.Item>
              </ListGroup>  
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  );
}
