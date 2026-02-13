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
          results: [
            {
              status: "success",
              run_id: "698c5180cf64ab96aa5dca59",
              file_name: "ATLTE 2024 Sun Country Rate Agreement.pdf",
              output_raw:
                '{\n  "meta": {\n    "document_title": "Sun Country Rate Agreement",\n    "station_or_airport_code": "ATL",\n    "hotel_name": "ELLIS HOTEL, A TRIBUTE HOTEL BY MARRIOTT",\n    "airline_name": "Sun Country Airlines"\n  },\n  "review": [\n    {\n      "field": "Name (Parties)",\n      "actual_content": "TA Connections IL, LLC d/b/a TA Connections and HOTEL: ELLIS HOTEL, A TRIBUTE HOTEL BY MARRIOTT",\n      "compliant": "Y",\n      "comment": "Both parties\' names are clearly stated."\n    },\n    {\n      "field": "Start Date",\n      "actual_content": "3/11/2024",\n      "compliant": "Y",\n      "comment": "Start date is explicitly stated."\n    },\n    {\n      "field": "End Date",\n      "actual_content": "3/11/2025",\n      "compliant": "Y",\n      "comment": "End date is explicitly stated."\n    },\n    {\n      "field": "Room Capping",\n      "actual_content": "LRA Last Room Ava. YES at $139 $109 Non LRA",\n      "compliant": "Y",\n      "comment": "LRA and non-LRA rates are specified."\n    },\n    {\n      "field": "Ad Hoc Rate",\n      "actual_content": "",\n      "compliant": "N",\n      "comment": "No specific ad hoc rate mentioned."\n    },\n    {\n      "field": "Currency",\n      "actual_content": "",\n      "compliant": "N",\n      "comment": "Currency is not explicitly mentioned."\n    },\n    {\n      "field": "Tax Rate and Exemption",\n      "actual_content": "16.9% + $5.00",\n      "compliant": "Y",\n      "comment": "Tax rate and additional flat tax are specified."\n    },\n    {\n      "field": "Early Check-ins and Check-outs",\n      "actual_content": "Rate is based on 11 am check in, 2 pm check out.",\n      "compliant": "Y",\n      "comment": "Check-in and check-out times are clearly stated."\n    },\n    {\n      "field": "Weekend/Special-Day Rates",\n      "actual_content": "Black out dates – 2024 July 15-18, August 29-September 1, August 20-23, December 20 2025-January 14-19, January 27-29",\n      "compliant": "Y",\n      "comment": "Blackout dates are specified, implying different rates."\n    },\n    {\n      "field": "Layover Rules",\n      "actual_content": "",\n      "compliant": "N",\n      "comment": "No specific layover rules mentioned."\n    },\n    {\n      "field": "Cancellation Policy",\n      "actual_content": "Reservation is cancelable prior to 6 p.m. on date of arrival with no penalty.",\n      "compliant": "Y",\n      "comment": "Cancellation policy is clearly stated."\n    },\n    {\n      "field": "Additional Room Rules",\n      "actual_content": "No Walk Policy - Hotel agrees not to walk or displace an airline employee to another property unless Airline agrees to said move in writing two (2) weeks in advance of arrival date.",\n      "compliant": "Y",\n      "comment": "Additional room rules regarding displacement are specified."\n    },\n    {\n      "field": "Commission Rate",\n      "actual_content": "Hotel agrees to pay TA CONNECTIONS a 10% commission per room night charged for all rooms utilized by the airline",\n      "compliant": "Y",\n      "comment": "Commission rate is clearly stated."\n    },\n    {\n      "field": "Single Room Rate",\n      "actual_content": "$139- LRA $109- Non-LRA",\n      "compliant": "Y",\n      "comment": "Single room rates for LRA and non-LRA are specified."\n    },\n    {\n      "field": "Check-In Time",\n      "actual_content": "11 am check in",\n      "compliant": "Y",\n      "comment": "Check-in time is clearly stated."\n    },\n    {\n      "field": "Check-Out Time",\n      "actual_content": "2 pm check out",\n      "compliant": "Y",\n      "comment": "Check-out time is clearly stated."\n    },\n    {\n      "field": "Other Tax / Flat Tax",\n      "actual_content": "$5.00",\n      "compliant": "Y",\n      "comment": "Flat tax amount is specified."\n    },\n    {\n      "field": "Is Contract Signed",\n      "actual_content": "Name: Maria Ellie Maldonado Title: Senior Director Client Services Date: 3/13/2024 Name: Raleih Bennett Title: Regional Director of Sales Date: 3/13/2024",\n      "compliant": "Y",\n      "comment": "Signatures and dates are present."\n    },\n    {\n      "field": "Operational Memo",\n      "actual_content": "Hotel shall indemnify and hold harmless TA Connections IL, LLC d/b/a TA Connections, its agents, officers, directors, employees, stockholders, and any affiliate named under this Agreement for any liabilities, costs, damages, fines, and expenses of any kind.",\n      "compliant": "Y",\n      "comment": "Operational and indemnity clauses are present."\n    }\n  ],\n  "snippets": [\n    {\n      "label": "Room Rate & Reservations",\n      "text": "$139- LRA $109- Non-LRA",\n      "page_or_section": "Section 7"\n    },\n    {\n      "label": "Tax / Exemption / Refund",\n      "text": "16.9% + $5.00",\n      "page_or_section": "Section 7"\n    },\n    {\n      "label": "Term (Start/End)",\n      "text": "Start Date 3/11/2024 End Date 3/11/2025",\n      "page_or_section": "Section 7"\n    },\n    {\n      "label": "Early/Late Check-in/out / Layover",\n      "text": "Rate is based on 11 am check in, 2 pm check out.",\n      "page_or_section": "Section 7"\n    },\n    {\n      "label": "Cancellation Policy",\n      "text": "Reservation is cancelable prior to 6 p.m. on date of arrival with no penalty.",\n      "page_or_section": "Section 7"\n    },\n    {\n      "label": "Additional Room Rules",\n      "text": "No Walk Policy - Hotel agrees not to walk or displace an airline employee to another property unless Airline agrees to said move in writing two (2) weeks in advance of arrival date.",\n      "page_or_section": "Section 7"\n    }\n  ],\n  "flags": {\n    "missing_fields": [\n      "Ad Hoc Rate",\n      "Currency",\n      "Layover Rules"\n    ],\n    "ambiguous_points": []\n  }\n}',
              output_parsed: {
                meta: {
                  document_title: "Sun Country Rate Agreement",
                  station_or_airport_code: "ATL",
                  hotel_name: "ELLIS HOTEL, A TRIBUTE HOTEL BY MARRIOTT",
                  airline_name: "Sun Country Airlines",
                },
                review: [
                  {
                    field: "Name (Parties)",
                    // actual_content:
                    //   "This Agreement is made between The Riverside Hotel, PQR, located at 987 Lakeview Ave, PQR 560011 (the “Hotel”) and SkyFleet Airways, Inc., located at 2410 Horizon Park, Suite 400, Austin",
                    // actual_content: "Aadhar is unique and secure",
                    actual_content: "Your order Aadhaar PVC card , request is successfully placed.",
                    compliant: "Y",
                    comment: "Both parties' names are clearly stated.",
                  },
                  {
                    field: "Start Date",
                    actual_content: "3/11/2024",
                    compliant: "Y",
                    comment: "Start date is explicitly stated.",
                  },
                  {
                    field: "End Date",
                    actual_content: "3/11/2025",
                    compliant: "Y",
                    comment: "End date is explicitly stated.",
                  },
                  {
                    field: "Room Capping",
                    actual_content:
                      "LRA Last Room Ava. YES at $139 $109 Non LRA",
                    compliant: "Y",
                    comment: "LRA and non-LRA rates are specified.",
                  },
                  {
                    field: "Ad Hoc Rate",
                    actual_content: "",
                    compliant: "N",
                    comment: "No specific ad hoc rate mentioned.",
                  },
                  {
                    field: "Currency",
                    actual_content: "",
                    compliant: "N",
                    comment: "Currency is not explicitly mentioned.",
                  },
                  {
                    field: "Tax Rate and Exemption",
                    actual_content: "16.9% + $5.00",
                    compliant: "Y",
                    comment: "Tax rate and additional flat tax are specified.",
                  },
                  {
                    field: "Early Check-ins and Check-outs",
                    actual_content:
                      "Rate is based on 11 am check in, 2 pm check out.",
                    compliant: "Y",
                    comment: "Check-in and check-out times are clearly stated.",
                  },
                  {
                    field: "Weekend/Special-Day Rates",
                    actual_content:
                      "Black out dates – 2024 July 15-18, August 29-September 1, August 20-23, December 20 2025-January 14-19, January 27-29",
                    compliant: "Y",
                    comment:
                      "Blackout dates are specified, implying different rates.",
                  },
                  {
                    field: "Layover Rules",
                    actual_content: "",
                    compliant: "N",
                    comment: "No specific layover rules mentioned.",
                  },
                  {
                    field: "Cancellation Policy",
                    actual_content:
                      "Reservation is cancelable prior to 6 p.m. on date of arrival with no penalty.",
                    compliant: "Y",
                    comment: "Cancellation policy is clearly stated.",
                  },
                  {
                    field: "Additional Room Rules",
                    actual_content:
                      "No Walk Policy - Hotel agrees not to walk or displace an airline employee to another property unless Airline agrees to said move in writing two (2) weeks in advance of arrival date.",
                    compliant: "Y",
                    comment:
                      "Additional room rules regarding displacement are specified.",
                  },
                  {
                    field: "Commission Rate",
                    actual_content:
                      "Hotel agrees to pay TA CONNECTIONS a 10% commission per room night charged for all rooms utilized by the airline",
                    compliant: "Y",
                    comment: "Commission rate is clearly stated.",
                  },
                  {
                    field: "Single Room Rate",
                    actual_content: "$139- LRA $109- Non-LRA",
                    compliant: "Y",
                    comment:
                      "Single room rates for LRA and non-LRA are specified.",
                  },
                  {
                    field: "Check-In Time",
                    actual_content: "11 am check in",
                    compliant: "Y",
                    comment: "Check-in time is clearly stated.",
                  },
                  {
                    field: "Check-Out Time",
                    actual_content: "2 pm check out",
                    compliant: "Y",
                    comment: "Check-out time is clearly stated.",
                  },
                  {
                    field: "Other Tax / Flat Tax",
                    actual_content: "$5.00",
                    compliant: "Y",
                    comment: "Flat tax amount is specified.",
                  },
                  {
                    field: "Is Contract Signed",
                    actual_content:
                      "Name: Maria Ellie Maldonado Title: Senior Director Client Services Date: 3/13/2024 Name: Raleih Bennett Title: Regional Director of Sales Date: 3/13/2024",
                    compliant: "Y",
                    comment: "Signatures and dates are present.",
                  },
                  {
                    field: "Operational Memo",
                    actual_content:
                      "Hotel shall indemnify and hold harmless TA Connections IL, LLC d/b/a TA Connections, its agents, officers, directors, employees, stockholders, and any affiliate named under this Agreement for any liabilities, costs, damages, fines, and expenses of any kind.",
                    compliant: "Y",
                    comment: "Operational and indemnity clauses are present.",
                  },
                ],
                snippets: [
                  {
                    label: "Room Rate & Reservations",
                    text: "$139- LRA $109- Non-LRA",
                    page_or_section: "Section 7",
                  },
                  {
                    label: "Tax / Exemption / Refund",
                    text: "16.9% + $5.00",
                    page_or_section: "Section 7",
                  },
                  {
                    label: "Term (Start/End)",
                    text: "Start Date 3/11/2024 End Date 3/11/2025",
                    page_or_section: "Section 7",
                  },
                  {
                    label: "Early/Late Check-in/out / Layover",
                    text: "Rate is based on 11 am check in, 2 pm check out.",
                    page_or_section: "Section 7",
                  },
                  {
                    label: "Cancellation Policy",
                    text: "Reservation is cancelable prior to 6 p.m. on date of arrival with no penalty.",
                    page_or_section: "Section 7",
                  },
                  {
                    label: "Additional Room Rules",
                    text: "No Walk Policy - Hotel agrees not to walk or displace an airline employee to another property unless Airline agrees to said move in writing two (2) weeks in advance of arrival date.",
                    page_or_section: "Section 7",
                  },
                ],
                flags: {
                  missing_fields: ["Ad Hoc Rate", "Currency", "Layover Rules"],
                  ambiguous_points: [],
                },
              },
              flat_rows: [
                {
                  run_id: "698c5180cf64ab96aa5dca59",
                  file_name: "ATLTE 2024 Sun Country Rate Agreement.pdf",
                  timestamp: "2026-02-11 15:23:00",
                  review: [
                    {
                      field: "Name (Parties)",
                      actual_content:
                        "TA Connections IL, LLC d/b/a TA Connections and HOTEL: ELLIS HOTEL, A TRIBUTE HOTEL BY MARRIOTT",
                      compliant: "Y",
                      comment: "Both parties' names are clearly stated.",
                    },
                    {
                      field: "Start Date",
                      actual_content: "3/11/2024",
                      compliant: "Y",
                      comment: "Start date is explicitly stated.",
                    },
                    {
                      field: "End Date",
                      actual_content: "3/11/2025",
                      compliant: "Y",
                      comment: "End date is explicitly stated.",
                    },
                    {
                      field: "Room Capping",
                      actual_content:
                        "LRA Last Room Ava. YES at $139 $109 Non LRA",
                      compliant: "Y",
                      comment: "LRA and non-LRA rates are specified.",
                    },
                    {
                      field: "Ad Hoc Rate",
                      actual_content: "",
                      compliant: "N",
                      comment: "No specific ad hoc rate mentioned.",
                    },
                    {
                      field: "Currency",
                      actual_content: "",
                      compliant: "N",
                      comment: "Currency is not explicitly mentioned.",
                    },
                    {
                      field: "Tax Rate and Exemption",
                      actual_content: "16.9% + $5.00",
                      compliant: "Y",
                      comment:
                        "Tax rate and additional flat tax are specified.",
                    },
                    {
                      field: "Early Check-ins and Check-outs",
                      actual_content:
                        "Rate is based on 11 am check in, 2 pm check out.",
                      compliant: "Y",
                      comment:
                        "Check-in and check-out times are clearly stated.",
                    },
                    {
                      field: "Weekend/Special-Day Rates",
                      actual_content:
                        "Black out dates – 2024 July 15-18, August 29-September 1, August 20-23, December 20 2025-January 14-19, January 27-29",
                      compliant: "Y",
                      comment:
                        "Blackout dates are specified, implying different rates.",
                    },
                    {
                      field: "Layover Rules",
                      actual_content: "",
                      compliant: "N",
                      comment: "No specific layover rules mentioned.",
                    },
                    {
                      field: "Cancellation Policy",
                      actual_content:
                        "Reservation is cancelable prior to 6 p.m. on date of arrival with no penalty.",
                      compliant: "Y",
                      comment: "Cancellation policy is clearly stated.",
                    },
                    {
                      field: "Additional Room Rules",
                      actual_content:
                        "No Walk Policy - Hotel agrees not to walk or displace an airline employee to another property unless Airline agrees to said move in writing two (2) weeks in advance of arrival date.",
                      compliant: "Y",
                      comment:
                        "Additional room rules regarding displacement are specified.",
                    },
                    {
                      field: "Commission Rate",
                      actual_content:
                        "Hotel agrees to pay TA CONNECTIONS a 10% commission per room night charged for all rooms utilized by the airline",
                      compliant: "Y",
                      comment: "Commission rate is clearly stated.",
                    },
                    {
                      field: "Single Room Rate",
                      actual_content: "$139- LRA $109- Non-LRA",
                      compliant: "Y",
                      comment:
                        "Single room rates for LRA and non-LRA are specified.",
                    },
                    {
                      field: "Check-In Time",
                      actual_content: "11 am check in",
                      compliant: "Y",
                      comment: "Check-in time is clearly stated.",
                    },
                    {
                      field: "Check-Out Time",
                      actual_content: "2 pm check out",
                      compliant: "Y",
                      comment: "Check-out time is clearly stated.",
                    },
                    {
                      field: "Other Tax / Flat Tax",
                      actual_content: "$5.00",
                      compliant: "Y",
                      comment: "Flat tax amount is specified.",
                    },
                    {
                      field: "Is Contract Signed",
                      actual_content:
                        "Name: Maria Ellie Maldonado Title: Senior Director Client Services Date: 3/13/2024 Name: Raleih Bennett Title: Regional Director of Sales Date: 3/13/2024",
                      compliant: "Y",
                      comment: "Signatures and dates are present.",
                    },
                    {
                      field: "Operational Memo",
                      actual_content:
                        "Hotel shall indemnify and hold harmless TA Connections IL, LLC d/b/a TA Connections, its agents, officers, directors, employees, stockholders, and any affiliate named under this Agreement for any liabilities, costs, damages, fines, and expenses of any kind.",
                      compliant: "Y",
                      comment: "Operational and indemnity clauses are present.",
                    },
                  ],
                  snippets: [
                    {
                      label: "Room Rate & Reservations",
                      text: "$139- LRA $109- Non-LRA",
                      page_or_section: "Section 7",
                    },
                    {
                      label: "Tax / Exemption / Refund",
                      text: "16.9% + $5.00",
                      page_or_section: "Section 7",
                    },
                    {
                      label: "Term (Start/End)",
                      text: "Start Date 3/11/2024 End Date 3/11/2025",
                      page_or_section: "Section 7",
                    },
                    {
                      label: "Early/Late Check-in/out / Layover",
                      text: "Rate is based on 11 am check in, 2 pm check out.",
                      page_or_section: "Section 7",
                    },
                    {
                      label: "Cancellation Policy",
                      text: "Reservation is cancelable prior to 6 p.m. on date of arrival with no penalty.",
                      page_or_section: "Section 7",
                    },
                    {
                      label: "Additional Room Rules",
                      text: "No Walk Policy - Hotel agrees not to walk or displace an airline employee to another property unless Airline agrees to said move in writing two (2) weeks in advance of arrival date.",
                      page_or_section: "Section 7",
                    },
                  ],
                  "meta.document_title": "Sun Country Rate Agreement",
                  "meta.station_or_airport_code": "ATL",
                  "meta.hotel_name": "ELLIS HOTEL, A TRIBUTE HOTEL BY MARRIOTT",
                  "meta.airline_name": "Sun Country Airlines",
                  "flags.missing_fields": [
                    "Ad Hoc Rate",
                    "Currency",
                    "Layover Rules",
                  ],
                  "flags.ambiguous_points": [],
                },
              ],
              meta: {
                timestamp: "2026-02-11 15:23:00",
                file_name: "ATLTE 2024 Sun Country Rate Agreement.pdf",
                run_id: "698c5180cf64ab96aa5dca59",
              },
            },
          ],
        };

        // return {
        //   status: "success",
        //   file_name: "Hotel-Airline Rate Agreement - Sample.docx",
        //   output_parsed: {
        //     meta: {
        //       document_title: "HOTEL CREW RATE AGREEMENT",
        //       station_or_airport_code: "QNM",
        //       hotel_name: "The Riverside Hotel, PQR",
        //       airline_name: "SkyFleet Airways, Inc.",
        //     },
        //     review: [
        //       {
        //         field: "Name (Parties)",
        //         // actual_content:
        //         //   "This Agreement is made between The Riverside Hotel, PQR, located at 987 Lakeview Ave, PQR 560011 (the “Hotel”) and SkyFleet Airways, Inc., located at 2410 Horizon Park, Suite 400, Austin, Texas 78701 (the “Airline”)",
        //         actual_content:
        //         "Your ordered Aadhaar PVC Card will be printed within 5 working days by UIDAI and will be handed over to India Post.",
        //         compliant: "Y",
        //         comment:
        //           "Both parties' full legal names and addresses are clearly present and properly formatted.",
        //       },
        //       {
        //         field: "Start Date",
        //         actual_content:
        //           "This Agreement shall commence on January 1, 2025.",
        //         compliant: "Y",
        //         comment: "Start date is clearly specified and unambiguous.",
        //       },
        //       {
        //         field: "End Date",
        //         actual_content: "",
        //         compliant: "N",
        //         comment:
        //           "End date is not specified. Agreement should have a clear termination date or renewal terms.",
        //       },
        //       {
        //         field: "Room Rate",
        //         actual_content:
        //           "The Hotel agrees to provide rooms at a rate of $89.00 per night for single occupancy and $99.00 for double occupancy.",
        //         compliant: "Y",
        //         comment:
        //           "Room rates are clearly specified for both single and double occupancy.",
        //       },
        //       {
        //         field: "Room Capping",
        //         actual_content: "",
        //         compliant: "N",
        //         comment:
        //           "No room capping clause found. Agreement should specify maximum number of rooms per night.",
        //       },
        //       {
        //         field: "Last Room Availability (LRA)",
        //         actual_content:
        //           "Hotel guarantees last room availability for airline crew members at the agreed rate.",
        //         compliant: "Y",
        //         comment:
        //           "LRA clause is present and guarantees availability at contracted rates.",
        //       },
        //       {
        //         field: "Payment Terms",
        //         actual_content:
        //           "Payment shall be made by the Airline within 30 days of invoice date via direct billing.",
        //         compliant: "Y",
        //         comment:
        //           "Payment terms are clearly defined with specific timeframe and method.",
        //       },
        //       {
        //         field: "Cancellation Policy",
        //         actual_content:
        //           "Cancellations must be made at least 24 hours prior to arrival to avoid charges.",
        //         compliant: "Y",
        //         comment:
        //           "Cancellation policy is clearly stated with specific timeframe.",
        //       },
        //       {
        //         field: "IROP Rates",
        //         actual_content: "",
        //         compliant: "N",
        //         comment:
        //           "No IROP (Irregular Operations) rates specified. Should include provisions for emergency/unscheduled operations.",
        //       },
        //     ],
        //     snippets: [
        //       {
        //         label: "Parties and Addresses",
        //         text: "This Agreement is made between SkyFleet Airways, Inc., a corporation organized under the laws of Delaware with its principal office at 123 Aviation Blvd, Chicago, IL 60601 (hereinafter referred to as 'Airline'), and The Riverside Hotel, PQR, located at 456 River Road, Quincy, QNM 12345 (hereinafter referred to as 'Hotel').",
        //         page_or_section: "Section 1 - Parties",
        //       },
        //       {
        //         label: "Room Rate & Reservations",
        //         text: "The Hotel agrees to provide rooms for the Airline's crew members at the following rates: Single Occupancy: $89.00 per night, Double Occupancy: $99.00 per night. These rates are inclusive of all taxes and fees. Hotel guarantees last room availability for airline crew members at the agreed rate, regardless of hotel occupancy status.",
        //         page_or_section: "Section 2(a) - Rates",
        //       },
        //       {
        //         label: "Payment and Billing",
        //         text: "Payment shall be made by the Airline within 30 days of invoice date via direct billing. The Hotel will provide itemized invoices on a monthly basis. Late payments will incur a 1.5% monthly interest charge.",
        //         page_or_section: "Section 4 - Payment Terms",
        //       },
        //       {
        //         label: "Cancellation and No-Show Policy",
        //         text: "Cancellations must be made at least 24 hours prior to the scheduled arrival time to avoid charges. No-shows will be charged for one night's accommodation. The Airline may modify or cancel reservations due to operational requirements with reasonable notice.",
        //         page_or_section: "Section 5 - Cancellations",
        //       },
        //     ],
        //     flags: {
        //       missing_fields: ["End Date", "Room Capping", "IROP Rates"],
        //       ambiguous_points: [
        //         "Agreement duration is unclear without an end date",
        //         "No provisions for rate increases or adjustments",
        //         "Emergency operations procedures not defined",
        //       ],
        //     },
        //   },
        // };
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

      // Flatten: each mockResult has { results: [...] }, client expects a flat array of BatchResult
      const flatResults = mockResults.flatMap((r: { results?: unknown[] }) => r.results ?? [r]);

      return NextResponse.json({
        status: "success",
        results: flatResults,
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


