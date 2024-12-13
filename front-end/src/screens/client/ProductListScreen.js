import React, { useContext, useEffect, useReducer, useState } from "react";
import axios from "axios";
import { Store } from "../../Store";
import LoadingBox from "../../components/LoadingBox";
import MessageBox from "../../components/MessageBox";
import { Row, Col, Button, Form, Modal } from "react-bootstrap";
import { toast } from "react-toastify";
import { getError } from "../../utils";
import { Helmet } from "react-helmet-async";

const reducer = (state, action) => {
  switch (action.type) {
    case "FETCH_REQUEST":
      return { ...state, loading: true };
    case "FETCH_SUCCESS":
      return { ...state, products: action.payload.data, loading: false };
    case "CREATE_VARIANT_REQUEST":
      return { ...state, loadingCreate: true };
    case "CREATE_VARIANT_SUCCESS":
      return { ...state, loadingCreate: false };
    case "CREATE_VARIANT_FAIL":
      return { ...state, loadingCreate: false };
    case "FETCH_METADATA_SUCCESS":
      return {
        ...state,
        metadata: {
          categories: Array.isArray(action.payload.categories) ? action.payload.categories : [],
          brands: Array.isArray(action.payload.brands) ? action.payload.brands : [],
          tags: Array.isArray(action.payload.tags) ? action.payload.tags : [],
          suppliers: Array.isArray(action.payload.suppliers) ? action.payload.suppliers : [],
        },
        loading: false,
      };
    case "CREATE_REQUEST":
      return { ...state, loadingCreate: true };
    case "CREATE_SUCCESS":
      return { ...state, loadingCreate: false };
    case "CREATE_FAIL":
      return { ...state, loadingCreate: false };
    case "FETCH_FAIL":
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
};

export default function ProductListScreen() {
  const [{ loading, error, products, metadata, loadingCreate }, dispatch] = useReducer(reducer, {
    loading: true,
    error: "",
    products: [],
    metadata: {
      categories: [],
      brands: [],
      tags: [],
      suppliers: [],
    },
  });

  const { state } = useContext(Store);
  const { userInfo } = state;

  const [showProductModal, setShowProductModal] = useState(false);
  const [showVariantModal, setShowVariantModal] = useState(false);
  const [showMetadataModal, setShowMetadataModal] = useState(false);
  const [selectedMetadataType, setSelectedMetadataType] = useState("");
  const [shouldRefresh, setShouldRefresh] = useState(false); // State to trigger refresh

  const [modalForm, setModalForm] = useState({ name: "", description: "" });
  const [showEditProductModal, setShowEditProductModal] = useState(false);
  const [showVariantDetailModal, setShowVariantDetailModal] = useState(false);
  const [currentProduct, setCurrentProduct] = useState(null);
  const [currentVariant, setCurrentVariant] = useState(null);
  const [editProductForm, setEditProductForm] = useState({
    name: "",
    description: "",
    material: "",
  });
  const [editVariantForm, setEditVariantForm] = useState({
    name: "",
    sku: "",
    barcode: "",
    price: 0,
    quantity: 0,
  });
  const [productForm, setProductForm] = useState({
    name: "",
    description: "",
    material: "",
    categoryId: "",
    brandId: "",
    tagIds: [],
    supplierIds: [],
  });
  const [variantForm, setVariantForm] = useState({
    name: "",
    sku: "",
    barcode: "",
    price: 0,
    currency: "USD",
    effectiveDate: new Date().toISOString().split("T")[0],
    colorName: "",
    colorCode: "",
    size: "",
    quantity: 0,
    location: "",
    mainImage: "",
    images: [],
    productId: "",
  });
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [createdProductId, setCreatedProductId] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        dispatch({ type: "FETCH_REQUEST" });

        const { data: productsData } = await axios.get("http://localhost:10000/api/v1/product", {
          headers: { Authorization: `Bearer ${userInfo.access_token}` },
        });

        const [categories, brands, tags, suppliers] = await Promise.all([
          axios.get("http://localhost:10000/api/v1/category", { headers: { Authorization: `Bearer ${userInfo.access_token}` } }),
          axios.get("http://localhost:10000/api/v1/brand", { headers: { Authorization: `Bearer ${userInfo.access_token}` } }),
          axios.get("http://localhost:10000/api/v1/tag", { headers: { Authorization: `Bearer ${userInfo.access_token}` } }),
          axios.get("http://localhost:10000/api/v1/supplier", { headers: { Authorization: `Bearer ${userInfo.access_token}` } }),
        ]);

        dispatch({
          type: "FETCH_SUCCESS",
          payload: productsData.data,
        });

       
        dispatch({
          type: "FETCH_METADATA_SUCCESS",
          payload: {
            categories: categories.data.data.data,
            brands: brands.data.data.data,
            tags: tags.data.data.data,
            suppliers: suppliers.data.data.data,
          },
        });
      } catch (err) {
        dispatch({ type: "FETCH_FAIL", payload: getError(err) });
      }
    };

    fetchData();
  }, [userInfo, shouldRefresh]);

  const createMetadataHandler = async () => {
    try {
      dispatch({ type: "CREATE_REQUEST" });
      const { data } = await axios.post(
        `http://localhost:10000/api/v1/${selectedMetadataType}`,
        modalForm,
        {
          headers: { Authorization: `Bearer ${userInfo.access_token}` },
        }
      );
      toast.success(`${selectedMetadataType} created successfully`);
      setModalForm({ name: "", description: "" });
      setShowMetadataModal(false);

      dispatch({
        type: "FETCH_METADATA_SUCCESS",
        payload: {
          ...metadata,
          [`${selectedMetadataType}s`]: [...metadata[`${selectedMetadataType}s`], data],
        },
      });
    } catch (err) {
      toast.error(getError(err));
      dispatch({ type: "CREATE_FAIL" });
    }
  };

  const createProductHandler = async () => {
    try {
      dispatch({ type: "CREATE_REQUEST" });
      const { data } = await axios.post(
        `http://localhost:10000/api/v1/product`,
        productForm,
        {
          headers: { Authorization: `Bearer ${userInfo.access_token}` },
        }
      );
      toast.success("Product created successfully");
      setCreatedProductId(data.id);
      setShouldRefresh(!shouldRefresh);
      setShowProductModal(false);
      setShowVariantModal(true);
      dispatch({ type: "CREATE_SUCCESS" });
    } catch (err) {
      toast.error(getError(err));
      dispatch({ type: "CREATE_FAIL" });
    }
  };
  const uploadFileHandler = async (file) => {
    const formData = new FormData();
    formData.append("file", file);

    const { data } = await axios.post("http://localhost:10000/api/v1/file/upload", formData, {
      headers: {
        Authorization: `Bearer ${userInfo.access_token}`,
        "Content-Type": "multipart/form-data",
      },
    });
    return `/default/${data.data.filename}`; // Adjusting to include the expected path
  };

  const createVariantHandler = async () => {
    try {
      dispatch({ type: "CREATE_VARIANT_REQUEST" });

      // Upload images
      console.log(1)
      const uploadedImages = [];
      for (let file of selectedFiles) {
        const uploadedUrl = await uploadFileHandler(file);
        uploadedImages.push(uploadedUrl);
      }

      const uploadedMainImage = uploadedImages[0] || "";
      console.log({  ...variantForm,
        productId:createdProductId,
        mainImage: uploadedMainImage,
        images: uploadedImages})

      // Create Variant
      const { data: variantData } = await axios.post(
        `http://localhost:10000/api/v1/variant`,
        {
          name:variantForm.name,
          sku:variantForm.sku,
          barcode:variantForm.barcode,
          price:variantForm.price,
          colorName:variantForm.colorName,
          colorCode:variantForm.colorCode,
          size:variantForm.size,
          quantity:variantForm.quantity,
          productId:createdProductId,
          mainImage: uploadedMainImage,
          images: uploadedImages,
        },
        {
          headers: { Authorization: `Bearer ${userInfo.access_token}` },
        }
      );
      console.log(variantData);
      const variantId = variantData.data.id;

      // Create Price
      const { data: priceData } = await axios.post(
        `http://localhost:10000/api/v1/price`,
        {
          price: variantForm.price,
          currency: variantForm.currency,
          effectiveDate: variantForm.effectiveDate,
          variantId,
        },
        {
          headers: { Authorization: `Bearer ${userInfo.access_token}` },
        }
      );

      // Create Inventory
      const { data: inventoryData } = await axios.post(
        `http://localhost:10000/api/v1/inventory`,
        {
          quantity: variantForm.quantity,
          location: variantForm.location,
          variantId,
        },
        {
          headers: { Authorization: `Bearer ${userInfo.access_token}` },
        }
      );

      // Update Variant with priceIds and inventoryIds
      await axios.patch(
        `http://localhost:10000/api/v1/variant/${variantId}`,
        {
          priceIds: [priceData.data.id],
          inventoryIds: [inventoryData.data.id],
        },
        {
          headers: { Authorization: `Bearer ${userInfo.access_token}` },
        }
      );

      toast.success("Variant, Price, and Inventory created successfully");
      setShowVariantModal(false);
      dispatch({ type: "CREATE_VARIANT_SUCCESS" });
    } catch (err) {
      toast.error(getError(err));
      dispatch({ type: "CREATE_VARIANT_FAIL" });
    }
  };

  const deleteProductHandler = async (productId) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      try {
        await axios.delete(`http://localhost:10000/api/v1/product/${productId}`, {
          headers: { Authorization: `Bearer ${userInfo.access_token}` },
        });
        toast.success("Product deleted successfully");
        dispatch({ type: "CREATE_SUCCESS" }); // Trigger refresh
      } catch (err) {
        toast.error(getError(err));
        dispatch({ type: "CREATE_FAIL" });
      }
    }
  };

  const editProductHandler = async () => {
    try {
      await axios.patch(
        `http://localhost:10000/api/v1/product/${currentProduct.id}`,
        editProductForm,
        {
          headers: { Authorization: `Bearer ${userInfo.access_token}` },
        }
      );
      toast.success("Product updated successfully");
      setShowEditProductModal(false);
      dispatch({ type: "EDIT_SUCCESS" }); // Trigger refresh
    } catch (err) {
      toast.error(getError(err));
      dispatch({ type: "EDIT_FAIL" });
    }
  };

  const fetchVariantDetail = async (variantId) => {
    try {
      const { data } = await axios.get(`http://localhost:10000/api/v1/variant`, {
        headers: { Authorization: `Bearer ${userInfo.access_token}` },
      });
      setCurrentVariant(data);
      setEditVariantForm(data);
      setShowVariantDetailModal(true);
      dispatch({ type: "FETCH_VARIANT_SUCCESS", payload: data });
    } catch (err) {
      toast.error(getError(err));
    }
  };

  const editVariantHandler = async () => {
    try {
      await axios.patch(
        `http://localhost:10000/api/v1/variant/${currentVariant.id}`,
        editVariantForm,
        {
          headers: { Authorization: `Bearer ${userInfo.access_token}` },
        }
      );
      toast.success("Variant updated successfully");
      setShowVariantDetailModal(false);
      dispatch({ type: "EDIT_SUCCESS" }); // Trigger refresh
    } catch (err) {
      toast.error(getError(err));
      dispatch({ type: "EDIT_FAIL" });
    }
  };

  const deleteVariantHandler = async (variantId) => {
    if (window.confirm("Are you sure you want to delete this variant?")) {
      try {
        await axios.delete(`http://localhost:10000/api/v1/variant/${variantId}`, {
          headers: { Authorization: `Bearer ${userInfo.access_token}` },
        });
        toast.success("Variant deleted successfully");
        setShowVariantDetailModal(false);
        dispatch({ type: "DELETE_SUCCESS" }); // Trigger refresh
      } catch (err) {
        toast.error(getError(err));
        dispatch({ type: "DELETE_FAIL" });
      }
    }
  };
  return (
    <div>
      <Helmet>
        <title>Product Admin</title>
      </Helmet>
      <h1>Products</h1>
      {loading ? (
        <LoadingBox />
      ) : error ? (
        <MessageBox variant="danger">{error}</MessageBox>
      ) : (
        <div>
          <Row className="mb-3">
            <Col>
              <Button variant="primary" onClick={() => setShowProductModal(true)}>
                Create Product
              </Button>{" "}
              <Button
                variant="secondary"
                onClick={() => {
                  setSelectedMetadataType("category");
                  setShowMetadataModal(true);
                }}
              >
                Create Category
              </Button>{" "}
              <Button
                variant="secondary"
                onClick={() => {
                  setSelectedMetadataType("brand");
                  setShowMetadataModal(true);
                }}
              >
                Create Brand
              </Button>{" "}
              <Button
                variant="secondary"
                onClick={() => {
                  setSelectedMetadataType("supplier");
                  setShowMetadataModal(true);
                }}
              >
                Create Supplier
              </Button>{" "}
              <Button
                variant="secondary"
                onClick={() => {
                  setSelectedMetadataType("tag");
                  setShowMetadataModal(true);
                }}
              >
                Create Tag
              </Button>
            </Col>
          </Row>
          <table className="table mt-3">
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr key={product.id}>
                  <td>{product.id}</td>
                  <td>{product.name}</td>
                  <td>
                    <Button
                      variant="info"
                      onClick={() => {
                        setCreatedProductId(product.id);
                        setShowVariantModal(true);
                      }}
                    >
                      Add Variant
                    </Button>
                    <Button
                      variant="info"
                      onClick={() => {
                        setCurrentProduct(product);
                        setEditProductForm({
                          name: product.name,
                          description: product.description,
                          material: product.material,
                        });
                        setShowEditProductModal(true);
                      }}
                    >
                      Edit
                    </Button>{" "}
                    <Button variant="danger" onClick={() => deleteProductHandler(product.id)}>
                      Delete
                    </Button>{" "}
                    <Button
                      variant="secondary"
                      onClick={() => fetchVariantDetail(product.id)}
                    >
                      View Details
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Metadata Modal */}
      <Modal show={showMetadataModal} onHide={() => setShowMetadataModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Create {selectedMetadataType}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group>
              <Form.Label>Name</Form.Label>
              <Form.Control
                type="text"
                value={modalForm.name}
                onChange={(e) => setModalForm({ ...modalForm, name: e.target.value })}
              />
            </Form.Group>
            <Form.Group className="mt-3">
              <Form.Label>Description</Form.Label>
              <Form.Control
                type="text"
                value={modalForm.description}
                onChange={(e) => setModalForm({ ...modalForm, description: e.target.value })}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={createMetadataHandler}>Create</Button>
        </Modal.Footer>
      </Modal>

      {/* Product Modal */}
      <Modal show={showProductModal} onHide={() => setShowProductModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Create Product</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group>
              <Form.Label>Product Name</Form.Label>
              <Form.Control
                type="text"
                value={productForm.name}
                onChange={(e) => setProductForm({ ...productForm, name: e.target.value })}
              />
            </Form.Group>
            <Form.Group className="mt-3">
              <Form.Label>Description</Form.Label>
              <Form.Control
                type="text"
                value={productForm.description}
                onChange={(e) => setProductForm({ ...productForm, description: e.target.value })}
              />
            </Form.Group>
            <Form.Group className="mt-3">
              <Form.Label>Material</Form.Label>
              <Form.Control
                type="text"
                value={productForm.material}
                onChange={(e) => setProductForm({ ...productForm, material: e.target.value })}
              />
            </Form.Group>
            <Form.Group className="mt-3">
              <Form.Label>Category</Form.Label>
              <Form.Select
                value={productForm.categoryId}
                onChange={(e) => setProductForm({ ...productForm, categoryId: e.target.value })}
              >
                <option value="">Select Category</option>
                {metadata.categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>
            <Form.Group className="mt-3">
              <Form.Label>Brand</Form.Label>
              <Form.Select
                value={productForm.brandId}
                onChange={(e) => setProductForm({ ...productForm, brandId: e.target.value })}
              >
                <option value="">Select Brand</option>
                {metadata.brands.map((brand) => (
                  <option key={brand.id} value={brand.id}>
                    {brand.name}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>
            <Form.Group className="mt-3">
              <Form.Label>Supplier</Form.Label>
              <Form.Select
                multiple
                value={productForm.supplierIds || []} // Ensure an empty array by default
                onChange={(e) =>
                  setProductForm({
                    ...productForm,
                    supplierIds: Array.from(e.target.selectedOptions, (option) => option.value),
                  })
                }
                style={{ height: "120px", overflowY: "scroll" }} // Enhance usability for multiple selections
              >
                {metadata.suppliers.map((supplier) => (
                  <option key={supplier.id} value={supplier.id}>
                    {supplier.name}
                  </option>
                ))}
              </Form.Select>
              {productForm.supplierIds && productForm.supplierIds.length === 0 && (
                <div className="text-muted mt-2">No suppliers selected</div>
              )}
            </Form.Group>

            <Form.Group className="mt-3">
              <Form.Label>Tags</Form.Label>
              <Form.Select
                multiple
                value={productForm.tagIds || []} // Ensure an empty array by default
                onChange={(e) =>
                  setProductForm({
                    ...productForm,
                    tagIds: Array.from(e.target.selectedOptions, (option) => option.value),
                  })
                }
                style={{ height: "120px", overflowY: "scroll" }} // Enhance usability for multiple selections
              >
                {metadata.tags.map((tag) => (
                  <option key={tag.id} value={tag.id}>
                    {tag.name}
                  </option>
                ))}
              </Form.Select>
              {productForm.tagIds && productForm.tagIds.length === 0 && (
                <div className="text-muted mt-2">No tags selected</div>
              )}
            </Form.Group>


          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={createProductHandler}>Create Product</Button>
        </Modal.Footer>
      </Modal>

      {/* Create Variant Modal */}
      <Modal show={showVariantModal} onHide={() => setShowVariantModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Create Variant</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mt-3">
              <Form.Label>Name</Form.Label>
              <Form.Control
                type="text"
                value={variantForm.name}
                onChange={(e) => setVariantForm({ ...variantForm, name: e.target.value })}
              />
            </Form.Group>
            <Form.Group className="mt-3">
              <Form.Label>SKU</Form.Label>
              <Form.Control
                type="text"
                value={variantForm.sku}
                onChange={(e) => setVariantForm({ ...variantForm, sku: e.target.value })}
              />
            </Form.Group>
            <Form.Group className="mt-3">
              <Form.Label>Barcode</Form.Label>
              <Form.Control
                type="text"
                value={variantForm.barcode}
                onChange={(e) => setVariantForm({ ...variantForm, barcode: e.target.value })}
              />
            </Form.Group>
            <Form.Group className="mt-3">
              <Form.Label>Location</Form.Label>
              <Form.Control
                type="text"
                value={variantForm.location}
                onChange={(e) => setVariantForm({ ...variantForm, location: e.target.value })}
              />
            </Form.Group>
            <Form.Group className="mt-3">
              <Form.Label>Price</Form.Label>
              <Form.Control
                type="number"
                value={variantForm.price}
                onChange={(e) => setVariantForm({ ...variantForm, price: parseFloat(e.target.value) })}
                placeholder="Enter price"
                required
              />
            </Form.Group>
            <Form.Group className="mt-3">
              <Form.Label>Quanity</Form.Label>
              <Form.Control
                type="number"
                value={variantForm.quantity}
                onChange={(e) => setVariantForm({ ...variantForm, quantity: parseFloat(e.target.value) })}
                placeholder="Enter available quantity"
                required
              />
            </Form.Group>
            <Form.Group className="mt-3">
              <Form.Label>Currency</Form.Label>
              <Form.Control
                as="select"
                value={variantForm.currency}
                onChange={(e) => setVariantForm({ ...variantForm, currency: e.target.value })}
              >
                <option value="USD">USD</option>
                <option value="VND">VND</option>
              </Form.Control>
            </Form.Group>
            <Form.Group className="mt-3">
              <Form.Label>Effective Date</Form.Label>
              <Form.Control
                type="date"
                value={variantForm.effectiveDate}
                onChange={(e) => setVariantForm({ ...variantForm, effectiveDate: e.target.value })}
              />
            </Form.Group>
            <Form.Group className="mt-3">
              <Form.Label>Color Name</Form.Label>
              <Form.Control
                type="text"
                value={variantForm.colorName}
                onChange={(e) => setVariantForm({ ...variantForm, colorName: e.target.value })}
              />
            </Form.Group>
            <Form.Group className="mt-3">
              <Form.Label>Color Code</Form.Label>
              <div className="d-flex align-items-center">
                <Form.Control
                  type="color"
                  value={variantForm.colorCode}
                  onChange={(e) => setVariantForm({ ...variantForm, colorCode: e.target.value })}
                  style={{ width: "60px", height: "35px", padding: "0" }} // Style the color picker for better UX
                />
                <Form.Control
                  type="text"
                  value={variantForm.colorCode}
                  onChange={(e) => setVariantForm({ ...variantForm, colorCode: e.target.value })}
                  placeholder="#000000"
                  className="ms-3" // Add margin to separate the color picker and text field
                />
              </div>
            </Form.Group>

            <Form.Group className="mt-3">
              <Form.Label>Size</Form.Label>
              <Form.Control
                type="text"
                value={variantForm.size}
                onChange={(e) => setVariantForm({ ...variantForm, size: e.target.value })}
              />
            </Form.Group>
            <Form.Group className="mt-3">
              <Form.Label>Main Image</Form.Label>
              <Form.Control
                type="file"
                onChange={(e) => setSelectedFiles([e.target.files[0]])}
              />
            </Form.Group>
            <Form.Group className="mt-3">
              <Form.Label>Additional Images</Form.Label>
              <Form.Control
                type="file"
                multiple
                onChange={(e) => setSelectedFiles(Array.from(e.target.files))}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowVariantModal(false)}>
            Close
          </Button>
          <Button variant="primary" onClick={createVariantHandler}>
            Create Variant
          </Button>
        </Modal.Footer>
      </Modal>
         {/* Edit Product Modal */}
         <Modal show={showEditProductModal} onHide={() => setShowEditProductModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Edit Product</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group>
              <Form.Label>Name</Form.Label>
              <Form.Control
                type="text"
                value={editProductForm.name}
                onChange={(e) => setEditProductForm({ ...editProductForm, name: e.target.value })}
              />
            </Form.Group>
            <Form.Group className="mt-3">
              <Form.Label>Description</Form.Label>
              <Form.Control
                type="text"
                value={editProductForm.description}
                onChange={(e) =>
                  setEditProductForm({ ...editProductForm, description: e.target.value })
                }
              />
            </Form.Group>
            <Form.Group className="mt-3">
              <Form.Label>Material</Form.Label>
              <Form.Control
                type="text"
                value={editProductForm.material}
                onChange={(e) =>
                  setEditProductForm({ ...editProductForm, material: e.target.value })
                }
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowEditProductModal(false)}>
            Close
          </Button>
          <Button variant="primary" onClick={editProductHandler}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Variant Detail Modal */}
      <Modal show={showVariantDetailModal} onHide={() => setShowVariantDetailModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Variant Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group>
              <Form.Label>Name</Form.Label>
              <Form.Control
                type="text"
                value={editVariantForm.name}
                onChange={(e) => setEditVariantForm({ ...editVariantForm, name: e.target.value })}
              />
            </Form.Group>
            <Form.Group className="mt-3">
              <Form.Label>SKU</Form.Label>
              <Form.Control
                type="text"
                value={editVariantForm.sku}
                onChange={(e) => setEditVariantForm({ ...editVariantForm, sku: e.target.value })}
              />
            </Form.Group>
            <Form.Group className="mt-3">
              <Form.Label>Barcode</Form.Label>
              <Form.Control
                type="text"
                value={editVariantForm.barcode}
                onChange={(e) =>
                  setEditVariantForm({ ...editVariantForm, barcode: e.target.value })
                }
              />
            </Form.Group>
            <Form.Group className="mt-3">
              <Form.Label>Price</Form.Label>
              <Form.Control
                type="number"
                value={editVariantForm.price}
                onChange={(e) =>
                  setEditVariantForm({ ...editVariantForm, price: parseFloat(e.target.value) })
                }
              />
            </Form.Group>
            <Form.Group className="mt-3">
              <Form.Label>Quantity</Form.Label>
              <Form.Control
                type="number"
                value={editVariantForm.quantity}
                onChange={(e) =>
                  setEditVariantForm({
                    ...editVariantForm,
                    quantity: parseInt(e.target.value, 10),
                  })
                }
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowVariantDetailModal(false)}>
            Close
          </Button>
          <Button variant="primary" onClick={editVariantHandler}>
            Save Changes
          </Button>
          <Button
            variant="danger"
            onClick={() => deleteVariantHandler(currentVariant.id)}
          >
            Delete Variant
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}
