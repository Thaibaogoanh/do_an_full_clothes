import React from 'react';
import axios from 'axios';
import { useEffect, useReducer, useContext } from 'react';
import { Row, Col } from 'react-bootstrap';
import Product from '../../components/Product';
import { Helmet } from 'react-helmet-async';
import LoadingBox from '../../components/LoadingBox';
import MessageBox from '../../components/MessageBox';
import { Store } from '../../Store';

// Reducer function to handle state changes and log them
const reducer = (state, action) => {
  switch (action.type) {
    case 'FETCH_REQUEST':
      console.log('FETCH_REQUEST action dispatched');
      return { ...state, loading: true };
    case 'FETCH_SUCCESS':
      console.log('FETCH_SUCCESS action dispatched');
      return { ...state, product: action.payload, loading: false };
    case 'FETCH_FAIL':
      console.log('FETCH_FAIL action dispatched');
      return { ...state, error: action.payload, loading: false };
    default:
      console.log('Unknown action dispatched');
      return state;
  }
};

// HomeScreen component
export default function HomeScreen() {
  const [{ loading, error, product }, dispatch] = useReducer(reducer, {
    product: [],
    loading: true,
    error: '',
  });

  const { state, dispatch: ctxDispatch } = useContext(Store);
  const { cart, userInfo } = state;


  useEffect(() => {
    const fetchData = async () => {
      dispatch({ type: 'FETCH_REQUEST' });
      try {
        const result = await axios.get('http://localhost:10000/api/v1/product');
     
        
        dispatch({ type: 'FETCH_SUCCESS', payload: result.data.data.data });
      } catch (err) {
        dispatch({ type: 'FETCH_FAIL', payload: err.message });
      }
    };
    fetchData();
  }, []);

  return (
    <div>
      <Helmet>
        <title>Main Page</title>
      </Helmet>
      <h1>Featured Products</h1>
      <br />
      <div className="products">
        {loading ? (
          <LoadingBox />
        ) : error ? (
          <MessageBox variant="danger">{error}</MessageBox>
        ) : (
          <Row>
            {product.map((product) => (
              product.variants.length>0?(
              <Col key={product.slug} sm={6} md={4} lg={3} className="mb-3">
                <Product product={product}></Product>
              </Col>):(<div></div>)
            ))}
          </Row>
        )}
      </div>
    </div>
  );
}
