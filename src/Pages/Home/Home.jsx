import { useEffect, useState } from 'react';
import axios from 'axios';

import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import ProductCard from './ProductCard';

const Home = () => {
  const [itemsPerPage] = useState(18);
  const [currentPage, setCurrentPage] = useState(1);
  const [count, setCount] = useState(0);
  const [sortPrice, setSortPrice] = useState('');
  const [sortDate, setSortDate] = useState('');
  const [searchText, setSearchText] = useState('');
  const [products, setProducts] = useState([]);

  const [category, setCategory] = useState('');

  const [searchedProducts, setSearchedProducts] = useState([]);
  const [showSearchResult, setShowSearchResult] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const getData = async () => {
      const { data } = await axios.get(
        `${
          import.meta.env.VITE_API_URL
        }/all-products-by-pagination?page=${currentPage}&size=${itemsPerPage}&sortPrice=${sortPrice}&sortDate=${sortDate}`
      );

      setProducts(data);
    };

    getData();
  }, [currentPage, itemsPerPage, sortPrice, sortDate]);

  useEffect(() => {
    const getCount = async () => {
      const { data } = await axios.get(
        `${import.meta.env.VITE_API_URL}/products-count`
      );

      setCount(data.count);
    };

    getCount();
  }, []);

  const numberOfPages = Math.ceil(count / itemsPerPage);
  const pages = [...Array(numberOfPages).keys()]?.map(element => element + 1);

  //  handle pagination button
  const handlePaginationButton = value => {
    setCurrentPage(value);
  };

  const handleReset = () => {
    setSortPrice('');
    setSortDate('');
    setSearchText('');
    setCurrentPage(1);
    setShowSearchResult(false);
  };

  const handleSearch = async text => {
    if (text === '') {
      setSearchText('');
      setShowSearchResult(false);
      setSearchedProducts([]);
      return;
    }
    setIsLoading(true);
    setSearchText(text);
    setShowSearchResult(true);
    const { data } = await axios.get(
      `${import.meta.env.VITE_API_URL}/search-products?search=${text}`
    );
    setSearchedProducts(data);
    setIsLoading(false);
  };

  return (
    <div className="container px-6 py-10 mx-auto min-h-[calc(100vh-306px)] flex flex-col justify-between">
      <Helmet>
        <title>Zenova | All Products</title>
      </Helmet>
      <div>
        <div className="flex flex-col sm:flex-row justify-center items-center gap-5 sm:gap-12">
          <div className="flex gap-12 justify-between items-center">
            <div>
              <select
                onChange={e => {
                  setSortPrice(e.target.value);
                  setSortDate('');
                  setCurrentPage(1);
                }}
                value={sortPrice}
                className="border p-4 rounded-md"
                placeholder="Sort by"
              >
                <option hidden value="">
                  Sort By Price
                </option>
                <option value="asc">Low to high </option>
                <option value="dsc">High to Low</option>
              </select>
            </div>

            <div>
              <select
                onChange={e => {
                  setSortDate(e.target.value);
                  setSortPrice('');
                  setCurrentPage(1);
                }}
                value={sortDate}
                className="border p-4 rounded-md"
                placeholder="Sort by"
              >
                <option hidden value="">
                  Sort By Date
                </option>
                <option value="asc">New to old </option>
                <option value="dsc">Old to new</option>
              </select>
            </div>

            <div>
              <select
                onChange={e => {
                  setCategory(e.target.value);
                  setSortDate('');
                  setSortPrice('');
                  setCurrentPage(1);
                }}
                value={category}
                className="border p-4 rounded-md"
                placeholder="Sort by"
              >
                <option hidden value="">
                  Select a category
                </option>
                <option value="Electronics">Electronics</option>
                <option value="Wearables">Wearables</option>
                <option value="Entertainment">Entertainment</option>
                <option value="Accessories">Accessories</option>
                <option value="Computers">Computers</option>
              </select>
            </div>

            <button onClick={handleReset} className="btn">
              Reset
            </button>
          </div>
          <div className="flex p-1 overflow-hidden border rounded-lg focus-within:ring focus-within:ring-opacity-40 focus-within:border-blue-400 focus-within:ring-blue-300">
            <input
              className="px-6 py-2 text-gray-700 placeholder-gray-500 bg-white outline-none focus:placeholder-transparent"
              type="text"
              onChange={e => handleSearch(e.target.value)}
              value={searchText}
              name="search"
              placeholder="Search by product name"
            />
          </div>
        </div>
        <div>
          {showSearchResult && (
            <div>
              <h3 className="my-10 text-2xl font-bold">Search Result</h3>
              <div>
                {isLoading ? (
                  <span className="loading loading-dots loading-lg"></span>
                ) : (
                  <div>
                    {searchedProducts.length === 0 ? (
                      <div className="h-20">
                        <h3 className="text-red-500 text-2xl font-bold">
                          No result matched
                        </h3>
                      </div>
                    ) : (
                      <div className="border-2 border-gray-200 rounded-xl my-10 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                        {searchedProducts?.map(product => (
                          <div
                            key={product._id}
                            className="hover:scale-[1.05] transition-all flex flex-col gap-3 border border-gray-400 rounded-lg m-3 p-3 bg-white min-h-0.5"
                          >
                            <div className="flex justify-center items-center">
                              <img
                                className="rounded-lg border-2 border-gray-300 w-56"
                                src={product.image}
                                alt={product.name}
                              />
                            </div>
                            <h1 className="font-semibold text-gray-800 text-center flex-grow">
                              {product.name}
                            </h1>
                            <div className="flex items-center justify-around">
                              <div className="text-left">
                                <p className="mt-2 text-xs md:text-sm text-gray-600 flex-grow">
                                  By: {product.sellerName}
                                </p>

                                <p className="mt-2 text-xs md:text-sm text-gray-600 flex-grow">
                                  Price: ${product.price}
                                </p>
                              </div>
                            </div>
                            <Link to={`/product/${product._id}`}>
                              <button className="text-white text-xs hover:bg-green-500 bg-[#DD028B] rounded-md p-1.5">
                                Details
                              </button>
                            </Link>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Home content main part */}
        <h3 className="mt-10 font-bold text-2xl">All Products</h3>
        <div className="grid grid-cols-1 gap-6 mt-8 md:grid-cols-2 lg:grid-cols-3">
          {products?.map(product => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      </div>

      {/* Pagination Section */}
      <div className="flex justify-center mt-12">
        {/* Previous Button */}
        <button
          disabled={currentPage === 1}
          onClick={() => handlePaginationButton(currentPage - 1)}
          className="px-4 py-2 mx-1 text-gray-700 disabled:text-gray-500 capitalize bg-gray-200 rounded-md disabled:cursor-not-allowed disabled:hover:bg-gray-200 disabled:hover:text-gray-500 hover:bg-blue-500  hover:text-white"
        >
          <div className="flex items-center -mx-1">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-6 h-6 mx-1 rtl:-scale-x-100"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M7 16l-4-4m0 0l4-4m-4 4h18"
              />
            </svg>

            <span className="mx-1">previous</span>
          </div>
        </button>
        {/* Numbers */}
        {pages?.map(btnNum => (
          <button
            onClick={() => handlePaginationButton(btnNum)}
            key={btnNum}
            className={`hidden ${
              currentPage === btnNum ? 'bg-blue-600 text-white' : 'bg-blue-200'
            } px-4 py-2 mx-1 transition-colors duration-300 transform  rounded-md sm:inline hover:bg-blue-500  hover:text-white`}
          >
            {btnNum}
          </button>
        ))}
        {/* Next Button */}
        <button
          disabled={currentPage === numberOfPages}
          onClick={() => handlePaginationButton(currentPage + 1)}
          className="px-4 py-2 mx-1 text-gray-700 transition-colors duration-300 transform bg-gray-200 rounded-md hover:bg-blue-500 disabled:hover:bg-gray-200 disabled:hover:text-gray-500 hover:text-white disabled:cursor-not-allowed disabled:text-gray-500"
        >
          <div className="flex items-center -mx-1">
            <span className="mx-1">Next</span>

            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-6 h-6 mx-1 rtl:-scale-x-100"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M17 8l4 4m0 0l-4 4m4-4H3"
              />
            </svg>
          </div>
        </button>
      </div>
    </div>
  );
};

export default Home;
