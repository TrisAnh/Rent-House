import React, { useEffect, useRef, useState } from "react";
import GoongJS from "@goongmaps/goong-js";
import "@goongmaps/goong-js/dist/goong-js.css";

const Map = ({ latitude, longitude }) => {
  const mapContainer = useRef(null);
  const [currentLocation, setCurrentLocation] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setCurrentLocation({ latitude, longitude });
        },
        (error) => {
          switch (error.code) {
            case error.PERMISSION_DENIED:
              setErrorMessage("Bạn đã từ chối cấp quyền định vị.");
              break;
            case error.POSITION_UNAVAILABLE:
              setErrorMessage("Không thể xác định vị trí hiện tại.");
              break;
            case error.TIMEOUT:
              setErrorMessage("Yêu cầu xác định vị trí đã hết thời gian.");
              break;
            default:
              setErrorMessage("Đã xảy ra lỗi không xác định khi định vị.");
          }
          setCurrentLocation({ latitude: 10.8510797, longitude: 106.7710429 });
        }
      );
    } else {
      setErrorMessage("Trình duyệt của bạn không hỗ trợ Geolocation.");
    }
  }, []);

  useEffect(() => {
    const goongApiKey = "YOcMw2iSFoENJVwSjQjTPLCqI5mRJfxLSwoI2uSw";

    if (mapContainer.current && (currentLocation || (latitude && longitude))) {
      const map = new GoongJS.Map({
        container: mapContainer.current,
        style: "https://tiles.goong.io/assets/goong_map_web.json",
        center: [
          longitude || currentLocation?.longitude || 106.7710429,
          latitude || currentLocation?.latitude || 10.8510797,
        ],
        zoom: 14,
        accessToken: goongApiKey,
      });

      if (currentLocation) {
        console.log(
          "Vị trí hiện tại" +
            currentLocation.latitude +
            currentLocation.longitude
        );
        new GoongJS.Marker({ color: "blue" })
          .setLngLat([currentLocation.longitude, currentLocation.latitude])
          .setPopup(new GoongJS.Popup().setText("Vị trí hiện tại của bạn"))
          .addTo(map);
      }

      if (latitude && longitude) {
        new GoongJS.Marker({ color: "red" })
          .setLngLat([longitude, latitude])
          .setPopup(new GoongJS.Popup().setText("Vị trí được truyền vào"))
          .addTo(map);
      }

      return () => map.remove();
    }
  }, [currentLocation, latitude, longitude]);

  return (
    <div>
      {errorMessage && (
        <p style={{ color: "red", marginBottom: "8px" }}>{errorMessage}</p>
      )}
      <div
        ref={mapContainer}
        style={{
          width: "205%",
          height: "400px",
          marginTop: "16px",
        }}
      ></div>
    </div>
  );
};

export default Map;
