import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { auth } from "@/components/api/Google/Firebase";
import { useEffect } from "react";
import { setToken } from "@/components/store/slices/firebaseSlice";
import { store } from "../../components/store/index";

const PrivateRoutes = () => {
  const firebaseGetCurrentUserSession = () => {
    auth.onAuthStateChanged(async (user) => {
      if (user !== null) {
        const token = await user.getIdToken(/* forceRefresh */ true);
        if (token !== "") {
          const firebaseTokenAction: {
            payload: any;
            type: string;
          } = setToken(token);
          store.dispatch(firebaseTokenAction);
        }
        return navigate(`${location.pathname}`);
      } else {
        return navigate("/signin");
      }
    });
  };

  const navigate = useNavigate();
  const location = useLocation();
  useEffect(() => {
    firebaseGetCurrentUserSession();
  }, []);

  return (
    <>
      <Outlet />
    </>
  );
};

export default PrivateRoutes;
