"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import logo from "../../public/assets/bikedost_bike_logo.svg";
import loader from "../../public/assets/t3-loader.gif";
// import { Home01Icon, Layers01Icon, Logout04Icon } from "hugeicons-react";
import {
  Car,
  CarFront,
  ClipboardList,
  Cog,
  Download,
  HistoryIcon,
  House,
  IdCard,
  Layers3,
  LogOut,
  Menu,
  PhoneOutgoing,
  PlusIcon,
  ReceiptText,
  ShieldCheck,
  UmbrellaIcon,
  UserRoundCog,
  Wrench,
} from "lucide-react";

import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";

import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";

import { useRouter } from "next/navigation";
import { logoutUser } from "@/lib/appwrite";
import { deleteCookie, getCookie } from "cookies-next";
import { Button } from "./ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";

export default function Sidebar({ home }: any) {
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [currentHome, setCurrentHome] = useState(home);

  const [isSuperUser, setIsSuperUser] = useState(false);

  const router = useRouter();

  useEffect(() => {
    const getUser = () => {
      const token = getCookie("user");

      const parsedToken = JSON.parse(String(token));
      const userAccess = parsedToken.labels[0];
      console.log("PARSED", userAccess);
      //   setName(parsedToken.name);
      if (userAccess == "super") {
        setIsSuperUser(true);
      }
    };

    getUser();
  }, []);

  console.log("THIS IS THE HOME - ", home);

  const logout = async () => {
    setIsLoggingOut((prev) => true);
    await logoutUser();
    deleteCookie("user");
    router.push("/");
    // setIsLoggingOut((prev) => false);
  };

  const handleNavigation = (path: string) => {
    router.push(path);
  };

  const handleSuperUserNavigation = (value: string) => {
    router.push(`/${value}`);
  };
  return (
    <>
      <div className="sm:flex lg:hidden z-10 absolute top-5 right-5">
        <Drawer>
          <DrawerTrigger>
            <Menu color="#EF4444" size={38} />
          </DrawerTrigger>
          <DrawerContent>
            <DrawerHeader>
              <DrawerTitle className="flex justify-center">
                <Image src={logo} width={50} height={50} alt="Logo" />
              </DrawerTitle>
            </DrawerHeader>
            <DrawerFooter>
              <DrawerClose>
                <Button
                  className="flex justify-between p-4 border-b w-full"
                  onClick={() => router.push(home)}
                  variant={"link"}
                >
                  <House />
                  <div>Home</div>
                </Button>
              </DrawerClose>
              {(home == "/parts" || home == "/biller") && (
                <DrawerClose>
                  <Button
                    className="flex justify-between p-4 border-b w-full"
                    onClick={() => router.push(`${home}/parts-inventory`)}
                    variant={"link"}
                  >
                    <ClipboardList />
                    <div>Parts Inventory</div>
                  </Button>
                </DrawerClose>
              )}
              {home == "/parts" && (
                <DrawerClose>
                  <Button
                    className="flex justify-between p-4 border-b w-full"
                    onClick={() => router.push(`${home}/addParts`)}
                    variant={"link"}
                  >
                    <PlusIcon />
                    <div>Add Parts</div>
                  </Button>
                </DrawerClose>
              )}
              {home == "/biller" && (
                <DrawerClose>
                  <Button
                    className="flex justify-between p-4 border-b w-full"
                    onClick={() => router.push(`${home}/addLabour`)}
                    variant={"link"}
                  >
                    <PlusIcon />
                    <div>Add Labour</div>
                  </Button>
                </DrawerClose>
              )}
              {home == "/biller" && (
                <DrawerClose>
                  <Button
                    className="flex justify-between p-4 border-b w-full"
                    onClick={() => router.push(`${home}/labour-inventory`)}
                    variant={"link"}
                  >
                    <UserRoundCog />
                    <div>Labour Inventory</div>
                  </Button>
                </DrawerClose>
              )}
              {home == "/admin" && (
                <DrawerClose>
                  <Button
                    className="flex justify-between p-4 border-b w-full"
                    onClick={() => router.push(`${home}/manage-jobcards`)}
                    variant={"link"}
                  >
                    <ClipboardList />
                    <div>Manage Jobcards</div>
                  </Button>

                  <Button
                    className="flex justify-between p-4 border-b w-full"
                    onClick={() => router.push(`${home}/reports`)}
                    variant={"link"}
                  >
                    <Download />
                    <div>Reports</div>
                  </Button>
                  <Button
                    className="flex justify-between p-4 border-b w-full"
                    onClick={() => router.push(`${home}/add-car`)}
                    variant={"link"}
                  >
                    <CarFront />
                    <div>Add Car Model</div>
                  </Button>
                  <Button
                    className="flex justify-between p-4 border-b w-full"
                    onClick={() => router.push(`${home}/add-insuranceProvider`)}
                    variant={"link"}
                  >
                    <UmbrellaIcon />
                    <div>Add Policy Provider</div>
                  </Button>
                </DrawerClose>
              )}

              {home == "/security" && (
                <DrawerClose>
                  <Button
                    className="flex justify-between p-4 border-b w-full"
                    onClick={() => router.push(`${home}/addCar`)}
                    variant={"link"}
                  >
                    <Car />
                    <div>Add Car</div>
                  </Button>
                </DrawerClose>
              )}
              <Button
                onClick={logout}
                className="flex justify-between p-4 border-b"
                variant={"link"}
              >
                {isLoggingOut ? (
                  <Image src={loader} width={50} height={50} alt="Logo" />
                ) : (
                  <>
                    <LogOut />
                    <div>Logout</div>
                  </>
                )}
              </Button>
            </DrawerFooter>
          </DrawerContent>
        </Drawer>
      </div>
      <div className="hidden lg:flex sticky top-0 shadow-xl p-6 flex-col h-dvh bg-gray-50 min-w-[80px] items-center py-8">
        <div
          className="mb-10 cursor-pointer"
          onClick={() => {
            {
              if (isSuperUser) {
                router.push("/super");
              } else {
                router.push(home);
              }
            }
          }}
        >
          <Image src={logo} width={50} height={50} alt="Logo" />
        </div>
        {isSuperUser && (
          <Select
            onValueChange={(userAccess) =>
              handleSuperUserNavigation(userAccess)
            }
          >
            <SelectTrigger className="w-full mb-10">
              <SelectValue placeholder="Role" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem key={"Security"} value={"security"}>
                <div className="flex space-x-5 items-center justify-between">
                  <div>Security</div>
                  <IdCard />
                </div>
              </SelectItem>
              <SelectItem key={"Service"} value={"service"}>
                <div className="flex space-x-5 items-center justify-between">
                  <div>Service</div>
                  <Wrench />
                </div>
              </SelectItem>
              <SelectItem key={"Parts"} value={"parts"}>
                <div className="flex space-x-5 items-center justify-between">
                  <div>Parts</div>
                  <Cog />
                </div>
              </SelectItem>
              <SelectItem key={"Biller"} value={"biller"}>
                <div className="flex space-x-5 items-center justify-between">
                  <div>Biller</div>
                  <ReceiptText />
                </div>
              </SelectItem>
              <SelectItem key={"Admin"} value={"admin"}>
                <div className="flex space-x-5 items-center justify-between">
                  <div>Admin</div>
                  <ShieldCheck />
                </div>
              </SelectItem>
              <SelectItem key={"Caller"} value={"caller"}>
                <div className="flex space-x-5 items-center justify-between">
                  <div>Caller</div>
                  <PhoneOutgoing />
                </div>
              </SelectItem>
            </SelectContent>
          </Select>
        )}
        <div className="flex flex-col h-full justify-between">
          <div className="flex flex-col space-y-5">
            <HoverCard>
              <HoverCardTrigger asChild>
                <div
                  className="border-2 rounded-md shadow-md p-3 cursor-pointer"
                  onClick={() => {
                    if (isSuperUser) {
                      handleNavigation("/super");
                    } else {
                      handleNavigation(home);
                    }
                  }}
                >
                  <House />
                </div>
              </HoverCardTrigger>
              <HoverCardContent className="ml-10 -mt-5 font-semibold w-fit">
                Home
              </HoverCardContent>
            </HoverCard>

            {(currentHome == "/parts" || currentHome == "/biller") && (
              <HoverCard>
                <HoverCardTrigger asChild>
                  <div
                    className="border-2 rounded-md shadow-md p-3 cursor-pointer"
                    onClick={() =>
                      handleNavigation(`${currentHome}/parts-inventory`)
                    }
                  >
                    <ClipboardList />
                  </div>
                </HoverCardTrigger>
                <HoverCardContent className="ml-10 -mt-5 font-semibold w-fit">
                  Parts Inventory
                </HoverCardContent>
              </HoverCard>
            )}

            {currentHome == "/admin" && (
              <>
                <HoverCard>
                  <HoverCardTrigger asChild>
                    <div
                      className="border-2 rounded-md shadow-md p-3 cursor-pointer"
                      onClick={() =>
                        handleNavigation(`${currentHome}/manage-jobcards`)
                      }
                    >
                      <ClipboardList />
                    </div>
                  </HoverCardTrigger>
                  <HoverCardContent className="ml-10 -mt-5 font-semibold w-fit">
                    Manage Jobcards
                  </HoverCardContent>
                </HoverCard>

                <HoverCard>
                  <HoverCardTrigger asChild>
                    <div
                      className="border-2 rounded-md shadow-md p-3 cursor-pointer"
                      onClick={() => handleNavigation(`${currentHome}/reports`)}
                    >
                      <Download />
                    </div>
                  </HoverCardTrigger>
                  <HoverCardContent className="ml-10 -mt-5 font-semibold w-fit">
                    Download Reports
                  </HoverCardContent>
                </HoverCard>
                <HoverCard>
                  <HoverCardTrigger asChild>
                    <div
                      className="border-2 rounded-md shadow-md p-3 cursor-pointer"
                      onClick={() => handleNavigation(`${currentHome}/add-car`)}
                    >
                      <CarFront />
                    </div>
                  </HoverCardTrigger>
                  <HoverCardContent className="ml-10 -mt-5 font-semibold w-fit">
                    Add Car Model
                  </HoverCardContent>
                </HoverCard>
                <HoverCard>
                  <HoverCardTrigger asChild>
                    <div
                      className="border-2 rounded-md shadow-md p-3 cursor-pointer"
                      onClick={() =>
                        handleNavigation(`${currentHome}/add-insuranceProvider`)
                      }
                    >
                      <UmbrellaIcon />
                    </div>
                  </HoverCardTrigger>
                  <HoverCardContent className="ml-10 -mt-5 font-semibold w-fit">
                    Add Insurance Provider
                  </HoverCardContent>
                </HoverCard>
                <HoverCard>
                  <HoverCardTrigger asChild>
                    <div
                      className="border-2 rounded-md shadow-md p-3 cursor-pointer"
                      onClick={() =>
                        handleNavigation(`${currentHome}/viewChanges`)
                      }
                    >
                      <HistoryIcon />
                    </div>
                  </HoverCardTrigger>
                  <HoverCardContent className="ml-10 -mt-5 font-semibold w-fit">
                    View Change History
                  </HoverCardContent>
                </HoverCard>
              </>
            )}

            {currentHome == "/biller" && (
              <HoverCard>
                <HoverCardTrigger asChild>
                  <div
                    className="border-2 rounded-md shadow-md p-3 cursor-pointer"
                    onClick={() =>
                      handleNavigation(`${currentHome}/labour-inventory`)
                    }
                  >
                    <UserRoundCog />
                  </div>
                </HoverCardTrigger>
                <HoverCardContent className="ml-10 -mt-5 font-semibold w-fit">
                  Labour Inventory
                </HoverCardContent>
              </HoverCard>
            )}
            {currentHome == "/security" && (
              <HoverCard>
                <HoverCardTrigger asChild>
                  <div
                    className="border-2 rounded-md shadow-md p-3 cursor-pointer"
                    onClick={() => handleNavigation(`${currentHome}/addCar`)}
                  >
                    <Car />
                  </div>
                </HoverCardTrigger>
                <HoverCardContent className="ml-10 -mt-5 font-semibold w-fit">
                  Add Car
                </HoverCardContent>
              </HoverCard>
            )}
            {currentHome == "/parts" && (
              <HoverCard>
                <HoverCardTrigger asChild>
                  <div
                    className="border-2 rounded-md shadow-md p-3 cursor-pointer"
                    onClick={() => handleNavigation(`${currentHome}/addParts`)}
                  >
                    <PlusIcon />
                  </div>
                </HoverCardTrigger>
                <HoverCardContent className="ml-10 -mt-5 font-semibold w-fit">
                  Add Parts
                </HoverCardContent>
              </HoverCard>
            )}
            {currentHome == "/biller" && (
              <HoverCard>
                <HoverCardTrigger asChild>
                  <div
                    className="border-2 rounded-md shadow-md p-3 cursor-pointer"
                    onClick={() => handleNavigation(`${currentHome}/addLabour`)}
                  >
                    <PlusIcon />
                  </div>
                </HoverCardTrigger>
                <HoverCardContent className="ml-10 -mt-5 font-semibold w-fit">
                  Add Labour
                </HoverCardContent>
              </HoverCard>
            )}
          </div>
          <div>
            <button
              onClick={logout}
              className={`border-2 rounded-md shadow-md ${
                isLoggingOut ? "opacity-50 p-1" : "p-3"
              }`}
            >
              {isLoggingOut ? (
                <Image src={loader} width={50} height={50} alt="Logo" />
              ) : (
                <LogOut />
              )}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
