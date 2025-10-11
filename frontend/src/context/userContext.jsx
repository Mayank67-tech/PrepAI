import React, { createContext, useState, useEffect } from "react";
import axiosInstance from "../utils/axiosInstance";
import { API_PATHS } from "../utils/apiPaths";

export const UserContext = createContext();

const UserProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    // fetch user info on mount
    useEffect(() => {
        let isMounted = true;
        const fetchUser = async () => {
            try {
                setLoading(true);
                const res = await axiosInstance.get(API_PATHS.AUTH.GET_PROFILE); 
                if (isMounted) setUser(res.data.data || null);
            } catch {
                if (isMounted) setUser(null);
            } finally {
                if (isMounted) setLoading(false);
            }
        };
        fetchUser();
        return () => { isMounted = false; };
    }, []);

    const updateUser = (newUser) => setUser(newUser);
    const clearUser = () => setUser(null);

    return (
        <UserContext.Provider value={{ user, loading, updateUser, clearUser }}>
            {children}
        </UserContext.Provider>
    );
};

export default UserProvider;


