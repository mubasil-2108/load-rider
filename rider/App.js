import { useEffect } from "react";
import Navigation from "./src/navigation";
import { checkAuth } from "./src/store/authSlice";
import { useDispatch } from "react-redux";

export default function App() {
  
  return (
      <Navigation />
  );
}
