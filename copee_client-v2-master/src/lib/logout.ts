import { clientsApi } from "@/components/store/api/copee/clientsApiSlice";
import { store } from "../components/store";
import { reset } from "../components/store/slices/firebaseSlice";
import { firebaseLogoutUser } from "@/components/api/Google/Firebase";

export const handleLogout = async (): Promise<void> => {
  const resetFirebaseAction = reset();
  store.dispatch(clientsApi.util.resetApiState());
  store.dispatch(resetFirebaseAction);
  await firebaseLogoutUser();
};
