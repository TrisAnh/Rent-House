import React, { createContext, useContext, useState } from "react";
import { AuthContext } from "../contexts/AuthContext";
export const useAuth = () => {
  return useContext(AuthContext);
};
