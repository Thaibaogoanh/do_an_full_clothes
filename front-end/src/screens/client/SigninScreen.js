import React, { useContext, useEffect, useState } from 'react';
import { Button, Container, Form, Toast } from 'react-bootstrap';
import { Helmet } from 'react-helmet-async';
import { Link, useNavigate } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import { Store } from '../../Store';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { getError } from '../../utils';
const qs = require('qs');

export default function SigninScreen() {
  const navigate = useNavigate();
  const { search } = useLocation();
  const redirectInUrl = new URLSearchParams(search).get('redirect'); //'/shipping'
  const redirect = redirectInUrl ? redirectInUrl : '/'; //if redirectInUrl exist, redirect is redirectInUrl, else redirect is '/'

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  //for userInfo-
  //we bring it from useContext, and extract state from it
  //than from state we extract userInfo
  const { state, dispatch: ctxDispatch } = useContext(Store);
  const { userInfo } = state;

  const submitHandler = async (e) => {
    e.preventDefault(); //prevent refreshing the page when user click on sign in button
    //send ajax request backend
    try {
     

      const data1 = qs.stringify({
        username: email,  // Dùng email làm giá trị của username
        password: password,
      });
      const { data } = await axios.post('http://localhost:10000/api/v1/auth/signin', 
        data1,{
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      }
    );
    let token=data.data.access_token;
    const data2 = await axios.get('http://localhost:10000/api/v1/auth/profile', {
      headers: { Authorization: `Bearer ${token}` }, //this is to authenticate this api request- /api/orders/summery
    })

      let info= {...data2.data.data,...data.data}
      //save user info in local storage
      ctxDispatch({ type: 'USER_SIGNIN', payload: info });
      localStorage.setItem('userInfo', JSON.stringify( info));
      navigate(redirect || '/');
    } catch (err) {
      toast.error(getError(err));
    }
  };

  //useEffect for send an ajax request to get the dashboard data
  //try and catch beacuse we have to catch any error on ajax requests to backend
  useEffect(() => {
    if (userInfo) {
      navigate(redirect);
    }
  }, [navigate, redirect, userInfo]);

  return (
    <Container className="small-container">
      <Helmet>
        <title>Sign In</title>
      </Helmet>
      <h1 className="my-3">Sign In</h1>
      <Form onSubmit={submitHandler}>
        <Form.Group className="mb-3" controlId="email"></Form.Group>
        <Form.Label>Email</Form.Label>
        <Form.Control
          type="email"
          required
          onChange={(e) => setEmail(e.target.value)}
        />
        <Form.Group className="mb-3" controlId="password"></Form.Group>
        <Form.Label>Password</Form.Label>
        <Form.Control
          type="password"
          required
          onChange={(e) => setPassword(e.target.value)}
        />
        <div className="mb-3">
          <Button type="submit" className="sign-in-button">
            Sign In
          </Button>
        </div>
        <div className="mb-3">
          New customer? {''}
          <Link to={`/signup?redirect=${redirect}`}>Create your account</Link>
        </div>
      </Form>
    </Container>
  );
}
