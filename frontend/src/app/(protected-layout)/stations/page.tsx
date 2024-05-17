import OrderTable from "@/components/data-table";
import Header from "@/components/header";
import React from "react";

const page = () => {
  return (
    <div>
      <Header />
      <div className="p-8">
        <p className="font-semibold text-xl py-5">Station</p>
        <OrderTable/>
      </div>
    </div>
  );
};

export default page;
