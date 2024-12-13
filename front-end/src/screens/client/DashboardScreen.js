import React, { useReducer, useEffect } from 'react';
import Chart from 'react-google-charts';
import { Helmet } from 'react-helmet-async';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Card from 'react-bootstrap/Card';
import LoadingBox from '../../components/LoadingBox';
import MessageBox from '../../components/MessageBox';

// Fake data to simulate API responses
const fakeSummary = {
  users: [{ numUsers: 120 }],
  orders: [{ numOrders: 45, totalSales: 3250.75 }],
  dailyOrders: [
    { _id: '2024-12-01', sales: 500 },
    { _id: '2024-12-02', sales: 700 },
    { _id: '2024-12-03', sales: 400 },
    { _id: '2024-12-04', sales: 650 },
    { _id: '2024-12-05', sales: 1000 },
  ],
  productCategories: [
    { _id: 'Electronics', count: 15 },
    { _id: 'Clothing', count: 25 },
    { _id: 'Home Appliances', count: 10 },
    { _id: 'Books', count: 5 },
  ],
};

const reducer = (state, action) => {
  switch (action.type) {
    case 'FETCH_REQUEST':
      return { ...state, loading: true };
    case 'FETCH_SUCCESS':
      return { ...state, summary: action.payload, loading: false };
    case 'FETCH_FAIL':
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
};

export default function DashboardScreen() {
  const [{ loading, summary, error }, dispatch] = useReducer(reducer, {
    loading: true,
    summary: null,
    error: '',
  });

  // Simulating data fetching with fake data
  useEffect(() => {
    const fetchFakeData = () => {
      dispatch({ type: 'FETCH_REQUEST' });
      try {
        // Simulate a delay for the loading state
        setTimeout(() => {
          dispatch({ type: 'FETCH_SUCCESS', payload: fakeSummary });
        }, 1000);
      } catch (err) {
        dispatch({ type: 'FETCH_FAIL', payload: 'Failed to load data' });
      }
    };

    fetchFakeData();
  }, []);

  return (
    <div>
      <Helmet>
        <title>Dashboard</title>
      </Helmet>
      <h1>Dashboard</h1>

      {loading ? (
        <LoadingBox />
      ) : error ? (
        <MessageBox variant="danger">{error}</MessageBox>
      ) : (
        <>
          <Row>
            <Col md={4}>
              <Card>
                <Card.Body>
                  <Card.Text>Number Of Users</Card.Text>
                  <Card.Title>
                    {summary.users && summary.users[0]
                      ? summary.users[0].numUsers
                      : 0}
                  </Card.Title>
                </Card.Body>
              </Card>
            </Col>
            <Col md={4}>
              <Card>
                <Card.Body>
                  <Card.Text>Number Of Orders</Card.Text>
                  <Card.Title>
                    {summary.orders && summary.orders[0]
                      ? summary.orders[0].numOrders
                      : 0}
                  </Card.Title>
                </Card.Body>
              </Card>
            </Col>
            <Col md={4}>
              <Card>
                <Card.Body>
                  <Card.Text>Money Orders</Card.Text>
                  <Card.Title>
                    $
                    {summary.orders && summary.orders[0]
                      ? summary.orders[0].totalSales.toFixed(2)
                      : 0}
                  </Card.Title>
                </Card.Body>
              </Card>
            </Col>
          </Row>
          <div className="my-3">
            <h2>Sales</h2>
            {summary.dailyOrders.length === 0 ? (
              <MessageBox>No Sale</MessageBox>
            ) : (
              <Chart
                width="100%"
                height="400px"
                chartType="AreaChart"
                loader={<div>Loading Chart...</div>}
                data={[
                  ['Date', 'Sales'],
                  ...summary.dailyOrders.map((x) => [x._id, x.sales]),
                ]}
              ></Chart>
            )}
          </div>
          <div className="my-3">
            <h2>Categories</h2>
            {summary.productCategories.length === 0 ? (
              <MessageBox>No Category</MessageBox>
            ) : (
              <Chart
                width="100%"
                height="400px"
                chartType="PieChart"
                loader={<div>Loading Chart...</div>}
                data={[
                  ['Category', 'Products'],
                  ...summary.productCategories.map((x) => [x._id, x.count]),
                ]}
              ></Chart>
            )}
          </div>
        </>
      )}
    </div>
  );
}
