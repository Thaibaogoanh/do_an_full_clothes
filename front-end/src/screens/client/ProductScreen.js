import axios from 'axios';
import { useContext, useEffect, useReducer, useRef, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Card from 'react-bootstrap/Card';
import ListGroup from 'react-bootstrap/ListGroup';
import Badge from 'react-bootstrap/Badge';
import Button from 'react-bootstrap/Button';
import Rating from '../../components/Rating';
import { Helmet } from 'react-helmet-async';
import LoadingBox from '../../components/LoadingBox';
import MessageBox from '../../components/MessageBox';
import { getError } from '../../utils';
import { Store } from '../../Store';
import Form from 'react-bootstrap/Form';
import FloatingLabel from 'react-bootstrap/FloatingLabel';
import { toast } from 'react-toastify';
import './main.css';

const reducer = (state, action) => {
  switch (action.type) {
    case 'REFRESH_PRODUCT':
      return { ...state, product: action.payload };
    case 'FETCH_REQUEST':
      return { ...state, loading: true };
    case 'FETCH_SUCCESS':
      return { ...state, product: action.payload, loading: false };
    case 'FETCH_FAIL':
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
};

function ProductScreen() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [isComponent,setIsComponent]=useState(true);
  const [{ loading, error, product }, dispatch] = useReducer(reducer, {
    product: [],
    loading: true,
    error: '',
  });

  const [selectedVariant, setSelectedVariant] = useState(null);
  const [price, setPrice] = useState(0);
  const [quantity, setQuantity] = useState(0);
  const [selectedCartId, setSelectedCartId] = useState(null); // Track selected cart

  const { state, dispatch: ctxDispatch } = useContext(Store);
  const { cart, userInfo } = state;

  const reviewsRef = useRef();
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      dispatch({ type: 'FETCH_REQUEST' });
      try {
        const { data } = await axios.get(
          `http://localhost:10000/api/v1/product/${slug}`,
          {
            headers: { Authorization: `Bearer ${userInfo.access_token}` },
          }
        );
        dispatch({ type: 'FETCH_SUCCESS', payload: {...data.data,reviews: data.data.reviews || []} });
        setSelectedVariant(data.data.variants[0]);
      } catch (err) {
        dispatch({ type: 'FETCH_FAIL', payload: getError(err) });
      }
    };

    const fetchReviews = async () => {
      try {
        const { data } = await axios.get(
          `http://localhost:10000/api/v1/review`, // Fetch reviews for the product
        );
        dispatch({
          type: 'REFRESH_PRODUCT',
          payload: { ...product, reviews: data.data },
        });
      } catch (err) {
        toast.error(getError(err));
      }
    };

    fetchData();
    fetchReviews();

  }, [slug, userInfo.access_token]);

  useEffect(() => {
    const fetchVariantDetails = async () => {
      if (selectedVariant) {
        try {
          const { data } = await axios.get(
            `http://localhost:10000/api/v1/variant/${selectedVariant.id}`,
            {
              headers: { Authorization: `Bearer ${userInfo.access_token}` },
            }
          );
          setPrice(data.data.prices[0]?.price || 0);
          setQuantity(data.data.inventories[0]?.quantity || 0);
        } catch (err) {
          toast.error(getError(err));
        }
      }
    };
    fetchVariantDetails();
  }, [selectedVariant, userInfo.access_token]);

  const addToCartHandler = async () => {
    if (!selectedVariant) {
      toast.error('Please select a variant');
      return;
    }
  
    try {
      // Parse userInfo from localStorage
      const storedUserInfo = JSON.parse(localStorage.getItem('userInfo'));
      if (!storedUserInfo) {
        toast.error('User information is missing. Please log in again.');
        return;
      }
  
      let cartId = selectedCartId;
  
      // If no cart is selected, use the first available cart or create a new one
      if (!cartId) {
        if (storedUserInfo.carts && storedUserInfo.carts.length > 0) {
          cartId = storedUserInfo.carts[0].id; // Use the first cart
          setSelectedCartId(cartId);
        } else {
          // Create a new cart if no carts exist
          const { data: newCart } = await axios.post(
            `http://localhost:10000/api/v1/cart`,
            { cartItemIds: [] },
            {
              headers: { Authorization: `Bearer ${storedUserInfo.access_token}` },
            }
          );
  
          cartId = newCart.data.id;
          setSelectedCartId(cartId);
          
          // Update userInfo with the new cart
          const updatedUserInfo = {
            ...storedUserInfo,
            carts: [...storedUserInfo.carts, { id: cartId, cartItems: [] }],
          };
          localStorage.setItem('userInfo', JSON.stringify(updatedUserInfo));
          ctxDispatch({ type: 'USER_SIGNIN', payload: updatedUserInfo });
        }
      }
      // Add the selected variant to the selected cart
      const { data: cartItem } = await axios.post(
        `http://localhost:10000/api/v1/cart-item`,
        {
          cartId,
          variantId: selectedVariant.id,
          quantity: 1,
        },
        {
          headers: { Authorization: `Bearer ${storedUserInfo.access_token}` },
        }
      );
  
      // Update the userInfo with the new cart item
      const updatedCarts = storedUserInfo.carts.map((cart) =>
        cart.id === cartId
          ? { ...cart, cartItems: [...cart.cartItems, cartItem.data] }
          : cart
      );
  
      const updatedUserInfo = { ...storedUserInfo, carts: updatedCarts };
      localStorage.setItem('userInfo', JSON.stringify(updatedUserInfo));
      ctxDispatch({ type: 'USER_SIGNIN', payload: updatedUserInfo });
  
      toast.success('Item added to cart');
      navigate('/cart');
    } catch (err) {
      toast.error(getError(err));
    }
  };
  

  
  const submitHandler = async (e) => {
    e.preventDefault();
    if (!comment || !rating) {
      toast.error('Please enter comment and rating');
      return;
    }
    try {
      const { data } = await axios.post(
        `http://localhost:10000/api/v1/review`,
        {
          productId: product.id,
          rating: Number(rating),
          title: comment,
          comment,
        },
        {
          headers: { Authorization: `Bearer ${userInfo.access_token}` },
        }
      );
      toast.success('Review submitted successfully');
      // Add new review to the top of the list
      dispatch({
        type: 'REFRESH_PRODUCT',
        payload: { ...product, reviews: [data.data.data, ...product.reviews] },
      });
      setIsComponent(!isComponent)
      setRating(0);
      setComment('');
    } catch (error) {
      toast.error(getError(error));
    }
  };
  
  return loading ? (
    <LoadingBox />
  ) : error ? (
    <MessageBox variant="danger">{error}</MessageBox>
  ) : (
    <div>
   <Row>
        <Col md={6}>
          <div className="product-image-container">
            <img
              className="img-large"
              src={`http://localhost:10000/${selectedVariant?.mainImage || product.image}`}
              alt={product.name}
            />
          </div>
          <div className="variant-images mt-3">
            <Row>
              {product.variants.map((variant) => (
                <Col xs={4} key={variant.id}>
                  <img
                    className={`img-thumbnail variant-image ${
                      selectedVariant?.id === variant.id ? 'selected' : ''
                    }`}
                    src={`http://localhost:10000/${variant.mainImage}`}
                    alt={variant.name}
                    onClick={() => setSelectedVariant(variant)}
                    style={{ cursor: 'pointer' }}
                  />
                   <h4 style={{color: "blue"}}>{variant.name}</h4>
                </Col>
              ))}
            </Row>
          </div>
        </Col>
        <Col md={3}>
          <ListGroup variant="flush">
            <ListGroup.Item>
              <Helmet>
                <title>{product.name}</title>
              </Helmet>
              <h1 className="product-title">{product.name}</h1>
            </ListGroup.Item>
            <ListGroup.Item>
              <Rating
                rating={product.rating}
                numReviews={product.numReviews}
              ></Rating>
            </ListGroup.Item>
            <ListGroup.Item>
              <div className="product-price">
                Price: {price.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}
              </div>
            </ListGroup.Item>
            <ListGroup.Item>
              <p className="product-description">{product.description}</p>
            </ListGroup.Item>
          </ListGroup>
        </Col>
        <Col md={3}>
          <Card className="product-card">
            <Card.Body>
              <ListGroup variant="flush">
                <ListGroup.Item>
                  <Row>
                    <Col>Price:</Col>
                    <Col>{price.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}</Col>
                  </Row>
                </ListGroup.Item>
                <ListGroup.Item>
                  <Row>
                    <Col>Status:</Col>
                    <Col>
                      {quantity > 0 ? (
                        <Badge bg="success">In Stock</Badge>
                      ) : (
                        <Badge bg="danger">Unavailable</Badge>
                      )}
                    </Col>
                  </Row>
                </ListGroup.Item>
                {quantity > 0 && (
                  <ListGroup.Item>
                    <div className="d-grid">
                      <Button onClick={addToCartHandler} variant="primary">
                        Add to Cart
                      </Button>
                    </div>
                  </ListGroup.Item>
                )}
              </ListGroup>
            </Card.Body>
          </Card>
        </Col>
      </Row>
      <div className="my-3">
  <h2 ref={reviewsRef} className="reviews-header">
    <strong>Reviews</strong>
  </h2>
  <div className="mb-3">
    {product.reviews.length === 0 && (
      <MessageBox>There are no reviews</MessageBox>
    )}
  </div>
  <ListGroup className="reviews-list">
  {Array.isArray(product.reviews) && product.reviews.length > 0 ? (
    product.reviews.map((review) => (
      review && (
        <ListGroup.Item key={review.id} className="review-item">
          {/* Check if review exists and has a rating */}
          <Rating rating={review.rating || 0} caption=" "></Rating>
          <p>{new Date(review.createdAt || new Date()).toLocaleDateString()}</p>
          <p>{review.comment || "No comment provided."}</p>
        </ListGroup.Item>
      )
    ))
  ) : (
    <MessageBox>No reviews available.</MessageBox>
  )}
</ListGroup>

  <div className="my-3">
    {userInfo ? (
      <form onSubmit={submitHandler}>
        <h2>Write a customer review</h2>
        <Form.Group className="mb-3" controlId="rating">
          <Form.Label>Rating</Form.Label>
          <Form.Select
            aria-label="Rating"
            value={rating}
            onChange={(e) => setRating(e.target.value)}
          >
            <option value="">Select...</option>
            <option value="1">1- Poor</option>
            <option value="2">2- Fair</option>
            <option value="3">3- Good</option>
            <option value="4">4- Very good</option>
            <option value="5">5- Excellent</option>
          </Form.Select>
        </Form.Group>
        <FloatingLabel
          controlId="floatingTextarea"
          label="Comments"
          className="mb-3"
        >
          <Form.Control
            as="textarea"
            placeholder="Leave a comment here"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
          />
        </FloatingLabel>
        <div className="mb-3">
          <Button type="submit" variant="success" className="submit-btn">
            Submit
          </Button>
        </div>
      </form>
    ) : (
      <MessageBox>
        Please{' '}
        <Link
          to={`/signin?redirect=/product/${product.slug}`}
          className="signin-link"
        >
          Sign In
        </Link>{' '}
        to write a review
      </MessageBox>
    )}
  </div>
</div>
    </div>
  );
}

export default ProductScreen;