import { useEffect, useState } from "react";
import { FaUser, FaKey, FaMale, FaFemale } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { registerUserThunk } from "../../store/slices/user/user.thunk";

const Signup = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { isAuthenticated } = useSelector((state) => state.userReducer);

  const [signupData, setSignupData] = useState({
    fullname: "",
    username: "",
    password: "",
    gender: "male",
  });

  useEffect(() => {
    if (isAuthenticated) navigate("/");
  }, [isAuthenticated]);

  const handleInputChange = (e) => {
     console.log("changed:", e.target.name, "=>", e.target.value);
    setSignupData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleRegister = async () => {
    console.log("signup data: ", signupData);
    const response = await dispatch(registerUserThunk(signupData));
    if (response?.payload?.success) {
      navigate("/");
    }
  };

  return (
    <div className="flex justify-center items-center p-6 min-h-screen">
      <div className="max-w-[30rem] w-full flex flex-col gap-5 bg-base-200 p-6 rounded-lg ">
        <h1 className="font-semibold text-2xl">Signup Here</h1>
        <label className="input validator w-full flex items-center gap-2">
          <FaUser />
          <input
            className="w-full" // 👈 ensures input stretches
            type="text"
            required
            placeholder="Full Name"
            onChange={handleInputChange}
            name="fullname"
          />
        </label>
        <p className="validator-hint hidden">
          Must be 3 to 30 characters
          <br />
          containing only letters, numbers or dash
        </p>

        <label className="input w-full flex justify-between items-center gap-2">
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

        <div className="">
          <div className="input validator w-full flex items-center gap-4 relative">
            <label
              htmlFor="male"
              className="flex items-center gap-2 cursor-pointer"
            >
              <FaMale />
              <input
                id="male"
                type="radio"
                name="gender"
                value="male"
                className="radio radio-primary focus:outline-none focus:ring-0"
                style={{ outline: "none", boxShadow: "none" }}
                checked={signupData.gender === "male"}
                defaultChecked
                onChange={handleInputChange}
              />
              <span>Male</span>
            </label>

            <label
              htmlFor="female"
              className="flex items-center gap-2 cursor-pointer ml-auto mr-[25%]"
            >
              <FaFemale />
              <input
                id="female"
                type="radio"
                name="gender"
                value="female"
                checked={signupData.gender === "female"}
                className="radio radio-primary focus:outline-none focus:ring-0"
                style={{ outline: "none", boxShadow: "none" }}
                onChange={handleInputChange}
              />
              <span>Female</span>
            </label>
          </div>
        </div>

        <button onClick={handleRegister} className="btn btn-primary w-full font-semibold">
          Sign up
        </button>

        <p>
          Already have account? &nbsp;
          <span className="font-semibold text-primary underline">
            <Link to="/login">Login here</Link>
          </span>
        </p>
      </div>
    </div>
  );
};

export default Signup;
