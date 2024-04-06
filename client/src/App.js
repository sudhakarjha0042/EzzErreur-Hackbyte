import { Routes, Route, Link } from "react-router-dom";
import mainLogo from "./assets/EzzErreurLogo.png";
import Home from "./pages/homepage";
import Login from "./pages/login";
import Signup from "./pages/signup";
import "./index.css";

function App() {
  return (
    <div>
      {/* <nav>
        <ul>
          <li>
            <Link to="/">
              <img className="h-10 w-10" src={mainLogo} alt="EzzErreur Logo" />
            </Link>
          </li>
          <li>
            <Link to="/">Home</Link>
          </li>
          <li>
            <Link to="/login">Login</Link>
          </li>
          <li>
            <Link to="/signup">Signup</Link>
          </li>
        </ul>
      </nav> */}

      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/" element={<Home />} />
      </Routes>
    </div>
  );
}

export default App;
