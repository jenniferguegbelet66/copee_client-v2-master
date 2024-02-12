import { store } from "../..";
import { getToken } from "../../slices/firebaseSlice";
import {
  COPEE_CLIENT_HOME_APPLI_EQUIPMENT,
  COPEE_APPLI_CLIENT_HOME_EQUIPMENT_LIST,
  RequestArgs,
} from "../../types";
import { copeeApiSlice } from "../copeeApiSlice";

const injectEndpoints = copeeApiSlice.injectEndpoints;

export const clientHomeEquipmentsApi = injectEndpoints({
  endpoints: (builder) => ({
    fetchClientHomeEquipments: builder.query<
      COPEE_APPLI_CLIENT_HOME_EQUIPMENT_LIST,
      { requestArgs: RequestArgs }
    >({
      query() {
        const state = store.getState();
        const token: string = getToken(state);
        return `/clients/homes/equipments?token=${token}`;
      },
      providesTags: ["home_equipments"],
    }),

    fetchClientHomeEquipmentByID: builder.query<
      COPEE_CLIENT_HOME_APPLI_EQUIPMENT,
      { equipmentId: string }
    >({
      query(queryO: { equipmentId: string }) {
        const state = store.getState();
        const token: string = getToken(state);
        return `/clients/homes/equipments${queryO.equipmentId}?token=${token}`;
      },
      providesTags: ["home_equipment"],
    }),
    fetchClientHomeEquipmentsByHome: builder.query<
      COPEE_APPLI_CLIENT_HOME_EQUIPMENT_LIST,
      { homeID: string }
    >({
      query(queryO: { homeID: string }) {
        const state = store.getState();
        const token: string = getToken(state);
        return `/clients/homes/${queryO.homeID}/equipments?token=${token}`;
      },
      providesTags: ["home_equipment"],
    }),
    addNewClientHomeEquipment: builder.mutation({
      query(queryO: { equipment: COPEE_CLIENT_HOME_APPLI_EQUIPMENT }) {
        const state = store.getState();
        const token: string = getToken(state);
        return {
          url: `/clients/homes/equipments?token=${token}`,
          method: "POST",
          body: JSON.stringify(queryO.equipment),
        };
      },
    }),
    updateClientHomeEquipment: builder.mutation({
      query(queryO: {
        equipment: COPEE_CLIENT_HOME_APPLI_EQUIPMENT;
        equipmentId: string;
      }) {
        const state = store.getState();
        const token: string = getToken(state);
        return {
          url: `/clients/homes/equipments${queryO.equipmentId}?token=${token}`,
          method: "PUT",
          body: JSON.stringify(queryO.equipment),
        };
      },
    }),
    deleteClientHomeEquipment: builder.mutation({
      query(queryO: { equipmentId: string }) {
        const state = store.getState();
        const token: string = getToken(state);
        return {
          url: `/clients/homes/equipments${queryO.equipmentId}?token=${token}`,
          method: "DELETE",
        };
      },
    }),
  }),
});

export const {
  useFetchClientHomeEquipmentsQuery,
  useFetchClientHomeEquipmentByIDQuery,
  useFetchClientHomeEquipmentsByHomeQuery,
} = clientHomeEquipmentsApi;
