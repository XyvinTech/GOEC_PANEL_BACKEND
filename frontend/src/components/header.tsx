'use client'

import Image from "next/image";
import React, { useEffect, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { toggleSmallSidebar } from "@/lib/features/sidebar/sidebar-slice";
import { motion } from 'framer-motion';

const Header = () => {
  const dispatch = useAppDispatch();
  const { smallSidebar } = useAppSelector(state => state.sidebar);
  const [rotate, setRotate] = useState(0);

  useEffect(() => {
    // Toggle rotation degrees between 0 and 180
    setRotate(smallSidebar ? 180 : 0);
  }, [smallSidebar]);

  return (
    <div className="bg-white p-4 px-6 h-fit flex items-center justify-between">
      <motion.div
        animate={{ rotate }} // Apply the rotation
        transition={{ duration: 0.5 }} // Optional: control the animation speed
      >
        <Image
          onClick={() => dispatch(toggleSmallSidebar())}
          className="cursor-pointer"
          src="/svg/left.svg"
          width={18}
          height={18}
          alt="left icon"
          style={{ display: 'block' }} // Ensure Image component is affected by div's transform
        />
      </motion.div>
      <Avatar>
        <AvatarImage src="https://github.com/shadcn.png" />
        <AvatarFallback>CN</AvatarFallback>
      </Avatar>
    </div>
  );
};

export default Header;
