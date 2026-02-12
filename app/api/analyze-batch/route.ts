import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const files = formData.getAll("files");

    if (!files || files.length === 0) {
      return NextResponse.json(
        { status: "error", message: "No files provided" },
        { status: 400 },
      );
    }

    // Check if we should use mock data
    const useMockData = process.env.NEXT_PUBLIC_USE_MOCK_DATA === "true";

    if (useMockData) {
      // Mock response for multiple files
      const mockResults = files.map((file, index) => {
        const fileName =
          file instanceof File ? file.name : `document-${index}.docx`;

        return {
          status: "success",
          file_name: "Hotel-Airline Rate Agreement - Sample.docx",
          output_parsed: {
            meta: {
              document_title: "HOTEL CREW RATE AGREEMENT",
              station_or_airport_code: "QNM",
              hotel_name: "The Riverside Hotel, PQR",
              airline_name: "SkyFleet Airways, Inc.",
            },
            review: [
              {
                field: "Name (Parties)",
                // actual_content:
                //   "This Agreement is made between The Riverside Hotel, PQR, located at 987 Lakeview Ave, PQR 560011 (the “Hotel”) and SkyFleet Airways, Inc., located at 2410 Horizon Park, Suite 400, Austin, Texas 78701 (the “Airline”)",
                actual_content:
                "Ramesh Patil",
                compliant: "Y",
                comment:
                  "Both parties' full legal names and addresses are clearly present and properly formatted.",
              },
              {
                field: "Start Date",
                actual_content:
                  "This Agreement shall commence on January 1, 2025.",
                compliant: "Y",
                comment: "Start date is clearly specified and unambiguous.",
              },
              {
                field: "End Date",
                actual_content: "",
                compliant: "N",
                comment:
                  "End date is not specified. Agreement should have a clear termination date or renewal terms.",
              },
              {
                field: "Room Rate",
                actual_content:
                  "The Hotel agrees to provide rooms at a rate of $89.00 per night for single occupancy and $99.00 for double occupancy.",
                compliant: "Y",
                comment:
                  "Room rates are clearly specified for both single and double occupancy.",
              },
              {
                field: "Room Capping",
                actual_content: "",
                compliant: "N",
                comment:
                  "No room capping clause found. Agreement should specify maximum number of rooms per night.",
              },
              {
                field: "Last Room Availability (LRA)",
                actual_content:
                  "Hotel guarantees last room availability for airline crew members at the agreed rate.",
                compliant: "Y",
                comment:
                  "LRA clause is present and guarantees availability at contracted rates.",
              },
              {
                field: "Payment Terms",
                actual_content:
                  "Payment shall be made by the Airline within 30 days of invoice date via direct billing.",
                compliant: "Y",
                comment:
                  "Payment terms are clearly defined with specific timeframe and method.",
              },
              {
                field: "Cancellation Policy",
                actual_content:
                  "Cancellations must be made at least 24 hours prior to arrival to avoid charges.",
                compliant: "Y",
                comment:
                  "Cancellation policy is clearly stated with specific timeframe.",
              },
              {
                field: "IROP Rates",
                actual_content: "",
                compliant: "N",
                comment:
                  "No IROP (Irregular Operations) rates specified. Should include provisions for emergency/unscheduled operations.",
              },
            ],
            snippets: [
              {
                label: "Parties and Addresses",
                text: "This Agreement is made between SkyFleet Airways, Inc., a corporation organized under the laws of Delaware with its principal office at 123 Aviation Blvd, Chicago, IL 60601 (hereinafter referred to as 'Airline'), and The Riverside Hotel, PQR, located at 456 River Road, Quincy, QNM 12345 (hereinafter referred to as 'Hotel').",
                page_or_section: "Section 1 - Parties",
              },
              {
                label: "Room Rate & Reservations",
                text: "The Hotel agrees to provide rooms for the Airline's crew members at the following rates: Single Occupancy: $89.00 per night, Double Occupancy: $99.00 per night. These rates are inclusive of all taxes and fees. Hotel guarantees last room availability for airline crew members at the agreed rate, regardless of hotel occupancy status.",
                page_or_section: "Section 2(a) - Rates",
              },
              {
                label: "Payment and Billing",
                text: "Payment shall be made by the Airline within 30 days of invoice date via direct billing. The Hotel will provide itemized invoices on a monthly basis. Late payments will incur a 1.5% monthly interest charge.",
                page_or_section: "Section 4 - Payment Terms",
              },
              {
                label: "Cancellation and No-Show Policy",
                text: "Cancellations must be made at least 24 hours prior to the scheduled arrival time to avoid charges. No-shows will be charged for one night's accommodation. The Airline may modify or cancel reservations due to operational requirements with reasonable notice.",
                page_or_section: "Section 5 - Cancellations",
              },
            ],
            flags: {
              missing_fields: ["End Date", "Room Capping", "IROP Rates"],
              ambiguous_points: [
                "Agreement duration is unclear without an end date",
                "No provisions for rate increases or adjustments",
                "Emergency operations procedures not defined",
              ],
            },
          },
        };
        // return {
        //   status: "success",
        //   run_id: `mock-${Date.now()}-${index}`,
        //   file_name: fileName,
        //   output_raw: JSON.stringify({
        //     meta: {
        //       document_title: `HOTEL CREW RATE AGREEMENT ${index + 1}`,
        //       station_or_airport_code: `ABC${index}`,
        //       hotel_name: `Sample Hotel ${index + 1}`,
        //       airline_name: `Sample Airline ${index + 1}`,
        //     },
        //     review: [
        //       {
        //         field: "Name (Parties)",
        //         actual_content: `Mock content for ${fileName}`,
        //         compliant: "Y",
        //         comment: "Mock review comment",
        //       },
        //     ],
        //     snippets: [],
        //     flags: {
        //       missing_fields: [],
        //       ambiguous_points: [],
        //     },
        //   }),
        //   output_parsed: {
        //     meta: {
        //       document_title: `HOTEL CREW RATE AGREEMENT ${index + 1}`,
        //       station_or_airport_code: `ABC${index}`,
        //       hotel_name: `Sample Hotel ${index + 1}`,
        //       airline_name: `Sample Airline ${index + 1}`,
        //     },
        //     review: [
        //       {
        //         field: "Name (Parties)",
        //         actual_content: `Mock content for ${fileName}`,
        //         compliant: "Y",
        //         comment: "Mock review comment",
        //       },
        //     ],
        //     snippets: [],
        //     flags: {
        //       missing_fields: [],
        //       ambiguous_points: [],
        //     },
        //   },
        // };
      });

      return NextResponse.json({
        status: "success",
        results: mockResults,
      });
    }

    // Real API call
    const backendUrl = process.env.BACKEND_API_URL || "http://localhost:8000";
    const apiFormData = new FormData();

    files.forEach((file) => {
      apiFormData.append("files", file);
    });

    const response = await fetch(`${backendUrl}/analyze-batch`, {
      method: "POST",
      body: apiFormData,
    });

    if (!response.ok) {
      throw new Error(`Backend returned ${response.status}`);
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Batch analyze error:", error);
    return NextResponse.json(
      {
        status: "error",
        message: error instanceof Error ? error.message : "Analysis failed",
      },
      { status: 500 },
    );
  }
}
