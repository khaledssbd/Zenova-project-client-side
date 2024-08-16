import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

const ProductCard = ({ product }) => {
  const {
    _id,
    image,
    name,
    price,
    description,
    sellerEmail,
    sellerImage,
    sellerName,
    totalSold,
  } = product || {};
  return (
    <div className="w-full max-w-sm px-4 py-3 bg-white rounded-md shadow-md hover:scale-[1.05] transition-all text-start border border-gray-300">
      <div className="flex justify-center items-center">
        <img className="rounded-lg" src={image} alt={name} />
      </div>
      <div>
        <h1 className="text-lg font-semibold text-gray-800 text-center my-4">
          {name.substring(0, 30)}...
        </h1>

        <p title={description} className="mt-2 text-sm text-gray-600 ">
          {description.substring(0, 100)}...
        </p>
        <p className="mt-2 pt-2 text-sm font-bold text-gray-600 border-t border-gray-300">
          Seller:
        </p>
        <div className="flex justify-center items-center gap-4 mb-2 pb-2 border-b border-gray-300">
          <div className="rounded-full object-cover overflow-hidden w-10 h-10">
            <img src={sellerImage} alt={sellerName} />
          </div>
          <div>
            <p className="mt-2 text-sm  text-gray-600 ">Name: {sellerName}</p>
            <p className="mt-2 text-sm  text-gray-600 ">Email: {sellerEmail}</p>
          </div>
        </div>
        <div className="flex items-center justify-around">
          <div className="text-left">
            <p className="mt-2 text-sm text-gray-600 ">Price: ${price}</p>
            <p className="mt-2 text-sm text-gray-600 ">
              Total Sold: {totalSold}
            </p>
          </div>
          <Link to={`/product/${_id}`}>
            <button className="text-white hover:bg-green-500 bg-[#DD028B] rounded-lg p-2">
              View Details
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};
export default ProductCard;

ProductCard.propTypes = {
  product: PropTypes.object.isRequired,
};
