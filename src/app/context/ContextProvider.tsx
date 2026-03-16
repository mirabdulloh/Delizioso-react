import React, { useEffect, useState } from "react";
import { Member } from "../../lib/types/member";
import { GlobalContext } from "../hooks/useGlobals";
import MemberService from "../services/MemberService";

const ContextProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [authMember, setAuthMember] = React.useState<Member | null>(
    localStorage.getItem("memberData")
      ? JSON.parse(localStorage.getItem("memberData") as string)
      : null
  );
  const [orderBuilder, setOrderBuilder] = useState<Date>(new Date())

  useEffect(() => {
    let isMounted = true;

    const fetchMember = async () => {
      try {
        const memberService = new MemberService();
        const member = await memberService.getMemberDetail();
        if (isMounted) setAuthMember(member);
      } catch (err) {
        localStorage.removeItem("memberData");
        if (isMounted) setAuthMember(null);
      }
    };

    fetchMember();
    return () => {
      isMounted = false;
    };
  }, []);

  return(<GlobalContext.Provider value={{authMember,setAuthMember, orderBuilder,setOrderBuilder}}>
    {children}
  </GlobalContext.Provider>)
  
};

export default ContextProvider;
