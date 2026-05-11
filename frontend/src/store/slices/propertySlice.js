import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import API from "../../utils/axios";

const getApiBaseUrl = () => {
  const envUrl = import.meta.env.VITE_API_URL?.trim();

  if (envUrl) {
    const normalized = envUrl.replace(/\/+$/, "");
    if (/^https?:\/\//i.test(normalized)) {
      return normalized.endsWith("/api") ? normalized : `${normalized}/api`;
    }
    return normalized.startsWith("/") ? normalized : `/${normalized}`;
  }

  const isDev = import.meta.env.DEV;
  if (isDev) return "/api";

  return "https://real-estate-management-system-rh4j.onrender.com/api";
};

const buildQueryString = (params = {}) => {
  const searchParams = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      searchParams.set(key, value);
    }
  });
  return searchParams.toString();
};

const fetchJson = async (url) => {
  const response = await fetch(url, { cache: "no-store" });

  if (!response.ok) {
    let message = "Failed to fetch properties";
    try {
      const data = await response.json();
      message = data?.message || message;
    } catch (parseError) {
      // Keep the default message when the body is not JSON.
    }
    throw new Error(message);
  }

  return response.json();
};

export const fetchProperties = createAsyncThunk(
  "properties/fetchAll",
  async (params = {}, { rejectWithValue }) => {
    try {
      const queryString = buildQueryString(params);
      const apiUrl = getApiBaseUrl();
      const url = `${apiUrl}/properties${queryString ? `?${queryString}` : ""}`;

      return await fetchJson(url);
    } catch (err) {
      if (err instanceof Error && err.message) {
        return rejectWithValue(err.message);
      }

      if (!err.response) {
        return rejectWithValue(
          "Cannot reach backend API. Verify your API URL and network connection.",
        );
      }
      return rejectWithValue(
        err.response?.data?.message || "Failed to fetch properties",
      );
    }
  },
);

export const fetchProperty = createAsyncThunk(
  "properties/fetchOne",
  async (id, { rejectWithValue }) => {
    try {
      const apiUrl = getApiBaseUrl();
      const res = await fetchJson(`${apiUrl}/properties/${id}`);
      return res;
    } catch (err) {
      return rejectWithValue(
        err instanceof Error ? err.message : "Property not found",
      );
    }
  },
);

export const fetchAgentProperties = createAsyncThunk(
  "properties/fetchAgentProps",
  async (_, { rejectWithValue }) => {
    try {
      const res = await API.get("/properties/agent/my");
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to fetch");
    }
  },
);

export const fetchAdminProperties = createAsyncThunk(
  "properties/fetchAdminProps",
  async (_, { rejectWithValue }) => {
    try {
      const res = await API.get("/properties/admin/all");
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to fetch");
    }
  },
);

export const createProperty = createAsyncThunk(
  "properties/create",
  async (formData, { rejectWithValue }) => {
    try {
      const res = await API.post("/properties", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return res.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to create property",
      );
    }
  },
);

export const updateProperty = createAsyncThunk(
  "properties/update",
  async ({ id, formData }, { rejectWithValue }) => {
    try {
      const res = await API.put(`/properties/${id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return res.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to update property",
      );
    }
  },
);

export const deleteProperty = createAsyncThunk(
  "properties/delete",
  async (id, { rejectWithValue }) => {
    try {
      await API.delete(`/properties/${id}`);
      return id;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to delete property",
      );
    }
  },
);

export const approveProperty = createAsyncThunk(
  "properties/approve",
  async ({ id, isApproved }, { rejectWithValue }) => {
    try {
      const res = await API.put(`/properties/${id}/approve`, { isApproved });
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to update");
    }
  },
);

const propertySlice = createSlice({
  name: "properties",
  initialState: {
    properties: [],
    property: null,
    agentProperties: [],
    adminProperties: [],
    pagination: null,
    isFallbackData: false,
    loading: false,
    error: null,
  },
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearProperty: (state) => {
      state.property = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProperties.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProperties.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.properties = action.payload.properties;
        state.pagination = action.payload.pagination;
        state.isFallbackData = Boolean(action.payload.fallback);
      })
      .addCase(fetchProperties.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.isFallbackData = false;
      })
      .addCase(fetchProperty.pending, (state) => {
        state.loading = true;
        state.property = null;
      })
      .addCase(fetchProperty.fulfilled, (state, action) => {
        state.loading = false;
        state.property = action.payload.property;
      })
      .addCase(fetchProperty.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchAgentProperties.fulfilled, (state, action) => {
        state.agentProperties = action.payload.properties;
      })
      .addCase(fetchAdminProperties.fulfilled, (state, action) => {
        state.adminProperties = action.payload.properties;
      })
      .addCase(createProperty.fulfilled, (state, action) => {
        state.agentProperties.unshift(action.payload.property);
      })
      .addCase(deleteProperty.fulfilled, (state, action) => {
        state.agentProperties = state.agentProperties.filter(
          (p) => p._id !== action.payload,
        );
        state.adminProperties = state.adminProperties.filter(
          (p) => p._id !== action.payload,
        );
      })
      .addCase(approveProperty.fulfilled, (state, action) => {
        const idx = state.adminProperties.findIndex(
          (p) => p._id === action.payload.property._id,
        );
        if (idx !== -1) state.adminProperties[idx] = action.payload.property;
      });
  },
});

export const { clearError, clearProperty } = propertySlice.actions;
export default propertySlice.reducer;
