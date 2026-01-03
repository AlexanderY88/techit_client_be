import { FormikValues, useFormik } from "formik";
import { FunctionComponent } from "react";
import * as yup from "yup";
import { addProduct } from "../services/productsService";

interface AddProductProps {
  onHide: Function;
}

const AddProduct: FunctionComponent<AddProductProps> = ({ onHide }) => {
  const formik = useFormik({
    initialValues: {
      name: "",
      price: 0,
      category: "",
      description: "",
      image: "",
      quantity: 0,
    },
    validationSchema: yup.object({
      name: yup.string().required().min(2),
      price: yup.number().required().moreThan(0),
      category: yup.string().required().min(2),
      description: yup.string().required().min(2),
      image: yup.string().required().min(2).url(),
      quantity: yup.number().required(),
    }),
    onSubmit: (values) => {
      addProduct(values)
        .then((res) => {
          onHide();
        })
        .catch((err) => console.log(err));
    },
  });
  return (
    <div className="container w-75">
      <form onSubmit={formik.handleSubmit}>
        <div className="form-floating mb-3">
          <input
            type="text"
            className="form-control"
            id="name"
            placeholder="John Doe"
            value={formik.values.name}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          />
          <label htmlFor="name">Name</label>
          {formik.touched.name && formik.errors.name && (
            <span className="text-danger">{formik.errors.name}</span>
          )}
        </div>
        <div className="form-floating mb-3">
          <input
            type="number"
            className="form-control"
            id="price"
            placeholder="0"
            value={formik.values.price}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          />
          <label htmlFor="price">Price</label>
          {formik.touched.price && formik.errors.price && (
            <span className="text-danger">{formik.errors.price}</span>
          )}
        </div>
        <div className="form-floating mb-3">
          <input
            type="text"
            className="form-control"
            id="category"
            placeholder="laptops"
            value={formik.values.category}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          />
          <label htmlFor="category">Category</label>
          {formik.touched.category && formik.errors.category && (
            <span className="text-danger">{formik.errors.category}</span>
          )}
        </div>
        <div className="form-floating mb-3">
          <input
            type="text"
            className="form-control"
            id="description"
            placeholder="some text"
            value={formik.values.description}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          />
          <label htmlFor="description">Description</label>
          {formik.touched.description && formik.errors.description && (
            <span className="text-danger">{formik.errors.description}</span>
          )}
        </div>
        <div className="form-floating mb-3">
          <input
            type="text"
            className="form-control"
            id="image"
            placeholder="some url"
            value={formik.values.image}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          />
          <label htmlFor="image">Image</label>
          {formik.touched.image && formik.errors.image && (
            <span className="text-danger">{formik.errors.image}</span>
          )}
        </div>
        <div className="form-floating mb-3">
          <input
            type="number"
            className="form-control"
            id="quantity"
            placeholder="0"
            value={formik.values.quantity}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          />
          <label htmlFor="quantity">Quantity</label>
          {formik.touched.quantity && formik.errors.quantity && (
            <span className="text-danger">{formik.errors.quantity}</span>
          )}
        </div>
        <button
          className="btn btn-success w-100"
          type="submit"
          disabled={!formik.dirty || !formik.isValid}
        >
          Add
        </button>
      </form>
    </div>
  );
};

export default AddProduct;
