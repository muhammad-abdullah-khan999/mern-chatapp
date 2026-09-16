import { useEffect, useState } from "react";
import { FaUser, FaKey } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { loginUserThunk } from "../../store/slices/user/user.thunk";
const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
   const { isAuthenticated } = useSelector((state) => state.userReducer);

  const [loginData, setLoginData] = useState({
    username: "",
    password: "",
  });

  useEffect(() => {
    if (isAuthenticated) navigate("/");
  }, [isAuthenticated]);

  const handleInputChange = (e) => {
    console.log(e.target.placeholder);
    setLoginData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleLogin =async () => {
    const response = await dispatch(loginUserThunk(loginData))
    if (response?.payload?.success) {
      navigate("/");
    }
  };

  return (
    <div className="flex justify-center items-center p-6 min-h-screen">
      <div className="max-w-[30rem] w-full flex flex-col gap-5 bg-base-200 p-6 rounded-lg ">
        <h1 className="text-2xl font-semibold">Login Here</h1>
        <label className="input validator w-full flex items-center gap-2">
          <FaUser />
          <input
            className="w-full" // 👈 ensures input stretches
            type="text"
            required
            placeholder="Username"
            onChange={handleInputChange}
            name="username"
          />
        </label>
        <p className="validator-hint hidden">
          Must be 3 to 30 characters
          <br />
          containing only letters, numbers or dash
        </p>

        <label className="input validator w-full flex items-center gap-2">
          <FaKey />
          <input
            className="w-full" // 👈 ensures input stretches
            type="password"
            required
            placeholder="Password"
            onChange={handleInputChange}
            name="password"
          />
        </label>
        <p className="validator-hint hidden">
          Must be more than 8 characters, including
          <br />
          At least one number <br />
          At least one lowercase letter <br />
          At least one uppercase letter
        </p>

        <button onClick={handleLogin} className="btn btn-primary w-full font-semibold">
          Login
        </button>

        <p>
          Don't have an account? &nbsp;
          <span className="font-semibold text-primary underline">
            <Link to="/signup">Signup here</Link>
          </span>
        </p>
      </div>
    </div>
  );
};

export default Login;
