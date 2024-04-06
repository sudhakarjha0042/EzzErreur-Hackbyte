import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import mainLogo from "../assets/EzzErreurLogo.png";

import Banner from "../components/Banner";
import Input from "../components/Input";
import Button from "../components/Button";
import Loader from "../components/Loader";

function Login() {
  let width;
  const [windowWidth, setWindowWidth] = useState(width);

  const [verifying, setVerifying] = useState(false);
  const [isSiging, setIsSigning] = useState(false);

  // going for normal approach later on we will use hooks for inputs
  const [isPasswordfocus, setIsPasswordfocus] = useState(false);

  useEffect(() => {
    function watchWidth() {
      setWindowWidth(window.innerWidth);
    }

    window.addEventListener("resize", watchWidth);
  }, [windowWidth]);
  // signup details handling
  const [data, setData] = useState({
    name: "",
    password: "",
    email: "",
  });

  // Login details
  const onInput = (e) => {
    e.preventDefault();
    setData((state) => ({ ...state, [e.target.name]: e.target.value }));
  };

  const isValidName = data.name.length > 3;
  const passwordPattern =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d@$!%*?&#]{8,}$/;
  const isValidPassword = passwordPattern.test(data.password);
  const isValidInput = isValidName;

  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    if (!isValidInput) {
      return;
    }
    setIsSigning(true);
    const { name, password } = data;
    try {
      // DO NOT TOUCH BELOW CODE
      const response = await fetch('https://ezzerreur-hackbyte.onrender.com/users/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username: name,
        password: password,
      }),
    });
    const responseData = await response.json();
    if (response.ok) {
      console.log('Login successful');
      localStorage.setItem('user', JSON.stringify(responseData.user));
      localStorage.setItem('token', responseData.token);
      navigate('/home');
    } else {
      console.error('Login failed:', responseData.message);
    }
    // DO NOT TOUCH ABOVE CODE
      setIsSigning(false);
      setVerifying(true);
    } catch (error) {
      console.log(error);
      setIsSigning(false);
    }
  };

  return (
    <>
      <div
        style={{
          background: `linear-gradient(0deg, #37c189 -10.03%, rgba(144, 146, 255, 0) 98.39%), #212121`,
        }}
      >
        <div className="flex flex-col items-center justify-evenly min-h-screen gap-0 sm:flex-wrap lg:flex-nowrap sm:flex-row md:justify-center md:gap-12 lg:justify-evenly max-w-[3000px] mx-auto">
          {windowWidth > 1024 && (
            <div className="flex items-center justify-center w-full h-[80vh] lg:min-h-screen lg:w-1/2 ">
              <Banner />
            </div>
          )}

          <div className="flex items-center justify-center w-full bg-[#212121] text-[#17a199] sm:py-10 lg:py-0 lg:w-1/2 lg:items-center">
            <div className=" flex items-center justify-center p-10 w-[90%] sm:w-2/3  lg:mt-0 md:w-3/4 lg:w-2/3 max-w-[420px] sm:max-w-[600px] md:max-w-[420px] ">
              <div className="rounded-2xl bg-bgPrimary  px-10 pb-[60px] w-full md:w-[410px]">
                <div>
                  <Link to={"/"}>
                    <img
                      className="h-20 mx-auto "
                      src={mainLogo}
                      alt="LinkCollect"
                    />
                  </Link>
                  <h2 className="mt-2 mb-3 text-xl font-bold text-white tracking-tight text-center sm:text-3xl">
                    Welcome
                  </h2>
                  <p
                    className="-mt-2 text-sm  text-center sm:text-lg para"
                   
                  >
                    Log in to Your Account
                  </p>
                </div>
                <div className="mt-8 mb-3">
                  <form onSubmit={handleRegister}>
                    <div className="mb-3">
                      <Input
                        id="name"
                        name="name"
                        type="text"
                        placeholder="Homelander"
                        onInput={onInput}
                        value={data.name}
                      />
                    </div>
                    <div className="mb-4">
                      <Input
                        id="password"
                        name="password"
                        type="password"
                        placeholder="password"
                        onInput={onInput}
                        value={data.password}
                        onFocus={() => setIsPasswordfocus(true)}
                        onBlur={() => setIsPasswordfocus(false)}
                      />
                      {!isValidPassword && isPasswordfocus && (
                        <p className="text-xs text-error-500 mt-2 text-start">
                          incorrect Password
                        </p>
                      )}
                    </div>

                    {/* Need to add link after adding the api for forget pass */}
                    {/* <p className="mb-4 font-light text-left text-textSecondary">
                  Forget Your Password?
                </p> */}

                    <Button
                      variant="primary"
                      disabled={!isValidInput}
                      onClick={handleRegister}
                      isLoading={isSiging}
                    >
                      {!isSiging ? "Login" : <Loader />}
                    </Button>
                    <div className="flex w-full justify-center items-center flex-col gap-1 my-3" >

                    <p className="mt-1 font-light text-left text-neutral-400">
                      want to Create an Account?{" "}
                    </p>
                      <Link to="/signup" className="font-bold text-center text-white">
                        Sign Up
                      </Link>
                    </div>
                  </form>
                </div>
                <hr className="mt-4 hr-text" data-content="OR" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Login;
