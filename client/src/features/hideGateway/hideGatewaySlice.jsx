import { createSlice } from "@reduxjs/toolkit"

const initialState = {
    value: false,
    idGat: null,
    serialNumber: null
}

export const hideGatewaySlice = createSlice({
    name: "hideGateway",
    initialState,
    reducers: {
        updatingMode: (state, action) => {
            state.value = action.payload.value;
            state.idGat = action.payload.idGat;
            state.serialNumber = action.payload.serialNumber;

        }
    }
})

export const { updatingMode } = hideGatewaySlice.actions;
export default hideGatewaySlice.reducer