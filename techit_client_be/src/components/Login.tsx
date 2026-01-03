import { useFormik } from "formik";
import { FunctionComponent } from "react";
import * as yup from "yup";
import { checkUser } from "../services/usersService";
import { Link, useNavigate } from "react-router-dom";

interface LoginProps {}

const Login: FunctionComponent<LoginProps> = () => {
  const navigate = useNavigate();
  const formik = useFormik({
    initialValues: { email: "", password: "" },
    validationSchema: yup.object({
      email: yup.string().email().required().min(5),
      password: yup.string().required().min(8),
    }),
    onSubmit: (values) => {
      checkUser(values)
        .then((res) => {
          if (res.data.length) {
            navigate("/home");
            sessionStorage.setItem("userId", res.data[0].id);
          } else {
            alert("Wrong email or password");
          }
        })
        .catch((err) => console.log(err));
    },
  });
  return (
    <>
      <div className="container text-center">
        <h4 className="display-4">LOGIN</h4>
        <form onSubmit={formik.handleSubmit} className="w-75 m-auto">
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
            className="btn btn-info w-100 my-3 "
            disabled={!formik.isValid || !formik.dirty}
          >
            Login
          </button>
        </form>
        <Link to={"/register"}>New user? Register here</Link>
      </div>
    </>
  );
};

export default Login;
