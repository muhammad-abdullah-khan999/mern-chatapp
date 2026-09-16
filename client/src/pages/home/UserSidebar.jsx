import { IoSearch } from "react-icons/io5";
import User from "./User";
import { useDispatch, useSelector } from "react-redux";
import {
  getOtherUsersThunk,
  logoutUserThunk,
} from "../../store/slices/user/user.thunk";
import { useEffect, useState } from "react";

const UserSidebar = () => {
  const [searchValue, setSearchValue] = useState("");
  const dispatch = useDispatch();
  const [users, setUsers] = useState([]);
  const { otherUsers, userProfile } = useSelector((state) => state.userReducer);

  const handleLogout = async () => {
     dispatch(logoutUserThunk());
  };

  useEffect(() => {
    if (!searchValue) {
      setUsers(otherUsers);
    } else {
      setUsers(
        otherUsers.filter((user) => {
          return (
            user.username.toLowerCase().includes(searchValue.toLowerCase()) ||
            user.fullname
              .toLowerCase()
              .includes(searchValue.toLocaleLowerCase())
          );
        })
      );
    }
  }, [searchValue, otherUsers]);

  useEffect(() => {
    (async () => {
      await dispatch(getOtherUsersThunk());
    })();
  }, []);

  return (
    <div className="max-w-[24rem] w-full h-screen flex flex-col bg-gray-900 border-r border-gray-800">
      <div>
        <h1 className="mt-5 mx-3 text-primary text-3xl font-semibold rounded-lg">
          GUP SHUP
        </h1>
      </div>
      <div className="py-5 pl-3">
        <label className="input">
          <IoSearch />
          <input
            onChange={(e) => setSearchValue(e.target.value)}
            type="text"
            className="grow"
            placeholder="Search"
          />
        </label>
      </div>
      <div className="h-full overflow-y-auto bg-gray-900">
        {users?.map((userDetails) => {
          return <User key={userDetails?._id} userDetails={userDetails} bgColor="bg-gray-800"/>;
        })}
      </div>
      


      <div className="pt-2 flex gap-3 items-center py-5">
          <div className="avatar">
            <div className="w-13 rounded-full ml-3 ring-primary ring-offset-base-100 ring-2 ring-offset-2">
              <img src={userProfile?.avatar} />
            </div>
          </div>
          <div className="w-full">
            <p className="text-md text-gray-200 font-bold">{userProfile?.fullname}</p>
            <p className="text-xs text-gray-350">{userProfile?.username}</p>
          </div>
          <button onClick={handleLogout} className="btn btn-primary mx-3 btn-sm">
          Logout
        </button>
        </div>
    </div>
  );
};

export default UserSidebar;
