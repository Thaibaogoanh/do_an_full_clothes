import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import { Link } from 'react-router-dom';
import Rating from './Rating';
import axios from 'axios';
import { useContext, useState, useEffect } from 'react';
import { Store } from '../Store';

function Product(props) {
  const { product } = props;

  const [variant, setVariant] = useState(product.variants[0]);
  const [price, setPrice] = useState(0);
  const [quantity, setQuantity] = useState(product.variants[0]?.quantity||0);

  const { state, dispatch: ctxDispatch } = useContext(Store);
  const { cart: { cartItems }, } = state;
  const { userInfo } = state;

  const [isClicked, setIsClicked] = useState(false);

  useEffect(() => {
    // Fetch variant details from API
    const fetchVariantDetails = async () => {
      try {
        
        const { data } = await axios.get(`http://localhost:10000/api/v1/variant/${product.variants[0].id}`,
          {
            headers: { Authorization: `Bearer ${userInfo.access_token}` },
          });
        setVariant(product.variants[0]);
        setPrice(data.data.prices[0]?.price || 0);
        setQuantity(product.variants[0].quantity || 0);
      } catch (error) {
        console.error('Error fetching variant details:', error);
      }
    };

    fetchVariantDetails();
  }, [product.variants]);
  const addToCartHandler = async (item) => {
    if (!userInfo) {
      window.alert('Please sign in to add items to the cart');
      return;
    }

    const existItem = cartItems.find((x) => x.variantId === variant.id);
    const itemQuantity = existItem ? existItem.quantity + 1 : 1;

    if (quantity < itemQuantity) {
      window.alert('Sorry. Product is out of stock');
      return;
    }

    try {
      await axios.post(
        `http://localhost:10000/api/v1/cart-items`,
        {
          cartId: state.cart.id,
          variantId: variant.id,
          quantity: itemQuantity,
        },
        {
          headers: { Authorization: `Bearer ${userInfo.access_token}` },
        }
      );

      ctxDispatch({
        type: 'CART_ADD_ITEM',
        payload: { ...item, variantId: variant.id, quantity: itemQuantity },
      });

      setIsClicked(true);
      setTimeout(() => {
        setIsClicked(false);
      }, 200);
      window.alert('Item added to the cart successfully!');
    } catch (error) {
      console.error('Error adding to cart:', error);
      window.alert('Failed to add item to the cart');
    }
  };

  if (!variant) {
    return <div>Loading...</div>;
  }

  return (
    <Card>
      <Link to={`/product/${product.id}`}>
        <img
          src={`http://localhost:10000/${product.variants[0].mainImage}`}
          // src={product.variants[0].mainImage}
          className="card-img-top"
          alt={product.variants[0].mainImage}
          style={{
            aspectRatio: '1 / 1',
            objectFit: 'cover',
            borderRadius: '8px'
          }}
        />
      </Link>

      <Card.Body>
        <Link to={`/product/${product.id}`}>
          <Card.Title>{product.name}</Card.Title>
        </Link>

        <Rating rating={product.reviews.rating} numReviews={product.reviews.length} />

        <Card.Text>{price.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}</Card.Text>
{/* 
        {quantity === 0 ? (
          <Button variant="light" disabled>
            Out of stock
          </Button>
        ) : (
          <Button
            onClick={() => addToCartHandler(product)}
            style={{
              position: 'relative',
              transition: 'transform 200ms ease-out',
              transform: isClicked ? 'scale(0.95)' : 'none',
            }}
          >
            Add to cart
          </Button>
        )} */}
      </Card.Body>
    </Card>
  );
}

export default Product;
