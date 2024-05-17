import { createAppSlice } from '@/lib/createAppSlice';
import type { AppThunk } from '@/lib/store';
import type { PayloadAction } from '@reduxjs/toolkit';
import {
  addNewStations,
  fetchStations,
  deleteStations,
  updateStation,
  fetchStationsWOFilter,
  uploadBulkStations,
} from './stationAPI';

interface Location {
  coordinates: {
    longitude: number;
    latitude: number;
  };
  address: string;
  city: string;
  state: string;
  country: string;
  mapUrl: string;
}

interface Amenities {
  restRoom: boolean;
  restaurant: boolean;
  hotel: boolean;
  cafe: boolean;
  mall: boolean;
}

interface Media {
  images: File[] | string[];
  coverImage: File[] | string[];
}

export interface Charger {
  vehicleType: string;
  socketType: string;
  outputPower: number;
  rateUnit: string;
  // _id: string;
}
export interface Station {
  _id?: string;
  [key: string]: any; // Index signature
  stationName: string;
  goecOnly: boolean;
  location: Location;
  amenities: Amenities;
  chargers: Charger[];
  media: Media;
  nearbyStations?: string[];
  rating: number;
}

export interface Pagination {
  count: number;
  page: number;
  totalPages: number;
}
export interface StationSliceState {
  stations: Station[];
  status: 'idle' | 'loading' | 'failed';
  nearbyStations: Station[];
  pagination: Pagination;
}

const initialState: StationSliceState = {
  stations: [],
  status: 'idle',
  nearbyStations: [],
  pagination: { count: 0, page: 0, totalPages: 0 },
};

export const stationSlice = createAppSlice({
  name: 'stations',
  initialState,
  reducers: (create) => ({
    getAllStations: create.asyncThunk(
      async (data = { state: '', city: '', goecOnly: false, page: 1, pageLimit: 30 }) => {
        const response = await fetchStations(data);
        return response;
      },
      {
        pending: (state) => {
          state.status = 'loading';
        },
        fulfilled: (state, action) => {
          state.status = 'idle';
          state.stations = action.payload.data;

          state.pagination = {
            count: action.payload.count,
            page: action.payload.page,
            totalPages: action.payload.pages,
          };
        },
        rejected: (state) => {
          state.status = 'failed';
        },
      }
    ),
    getAllStationsWOFilter: create.asyncThunk(
      async () => {
        const response = await fetchStationsWOFilter();
        return response.data;
      },
      {
        pending: (state) => {
          state.status = 'loading';
        },
        fulfilled: (state, action) => {
          state.status = 'idle';
          state.nearbyStations = action.payload;
        },
        rejected: (state) => {
          state.status = 'failed';
        },
      }
    ),
    addNewStation: create.asyncThunk(
      async (data: Station) => {
        const response = await addNewStations(data);
        return response.data;
      },
      {
        pending: (state) => {
          state.status = 'loading';
        },
        fulfilled: (state, action) => {
          state.stations = action.payload;
          state.status = 'idle';
        },
        rejected: (state) => {
          state.status = 'failed';
        },
      }
    ),
    deleteStation: create.asyncThunk(
      async (data: string[]) => {
        const response = await deleteStations(data);
        return response.data;
      },
      {
        pending: (state) => {
          state.status = 'loading';
        },
        fulfilled: (state, action) => {
          state.stations = action.payload;
          state.status = 'idle';
        },
        rejected: (state) => {
          state.status = 'failed';
        },
      }
    ),
    editStation: create.asyncThunk(
      async (data: Station) => {
        const response = await updateStation(data);
        return response.data;
      },
      {
        pending: (state) => {
          state.status = 'loading';
        },
        fulfilled: (state, action) => {
          state.stations = action.payload;
          state.status = 'idle';
        },
        rejected: (state) => {
          state.status = 'failed';
        },
      }
    ),
    bulkUpload: create.asyncThunk(
      async (data: File) => {
        const response = await uploadBulkStations(data);
        return response.data;
      },
      {
        pending: (state) => {
          state.status = 'loading';
        },
        fulfilled: (state, action) => {
          state.status = 'idle';
        },
        rejected: (state) => {
          state.status = 'failed';
        },
      }
    ),
  }),
  selectors: {
    selectStation: (state) => state.stations,
    selectStatus: (state) => state.status,
    selectNearByStation: (state) => state.nearbyStations,
    selectPagination: (state) => state.pagination,
  },
});

export const {
  getAllStations,
  addNewStation,
  deleteStation,
  editStation,
  getAllStationsWOFilter,
  bulkUpload,
} = stationSlice.actions;

export const {
  selectStation,
  selectStatus,
  selectNearByStation,
  selectPagination,
} = stationSlice.selectors;
