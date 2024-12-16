import React, { createContext, useState } from "react";

// Context 생성
export const UserDataContext = createContext();

// Provider 컴포넌트
export const UserDataProvider = ({ children }) => {
  const [userData, setUserData] = useState(null);

  return (
    <UserDataContext.Provider value={{ userData, setUserData }}>
      {children}
    </UserDataContext.Provider>
  );
};
