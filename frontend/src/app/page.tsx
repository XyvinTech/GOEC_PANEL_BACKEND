"use client";



import { useRouter } from "next/navigation";
import { useEffect } from "react";
import Cookies from "js-cookie";

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    const token = Cookies.get('token');

    if (token) {
      router.push('/stations')
    } else {
      router.push('/login')

    }


  }, [router])

  return (
    <div>
      <h1>Loading...</h1>
    </div>
  );
}
