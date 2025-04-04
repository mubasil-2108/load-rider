//authSlice

import AsyncStorage from "@react-native-async-storage/async-storage";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
    isAuthenticated: false,
    isLoading: false,
    user: null,
    userRole: null
}

export const registerUser = createAsyncThunk(
    'registerUser',
    async (formData, { rejectWithValue }) => {
        try {
          const response = await axios.post(
            'http://192.168.0.110:5000/api/auth/register',
            formData,
            { withCredentials: true }
          );
          console.log(response.data, 'Register Auth Slice');
          await AsyncStorage.setItem("role", response?.data.userRole.role);
          return response.data;
        } catch (err) {
          console.log(err.response?.data || err.message, 'Register Error');
          return rejectWithValue(err.response?.data || { message: 'Something went wrong' });
        }
      }
)

export const loginUser = createAsyncThunk(
    'loginUser',
    async (formData) => {
        console.log(formData, 'Form Data');
        const response = await axios.post('http://192.168.0.110:5000/api/auth/login',
            formData,
            {
                withCredentials: true
            }
        );
        console.log(response.data, 'Login Auth Slice');
        return response.data;
    }
)

export const checkAuth = createAsyncThunk(
    'checkAuth',
    async (_, { rejectWithValue }) => {
        try {
            let token = await AsyncStorage.getItem("token");
            console.log("Token:", token);
            token = token ? token.trim() : null
            if (!token) {
                return rejectWithValue("No token found");
            }
            const response = await axios.get('http://192.168.0.110:5000/api/auth/check-auth',
                {
                    headers: {
                        "Authorization": token ? `Bearer ${token}` : "",
                        "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
                    }
                }
            )
            return response.data;
        } catch (e) {
            if (e.response?.status === 401) {
                const refreshToken = await AsyncStorage.getItem("refreshToken");
                if (!refreshToken) {
                    return rejectWithValue("Refresh token not found");
                }
                const response = await axios.post('http://192.168.0.110:5000/api/auth/refresh-token',
                    {},
                    {
                        headers: {
                            "Authorization": `Bearer ${refreshToken}`
                        }
                    }
                )
                console.log(response, 'Refresh token');
                if (response.status === 200) {
                    await AsyncStorage.setItem("token", response?.data?.accessToken);
                    const authResponse = await axios.get('http://192.168.0.110:5000/api/auth/check-auth',
                        {
                            headers: {
                                "Authorization": response.data.accessToken ? `Bearer ${response?.data?.accessToken}` : "",
                            }
                        }
                    )
                    return authResponse.data;
                }
            }
            return rejectWithValue(e.response?.data || "Auth check failed");
        }

    }
)

export const logoutUser = createAsyncThunk(
    'logoutUser',
    async (_, { dispatch }) => {
        await AsyncStorage.removeItem("token");
        await AsyncStorage.removeItem("refreshToken");
        dispatch(authSlice.actions.resetAuth());
    }
);

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        resetAuth: (state) => {
            state.isAuthenticated = false;
            state.user = null;
        }
    },
    extraReducers: (builder) => {
        builder.addCase(registerUser.pending, (state) => {
            state.isLoading = true;
        })
            .addCase(registerUser.fulfilled, (state, action) => {
                console.log(action.payload);
                state.isLoading = false;
                state.isAuthenticated = false;
                state.user = null
                state.userRole= action.payload?.success ?  action.payload.userRole : null
            })
            .addCase(registerUser.rejected, (state) => {
                state.isLoading = false;
                state.isAuthenticated = false;
                state.user = null;
                state.userRole=null
            })
            .addCase(loginUser.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(loginUser.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isAuthenticated = action.payload?.success;
                state.user = action.payload?.success ? action.payload?.user : null;
                AsyncStorage.setItem("token", action.payload.accessToken);
                AsyncStorage.setItem("refreshToken", action.payload.refreshToken);
            })
            .addCase(loginUser.rejected, (state) => {
                state.isLoading = false;
                state.isAuthenticated = false;
                state.user = null;
            })
            .addCase(checkAuth.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(checkAuth.fulfilled, (state, action) => {
                console.log(action.payload, 'check auth');
                state.isLoading = false;
                state.isAuthenticated = action.payload.success;
                state.user = action.payload.success ? action.payload?.user : null;
            })
            .addCase(checkAuth.rejected, (state) => {
                state.isLoading = false;
                state.isAuthenticated = false;
                state.user = null;
            })
    }
})



export const { resetAuth } = authSlice.actions;

export default authSlice.reducer