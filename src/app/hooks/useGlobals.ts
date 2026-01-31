import {createContext, useContext} from "react";
import { AuthData } from "../../lib/types/member";


interface GlobalInterface{
    authMember: AuthData | null;
    setAuthMember: (member: AuthData | null) => void;
    orderBuilder: Date;
    setOrderBuilder: (input: Date) => void;
}


export const GlobalContext = createContext<GlobalInterface | undefined>(
    undefined
)

export const useGlobals = () => {
    const context = useContext(GlobalContext);

    if(context === undefined) throw new Error("useGlobals must be used within a GlobalProvider");

    return context;
    
};

