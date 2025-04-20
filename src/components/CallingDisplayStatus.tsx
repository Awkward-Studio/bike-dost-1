import React, { useEffect, useState } from "react";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select"; // adjust import paths
import { callingStatuses } from "@/lib/helper";
import { updateCarField } from "@/lib/appwrite";
import { toast } from "sonner";

// assuming `callingStatuses` is imported or passed as prop

const DisplayStatus = ({
  callingStatus,
  carId,
}: {
  callingStatus: number;
  carId: any;
}) => {
  const [selectedCallingStatus, setSelectedCallingStatus] =
    useState(callingStatus);

  useEffect(() => {
    const updateCarCallingStatus = async () => {
      const isDone = await updateCarField(
        carId,
        "callingStatus",
        Number(selectedCallingStatus)
      );
      if (isDone) {
        toast("Updated Car Calling Statsus \u2705");
      } else {
        toast("Problem in updating calling status");
      }
    };

    if (!(selectedCallingStatus == callingStatus)) {
      updateCarCallingStatus();
    }
  }, [selectedCallingStatus]);

  return (
    <div className="flex items-center px-4 py-2 rounded-full font-semibold space-x-5">
      <Select
        onValueChange={(value) => {
          const numValue = Number(value);
          setSelectedCallingStatus(numValue);
          console.log(carId);
        }}
        value={
          selectedCallingStatus != null ? selectedCallingStatus.toString() : "0"
        }
        disabled={true}
      >
        <SelectTrigger
          className={`w-[180px] border-4
            ${
              selectedCallingStatus == 0
                ? "border-[#737373] text-[#737373]"
                : ""
            }
            ${
              selectedCallingStatus == 1
                ? "border-[#099250] text-[#099250]"
                : ""
            }
            ${
              selectedCallingStatus == 2
                ? "border-yellow-600 text-yellow-600"
                : ""
            }
          `}
        >
          <SelectValue placeholder="Status" />
        </SelectTrigger>
        <SelectContent>
          {callingStatuses.map((status, index) =>
            status.code !== 999 ? (
              <SelectItem key={index} value={String(status.code)}>
                <div className="flex space-x-2">
                  <div
                    className={`h-5 w-5 rounded-full 
                      ${status.code == 0 ? "bg-[#737373]" : ""}
                      ${status.code == 1 ? "bg-[#099250]" : ""}
                      ${status.code == 2 ? "bg-yellow-500" : ""}
                    `}
                  ></div>
                  <div className="font-bold">{status.description}</div>
                </div>
              </SelectItem>
            ) : null
          )}
        </SelectContent>
      </Select>
    </div>
  );
};

export default DisplayStatus;
