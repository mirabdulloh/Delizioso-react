import React, { useState } from "react";
import Cookie from "universal-cookie";
import { AuthData } from "../../lib/types/member";
import { GlobalContext } from "../hooks/useGlobals";

const ContextProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const cookies = new Cookie();
  if (!cookies.get("accessToken")) localStorage.removeItem("memberData");

  const [authMember, setAuthMember] = React.useState<AuthData | null>(
    localStorage.getItem("memberData")
      ? JSON.parse(localStorage.getItem("memberData") as string)
      : null
  );
  const [orderBuilder, setOrderBuilder] = useState<Date>(new Date())

  console.log("=== ContextProvider authMember ===", authMember);
  return(<GlobalContext.Provider value={{authMember,setAuthMember, orderBuilder,setOrderBuilder}}>
    {children}
  </GlobalContext.Provider>)
  
};

export default ContextProvider;
