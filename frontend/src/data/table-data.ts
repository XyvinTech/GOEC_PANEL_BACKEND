import { Station } from "@/types/table-types";

const  data: Station[] = [
    {
      id: "#12345",
      name: "Station 1",
      location: "Lagos",
      vehicles: "Electric",
      socket_type: ["Type 1", "Type 2", "Type 3", "Type 4"],
      amenities: ["CCTV", "Wifi"],
    },
    {
      id: "#12346",
      name: "Station 2",
      location: "Abuja",
      vehicles: "Electric",
      socket_type: ["Type 1", "Type 2"],
      amenities: ["CCTV", "Wifi"],
    },
    {
      id: "#12347",
      name: "Station 3",
      location: "Port Harcourt",
      vehicles: "Electric",
      socket_type: ["Type 1", "Type 2"],
      amenities: ["CCTV", "Wifi"],
    },
    {
      id: "#12348",
      name: "Station 4",
      location: "Kano",
      vehicles: "Electric",
      socket_type: ["Type 1", "Type 2"],
      amenities: ["CCTV", "Wifi", "Wifi", "Wifi", "Wifi", "Wifi", "Wifi", "Wifi"],
    },
    
  ];

  export default data;