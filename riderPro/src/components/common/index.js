import { useEffect } from "react";
import { navigationRef } from "../../navigation/rootNavigation";
import { StackActions } from "@react-navigation/native";
import { useSelector } from "react-redux";
import JWT from "expo-jwt";

 function CheckAuth({ children }) {
    const { isAuthenticated, user } = useSelector(state => state.auth);
    const userData = user ? JWT.decode(user, 'CLIENT_SECRET_KEY') : null;
    console.log(isAuthenticated, user, userData, 'CheckAuth');
    useEffect(() => {
        if (!isAuthenticated) {
            navigationRef.current?.navigate("Login");
        } else {
            if (userData?.role === "user") {
                navigationRef.current?.dispatch(StackActions.replace("Home"));
            }
        }
    }, [isAuthenticated, user]);

    return <>{children}</>
}

export default CheckAuth