import { ApiResponse } from "./types";

export const mockApiResponse: ApiResponse = {
  status: "success",
  ocr_session_id: "8f6848b9-eee9-4604-9ceb-bf6b4a9b0a08",
  results: [
    {
      status: "success",
      run_id: "69a00da070199a6ebe8286f4",
      file_name: "DWC - Grand Millennium Contract 2025-27 (signed).pdf",
      ocr_markdown: null,
      output_parsed: {
        meta: {
          document_title: "Grand Millennium Contract 2025",
          station_or_airport_code: "DWC",
          hotel_name: "Grand Millennium Hotel Dubai",
          airline_name: "ASL Aviation Holdings DAC",
        },
        review: [
          {
            field: "Name (Parties)",
            actual_content:
              'ASL AIRLINES France SA Adresse: 15 rue du Haut de Laval Zone Cargo 9, 95708 Roissy CDG09977939',
            compliant: "Y",
            comment: "Both parties are clearly named.",
          },
          {
            field: "Start Date",
            actual_content: "01st May 2025",
            compliant: "Y",
            comment: "Start date is explicitly stated.",
          },
          {
            field: "End Date",
            actual_content: "30th April 2027",
            compliant: "Y",
            comment: "End date is explicitly stated.",
          },
          {
            field: "Room Capping",
            actual_content:
              "Hotel shall set aside a minimum of zero (0) to a maximum of 6 rooms per night...",
            compliant: "Y",
            comment:
              "Room capping is defined with a maximum of 6 rooms per night.",
          },
          {
            field: "Ad Hoc Rate",
            actual_content: "",
            compliant: "N",
            comment:
              "No specific ad hoc rate for unscheduled bookings is mentioned.",
          },
          {
            field: "Currency",
            actual_content: "AED",
            compliant: "Y",
            comment: "Currency is clearly stated as AED.",
          },
          {
            field: "Tax Rate and Exemption",
            actual_content:
              "10% Service charge, 07% Municipal fee, 05% VAT and 20 AED tourism fee",
            compliant: "Y",
            comment: "Tax rates and components are clearly detailed.",
          },
          {
            field: "Early Check-ins and Check-outs",
            actual_content:
              "Hotel will not charge Airline for the scheduled rooms...",
            compliant: "Y",
            comment:
              "Early check-in and late check-out policies are clearly defined.",
          },
          {
            field: "Weekend/Special-Day Rates",
            actual_content: "",
            compliant: "N",
            comment: "No specific mention of weekend or special-day rates.",
          },
          {
            field: "Layover Rules",
            actual_content: "The hotel agrees to the 24-hour rule...",
            compliant: "Y",
            comment: "Layover rules are defined with a 24-hour policy.",
          },
          {
            field: "Cancellation Policy",
            actual_content:
              "Airline may cancel the rooms up until 24 hours prior to the day of arrival.",
            compliant: "Y",
            comment: "Cancellation policy is clearly stated.",
          },
          {
            field: "Additional Room Rules",
            actual_content: "Rooms must be non-smoking...",
            compliant: "Y",
            comment: "Additional room rules are specified.",
          },
          {
            field: "Commission Rate",
            actual_content: "",
            compliant: "N",
            comment: "No commission rate is mentioned.",
          },
          {
            field: "Single Room Rate",
            actual_content: "400 AED (510 AED Rate including all Taxes)",
            compliant: "Y",
            comment: "Single room rate is clearly stated.",
          },
          {
            field: "Check-In Time",
            actual_content: "",
            compliant: "N",
            comment: "Specific check-in time is not mentioned.",
          },
          {
            field: "Check-Out Time",
            actual_content: "",
            compliant: "N",
            comment: "Specific check-out time is not mentioned.",
          },
          {
            field: "Other Tax / Flat Tax",
            actual_content: "20 AED tourism fee",
            compliant: "Y",
            comment: "Flat tax is mentioned as a tourism fee.",
          },
          {
            field: "Is Contract Signed",
            actual_content:
              "Signature: Mark O'Kelly, Chief Financial Officer, ASL Aviation Holdings DAC Date: 15 May 2025",
            compliant: "Y",
            comment: "Contract is signed by the airline representative.",
          },
          {
            field: "Operational Memo",
            actual_content:
              "Airline will only pay for rooms used and only the official Airline sign-in sheet is authorized to qualify for payment.",
            compliant: "Y",
            comment: "Operational billing requirement is clearly stated.",
          },
        ],
        snippets: [
          {
            label: "Room Rate & Reservations",
            text: "400 AED (510 AED Rate including all Taxes)",
            page_or_section: "Section C",
          },
          {
            label: "Tax / Exemption / Refund",
            text: "10% Service charge, 07% Municipal fee, 05% VAT and 20 AED tourism fee",
            page_or_section: "Section C",
          },
        ],
        flags: {
          missing_fields: [
            "Ad Hoc Rate",
            "Weekend/Special-Day Rates",
            "Commission Rate",
            "Check-In Time",
            "Check-Out Time",
          ],
          ambiguous_points: [
            "No specific ad hoc rate for unscheduled bookings is mentioned.",
            "No specific mention of weekend or special-day rates.",
          ],
        },
      },
    },
  ],
};
