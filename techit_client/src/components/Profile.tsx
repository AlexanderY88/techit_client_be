import { FunctionComponent, useEffect, useState } from "react";
import Navbar from "./Navbar";
import User from "../interfaces/User";
import { getUserById } from "../services/usersService";

interface ProfileProps {}

const Profile: FunctionComponent<ProfileProps> = () => {
  const [user, setUser] = useState<User>({ name: "", email: "", password: "" });

  useEffect(() => {
    getUserById()
      .then((res) => setUser(res.data))
      .catch((err) => console.log(err));
  }, []);

  return (
    <>
      <Navbar />
      <h4 className="display-4">PROFILE</h4>
      <p>Name: {user.name}</p>
      <p>Email: {user.email}</p>
      {user.isAdmin ? (
        <p className="text-success">You are an admin</p>
      ) : (
        <p className="text-danger">You are NOT an admin</p>
      )}
    </>
  );
};

export default Profile;
