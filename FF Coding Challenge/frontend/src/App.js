import { ToastContainer } from "react-toastify";
import "./App.css";
import "antd/dist/antd.css";
import { RoutesComponent } from "./components/Routes";

function App() {
  return (
    <div>
      <ToastContainer />
      <RoutesComponent />;
    </div>
  );
}

export default App;
