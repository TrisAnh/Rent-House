// src/components/listings/ListingCard.jsx
import React from "react";

const ListingCard = ({ listing }) => {
  return (
    <div className="listing-card">
      <img src={listing.image} alt={listing.title} />
      <h2>{listing.title}</h2>
      <p>{listing.description}</p>
      <p>Giá: {listing.price} VND</p>
      {/* Thêm các nút hoặc liên kết */}
    </div>
  );
};

export default ListingCard;
