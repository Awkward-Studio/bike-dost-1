import { NextRequest, NextResponse } from "next/server";
import { Client, Databases, Query } from "node-appwrite";
import { config } from "@/lib/appwrite";
// Initialize Appwrite Client
const client = new Client();
const databases = new Databases(client);

client
  .setEndpoint("https://cloud.appwrite.io/v1") 
  .setProject(config.projectId) 
  .setKey("standard_da0912f9efcaa6d841fbc40fcea9b406f1f7ece6dc34d1430c2b71d5a9c2b5ad9538dc8545395cb49aaf7b13da60ffd63aee40119278b5daaf180da5962b44c006a6aa1a5ad7d55fcb4eed7987434c2d11a9cf0f4896511d777f5ecfd935f41ca2110174da6db3a41a6600dc5293202d099b0698766e81ed1f98beb08217769c"); 

  export async function POST(req: NextRequest, res:NextResponse) {

  try {
    // Extract input from the request body
    const body = await req.json();
    const { jobCardId, invoiceType, isInsuranceInvoice, series } = body;

    if (!jobCardId || !series || !invoiceType) {
      return NextResponse.json(
        { message: "Missing required fields" },
        { status: 400 }
      );
    }

    // Step 1: Fetch existing invoices for the job card
    const existingInvoices = await databases.listDocuments(
      config.databaseId,
      config.invoicesCollectionId,
      [Query.equal("jobCardId", jobCardId), Query.equal("invoiceSeries", series)]
    );

    let customerInvoiceNumber: number | null = null;
    let insuranceInvoiceNumber: number | null = null;

    // Check existing invoices
    existingInvoices.documents.forEach((inv) => {
      if (!inv.isInsuranceInvoice) {
        customerInvoiceNumber = inv.invoiceNumber; // Reuse customer invoice number
      } else if (inv.isInsuranceInvoice) {
        insuranceInvoiceNumber = inv.invoiceNumber; // Track insurance invoice number
      }
    });

    // Step 2: Get or initialize the global counter for the series
    const counterId = `counter_${series}`;
    let globalCounter;

    try {
      globalCounter = await databases.getDocument(
        config.databaseId,
        config.atomicCounterCollectionId,
        counterId
      );
    } catch (error) {
      // Initialize the counter if it doesn't exist
      globalCounter = await databases.createDocument(
        config.databaseId,
        config.atomicCounterCollectionId,
        counterId,
        { series, currentNumber: 1000 }
      );
    }

    // Step 3: Determine the invoice number
    let invoiceNumber;

    if (invoiceType === "Quote") {
      // Reuse the customer invoice number or generate a new one
      invoiceNumber = customerInvoiceNumber || globalCounter.currentNumber + 1;
    } else if (isInsuranceInvoice) {
      // Insurance invoices get a new global number
      invoiceNumber = insuranceInvoiceNumber || globalCounter.currentNumber + 1;
    } else {
      // For customer Pro-Forma or Tax Invoices, reuse the Quote number
      invoiceNumber = customerInvoiceNumber || globalCounter.currentNumber + 1;
    }

    // Step 4: Update the global counter if a new number is used
    if (invoiceNumber > globalCounter.currentNumber) {
      await databases.updateDocument(
        config.databaseId,
        config.atomicCounterCollectionId,
        counterId,
        { currentNumber: invoiceNumber }
      );
    }

    // Step 5: Generate the invoice code
    const invoiceCode = `${series}/${invoiceNumber}`;

    // Step 6: Return the response
    return NextResponse.json({
      invoiceNumber,
      invoiceCode,
      message: "Invoice number generated successfully",
    });
  } catch (error) {
    console.error("Error generating invoice number:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
