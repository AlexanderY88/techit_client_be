import { FunctionComponent } from "react";
import Navbar from "./Navbar";

interface HomeProps {}

const Home: FunctionComponent<HomeProps> = () => {
  return (
    <>
      <Navbar />
      HOME
    </>
  );
};

export default Home;
