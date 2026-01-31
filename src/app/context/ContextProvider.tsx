import React, { useEffect, useState } from "react";
import Cookie from "universal-cookie";
import { Member } from "../../lib/types/member";
import { GlobalContext } from "../hooks/useGlobals";
import MemberService from "../services/MemberService";

const ContextProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const cookies = new Cookie();
  if (!cookies.get("accessToken")) localStorage.removeItem("memberData");

  const [authMember, setAuthMember] = React.useState<Member | null>(
    localStorage.getItem("memberData")
      ? JSON.parse(localStorage.getItem("memberData") as string)
      : null
  );
  const [orderBuilder, setOrderBuilder] = useState<Date>(new Date())

  useEffect(() => {
    const fetchMember = async () => {
      if (!cookies.get("accessToken")) return;
      try {
        const memberService = new MemberService();
        const member = await memberService.getMemberDetail();
        setAuthMember(member);
      } catch (err) {
        console.log("ContextProvider - getMemberDetail error:", err);
      }
    };

    fetchMember();
  }, []);

  console.log("=== verify ===");
  return(<GlobalContext.Provider value={{authMember,setAuthMember, orderBuilder,setOrderBuilder}}>
    {children}
  </GlobalContext.Provider>)
  
};

export default ContextProvider;
