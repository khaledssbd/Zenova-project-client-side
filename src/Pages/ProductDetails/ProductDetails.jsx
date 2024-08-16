import { Helmet } from 'react-helmet-async';
import { useLoaderData } from 'react-router-dom';
// import xButtonSVG from '../../assets/x-button.svg';

const productDetails = () => {
  const product = useLoaderData();

  const {
    name,
    image,
    price,
    description,
    category,
    rating,
    date_Time,
    totalSold,
    sellerEmail,
    sellerImage,
    sellerName,
  } = product || {};

  return (
    <div className="my-6 md:my-11">
      <Helmet>
        <title>Zenova | {name}</title>
      </Helmet>
      <div className="flex justify-center items-center mb-5 md:mb-10 animate__animated animate__backInUp">
        <img className="h-1/2 rounded-xl" src={image} alt={name} />
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-3 gap-5">
        <div className="col-span-2 flex flex-col gap-5 animate__animated animate__backInUp">
          <h3 className="font-play text-xl font-bold">
            {name}
          </h3>

          <div className="ml-10 sm:20 md:ml-40 space-y-3">
            <h4 className="text-left text-base font-normal">Price: ${price}</h4>
            <h4 className="text-left text-base font-normal">
              Category: {category}
            </h4>
            <h4 className="text-left text-base font-normal">
              Rating:{' '}
              {[...Array(rating)].map((item, index) => (
                <span className="text-2xl text-amber-600" key={index}>
                  &#9733;
                </span>
              ))}
            </h4>
            <h4 className="text-left text-base font-normal">
              Total Sold: {totalSold}
            </h4>
            <h4 className="text-left text-base font-normal">
              Posted on: {new Date(date_Time).toLocaleDateString()}
            </h4>
            <div className="text-left">
              <h3 className="text-sm font-normal whitespace-pre-line text-justify">
                Description: {description}
              </h3>
            </div>
          </div>

          <div className="flex gap-2 mt-5"></div>
        </div>

        <div className="animate__animated animate__backInUp min-w-80 ml-0 sm:ml-36 md:ml-0">
          <div className="lg:mt-28 ml-4 flex flex-col mb-6">
            <h3 className="text-base font-medium mb-2">Seller-</h3>
            <div className="flex justify-center items-center gap-4 mb-2 py-2 border-t border-gray-400">
              <div className="rounded-full object-cover overflow-hidden w-14">
                <img src={sellerImage} alt={sellerName} />
              </div>
              <div>
                <p className="mt-2 text-sm  text-left">Name: {sellerName}</p>
                <p className="mt-2 text-sm text-left">Email: {sellerEmail}</p>
              </div>
            </div>
            <div className="text-center mt-5">
              <button className="btn text-xs md:text-sm bg-[#DD028B] hover:bg-green-500 text-white hover:text-black">
                Buy Now
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default productDetails;
