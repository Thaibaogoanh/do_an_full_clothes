import axios from "axios";
import React, { useContext, useEffect, useReducer } from "react";
import Button from "react-bootstrap/Button";
import { Helmet } from "react-helmet-async";
import Table from "react-bootstrap/Table";
import Pagination from "react-bootstrap/Pagination";
import LoadingBox from "../../components/LoadingBox";
import MessageBox from "../../components/MessageBox";
import { Store } from "../../Store";
import { getError } from "../../utils";

const reducer = (state, action) => {
  switch (action.type) {
    case "FETCH_REQUEST":
      return { ...state, loading: true };
    case "FETCH_SUCCESS":
      return {
        ...state,
        loading: false,
        orders: action.payload.data,
        pagination: action.payload.pagination,
      };
    case "FETCH_FAIL":
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
};

export default function OrderListScreen() {
  const { state } = useContext(Store);
  const { userInfo } = state;

  const [{ loading, error, orders, pagination }, dispatch] = useReducer(
    reducer,
    {
      loading: true,
      error: "",
      orders: [],
      pagination: { totalRecords: 0, totalPages: 0, page: 1, limit: 10 },
    }
  );

  const fetchOrders = async (page = 1) => {
    try {
      dispatch({ type: "FETCH_REQUEST" });
      const { data } = await axios.get(
        `http://localhost:10000/api/v1/order?page=${page}&limit=${pagination.limit}`,
        {
          headers: { Authorization: `Bearer ${userInfo.access_token}` },
        }
      );
      dispatch({ type: "FETCH_SUCCESS", payload: data.data });
    } catch (err) {
      dispatch({ type: "FETCH_FAIL", payload: getError(err) });
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handlePageChange = (page) => {
    fetchOrders(page);
  };

  return (
    <div>
      <Helmet>
        <title>Admin Orders</title>
      </Helmet>
      <h1>Order Management</h1>
      {loading ? (
        <LoadingBox />
      ) : error ? (
        <MessageBox variant="danger">{error}</MessageBox>
      ) : (
        <>
          <Table striped bordered hover responsive className="table-sm">
            <thead>
              <tr>
                <th>ORDER ID</th>
                <th>STATUS</th>
                <th>TOTAL</th>
                <th>CURRENCY</th>
                <th>CREATED AT</th>
                <th>ACTIONS</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order.id}>
                  <td>{order.id}</td>
                  <td>{order.status}</td>
                  <td>
                    {order.total.toLocaleString("en-US", {
                      style: "currency",
                      currency: order.currency,
                    })}
                  </td>
                  <td>{order.currency}</td>
                  <td>{new Date(order.createdAt).toLocaleString()}</td>
                  <td>
                    <Button
                      type="button"
                      variant="primary"
                      onClick={() => {
                        window.location.href = `/order/${order.id}`;
                      }}
                    >
                      Details
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
          <div className="d-flex justify-content-center mt-3">
            <Pagination>
              {Array.from({ length: pagination.totalPages }, (_, i) => (
                <Pagination.Item
                  key={i + 1}
                  active={i + 1 === pagination.page}
                  onClick={() => handlePageChange(i + 1)}
                >
                  {i + 1}
                </Pagination.Item>
              ))}
            </Pagination>
          </div>
        </>
      )}
    </div>
  );
}
