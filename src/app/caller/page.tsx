"use client";

import { CallingDataTable } from "@/components/data-tables/calling-data-table";
import PartsPageSkeleton from "@/components/skeletons/PartsPageSkeleton";
import {
  getAllCars,
  getCarsUpdatedBefore,
  getJobCardsBefore,
  getJobCardsBetween,
} from "@/lib/appwrite";
import { callingColumns } from "@/lib/column-definitions";
import { Car, JobCard, TempCar } from "@/lib/definitions";
import { createDateExpandedObj } from "@/lib/helper";
import { getCookie } from "cookies-next";
import React, { useEffect, useState } from "react";
import jobCard from "../biller/jobCard/[jobCardId]/page";

type Props = {};

const Caller = (props: Props) => {
  const [name, setName] = useState("");
  const [callingData, setCallingData] = useState<Car[]>([]);

  useEffect(() => {
    const getUser = () => {
      const token = getCookie("user");

      const parsedToken = JSON.parse(String(token));
      // console.log(parsedToken);
      setName(parsedToken.name);
    };

    const getCallingData = async () => {
      const todaysDate = await createDateExpandedObj(new Date());

      const from = new Date(
        Number(todaysDate.year),
        Number(todaysDate.month) - 2,
        1
      );
      const to = new Date();

      const allCars = await getCarsUpdatedBefore(from);
      const allJobCards = await getJobCardsBefore(from);

      const updatedCars = await Promise.all(
        allCars.documents.map(async (car: Car) => {
          if (!car.customerName && !car.customerPhone) {
            const foundJobCard = allJobCards.documents.find(
              (jobCard: JobCard) => jobCard.carNumber === car.carNumber
            );

            if (foundJobCard) {
              console.log("REPLACING", car.carNumber);
              return {
                ...car,
                customerName: foundJobCard.customerName,
                customerPhone: foundJobCard.customerPhone,
              };
            }
          }

          return car;
        })
      );

      console.log("UpdatedCars", updatedCars);
      setCallingData(updatedCars);
    };

    // const modifyReportsTimeline = async (timeline: string) => {
    //     setShowDatePicker((prev) => false);
    //     const todaysDate = await createDateExpandedObj(new Date());
    //     switch (timeline) {
    //       case "thisMonth":
    //         setCustomDateRange({
    //           from: new Date(
    //             Number(todaysDate.year),
    //             Number(todaysDate.month) - 1,
    //             1
    //           ),
    //           to: new Date(),
    //         });

    //         break;
    //       case "lastMonth":
    //         if (Number(todaysDate.month) != 1) {
    //           setCustomDateRange({
    //             from: new Date(
    //               Number(todaysDate.year),
    //               Number(todaysDate.month) - 2,
    //               1
    //             ),
    //             to: new Date(
    //               Number(todaysDate.year),
    //               Number(todaysDate.month) - 1,
    //               0
    //             ),
    //           });
    //         } else {
    //           setCustomDateRange({
    //             from: new Date(Number(todaysDate.year) - 1, 11, 1),
    //             to: new Date(Number(todaysDate.year) - 1, 12, 0),
    //           });
    //         }

    //         break;
    //       case "lastSixMonths":
    //         if (Number(todaysDate.month) - 6 > 0) {
    //           setCustomDateRange({
    //             from: new Date(
    //               Number(todaysDate.year),
    //               Number(todaysDate.month) - 7,
    //               1
    //             ),
    //             to: new Date(
    //               Number(todaysDate.year),
    //               Number(todaysDate.month) - 1,
    //               0
    //             ),
    //           });
    //         } else {
    //           setCustomDateRange({
    //             from: new Date(
    //               Number(todaysDate.year) - 1,
    //               11 - (6 - Number(todaysDate.month)),
    //               1
    //             ),
    //             to: new Date(
    //               Number(todaysDate.year),
    //               Number(todaysDate.month) - 1,
    //               0
    //             ),
    //           });
    //         }
    //         break;
    //       case "lastYear":
    //         setCustomDateRange({
    //           from: new Date(
    //             Number(todaysDate.year) - 1,
    //             Number(todaysDate.month) - 1,
    //             1
    //           ),
    //           to: new Date(
    //             Number(todaysDate.year),
    //             Number(todaysDate.month) - 1,
    //             0
    //           ),
    //         });
    //         break;
    //       case "custom":
    //         setShowDatePicker((prev) => true);

    //         break;

    //       default:
    //         break;
    //     }
    //     setCurrentSelectedTimeline(timeline);
    //   };

    // const getJobCardsForTimeline = async () => {
    //   const todaysDate = await createDateExpandedObj(new Date());

    //   // setLoading((prev) => true);
    //   const from = new Date(
    //     Number(todaysDate.year),
    //     Number(todaysDate.month) - 1,
    //     1
    //   );
    //   const to = new Date();

    //   const jobcards = await getJobCardsBetween(from!, to!);

    //   console.log("JOB CARDS FOR TIMELINE - ", jobcards);

    //   const onGoingJobCards = jobcards.documents.filter(
    //     (jobCard: JobCard) => jobCard.jobCardStatus < 6
    //   );

    //   const completedJobCards = jobcards.documents.filter(
    //     (jobCard: JobCard) => jobCard.jobCardStatus >= 6
    //   );

    //   // setTotalNumberOfCars(jobcards.total);
    //   setNumberOfCarsInProgress(onGoingJobCards.length);
    //   // setCompletedJobCars(completedJobCards.length);

    //   // return filteredJobCards;
    // };

    // const getTempCars = async () => {
    //   const allTempCars = await getAllTempCars();
    //   const toExitCars = allTempCars.documents.filter(
    //     (car: TempCar) => car.carStatus == 2
    //   );
    //   console.log("TEMP CARS - ", allTempCars);
    //   setTempCars(toExitCars);
    //   // setNumberOfCarsInProgress(allTempCars.total);
    // };

    getUser();
    getCallingData();
    // getJobCardsForTimeline();
    // getTempCars();
  }, []);
  return (
    <div className="flex flex-col w-[90%] mt-32">
      {!(name && callingData) ? (
        <PartsPageSkeleton />
      ) : (
        <>
          <div>
            <div className="font-semibold text-3xl">Hello {name}! </div>
            <div className="font-medium">T3, Mira Road</div>
          </div>
          <div className="flex flex-row space-x-8 mt-16 w-full justify-center lg:justify-normal">
            {/* <DisplayCard
              icon={<Wrench />}
              desc={"In Garage"}
              value={numberOfCarsInProgress}
            /> */}
          </div>
          <div className="flex flex-col mt-16">
            <div className="font-semibold text-2xl mb-5">Calling Data</div>
            {/* <TempCarsDataTable columns={tempCarsColumns} data={tempCars} /> */}
            <CallingDataTable columns={callingColumns} data={callingData!} />
          </div>
        </>
      )}
    </div>
  );
};

export default Caller;
