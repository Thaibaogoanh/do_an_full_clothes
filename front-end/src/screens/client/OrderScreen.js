import React, { useContext, useEffect, useReducer, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import Axios from 'axios';
import { Helmet } from 'react-helmet-async';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Card from 'react-bootstrap/Card';
import ListGroup from 'react-bootstrap/ListGroup';
import Button from 'react-bootstrap/Button';
import LoadingBox from '../../components/LoadingBox';
import MessageBox from '../../components/MessageBox';
import { Store } from '../../Store';
import { getError } from '../../utils';

const reducer = (state, action) => {
  switch (action.type) {
    case 'FETCH_REQUEST':
      return { ...state, loading: true, error: '' };
    case 'FETCH_SUCCESS':
      return { ...state, loading: false, order: action.payload, orderItems: action.orderItems };
    case 'FETCH_FAIL':
      return { ...state, loading: false, error: action.payload };
    case 'PAY_REQUEST':
      return { ...state, loadingPay: true };
    case 'PAY_SUCCESS':
      return { ...state, loadingPay: false, successPay: true };
    case 'PAY_FAIL':
      return { ...state, loadingPay: false };
    default:
      return state;
  }
};

export default function OrderScreen() {
  const { id: orderId } = useParams();
  const { state } = useContext(Store);
  const { userInfo } = state;

  const [{ loading, error, order, orderItems, loadingPay, successPay }, dispatch] = useReducer(
    reducer,
    {
      loading: true,
      order: {},
      orderItems: [],
      error: '',
    }
  );

  const [paymentMethod] = useState(
    localStorage.getItem('paymentMethod') || 'PayPal'
  );
  const [shippingAddress] = useState(
    JSON.parse(localStorage.getItem('shippingAddress')) || {
      fullName: 'John Doe',
      address: '123 Main St',
      city: 'New York',
      postalCode: '10001',
      country: 'USA',
    }
  );

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        dispatch({ type: 'FETCH_REQUEST' });

        // Fetch order by ID
        const { data: orderData } = await Axios.get(
          `http://localhost:10000/api/v1/order/${orderId}`,
          {
            headers: { Authorization: `Bearer ${userInfo.access_token}` },
          }
        );

        const orderItems = await Promise.all(
          orderData.data.orderItems.map(async (item) => {
            const { data: orderItemData } = await Axios.get(
              `http://localhost:10000/api/v1/order-item/${item.id}`,
              {
                headers: { Authorization: `Bearer ${userInfo.access_token}` },
              }
            );
            return orderItemData.data;
          })
        );

        dispatch({
          type: 'FETCH_SUCCESS',
          payload: orderData.data,
          orderItems: orderItems,
        });
      } catch (err) {
        dispatch({ type: 'FETCH_FAIL', payload: getError(err) });
      }
    };

    if (successPay) {
      fetchOrder(); // Reload order data after successful payment
    } else {
      fetchOrder();
    }
  }, [orderId, userInfo.access_token, successPay]);

  const handlePayment = async () => {
    try {
      dispatch({ type: 'PAY_REQUEST' });

      // Fake payment simulation
      await new Promise((resolve) => setTimeout(resolve, 2000)); // Simulate 2-second delay

      // Update order status to complete
      await Axios.patch(
        `http://localhost:10000/api/v1/order/${orderId}`,
        { status: 'complete' },
        {
          headers: { Authorization: `Bearer ${userInfo.access_token}` },
        }
      );

      dispatch({ type: 'PAY_SUCCESS' });
      alert('Payment successful!');
    } catch (err) {
      dispatch({ type: 'PAY_FAIL' });
      alert('Payment failed!');
    }
  };

  return loading ? (
    <LoadingBox />
  ) : error ? (
    <MessageBox variant="danger">{error}</MessageBox>
  ) : (
    <div>
      <Helmet>
        <title>Order {orderId}</title>
      </Helmet>
      <h1 className="my-3">Order {orderId}</h1>
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
              {order.status === 'complete' ? (
                <MessageBox variant="success">
                  Delivered at {order.deliveredAt || 'N/A'}
                </MessageBox>
              ) : (
                <MessageBox variant="danger">Not Delivered</MessageBox>
              )}
            </Card.Body>
          </Card>
          <Card className="mb-3">
            <Card.Body>
              <Card.Title>Payment</Card.Title>
              <Card.Text>
                <strong>Method:</strong> {paymentMethod}
              </Card.Text>
              {order.status === 'complete' ? (
                <MessageBox variant="success">Paid</MessageBox>
              ) : (
                <MessageBox variant="danger">Not Paid</MessageBox>
              )}
            </Card.Body>
          </Card>
          <Card className="mb-3">
            <Card.Body>
              <Card.Title>Items</Card.Title>
              <ListGroup variant="flush">
                {orderItems.map((item) => (
                  <ListGroup.Item key={item.id}>
                    <Row className="align-items-center">
                      <Col md={6}>
                        <img
                          src={`http://localhost:10000${item.variant?.mainImage || ''}`}
                          alt={item.variant?.name || 'Variant Image'}
                          className="img-fluid rounded img-thumbnail"
                        ></img>{' '}
                        <Link to={`/product/${item.variant?.id || '#'}`}>
                          {item.variant?.name || 'Unknown Variant'}
                        </Link>
                      </Col>
                      <Col md={3}>
                        <span>{item.quantity || 0}</span>
                      </Col>
                      <Col md={3}>
                        {item.variant?.prices?.[0]?.price?.toLocaleString('vi-VN', {
                          style: 'currency',
                          currency: 'VND',
                        })}
                      </Col>
                    </Row>
                  </ListGroup.Item>
                ))}
              </ListGroup>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card className="mb-3">
            <Card.Body>
              <Card.Title>Order Summary</Card.Title>
              <ListGroup variant="flush">
                <ListGroup.Item>
                  <Row>
                    <Col>Items</Col>
                    <Col>
                      {order.total?.toLocaleString('vi-VN', {
                        style: 'currency',
                        currency: order.currency,
                      })}
                    </Col>
                  </Row>
                </ListGroup.Item>
                <ListGroup.Item>
                  <Row>
                    <Col>Total</Col>
                    <Col>
                      <strong>
                        {order.total?.toLocaleString('vi-VN', {
                          style: 'currency',
                          currency: order.currency,
                        })}
                      </strong>
                    </Col>
                  </Row>
                </ListGroup.Item>
              </ListGroup>
              {!order.status.includes('complete') && (
                <ListGroup.Item>
                  <div className="d-grid">
                    <Button onClick={handlePayment} disabled={loadingPay}>
                      {loadingPay ? 'Processing...' : 'Pay Now'}
                    </Button>
                  </div>
                </ListGroup.Item>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  );
}
