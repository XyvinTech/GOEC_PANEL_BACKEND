import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '@/lib/store';

type SidebarData = {
    smallSidebar: boolean;
}

const initialState: SidebarData = {
    smallSidebar: false,
};

export const sidebar = createSlice({
    name: 'sidebar',
    initialState,
    reducers: {
        toggleSmallSidebar: (state) => {
            state.smallSidebar = !state.smallSidebar;
        },
    },
});

export const { toggleSmallSidebar } = sidebar.actions;

export const selectSidebarData = (state: RootState) => state.sidebar;

// export default sidebar.reducer;