import { Routes, Route } from "react-router-dom";
import { CreateEvent } from "./CreateEvent";
import { Home } from "./Home";
import { Navbar } from "./Navbar";

export const RoutesComponent = () => {
  return (
    <Routes>
      <Route path="/" element={<Navbar />}>
        <Route path="" element={<Home />}></Route>
        <Route path="create" element={<CreateEvent />}></Route>
      </Route>
    </Routes>
  );
};
