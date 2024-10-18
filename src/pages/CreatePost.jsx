import React, { useState } from "react";
import { createPost } from "../api/post";
const CreatePost = () => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    price: 0,
    location: {
      address: "",
      city: "",
      district: "",
      ward: "",
      geoLocation: { latitude: 0, longitude: 0 },
    },
    landlord: "",
    roomType: "Single",
    size: 0,
    availability: true,
    amenities: {
      wifi: false,
      airConditioner: false,
      heater: false,
      kitchen: false,
      parking: false,
    },
    additionalCosts: {
      electricity: 0,
      water: 0,
      internet: 0,
      cleaning: 0,
    },
    images: [],
    videos: [],
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (type === "checkbox") {
      const [key, subKey] = name.split(".");
      setFormData((prevData) => ({
        ...prevData,
        [key]: { ...prevData[key], [subKey]: checked },
      }));
    } else if (name.startsWith("location.")) {
      const key = name.split(".")[1];
      setFormData((prevData) => ({
        ...prevData,
        location: { ...prevData.location, [key]: value },
      }));
    } else {
      setFormData((prevData) => ({
        ...prevData,
        [name]: value,
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await createPost(formData); // Gọi hàm createPost
      console.log("Post created successfully:", response.data);
    } catch (error) {
      console.error(
        "Error creating post:",
        error.response ? error.response.data : error.message
      );
    }
  };

  return (
    <div className="container mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-semibold mb-4">Đăng tin</h2>
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 gap-6 mb-4">
          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Tiêu đề
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500"
              required
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Mô tả
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500"
              required
            />
          </div>

          {/* Price */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Giá
            </label>
            <input
              type="number"
              name="price"
              value={formData.price}
              onChange={handleChange}
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500"
              required
            />
          </div>

          {/* Location */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Địa chỉ
              </label>
              <input
                type="text"
                name="location.address"
                value={formData.location.address}
                onChange={handleChange}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Thành phố
              </label>
              <input
                type="text"
                name="location.city"
                value={formData.location.city}
                onChange={handleChange}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Quận
              </label>
              <input
                type="text"
                name="location.district"
                value={formData.location.district}
                onChange={handleChange}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Phường
              </label>
              <input
                type="text"
                name="location.ward"
                value={formData.location.ward}
                onChange={handleChange}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Room Type */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Loại phòng
            </label>
            <select
              name="roomType"
              value={formData.roomType}
              onChange={handleChange}
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500"
            >
              <option value="Single">Phòng đơn</option>
              <option value="Double">Phòng đôi</option>
              <option value="Shared">Phòng chung</option>
            </select>
          </div>

          {/* Size */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Kích thước (m²)
            </label>
            <input
              type="number"
              name="size"
              value={formData.size}
              onChange={handleChange}
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>

          {/* Availability */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Tình trạng sẵn có
            </label>
            <input
              type="checkbox"
              name="availability"
              checked={formData.availability}
              onChange={handleChange}
              className="mt-1 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <span className="ml-2">Có sẵn</span>
          </div>

          {/* Amenities */}
          <div>
            <h3 className="text-lg font-medium text-gray-700 mb-2">
              Tiện nghi
            </h3>
            {Object.keys(formData.amenities).map((amenity) => (
              <div key={amenity}>
                <input
                  type="checkbox"
                  name={`amenities.${amenity}`}
                  checked={formData.amenities[amenity]}
                  onChange={handleChange}
                  className="mr-2"
                />
                <label className="text-sm text-gray-700 capitalize">
                  {amenity}
                </label>
              </div>
            ))}
          </div>

          {/* Additional Costs */}
          <div>
            <h3 className="text-lg font-medium text-gray-700 mb-2">
              Chi phí bổ sung
            </h3>
            {Object.keys(formData.additionalCosts).map((cost) => (
              <div key={cost}>
                <label className="block text-sm font-medium text-gray-700">
                  {cost.charAt(0).toUpperCase() + cost.slice(1)}
                </label>
                <input
                  type="number"
                  name={`additionalCosts.${cost}`}
                  value={formData.additionalCosts[cost]}
                  onChange={handleChange}
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
            ))}
          </div>

          {/* Images */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Hình ảnh
            </label>
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={(e) => {
                setFormData((prevData) => ({
                  ...prevData,
                  images: Array.from(e.target.files),
                }));
              }}
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>

          {/* Videos */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Video
            </label>
            <input
              type="file"
              accept="video/*"
              multiple
              onChange={(e) => {
                setFormData((prevData) => ({
                  ...prevData,
                  videos: Array.from(e.target.files),
                }));
              }}
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-blue-600 text-white font-semibold py-2 rounded-md hover:bg-blue-700 transition duration-200"
          >
            Đăng tin
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreatePost;
