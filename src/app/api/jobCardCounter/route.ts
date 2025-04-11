import { NextRequest, NextResponse } from "next/server";
import { Client, Databases } from "node-appwrite";
import { config } from "@/lib/appwrite";
// Initialize Appwrite Client
const client = new Client();
const databases = new Databases(client);

client
  .setEndpoint("https://cloud.appwrite.io/v1") // Replace with your Appwrite endpoint
  .setProject(config.projectId) // Replace with your project ID
  .setKey("standard_da0912f9efcaa6d841fbc40fcea9b406f1f7ece6dc34d1430c2b71d5a9c2b5ad9538dc8545395cb49aaf7b13da60ffd63aee40119278b5daaf180da5962b44c006a6aa1a5ad7d55fcb4eed7987434c2d11a9cf0f4896511d777f5ecfd935f41ca2110174da6db3a41a6600dc5293202d099b0698766e81ed1f98beb08217769c"); // Replace with your API Key

export async function POST(req: NextRequest) {
  try {
    const counterId = "counter_JCARD"; // ID for the global job card counter document
    const databaseId = config.databaseId; // Replace with your database ID
    const collectionId = config.atomicCounterCollectionId; // Replace with your collection ID

    let counterDocument;

    try {
      // Step 1: Fetch the current job card counter
      counterDocument = await databases.getDocument(
        databaseId,
        collectionId,
        counterId
      );
    } catch (error) {
      // Step 2: If counter doesn't exist, initialize it with 1000
      counterDocument = await databases.createDocument(
        databaseId,
        collectionId,
        counterId,
        { currentNumber: 1000 }
      );
    }

    // Step 3: Increment the counter
    console.log("Current job card number:", counterDocument.currentNumber);
    const nextNumber = counterDocument.currentNumber + 1;
    console.log("Next job card number:", nextNumber);

    // Step 4: Update the counter in the database
    const result = await databases.updateDocument(databaseId, collectionId, counterId, {
      currentNumber: nextNumber,
    });
    console.log("Counter updated successfully:", result);

    // Step 5: Return the next job card number
    return NextResponse.json({
      jobCardNumber: nextNumber,
      message: "Next job card number generated successfully",
    });
  } catch (error: any) {
    console.error("Error generating job card number:", error);
    return NextResponse.json(
      { message: "Failed to generate job card number", error: error.message },
      { status: 500 }
    );
  }
}
