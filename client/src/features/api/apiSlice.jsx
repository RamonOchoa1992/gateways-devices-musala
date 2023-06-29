import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react"

export const apiSlice = createApi({
    reducerPath: "apiSlice",
    baseQuery: fetchBaseQuery({
        baseUrl: "http://localhost:3000/api"
    }),
    endpoints: (builder) => ({
        gateways: builder.query({
            query: () => ({
                url: "/gateways",
                headers: {
                    "Content-Type": "application/json",
                },
            }),
            providesTags: ["gateways"]
        }),
        devices: builder.query({
            query: (idGatStatus) => ({
                url: `/devices/${idGatStatus}`,
                headers: {
                    "Content-Type": "application/json",
                },
            }),
            providesTags: ["devices"]
        }),
        addGateway: builder.mutation({
            query: (form) => ({
                url: "/gateways",
                headers: {
                    "Content-Type": "application/json"
                },
                method: "POST",
                body: form
            }),
            invalidatesTags: ["gateways"]
        }),
        addDevice: builder.mutation({
            query: (form) => ({
                url: "/devices",
                headers: {
                    "Content-Type": "application/json"
                },
                method: "POST",
                body: form
            }),
            invalidatesTags: ["devices"]
        }),
        deleteGateway: builder.mutation({
            query: (id) => ({
                url: `/gateways/${id}`,
                headers: {
                    "Content-Type": "application/json"
                },
                method: "DELETE",
            }),
            invalidatesTags: ["gateways"]
        }),
        deleteDevice: builder.mutation({
            query: (id) => ({
                url: `/devices/${id}`,
                headers: {
                    "Content-Type": "application/json"
                },
                method: "DELETE",
            }),
            invalidatesTags: ["devices"]
        }),
        putDevice: builder.mutation({
            query: (obj) => ({
                url: `/devices/${obj.idP}`,
                headers: {
                    "Content-Type": "application/json"
                },
                method: "PUT",
                body: {
                    "status": `${obj.status}`
                }
            }),
            invalidatesTags: ["devices"]
        }),
    })
})

export const {
    useGatewaysQuery,
    useDevicesQuery,
    useAddGatewayMutation,
    useAddDeviceMutation,
    useDeleteGatewayMutation,
    useDeleteDeviceMutation,
    usePutDeviceMutation,
} = apiSlice;