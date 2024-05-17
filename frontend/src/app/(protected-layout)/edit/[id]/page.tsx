"use client"

import { useParams, useRouter } from 'next/navigation';
import { useAppDispatch, useAppSelector } from '@/lib/hooks';
import {
    selectStation,
    getAllStations,
    deleteStation,
    Station,
    selectStatus,

} from '../../../../lib/features/chargingStations/stationSlice';
import Header from "@/components/header";
import { ArrowLeft } from "lucide-react";
import EditStationData from "@/components/edit-station-data";



function EditStation() {
    const charingStations = useAppSelector(selectStation);
    const param = useParams();
    const { id } = param;
    const router = useRouter();

    const handleBackClick = () => {
        router.back();
    };

    const itemData = charingStations.find(item => item._id === id);


    return (
        <div>
            <Header />
            <div className="p-8 flex flex-col">
                <div className="h-fit flex items-center gap-2">
                    <div
                        onClick={handleBackClick}
                        className=" border-2 border-[#898b8d] w-fit p-1 rounded cursor-pointer">
                        <ArrowLeft size={20} color="#898b8d" />
                    </div>
                    <p className="font-semibold text-xl py-5 text-[#202223]">
                        Edit Station
                    </p>
                </div>

                <EditStationData stationData={itemData} />
            </div>
        </div>
    );
}

export default EditStation;
