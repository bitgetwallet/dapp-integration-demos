"use client";
// import Image from "next/image";
import React from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();
  return (
    <div className="w-full bg-[#efefef] box-border">
      <button
        className={`w-full h-[48px] rounded-full bg-[#3894ff] text-white text-lg mt-6 `}
        type="button"
        onClick={() => {
          router.push("/eth");
        }}
      >
        Eip155
      </button>
      <button
        className={`w-full h-[48px] rounded-full bg-[#3894ff] text-white text-lg mt-6 `}
        type="button"
        onClick={() => {
          router.push("/solana");
        }}
      >
        Solana
      </button>
    </div>
  );
}
