"use client"

import Header from "@/components/header";
import React from "react";
import { ArrowLeft } from "lucide-react";
import InputStationData from "@/components/input-station-data";
import { useRouter } from "next/navigation";


const page = () => {
  const router = useRouter();

  const handleBackClick = () => {
    router.back();
  };
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
            Add A New Station
          </p>
        </div>

        <InputStationData />
      </div>
    </div>
  );
};

export default page;
