import { useFormik } from "formik";
import { FunctionComponent } from "react";
import { Link, useNavigate } from "react-router-dom";
import * as yup from "yup";
import { addUser } from "../services/usersService";
import { createCart } from "../services/cartsService";

interface RegisterProps {}

const Register: FunctionComponent<RegisterProps> = () => {
  const navigate = useNavigate();
  const formik = useFormik({
    initialValues: { email: "", password: "", name: "" },
    validationSchema: yup.object({
      email: yup.string().email().required().min(5),
      password: yup.string().required().min(8),
      name: yup.string().required().min(2),
    }),
    onSubmit: (values) => {
      addUser({ ...values, isAdmin: false })
        .then((res) => {
          navigate("/home");
          sessionStorage.setItem("userId", res.data.id);
          createCart(res.data.id)
            .then(() => {
              console.log("Cart created successfully!");
            })
            .catch((err) => console.log(err));
        })
        .catch((err) => console.log(err));
    },
  });
  return (
    <>
      <div className="container text-center">
        <h4 className="display-4">REGISTER</h4>
        <form onSubmit={formik.handleSubmit} className="w-75 m-auto">
          <div className="form-floating mb-3">
            <input
              type="text"
              className="form-control"
              id="name"
              placeholder="John Doe"
              name="name"
              value={formik.values.name}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
            <label htmlFor="name">Name</label>
            {formik.touched.name && formik.errors.name && (
              <p className="text-danger">{formik.errors.name}</p>
            )}
          </div>
          <div className="form-floating mb-3">
            <input
              type="email"
              className="form-control"
              id="email"
              placeholder="name@example.com"
              name="email"
              value={formik.values.email}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
            <label htmlFor="email">Email address</label>
            {formik.touched.email && formik.errors.email && (
              <p className="text-danger">{formik.errors.email}</p>
            )}
          </div>
          <div className="form-floating">
            <input
              type="password"
              className="form-control"
              id="password"
              placeholder="Password"
              name="password"
              value={formik.values.password}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
            <label htmlFor="password">Password</label>
            {formik.touched.password && formik.errors.password && (
              <p className="text-danger">{formik.errors.password}</p>
            )}
          </div>
          <button
            type="submit"
            className="btn btn-primary w-100 my-3 "
            disabled={!formik.isValid || !formik.dirty}
          >
            Register
          </button>
        </form>
        <Link to={"/"}>Already have user? Login here</Link>
      </div>
    </>
  );
};

export default Register;
