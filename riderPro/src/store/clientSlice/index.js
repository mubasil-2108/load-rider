import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
    isLoading: false,
    clientProfile: null,
};

export const createClientProfile = createAsyncThunk(
    'createClientProfile',
    async (formData) => {
        const response = await axios.post('http://192.168.0.110:5000/api/client/create-profile',
            formData,
            {
                withCredentials: true
            }
        )
        return response.data
    }
)

export const getClientProfile = createAsyncThunk(
    'getClientProfile',
    async (userId) => {
        const response = await axios.get(`http://192.168.0.110:5000/api/client/get-profile?userId=${userId}`)
        console.log(response.data, 'getClientProfile');
        return response.data
    }
)

export const updateClientProfile = createAsyncThunk(
    'updateClientProfile',
    async (formData) => {
        const response = await axios.put('http://192.168.0.110:5000/api/client/update-profile',
            formData,
            {
                withCredentials: true
            }
        )
        console.log(response.data, 'updateClientProfile');
        return response.data;
    }
)

const clientSlice = createSlice({
    name: 'client',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(createClientProfile.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(createClientProfile.fulfilled, (state, action) => {
                state.isLoading = false;
                state.clientProfile = action.payload?.clientProfile;
            })
            .addCase(createClientProfile.rejected, (state) => {
                state.isLoading = false;
                state.clientProfile = null
            })
            .addCase(getClientProfile.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(getClientProfile.fulfilled, (state, action) => {
                state.isLoading = false;
                state.clientProfile = action.payload?.clientProfile;
            })
            .addCase(getClientProfile.rejected, (state) => {
                state.isLoading = false;
                state.clientProfile = null
            })
            .addCase(updateClientProfile.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(updateClientProfile.fulfilled, (state, action) => {
                state.isLoading = false;
                state.clientProfile = action.payload?.clientProfile;
            })
            .addCase(updateClientProfile.rejected, (state) => {
                state.isLoading = false;
                state.clientProfile = null
            })
    }
})

export default clientSlice.reducer