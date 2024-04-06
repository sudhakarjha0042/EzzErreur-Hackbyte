import { Routes, Route, Link } from "react-router-dom";
import mainLogo from "./assets/EzzErreurLogo.png";
import Landing from "./pages/Landing";
import Home from "./pages/homepage";
import Login from "./pages/login";
import Signup from "./pages/signup";
import Explore from "./pages/Explore";
import './index.css';

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
        <Route path="/" element={<Landing/>}/>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/home" element={<Home />} />
        <Route path="/explore" element = {<Explore/>}/>
      </Routes>
    </div>
  );
}

export default App;
