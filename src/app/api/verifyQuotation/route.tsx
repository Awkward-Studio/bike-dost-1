import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  console.log("BODY", request.body);
  try {
    const recievedData = await request.json();

    //   await updateJobCardField()
    console.log("THIS IS THE RECIEVED DATA _ ", recievedData);
    return NextResponse.json({
      message: "Recieved Message",
      status: true,
      recievedData,
    });
  } catch (error) {
    console.log("Failed");
    console.log(error);

    return NextResponse.json({
      message: "Failed",
      status: false,
    });
  }
}
