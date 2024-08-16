import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import userImg from '../../assets/user.png';
import useAuth from '../../hooks/useAuth';
import { Tooltip } from 'react-tooltip';

const UserProfile = () => {
  const { user } = useAuth();

  return (
    <div className="py-20">
      <Helmet>
        <title>Zenova | User Profile</title>
      </Helmet>
      <h2 className="text-xl sm:text-2xl mt-10 mb-5 text-center font-bold">
        Your Profile
      </h2>
      <div className="md:w-3/4 lg:w-1/2 mx-auto">
        <div className="flex justify-center items-center my-10">
          <img
            className="rounded-full w-48 h-48"
            src={user?.photoURL || userImg}
            referrerPolicy="no-referrer"
            data-tooltip-id="userName"
            data-tooltip-content={
              user?.displayName ? user?.displayName : 'No Name Set Yet'
            }
            data-tooltip-place="right"
          />
          <Tooltip id="userNamee" />
        </div>
        <h4 className="text-base font-medium my-4">
          Name:
          <span className="text-amber-700 ml-2">{user?.displayName}</span>
        </h4>
        <h4 className="text-base font-medium">
          Email:
          <span className="text-amber-700 ml-2">{user?.email}</span>
        </h4>
      </div>

      <p className="text-center mt-10">
        Want to update your profile?{' '}
        <Link
          className="text-blue-600 text-sm font-bold ml-2"
          to="/update-profile"
        >
          Click here
        </Link>
      </p>
    </div>
  );
};

export default UserProfile;
