"use client";

import PartsPageSkeleton from "@/components/skeletons/PartsPageSkeleton";
import { getCookie } from "cookies-next";
import {
  Cog,
  IdCard,
  PhoneOutgoing,
  ReceiptText,
  ShieldCheck,
  Wrench,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

type Props = {};

function SuperPage({}: Props) {
  const [name, setName] = useState("");

  useEffect(() => {
    const getUser = () => {
      const token = getCookie("user");

      const parsedToken = JSON.parse(String(token));
      console.log("PARSED", parsedToken);
      //   setName(parsedToken.name);
      setName("Super");
    };

    getUser();
  }, []);

  return (
    <div className="flex flex-col w-[90%] mt-32">
      {!name ? (
        <PartsPageSkeleton />
      ) : (
        <>
          <div>
            <div className="font-semibold text-3xl">Hello {name}! </div>
          </div>
          <div className="flex flex-row space-x-8 mt-16 w-full justify-center lg:justify-normal"></div>
          <div className="flex flex-col mt-16">
            <div className="font-semibold text-2xl mb-5">
              Chose the Profile -{" "}
            </div>
            {/* <TempCarsDataTable columns={tempCarsColumns} data={tempCars} /> */}
            <div className="grid grid-cols-4 gap-4 justify-items-center">
              <SuperRoleSelectButton
                role="Security"
                value="security"
                icon={
                  <IdCard className="w-12 h-12 text-red-500 group-hover:text-red-600" />
                }
              />
              <SuperRoleSelectButton
                role="Service"
                value="service"
                icon={
                  <Wrench className="w-12 h-12 text-red-500 group-hover:text-red-600" />
                }
              />
              <SuperRoleSelectButton
                role="Parts"
                value="parts"
                icon={
                  <Cog className="w-12 h-12 text-red-500 group-hover:text-red-600" />
                }
              />
              <SuperRoleSelectButton
                role="Biller"
                value="biller"
                icon={
                  <ReceiptText className="w-12 h-12 text-red-500 group-hover:text-red-600" />
                }
              />
              <SuperRoleSelectButton
                role="Admin"
                value="admin"
                icon={
                  <ShieldCheck className="w-12 h-12 text-red-500 group-hover:text-red-600" />
                }
              />
              <SuperRoleSelectButton
                role="Caller"
                value="caller"
                icon={
                  <PhoneOutgoing className="w-12 h-12 text-red-500 group-hover:text-red-600" />
                }
              />
            </div>
          </div>
        </>
      )}
    </div>
  );
}

interface SuperRoleSelectButtonProps {
  role: string;
  icon: React.ReactNode; // Accepts any renderable React content
  value: string;
  onClick?: () => void;
}

const SuperRoleSelectButton = ({
  role,
  icon,
  value,
}: SuperRoleSelectButtonProps) => {
  const router = useRouter();

  return (
    <div
      className="flex flex-col space-y-5 border-2 w-44 aspect-square justify-center items-center rounded-2xl border-red-500 text-red-500 hover:bg-red-100/50 cursor-pointer shadow-lg"
      onClick={() => router.push(`/${value}`)}
    >
      {icon}
      <div className="text-xl text-red-800 font-bold group-hover:text-red-700">
        {role}
      </div>
    </div>
  );
};

export default SuperPage;
