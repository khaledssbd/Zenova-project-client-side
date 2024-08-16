import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { useEffect, useRef, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import toast from 'react-hot-toast';
import googleSvg from '../../assets/google.svg';
import facebookSvg from '../../assets/facebook.svg';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import useAuth from '../../hooks/useAuth';
import bgImg from '../../assets/carousel2.jpg';
import xButtonSVG from '../../assets/x-button.svg';
import Swal from 'sweetalert2';
import Loading from '../../Components/AllLootie/Loading';

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || '/';

  // user data
  const {
    user,
    logIn,
    verifyUser,
    logOut,
    signInWithSocial,
    googleProvider,
    facebookProvider,
    getPassWordResetMail,
  } = useAuth();

  const [showPassword, setShowPassword] = useState(false);
  const emailRef = useRef(null);
  const [logging, setLogging] = useState(false);
  const [showForgotPassModal, setShowForgotPassModal] = useState(false);
  const [
    passWordResetMailSentConfirmation,
    setPassWordResetMailSentConfirmation,
  ] = useState(false);

  // const handleLogin = async e => {
  //   e.preventDefault();
  //   const email = e.target.email.value;
  //   const password = e.target.password.value;
  //   try {
  //     const result = await logIn(email, password);
  //     if (!result?.user?.emailVerified) {
  //       await logOut();
  //       await verifyUser(result.user);
  //       Swal.fire(
  //         'Alert!',
  //         'You must verify your email. Check your inbox.',
  //         'error'
  //       );
  //     } else {
  //       navigate(location?.state || '/');
  //       toast.success('Account logged-in successfully!');
  //     }
  //   } catch (error) {
  //     if (error.message === 'Firebase: Error (auth/invalid-credential).') {
  //       toast.error('Email or password is wrong, try again or reset.');
  //     } else if (
  //       error.message === 'Firebase: Error (auth/too-many-requests).'
  //     ) {
  //       toast.error('Too many requests may ban your account. Verify now.');
  //     } else {
  //       toast.error('An error occurred during login. Please try again.');
  //     }
  //   }
  // };

  const handleLogin = async e => {
    e.preventDefault();
    setLogging(true);
    const form = e.target;

    const email = form.email.value;
    const password = form.password.value;

    try {
      const result = await logIn(email, password);

      if (!result?.user?.emailVerified) {
        await logOut();
        await verifyUser(result.user);
        setLogging(false);
        Swal.fire({
          title: 'Alert!',
          text: 'You must verify your email before login. Check your inbox.',
          icon: 'error',
          confirmButtonColor: '#3085d6',
          confirmButtonText: 'Ok',
        }).then(async result => {
          if (result.isConfirmed) {
            window.location.reload();
          }
        });
      } else {
        navigate(from, { replace: true });
        // navigate(location?.state ? location.state : '/');
        toast.success('Account logged-in successfully!');
      }
    } catch (error) {
      setLogging(false);
      if (error.message === 'Firebase: Error (auth/invalid-credential).') {
        Swal.fire({
          title: 'Alert!',
          text: 'Email or password is wrong, try again or reset.',
          icon: 'error',
          confirmButtonColor: '#3085d6',
          confirmButtonText: 'Ok',
        }).then(async result => {
          if (result.isConfirmed) {
            window.location.reload();
          }
        });
      } else if (
        error.message === 'Firebase: Error (auth/too-many-requests).'
      ) {
        Swal.fire({
          title: 'Alert!',
          text: 'Too many trial may ban your account. Verify email quickly.',
          icon: 'error',
          confirmButtonColor: '#3085d6',
          confirmButtonText: 'Ok',
        }).then(async result => {
          if (result.isConfirmed) {
            window.location.reload();
          }
        });
      } else {
        Swal.fire({
          title: 'Alert!',
          text: 'An error occurred during login. Please try again.',
          icon: 'error',
          confirmButtonColor: '#3085d6',
          confirmButtonText: 'Ok',
        }).then(async result => {
          if (result.isConfirmed) {
            window.location.reload();
          }
        });
      }
    }
  };

  const socialSignIn = async provider => {
    await signInWithSocial(provider);
    navigate(from, { replace: true });
    // navigate(location?.state ? location.state : '/');
    toast.success('Successfully logged in');
  };

  const handlePasswordReset = async e => {
    e.preventDefault();
    const email = e.target.emailForPassReset.value;

    try {
      await getPassWordResetMail(email);
      setPassWordResetMailSentConfirmation(true);
    } catch (error) {
      toast.error(error.message);
    }
  };

  if (logging) {
    return (
      <div className="flex justify-center items-center pt-44">
        <Loading />
      </div>
    );
  }

  if (user) {
    return <Navigate to="/"></Navigate>;
  }

  return (
    <div className="my-5 md:my-10 p-5 md:p-10">
      <Helmet>
        <title>Zenova | Login</title>
      </Helmet>
      <h2 className="my-10 text-xl sm:text-2xl md:text-3xl font-medium text-centerrating">
        Welcome to Zenova! Please login.
      </h2>
      <form onSubmit={handleLogin} className=" md:w-3/4 lg:w-1/2 mx-auto">
        <div className="form-control">
          <label className="label label-textrating text-lg pb-1">Email</label>
          <input
            type="email"
            required
            name="email"
            ref={emailRef}
            placeholder="Your Email"
            className="input input-bordered"
          />
        </div>
        <div className="form-control">
          <label className="label label-textrating text-lg pb-1 mt-3">
            Password
          </label>
          <div className="flex items-center">
            <input
              type={showPassword ? 'text' : 'password'}
              required
              name="password"
              placeholder="Your Password"
              className="input input-bordered w-full"
              autoComplete="true"
            />
            <span
              onClick={() => setShowPassword(!showPassword)}
              className="-ml-10"
            >
              {showPassword ? <FaEye /> : <FaEyeSlash />}
            </span>
          </div>

          <label className="label">
            <div
              onClick={() => setShowForgotPassModal(true)}
              className="label-text-alt link link-hoverrating text-sm"
            >
              Forgot password?
            </div>
          </label>
        </div>
        <div className="form-control mt-6">
          <button className="btn bg-[#DD028B] text-white text-base md:text-lg">
            Login
          </button>
        </div>
      </form>
      <div className="">
        <h2 className="text-xlrating mt-10 mb-4">Login With</h2>
        <div className="flex justify-center gap-8">
          <button
            onClick={() => {
              socialSignIn(googleProvider);
            }}
          >
            <img className="w-9" src={googleSvg} alt="Google" />
          </button>
          {/* <button
            onClick={() => {
              socialSignIn(facebookProvider);
            }}
          >
            <img className="w-9" src={facebookSvg} alt="Facebook" />
          </button> */}
        </div>
      </div>
      <p className="text-centerrating mt-4">
        New member?
        <Link className="text-blue-600 font-bold ml-2" to="/register">
          Register
        </Link>{' '}
        here.
      </p>
      {showForgotPassModal && (
        <div
          style={{
            background:
              'linear-gradient(0deg, rgba(21, 11, 43, 0.90) 0%, rgba(21, 11, 43, 0.70) 100%)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
          className="fixed top-0 left-0 flex justify-center items-center h-screen w-full z-10"
        >
          <div className="w-full mx-3 sm:w-1/3 h-1/3 rounded-2xl bg-blue-400 text-center">
            <div className="card-actions justify-end">
              <button
                onClick={() => {
                  setShowForgotPassModal(false);
                  setPassWordResetMailSentConfirmation(false);
                }}
                className="btn btn-square btn-sm"
              >
                <img src={xButtonSVG} alt="close" />
              </button>
            </div>
            {passWordResetMailSentConfirmation ? (
              <div className="px-5 md:px-10 pt-10 xl:pt-16">
                <h3 className="text-black md:text-lg font-medium">
                  Password reset mail sent to the email. Check your inbox.
                </h3>
              </div>
            ) : (
              <form onSubmit={handlePasswordReset} className="px-5">
                <h3 className="mb-2 text-black text-xl font-bold md:mt-5">
                  Your Email
                </h3>
                <div className="form-control">
                  <input
                    type="email"
                    required
                    defaultValue={emailRef.current.value}
                    name="emailForPassReset"
                    placeholder="Enter your email"
                    className="input input-bordered"
                  />
                </div>
                <input
                  className="mt-2 sm:mt-4 md:mt-8 px-8 py-2.5 leading-5rating transition-colors duration-300 transform bg-blue-700 rounded-md hover:bg-red-700 focus:outline-none cursor-pointer"
                  type="submit"
                  value="Get reset mail"
                />
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Login;
