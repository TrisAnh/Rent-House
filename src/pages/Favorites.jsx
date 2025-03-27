"use client";

import { useState, useEffect } from "react";
import { getFavorites, removeFavourite } from "../api/favourites";
import { useAuth } from "../hooks/useAuth";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";

export default function FavoritesPage() {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useAuth();
  const [viewMode, setViewMode] = useState("grid"); // grid or list

  // Fetch favorites data
  useEffect(() => {
    const fetchFavorites = async () => {
      try {
        setLoading(true);
        const response = await getFavorites();
        setFavorites(response.data);
      } catch (err) {
        console.error("Error fetching favorites:", err);
        setError("Danh sách yêu thích trống");
      } finally {
        setLoading(false);
      }
    };

    if (user && user.id) {
      fetchFavorites();
    } else {
      setLoading(false);
    }
  }, [user]);

  // Handle favorite deletion
  const handleDeleteFavorite = async (favoriteId, event) => {
    if (event) {
      event.preventDefault();
      event.stopPropagation();
    }

    try {
      await removeFavourite(favoriteId);
      setFavorites(favorites.filter((favorite) => favorite._id !== favoriteId));
      toast.success("Đã xóa khỏi mục yêu thích!");
    } catch (err) {
      console.error("Error deleting favorite:", err);
      toast.error("Không thể xóa mục yêu thích. Vui lòng thử lại!");
    }
  };

  // Format address to be more readable
  const formatAddress = (location) => {
    if (!location) return "";

    const parts = [];
    if (location.address) parts.push(location.address);
    if (location.ward) parts.push(location.ward);
    if (location.district) parts.push(location.district);
    if (location.city) parts.push(location.city);

    return parts.join(", ");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white flex items-center justify-center">
        <div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-md flex flex-col items-center">
          <div className="w-12 h-12 border-4 border-blue-100 border-t-blue-500 rounded-full animate-spin mb-6"></div>
          <p className="text-gray-500 text-lg">
            Đang tải danh sách yêu thích...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white flex items-center justify-center p-4">
        <div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-md flex flex-col items-center">
          <div className="text-5xl mb-4">⚠️</div>
          <h2 className="text-xl font-bold text-red-500 mb-4">{error}</h2>
          <Link
            to="/listings"
            className="px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white font-medium rounded-lg transition-colors"
          >
            Tìm phòng trọ
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <div className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold text-gray-900 sm:text-4xl mb-2">
            Danh Sách Yêu Thích
          </h1>
          <p className="text-gray-500 max-w-2xl mx-auto">
            Quản lý danh sách phòng trọ bạn đã lưu để xem lại sau
          </p>
        </div>

        {favorites.length > 0 ? (
          <>
            {/* Stats and Controls */}
            <div className="bg-white rounded-xl shadow-sm mb-8 p-4 sm:p-6 flex flex-col sm:flex-row justify-between items-center gap-4">
              <div className="flex gap-8 flex-wrap">
                <div className="flex flex-col">
                  <span className="text-2xl font-bold text-blue-500">
                    {favorites.length}
                  </span>
                  <span className="text-sm text-gray-500">Phòng đã lưu</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-2xl font-bold text-blue-500">
                    {Math.min(
                      ...favorites.map((room) => room.id_post.price)
                    ).toLocaleString("vi-VN")}
                  </span>
                  <span className="text-sm text-gray-500">Giá thấp nhất</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-2xl font-bold text-blue-500">
                    {Math.max(
                      ...favorites.map((room) => room.id_post.price)
                    ).toLocaleString("vi-VN")}
                  </span>
                  <span className="text-sm text-gray-500">Giá cao nhất</span>
                </div>
              </div>

              <div className="flex rounded-lg overflow-hidden border border-gray-200">
                <button
                  className={`px-4 py-2 font-medium text-sm transition-colors ${
                    viewMode === "grid"
                      ? "bg-blue-500 text-white"
                      : "bg-white text-blue-500 hover:bg-blue-50"
                  }`}
                  onClick={() => setViewMode("grid")}
                >
                  Lưới
                </button>
                <button
                  className={`px-4 py-2 font-medium text-sm transition-colors ${
                    viewMode === "list"
                      ? "bg-blue-500 text-white"
                      : "bg-white text-blue-500 hover:bg-blue-50"
                  }`}
                  onClick={() => setViewMode("list")}
                >
                  Danh sách
                </button>
              </div>
            </div>

            {/* Favorites Grid/List */}
            <div
              className={
                viewMode === "grid"
                  ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
                  : "flex flex-col gap-6"
              }
            >
              {favorites.map((room) => (
                <div
                  key={room.id}
                  id={`favorite-${room._id}`}
                  className={`bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100 transition-shadow hover:shadow-md ${
                    viewMode === "list" ? "flex" : ""
                  }`}
                >
                  {/* Room Image */}
                  <div
                    className={`relative ${
                      viewMode === "list" ? "w-2/5 flex-shrink-0" : ""
                    }`}
                  >
                    <Link to={`/listings/${room.id_post._id}`}>
                      <div className="aspect-[4/3] overflow-hidden">
                        <img
                          src={
                            room.id_post.images?.[0]?.url ||
                            "/placeholder.svg?height=200&width=300" ||
                            "/placeholder.svg"
                          }
                          alt={room.id_post.title || "Room image"}
                          className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                        />
                      </div>
                      <div className="absolute bottom-3 left-3 bg-blue-500 text-white text-xs font-medium px-2.5 py-1.5 rounded-md shadow-sm">
                        {room.id_post.price.toLocaleString("vi-VN")} VNĐ/tháng
                      </div>
                    </Link>
                    <button
                      onClick={(e) => handleDeleteFavorite(room._id, e)}
                      className="absolute top-3 right-3 bg-red-500 hover:bg-red-600 text-white rounded-full w-8 h-8 flex items-center justify-center transition-colors"
                      aria-label="Xóa khỏi yêu thích"
                    >
                      <span>❤️</span>
                    </button>
                  </div>

                  {/* Room Details - Simplified */}
                  <div
                    className={`p-4 flex flex-col ${
                      viewMode === "list" ? "w-3/5" : ""
                    }`}
                  >
                    <Link
                      to={`/listings/${room.id_post._id}`}
                      className="group"
                    >
                      <h2 className="text-lg font-bold text-gray-800 group-hover:text-blue-500 transition-colors line-clamp-2 mb-3">
                        {room.id_post.title}
                      </h2>
                    </Link>

                    <div className="bg-blue-50 rounded-lg p-3 mb-4 flex items-start gap-2">
                      <span className="text-blue-500 flex-shrink-0 mt-0.5">
                        📍
                      </span>
                      <span className="text-sm text-gray-600 line-clamp-2">
                        {formatAddress(room.id_post.location)}
                      </span>
                    </div>

                    <div className="bg-gray-50 rounded-lg p-3 mb-4 flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-blue-500 text-white flex items-center justify-center font-semibold flex-shrink-0">
                        {room.id_post.landlord.username.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <div className="text-sm font-semibold text-gray-800">
                          {room.id_post.landlord.username}
                        </div>
                        <div className="text-xs text-gray-500">Chủ trọ</div>
                      </div>
                    </div>

                    <div className="flex gap-3 mt-auto">
                      <Link
                        to={`/listings/${room.id_post._id}`}
                        className="flex-1 bg-blue-500 hover:bg-blue-600 text-white text-center py-3 rounded-lg font-medium text-sm transition-colors"
                      >
                        Xem chi tiết
                      </Link>
                      <button
                        onClick={(e) => handleDeleteFavorite(room._id, e)}
                        className="flex-1 bg-white hover:bg-red-50 text-red-500 border border-red-500 py-3 rounded-lg font-medium text-sm transition-colors flex items-center justify-center gap-2"
                      >
                        <span>🗑️</span>
                        <span className="hidden sm:inline">Xóa yêu thích</span>
                        <span className="sm:hidden">Xóa</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        ) : (
          <div className="bg-white rounded-xl shadow-sm p-12 max-w-2xl mx-auto text-center">
            <div className="text-6xl mb-6">💔</div>
            <h2 className="text-2xl font-bold text-gray-800 mb-3">
              Chưa có phòng trọ yêu thích
            </h2>
            <p className="text-gray-500 mb-8 max-w-md mx-auto">
              Hãy khám phá và lưu những phòng trọ bạn quan tâm để xem lại sau
            </p>
            <Link
              to="/listings"
              className="inline-block bg-blue-500 hover:bg-blue-600 text-white font-medium px-6 py-3 rounded-lg transition-colors"
            >
              Khám phá phòng trọ
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
