// src/hooks/useFetch.js
import { useState, useEffect } from "react";
import axiosInstance from "../api/axiosInstance";

const useFetch = (url, options) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    axiosInstance(url, options)
      .then((response) => {
        setData(response.data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err);
        setLoading(false);
      });
  }, [url, options]);

  return { data, loading, error };
};

export default useFetch;
