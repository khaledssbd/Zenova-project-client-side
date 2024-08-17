import { Helmet } from 'react-helmet-async';
import { Typewriter } from 'react-simple-typewriter';
import Swal from 'sweetalert2';
import useAuth from '../../hooks/useAuth';
import { useState } from 'react';
import useAxiosSecure from '../../hooks/useAxiosSecure';
import axios from 'axios';
import deleteImg from '../../assets/delete.svg';
import updateImg from '../../assets/update.svg';
import eyeImg from '../../assets/eye.svg';
import { Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import Loading from '../../Components/AllLootie/Loading';
import xButtonSVG from '../../assets/x-button.svg';
import toast from 'react-hot-toast';

const image_hosting_key = import.meta.env.VITE_IMGBB_HOSTING_KEY;
const image_hosting_api = `https://api.imgbb.com/1/upload?key=${image_hosting_key}`;

const ManageProducts = () => {
  const { user } = useAuth();
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [productToUpdate, setProductToUpdate] = useState({});
  const axiosSecure = useAxiosSecure();
  const QueryClient = useQueryClient();

  // fetch data on start like useEffect
  const {
    data: products = [],
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ['my-products'],
    queryFn: async () => {
      const { data } = await axiosSecure.get(
        `/my-products?email=${user?.email}`
      );
      return data;
    },
  });

  // delete a product instance
  const deleteProduct = useMutation({
    mutationFn: async ({ id }) => {
      const { data } = await axiosSecure.delete(
        `/delete-product/${id}?email=${user?.email}`
      );
      return data;
    },
    onSuccess: () => {
      Swal.fire('Deleted!', 'This product has been deleted.', 'success');
      refetch();
      // QueryClient.invalidateQueries({ queryKey: ['my-products'] });
    },
  });

  const handleDeleteProduct = id => {
    Swal.fire({
      title: 'Confirm to delete?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!',
    }).then(async result => {
      if (result.isConfirmed) {
        await deleteProduct.mutateAsync({ id });
      }
    });
  };

  // get data and show modal to update a product
  const getDataForUpdate = async id => {
    const { data } = await axios.get(
      `${import.meta.env.VITE_API_URL}/product-details/${id}`
    );
    setProductToUpdate(data);
    setShowUpdateModal(true);
  };

  // update a product instance
  const updateProduct = useMutation({
    mutationFn: async ({ updateData }) => {
      const { data } = await axiosSecure.patch(
        `/update-product/${productToUpdate._id}?email=${user?.email}`,
        updateData
      );
      return data;
    },
    onSuccess: () => {
      Swal.fire('Updated!', 'Your product has been updated.', 'success');
      setShowUpdateModal(false);
      setProductToUpdate({});
      // refetch();
      QueryClient.invalidateQueries({ queryKey: ['my-products'] });
    },
  });

  const handleUpdatepProduct = async e => {
    e.preventDefault();
    const form = e.target;
    const image = form.image.files[0];
    const name = form.name.value;
    const price = parseFloat(form.price.value);
    const description = form.description.value;
    const category = form.category.value;
    const rating = parseFloat(form.rating.value);

    const formData = new FormData();
    formData.append('image', image);

    try {
      const { data } = await axios.post(image_hosting_api, formData);
      const imageUrl = data.data.display_url;

      const updateData = {
        image: imageUrl,
        name,
        price,
        description,
        category,
        rating,
      };

      await updateProduct.mutateAsync({ updateData });
    } catch (error) {
      toast.error(error.message);
    }
  };

  const cancelUpdating = () => {
    setShowUpdateModal(false);
    setProductToUpdate({});
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center">
        <Loading />
      </div>
    );
  }

  return (
    <div className="my-10 sm:px-6">
      <Helmet>
        <title>Zenova | Manage Products</title>
      </Helmet>

      <h3 className="flex justify-center items-center my-10 text-center text-[#fa237d] text-2xl font-bold">
        {products.length}
        <span
          style={{ color: '#DD028B', fontWeight: 'bold', fontSize: '25px' }}
        >
          <Typewriter
            words={['- Product(s) I sell']}
            loop={50}
            cursor
            cursorStyle="_"
            typeSpeed={70}
            deleteSpeed={50}
            delaySpeed={1500}
          />
        </span>
      </h3>
      {products.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products?.map((product, i) => (
            <div
              key={i}
              className="p-3 bg-gray-300 rounded-xl flex flex-col"
              data-aos="zoom-out-up"
            >
              <div className="flex justify-center items-center">
                <img
                  className="rounded-lg border border-black"
                  src={product.image}
                  alt={product.name}
                />
              </div>
              <h3 className="flex-grow font-medium text-justify text-base my-3 text-black">
                {product.name.substring(0, 30)}...
              </h3>
              <h3 className="flex gap-3 mx-5 mb-3 text-base text-black font-normal">
                Price: ${product.price}
              </h3>
              <h3 className="flex gap-3 mx-5 mb-3 text-base text-black font-normal">
                Category: {product.category}
              </h3>
              <h3 className="flex mx-5 mb-3 text-base text-black font-normal">
                Rating:{' '}
                {[...Array(product.rating)].map((item, index) => (
                  <span className="text-xl text-amber-600" key={index}>
                    &#9733;
                  </span>
                ))}
              </h3>

              <div className="flex justify-around items-center border rounded-md border-gray-500 p-2">
                <Link to={`/product/${product._id}`}>
                  <img src={eyeImg} alt="view-booking" className="w-6" />
                </Link>

                <div onClick={() => getDataForUpdate(product._id)}>
                  <img src={updateImg} alt="update-booking" className="w-6" />
                </div>

                <div onClick={() => handleDeleteProduct(product._id)}>
                  <img src={deleteImg} alt="delete-booking" className="w-6" />
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <h3 className="mt-20 text-xl font-bold">No product yet</h3>
      )}
      {showUpdateModal && (
        <div className=" fixed top-0 left-0 flex justify-center items-center h-screen w-full z-10">
          <div className="w-full md:w-2/3 h-5/6 rounded-xl bg-blue-300 text-center">
            <div className="card-actions justify-end">
              <button
                onClick={cancelUpdating}
                className="btn btn-square btn-sm"
              >
                <img src={xButtonSVG} alt="close" />
              </button>
            </div>
            <h3 className="mt-3 mb-2 md:mt-8 text-base md:text-xl font-bold text-black">
              Update the product ({productToUpdate.name})
            </h3>
            <div className="md:mt-8 mx-auto w-full md:w-2/3">
              <form onSubmit={handleUpdatepProduct}>
                <div className="grid grid-cols-2 gap-8">
                  {/* Left side */}
                  <div className="flex-1">
                    <label className="block mt-4 mb-1 text-sm text-black">
                      Product Name
                    </label>
                    <input
                      className="md:w-full p-2 border rounded-lg focus:outline-green-500 text-sm"
                      type="text"
                      required
                      defaultValue={productToUpdate.name}
                      name="name"
                    />

                    <label className="block mt-3 mb-1 text-sm text-black">
                      Product Image
                    </label>
                    <input
                      required
                      type="file"
                      name="image"
                      accept="image/*"
                      className="file-input file-input-bordered w-full"
                    />

                    <label className="block mt-3 mb-1 text-sm text-black">
                      Product Description
                    </label>
                    <textarea
                      className="w-3/4 md:w-full p-2 border rounded-lg focus:outline-green-500 text-sm"
                      name="description"
                      required
                      placeholder="Enter your instruction"
                      defaultValue={productToUpdate.description}
                      cols="1"
                      rows="2"
                    />
                  </div>
                  {/* Right side */}
                  <div className="flex-1">
                    <label className="block mt-3 mb-1 text-sm text-black">
                      Product Price
                    </label>
                    <input
                      className="md:w-full p-2 border rounded-lg focus:outline-green-500 text-sm"
                      type="number"
                      required
                      defaultValue={productToUpdate.price}
                      name="price"
                    />

                    <label className="block mt-4 mb-1">Category</label>
                    <select
                      defaultValue={productToUpdate.category}
                      className="w-full p-2 border rounded-lg focus:outline-green-500"
                      name="category"
                      required
                    >
                      {/* <option hidden value="undefined">
                        Select a category
                      </option> */}
                      <option value="Electronics">Electronics</option>
                      <option value="Wearables">Wearables</option>
                      <option value="Home Entertainment">
                        Home Entertainment
                      </option>
                      <option value="Accessories">Accessories</option>
                      <option value="Computers">Computers</option>
                    </select>

                    <label className="block mt-4 mb-1">Rating</label>
                    <input
                      className="w-full p-2 border rounded-lg focus:outline-green-500"
                      type="text"
                      required
                      defaultValue={productToUpdate.rating}
                      name="rating"
                    />
                  </div>
                </div>
                <input
                  className="mt-2 md:mt-10 px-8 py-2.5 leading-5 text-white transition-colors duration-300 transform bg-blue-700 rounded-md hover:bg-gray-700 focus:outline-none cursor-pointer"
                  type="submit"
                  value="Update"
                />
                <button
                  className="ml-10 mt-2 md:mt-10 px-8 py-2.5 leading-5 text-white transition-colors duration-300 transform bg-red-500 rounded-md hover:bg-gray-600 focus:outline-none focus:bg-gray-600"
                  onClick={cancelUpdating}
                >
                  Not Now
                </button>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageProducts;
