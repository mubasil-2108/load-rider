import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
    isLoading: false,
    bookingData: []
}


export const createBooking = createAsyncThunk(
    'createBooking',
    async(formData)=>{
        const response = await axios.post('http://192.168.0.110:5000/api/booking/create',
            formData,
            {
                withCredentials: true
            }
        )
        console.log(response.data, 'Create Booking');
        return response.data;
    }
)

export const getBookings = createAsyncThunk(
    'getBookings',
    async(userId)=>{
        if(userId){
            const response = await axios.get(`http://192.168.0.110:5000/api/booking/get?userId=${userId}`);
            // console.log(response.data, 'Get Bookings');
            return response.data;
        }else{
            const response = await axios.get('http://192.168.0.110:5000/api/booking/get');
            // console.log(response.data, 'Get Bookings');
            return response.data;
        }
        
    }
)

const bookingSlice = createSlice({
    name: "booking",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
        .addCase(createBooking.pending, (state) => {
            state.isLoading = true
        })
        .addCase(createBooking.fulfilled, (state, action) => {
            state.isLoading = false;
        })
        .addCase(createBooking.rejected, (state) => {
            state.isLoading = false
        })
        .addCase(getBookings.pending, (state) => {
            state.isLoading = true
        })
        .addCase(getBookings.fulfilled, (state, action) => {
            console.log(action.payload?.data, 'Get Bookings');
            state.isLoading = false;
            state.bookingData = action.payload?.data;
        })
        .addCase(getBookings.rejected, (state) => {
            state.isLoading = false
        })
        
    }
})

export default bookingSlice.reducer;