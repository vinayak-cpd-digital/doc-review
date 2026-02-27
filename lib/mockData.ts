export const mockApiResponse: unknown = {
  "status": "success",
  "ocr_session_id": "bbe0df32-9073-4288-8b58-4d045de727ef",
  "results": [
    {
      "status": "success",
      "run_id": "69a10eb070199a6ebe8293c3",
      "file_name": "HGH Sofitel Hangzhou Westlake contract.pdf",
      "ocr_markdown": null,
      "output_raw": "{\n  \"meta\": {\n    \"document_title\": \"HGH Sofitel Hangzhou Westlake contract\",\n    \"station_or_airport_code\": \"HGH\",\n    \"hotel_name\": \"Sofitel Hangzhou Westlake\",\n    \"airline_name\": \"ASL Aviation Holdings DAC\"\n  },\n  \"yearly_terms\": [\n    {\n      \"year\": 2023,\n      \"start_date\": \"15th January 2023\",\n      \"end_date\": \"31st December 2023\",\n      \"room_rate\": \"754.72 CNY (800.00 CNY Rate including all Taxes)\",\n      \"currency\": \"CNY\",\n      \"source_text\": \"15th Jan 2023 to 31st Dec 2025 - 754.72 CNY (800.00 CNY Rate including all Taxes)\"\n    },\n    {\n      \"year\": 2024,\n      \"start_date\": \"1st January 2024\",\n      \"end_date\": \"31st December 2024\",\n      \"room_rate\": \"754.72 CNY (800.00 CNY Rate including all Taxes)\",\n      \"currency\": \"CNY\",\n      \"source_text\": \"15th Jan 2023 to 31st Dec 2025 - 754.72 CNY (800.00 CNY Rate including all Taxes)\"\n    },\n    {\n      \"year\": 2025,\n      \"start_date\": \"1st January 2025\",\n      \"end_date\": \"31st December 2025\",\n      \"room_rate\": \"754.72 CNY (800.00 CNY Rate including all Taxes)\",\n      \"currency\": \"CNY\",\n      \"source_text\": \"15th Jan 2023 to 31st Dec 2025 - 754.72 CNY (800.00 CNY Rate including all Taxes)\"\n    }\n  ],\n  \"rate_periods\": [\n    {\n      \"period_label\": \"\",\n      \"start_date\": \"15th Jan 2023\",\n      \"end_date\": \"31st Dec 2025\",\n      \"room_rate\": \"754.72 CNY (800.00 CNY Rate including all Taxes)\",\n      \"currency\": \"CNY\",\n      \"taxes_and_fees\": \"45.28 CNY\",\n      \"source_text\": \"15th Jan 2023 to 31st Dec 2025 - 754.72 CNY (800.00 CNY Rate including all Taxes)\"\n    }\n  ],\n  \"review\": [\n    {\n      \"field\": \"Name (Parties)\",\n      \"actual_content\": \"ASL Aviation Holdings DAC VAT No IE 6381394H Registered in Ireland No 361394 and its directly or indirectly fully-owned subsidiaries: ASL Airlines Belgium SA, DBA ASL Airlines Belgium (ASLB) ASL Airlines France, DBA ASL Airlines France (ASLF) ASL Airlines Hungary Kft., Dba ASL Airlines Hungary (ASLH) ASL Airlines (Ireland) Limited, Dba ASL Airlines Ireland (ASLI) ASL Airlines Switzerland AG, Dba ASL Airlines Switzerland (ASLS) (hereinafter referred to as \\\"Airline\\\") AND Legal name of property DBA Full Address Registration (hereinafter referred to as \\\"Hotel\\\")\",\n      \"compliant\": \"Y\",\n      \"comment\": \"Both parties are named.\"\n    },\n    {\n      \"field\": \"Start Date\",\n      \"actual_content\": \"15th January 2023\",\n      \"compliant\": \"Y\",\n      \"comment\": \"Start date is explicitly stated.\"\n    },\n    {\n      \"field\": \"End Date\",\n      \"actual_content\": \"31st December 2025\",\n      \"compliant\": \"Y\",\n      \"comment\": \"End date is explicitly stated.\"\n    },\n    {\n      \"field\": \"Room Capping\",\n      \"actual_content\": \"Hotel shall set aside a yearly average of XX rooms OR a minimum of zero (0) to a maximum of 5 rooms per night, specifically for the purpose of accommodating Airline crew from 15th January 2023 to 31st December 2025, each day regardless of arrival or departure time.\",\n      \"compliant\": \"Y\",\n      \"comment\": \"Room capping is defined.\"\n    },\n    {\n      \"field\": \"Ad Hoc Rate\",\n      \"actual_content\": \"\",\n      \"compliant\": \"N\",\n      \"comment\": \"No specific ad hoc rate mentioned.\"\n    },\n    {\n      \"field\": \"Currency\",\n      \"actual_content\": \"CNY\",\n      \"compliant\": \"Y\",\n      \"comment\": \"Currency is stated as CNY.\"\n    },\n    {\n      \"field\": \"Tax Rate and Exemption\",\n      \"actual_content\": \"45.28 CNY\",\n      \"compliant\": \"Y\",\n      \"comment\": \"Tax rate is stated.\"\n    },\n    {\n      \"field\": \"Early Check-ins and Check-outs\",\n      \"actual_content\": \"Hotel will not charge Airline for the scheduled rooms being held the night prior. Hotel will not charge Airline a second day charge for rooms checking out late for evening flight departures.\",\n      \"compliant\": \"Y\",\n      \"comment\": \"Early check-in and late check-out policies are defined.\"\n    },\n    {\n      \"field\": \"Weekend/Special-Day Rates\",\n      \"actual_content\": \"\",\n      \"compliant\": \"N\",\n      \"comment\": \"No mention of different rates for weekends or special days.\"\n    },\n    {\n      \"field\": \"Layover Rules\",\n      \"actual_content\": \"\",\n      \"compliant\": \"N\",\n      \"comment\": \"No specific layover rules mentioned.\"\n    },\n    {\n      \"field\": \"Cancellation Policy\",\n      \"actual_content\": \"Airline may cancel the rooms up until 4pm on the day of arrival\",\n      \"compliant\": \"Y\",\n      \"comment\": \"Cancellation policy is defined.\"\n    },\n    {\n      \"field\": \"Additional Room Rules\",\n      \"actual_content\": \"All rooms must: i. Be between floors 2 and no higher than where local Fire Department ladders can reach and ii. in a part of the Hotel conducive to rest during day and night hours, and iii. must contain blackout shades, iron, ironing board and iv. Away from elevators, housekeeping closets, ice and vending machines, busy roads or other potentially noisy areas or activities. v. Rooms allocated to Airline will not be handicapped accessible, unless requested by the crew member. vi. Rooms must be non-smoking.\",\n      \"compliant\": \"Y\",\n      \"comment\": \"Additional room rules are defined.\"\n    },\n    {\n      \"field\": \"Commission Rate\",\n      \"actual_content\": \"\",\n      \"compliant\": \"N\",\n      \"comment\": \"No commission rate mentioned.\"\n    },\n    {\n      \"field\": \"Single Room Rate\",\n      \"actual_content\": \"754.72 CNY (800.00 CNY Rate including all Taxes)\",\n      \"compliant\": \"Y\",\n      \"comment\": \"Single room rate is clearly stated.\"\n    },\n    {\n      \"field\": \"Check-In Time\",\n      \"actual_content\": \"\",\n      \"compliant\": \"N\",\n      \"comment\": \"Check-in time not explicitly stated.\"\n    },\n    {\n      \"field\": \"Check-Out Time\",\n      \"actual_content\": \"\",\n      \"compliant\": \"N\",\n      \"comment\": \"Check-out time not explicitly stated.\"\n    },\n    {\n      \"field\": \"Other Tax / Flat Tax\",\n      \"actual_content\": \"\",\n      \"compliant\": \"N\",\n      \"comment\": \"No other tax or flat tax amount stated.\"\n    },\n    {\n      \"field\": \"Is Contract Signed\",\n      \"actual_content\": \"Signature: Moul o' Kelly\",\n      \"compliant\": \"Y\",\n      \"comment\": \"Contract is signed by Mark O'Kelly.\"\n    },\n    {\n      \"field\": \"Operational Memo\",\n      \"actual_content\": \"\",\n      \"compliant\": \"N\",\n      \"comment\": \"No explicit operational memo found.\"\n    }\n  ],\n  \"snippets\": [\n    {\n      \"label\": \"Room Rate & Reservations\",\n      \"text\": \"15th Jan 2023 to 31st Dec 2025 - 754.72 CNY (800.00 CNY Rate including all Taxes)\",\n      \"page_or_section\": \"C. Contract Pricing and Payment\"\n    },\n    {\n      \"label\": \"Tax / Exemption / Refund\",\n      \"text\": \"45.28 CNY\",\n      \"page_or_section\": \"C. Contract Pricing and Payment\"\n    },\n    {\n      \"label\": \"Term (Start/End)\",\n      \"text\": \"This Agreement shall commence 15th January 2023 to 31st December 2025 with the possibility for extension.\",\n      \"page_or_section\": \"B. Commencement and Duration\"\n    },\n    {\n      \"label\": \"Early/Late Check-in/out / Layover\",\n      \"text\": \"Hotel will not charge Airline for the scheduled rooms being held the night prior. Hotel will not charge Airline a second day charge for rooms checking out late for evening flight departures.\",\n      \"page_or_section\": \"A. Obligations\"\n    },\n    {\n      \"label\": \"Cancellation Policy\",\n      \"text\": \"Airline may cancel the rooms up until 4pm on the day of arrival\",\n      \"page_or_section\": \"A. Obligations\"\n    },\n    {\n      \"label\": \"Additional Room Rules\",\n      \"text\": \"All rooms must: i. Be between floors 2 and no higher than where local Fire Department ladders can reach and ii. in a part of the Hotel conducive to rest during day and night hours, and iii. must contain blackout shades, iron, ironing board and iv. Away from elevators, housekeeping closets, ice and vending machines, busy roads or other potentially noisy areas or activities. v. Rooms allocated to Airline will not be handicapped accessible, unless requested by the crew member. vi. Rooms must be non-smoking.\",\n      \"page_or_section\": \"A. Obligations\"\n    }\n  ],\n  \"flags\": {\n    \"missing_fields\": [\n      \"Ad Hoc Rate\",\n      \"Weekend/Special-Day Rates\",\n      \"Layover Rules\",\n      \"Commission Rate\",\n      \"Check-In Time\",\n      \"Check-Out Time\",\n      \"Other Tax / Flat Tax\",\n      \"Operational Memo\"\n    ],\n    \"ambiguous_points\": []\n  }\n}",
      "output_parsed": {
        "meta": {
          "document_title": "HGH Sofitel Hangzhou Westlake contract",
          "station_or_airport_code": "HGH",
          "hotel_name": "Sofitel Hangzhou Westlake",
          "airline_name": "ASL Aviation Holdings DAC"
        },
        "yearly_terms": [
          {
            "year": 2023,
            "start_date": "15th January 2023",
            "end_date": "31st December 2023",
            "room_rate": "754.72 CNY (800.00 CNY Rate including all Taxes)",
            "currency": "CNY",
            "source_text": "15th Jan 2023 to 31st Dec 2025 - 754.72 CNY (800.00 CNY Rate including all Taxes)"
          },
          {
            "year": 2024,
            "start_date": "1st January 2024",
            "end_date": "31st December 2024",
            "room_rate": "754.72 CNY (800.00 CNY Rate including all Taxes)",
            "currency": "CNY",
            "source_text": "15th Jan 2023 to 31st Dec 2025 - 754.72 CNY (800.00 CNY Rate including all Taxes)"
          },
          {
            "year": 2025,
            "start_date": "1st January 2025",
            "end_date": "31st December 2025",
            "room_rate": "754.72 CNY (800.00 CNY Rate including all Taxes)",
            "currency": "CNY",
            "source_text": "15th Jan 2023 to 31st Dec 2025 - 754.72 CNY (800.00 CNY Rate including all Taxes)"
          }
        ],
        "rate_periods": [
          {
            "period_label": "",
            "start_date": "15th Jan 2023",
            "end_date": "31st Dec 2025",
            "room_rate": "754.72 CNY (800.00 CNY Rate including all Taxes)",
            "currency": "CNY",
            "taxes_and_fees": "45.28 CNY",
            "source_text": "15th Jan 2023 to 31st Dec 2025 - 754.72 CNY (800.00 CNY Rate including all Taxes)"
          }
        ],
        "review": [
          {
            "field": "Name (Parties)",
            "actual_content": "ASL Aviation Holdings DAC VAT No IE 6381394H Registered in Ireland No 361394 and its directly or indirectly fully-owned subsidiaries: ASL Airlines Belgium SA, DBA ASL Airlines Belgium (ASLB) ASL Airlines France, DBA ASL Airlines France (ASLF) ASL Airlines Hungary Kft., Dba ASL Airlines Hungary (ASLH) ASL Airlines (Ireland) Limited, Dba ASL Airlines Ireland (ASLI) ASL Airlines Switzerland AG, Dba ASL Airlines Switzerland (ASLS) (hereinafter referred to as \"Airline\") AND Legal name of property DBA Full Address Registration (hereinafter referred to as \"Hotel\")",
            "compliant": "Y",
            "comment": "Both parties are named."
          },
          {
            "field": "Start Date",
            "actual_content": "15th January 2023",
            "compliant": "Y",
            "comment": "Start date is explicitly stated."
          },
          {
            "field": "End Date",
            "actual_content": "31st December 2025",
            "compliant": "Y",
            "comment": "End date is explicitly stated."
          },
          {
            "field": "Room Capping",
            "actual_content": "Hotel shall set aside a yearly average of XX rooms OR a minimum of zero (0) to a maximum of 5 rooms per night, specifically for the purpose of accommodating Airline crew from 15th January 2023 to 31st December 2025, each day regardless of arrival or departure time.",
            "compliant": "Y",
            "comment": "Room capping is defined."
          },
          {
            "field": "Ad Hoc Rate",
            "actual_content": "",
            "compliant": "N",
            "comment": "No specific ad hoc rate mentioned."
          },
          {
            "field": "Currency",
            "actual_content": "CNY",
            "compliant": "Y",
            "comment": "Currency is stated as CNY."
          },
          {
            "field": "Tax Rate and Exemption",
            "actual_content": "45.28 CNY",
            "compliant": "Y",
            "comment": "Tax rate is stated."
          },
          {
            "field": "Early Check-ins and Check-outs",
            "actual_content": "Hotel will not charge Airline for the scheduled rooms being held the night prior. Hotel will not charge Airline a second day charge for rooms checking out late for evening flight departures.",
            "compliant": "Y",
            "comment": "Early check-in and late check-out policies are defined."
          },
          {
            "field": "Weekend/Special-Day Rates",
            "actual_content": "",
            "compliant": "N",
            "comment": "No mention of different rates for weekends or special days."
          },
          {
            "field": "Layover Rules",
            "actual_content": "",
            "compliant": "N",
            "comment": "No specific layover rules mentioned."
          },
          {
            "field": "Cancellation Policy",
            "actual_content": "Airline may cancel the rooms up until 4pm on the day of arrival",
            "compliant": "Y",
            "comment": "Cancellation policy is defined."
          },
          {
            "field": "Additional Room Rules",
            "actual_content": "All rooms must: i. Be between floors 2 and no higher than where local Fire Department ladders can reach and ii. in a part of the Hotel conducive to rest during day and night hours, and iii. must contain blackout shades, iron, ironing board and iv. Away from elevators, housekeeping closets, ice and vending machines, busy roads or other potentially noisy areas or activities. v. Rooms allocated to Airline will not be handicapped accessible, unless requested by the crew member. vi. Rooms must be non-smoking.",
            "compliant": "Y",
            "comment": "Additional room rules are defined."
          },
          {
            "field": "Commission Rate",
            "actual_content": "",
            "compliant": "N",
            "comment": "No commission rate mentioned."
          },
          {
            "field": "Single Room Rate",
            "actual_content": "754.72 CNY (800.00 CNY Rate including all Taxes)",
            "compliant": "Y",
            "comment": "Single room rate is clearly stated."
          },
          {
            "field": "Check-In Time",
            "actual_content": "",
            "compliant": "N",
            "comment": "Check-in time not explicitly stated."
          },
          {
            "field": "Check-Out Time",
            "actual_content": "",
            "compliant": "N",
            "comment": "Check-out time not explicitly stated."
          },
          {
            "field": "Other Tax / Flat Tax",
            "actual_content": "",
            "compliant": "N",
            "comment": "No other tax or flat tax amount stated."
          },
          {
            "field": "Is Contract Signed",
            "actual_content": "Signature: Moul o' Kelly",
            "compliant": "Y",
            "comment": "Contract is signed by Mark O'Kelly."
          },
          {
            "field": "Operational Memo",
            "actual_content": "",
            "compliant": "N",
            "comment": "No explicit operational memo found."
          }
        ],
        "snippets": [
          {
            "label": "Room Rate & Reservations",
            "text": "15th Jan 2023 to 31st Dec 2025 - 754.72 CNY (800.00 CNY Rate including all Taxes)",
            "page_or_section": "C. Contract Pricing and Payment"
          },
          {
            "label": "Tax / Exemption / Refund",
            "text": "45.28 CNY",
            "page_or_section": "C. Contract Pricing and Payment"
          },
          {
            "label": "Term (Start/End)",
            "text": "This Agreement shall commence 15th January 2023 to 31st December 2025 with the possibility for extension.",
            "page_or_section": "B. Commencement and Duration"
          },
          {
            "label": "Early/Late Check-in/out / Layover",
            "text": "Hotel will not charge Airline for the scheduled rooms being held the night prior. Hotel will not charge Airline a second day charge for rooms checking out late for evening flight departures.",
            "page_or_section": "A. Obligations"
          },
          {
            "label": "Cancellation Policy",
            "text": "Airline may cancel the rooms up until 4pm on the day of arrival",
            "page_or_section": "A. Obligations"
          },
          {
            "label": "Additional Room Rules",
            "text": "All rooms must: i. Be between floors 2 and no higher than where local Fire Department ladders can reach and ii. in a part of the Hotel conducive to rest during day and night hours, and iii. must contain blackout shades, iron, ironing board and iv. Away from elevators, housekeeping closets, ice and vending machines, busy roads or other potentially noisy areas or activities. v. Rooms allocated to Airline will not be handicapped accessible, unless requested by the crew member. vi. Rooms must be non-smoking.",
            "page_or_section": "A. Obligations"
          }
        ],
        "flags": {
          "missing_fields": [
            "Ad Hoc Rate",
            "Weekend/Special-Day Rates",
            "Layover Rules",
            "Commission Rate",
            "Check-In Time",
            "Check-Out Time",
            "Other Tax / Flat Tax",
            "Operational Memo"
          ],
          "ambiguous_points": []
        }
      },
      "flat_rows": [
        {
          "run_id": "69a10eb070199a6ebe8293c3",
          "file_name": "HGH Sofitel Hangzhou Westlake contract.pdf",
          "timestamp": "2026-02-27 08:55:09",
          "yearly_terms": [
            {
              "year": 2023,
              "start_date": "15th January 2023",
              "end_date": "31st December 2023",
              "room_rate": "754.72 CNY (800.00 CNY Rate including all Taxes)",
              "currency": "CNY",
              "source_text": "15th Jan 2023 to 31st Dec 2025 - 754.72 CNY (800.00 CNY Rate including all Taxes)"
            },
            {
              "year": 2024,
              "start_date": "1st January 2024",
              "end_date": "31st December 2024",
              "room_rate": "754.72 CNY (800.00 CNY Rate including all Taxes)",
              "currency": "CNY",
              "source_text": "15th Jan 2023 to 31st Dec 2025 - 754.72 CNY (800.00 CNY Rate including all Taxes)"
            },
            {
              "year": 2025,
              "start_date": "1st January 2025",
              "end_date": "31st December 2025",
              "room_rate": "754.72 CNY (800.00 CNY Rate including all Taxes)",
              "currency": "CNY",
              "source_text": "15th Jan 2023 to 31st Dec 2025 - 754.72 CNY (800.00 CNY Rate including all Taxes)"
            }
          ],
          "rate_periods": [
            {
              "period_label": "",
              "start_date": "15th Jan 2023",
              "end_date": "31st Dec 2025",
              "room_rate": "754.72 CNY (800.00 CNY Rate including all Taxes)",
              "currency": "CNY",
              "taxes_and_fees": "45.28 CNY",
              "source_text": "15th Jan 2023 to 31st Dec 2025 - 754.72 CNY (800.00 CNY Rate including all Taxes)"
            }
          ],
          "review": [
            {
              "field": "Name (Parties)",
              "actual_content": "ASL Aviation Holdings DAC VAT No IE 6381394H Registered in Ireland No 361394 and its directly or indirectly fully-owned subsidiaries: ASL Airlines Belgium SA, DBA ASL Airlines Belgium (ASLB) ASL Airlines France, DBA ASL Airlines France (ASLF) ASL Airlines Hungary Kft., Dba ASL Airlines Hungary (ASLH) ASL Airlines (Ireland) Limited, Dba ASL Airlines Ireland (ASLI) ASL Airlines Switzerland AG, Dba ASL Airlines Switzerland (ASLS) (hereinafter referred to as \"Airline\") AND Legal name of property DBA Full Address Registration (hereinafter referred to as \"Hotel\")",
              "compliant": "Y",
              "comment": "Both parties are named."
            },
            {
              "field": "Start Date",
              "actual_content": "15th January 2023",
              "compliant": "Y",
              "comment": "Start date is explicitly stated."
            },
            {
              "field": "End Date",
              "actual_content": "31st December 2025",
              "compliant": "Y",
              "comment": "End date is explicitly stated."
            },
            {
              "field": "Room Capping",
              "actual_content": "Hotel shall set aside a yearly average of XX rooms OR a minimum of zero (0) to a maximum of 5 rooms per night, specifically for the purpose of accommodating Airline crew from 15th January 2023 to 31st December 2025, each day regardless of arrival or departure time.",
              "compliant": "Y",
              "comment": "Room capping is defined."
            },
            {
              "field": "Ad Hoc Rate",
              "actual_content": "",
              "compliant": "N",
              "comment": "No specific ad hoc rate mentioned."
            },
            {
              "field": "Currency",
              "actual_content": "CNY",
              "compliant": "Y",
              "comment": "Currency is stated as CNY."
            },
            {
              "field": "Tax Rate and Exemption",
              "actual_content": "45.28 CNY",
              "compliant": "Y",
              "comment": "Tax rate is stated."
            },
            {
              "field": "Early Check-ins and Check-outs",
              "actual_content": "Hotel will not charge Airline for the scheduled rooms being held the night prior. Hotel will not charge Airline a second day charge for rooms checking out late for evening flight departures.",
              "compliant": "Y",
              "comment": "Early check-in and late check-out policies are defined."
            },
            {
              "field": "Weekend/Special-Day Rates",
              "actual_content": "",
              "compliant": "N",
              "comment": "No mention of different rates for weekends or special days."
            },
            {
              "field": "Layover Rules",
              "actual_content": "",
              "compliant": "N",
              "comment": "No specific layover rules mentioned."
            },
            {
              "field": "Cancellation Policy",
              "actual_content": "Airline may cancel the rooms up until 4pm on the day of arrival",
              "compliant": "Y",
              "comment": "Cancellation policy is defined."
            },
            {
              "field": "Additional Room Rules",
              "actual_content": "All rooms must: i. Be between floors 2 and no higher than where local Fire Department ladders can reach and ii. in a part of the Hotel conducive to rest during day and night hours, and iii. must contain blackout shades, iron, ironing board and iv. Away from elevators, housekeeping closets, ice and vending machines, busy roads or other potentially noisy areas or activities. v. Rooms allocated to Airline will not be handicapped accessible, unless requested by the crew member. vi. Rooms must be non-smoking.",
              "compliant": "Y",
              "comment": "Additional room rules are defined."
            },
            {
              "field": "Commission Rate",
              "actual_content": "",
              "compliant": "N",
              "comment": "No commission rate mentioned."
            },
            {
              "field": "Single Room Rate",
              "actual_content": "754.72 CNY (800.00 CNY Rate including all Taxes)",
              "compliant": "Y",
              "comment": "Single room rate is clearly stated."
            },
            {
              "field": "Check-In Time",
              "actual_content": "",
              "compliant": "N",
              "comment": "Check-in time not explicitly stated."
            },
            {
              "field": "Check-Out Time",
              "actual_content": "",
              "compliant": "N",
              "comment": "Check-out time not explicitly stated."
            },
            {
              "field": "Other Tax / Flat Tax",
              "actual_content": "",
              "compliant": "N",
              "comment": "No other tax or flat tax amount stated."
            },
            {
              "field": "Is Contract Signed",
              "actual_content": "Signature: Moul o' Kelly",
              "compliant": "Y",
              "comment": "Contract is signed by Mark O'Kelly."
            },
            {
              "field": "Operational Memo",
              "actual_content": "",
              "compliant": "N",
              "comment": "No explicit operational memo found."
            }
          ],
          "snippets": [
            {
              "label": "Room Rate & Reservations",
              "text": "15th Jan 2023 to 31st Dec 2025 - 754.72 CNY (800.00 CNY Rate including all Taxes)",
              "page_or_section": "C. Contract Pricing and Payment"
            },
            {
              "label": "Tax / Exemption / Refund",
              "text": "45.28 CNY",
              "page_or_section": "C. Contract Pricing and Payment"
            },
            {
              "label": "Term (Start/End)",
              "text": "This Agreement shall commence 15th January 2023 to 31st December 2025 with the possibility for extension.",
              "page_or_section": "B. Commencement and Duration"
            },
            {
              "label": "Early/Late Check-in/out / Layover",
              "text": "Hotel will not charge Airline for the scheduled rooms being held the night prior. Hotel will not charge Airline a second day charge for rooms checking out late for evening flight departures.",
              "page_or_section": "A. Obligations"
            },
            {
              "label": "Cancellation Policy",
              "text": "Airline may cancel the rooms up until 4pm on the day of arrival",
              "page_or_section": "A. Obligations"
            },
            {
              "label": "Additional Room Rules",
              "text": "All rooms must: i. Be between floors 2 and no higher than where local Fire Department ladders can reach and ii. in a part of the Hotel conducive to rest during day and night hours, and iii. must contain blackout shades, iron, ironing board and iv. Away from elevators, housekeeping closets, ice and vending machines, busy roads or other potentially noisy areas or activities. v. Rooms allocated to Airline will not be handicapped accessible, unless requested by the crew member. vi. Rooms must be non-smoking.",
              "page_or_section": "A. Obligations"
            }
          ],
          "meta.document_title": "HGH Sofitel Hangzhou Westlake contract",
          "meta.station_or_airport_code": "HGH",
          "meta.hotel_name": "Sofitel Hangzhou Westlake",
          "meta.airline_name": "ASL Aviation Holdings DAC",
          "flags.missing_fields": [
            "Ad Hoc Rate",
            "Weekend/Special-Day Rates",
            "Layover Rules",
            "Commission Rate",
            "Check-In Time",
            "Check-Out Time",
            "Other Tax / Flat Tax",
            "Operational Memo"
          ],
          "flags.ambiguous_points": []
        }
      ],
      "meta": {
        "timestamp": "2026-02-27 08:55:09",
        "file_name": "HGH Sofitel Hangzhou Westlake contract.pdf",
        "run_id": "69a10eb070199a6ebe8293c3"
      }
    },
    {
      "status": "success",
      "run_id": "69a10ea870199a6ebe8293c1",
      "file_name": "ASLF - FSP Hotel Contract 2025.pdf",
      "ocr_markdown": null,
      "output_raw": "{\n  \"meta\": {\n    \"document_title\": \"FSP Hotel Contract 2025\",\n    \"station_or_airport_code\": null,\n    \"hotel_name\": \"Les Terrasses du Port\",\n    \"airline_name\": \"ASL AIRLINES France SA\"\n  },\n  \"yearly_terms\": [\n    {\n      \"year\": 2025,\n      \"start_date\": \"1er janvier 2025\",\n      \"end_date\": \"31 décembre 2025\",\n      \"room_rate\": \"100€\",\n      \"currency\": \"€\",\n      \"source_text\": \"Le présent contrat prendra effet à sa date de signature, et couvrira la période 1er janvier 2025 au 31 décembre 2025.\"\n    }\n  ],\n  \"rate_periods\": [\n    {\n      \"period_label\": \"\",\n      \"start_date\": \"1er janvier 2025\",\n      \"end_date\": \"31 décembre 2025\",\n      \"room_rate\": \"100€\",\n      \"currency\": \"€\",\n      \"taxes_and_fees\": \"5% du montant du prix de la chambre\",\n      \"source_text\": \"Le tarif proposé par l'Hôtel Les Terrasses du port à ASL AIRLINE est de 100€. Les tarifs sont des tarifs nets TTC. Depuis le 1er Janvier 2023, une taxe de séjour est applicable sur l'archipel de Saint-Pierre et Miquelon. Elle correspond à 5% du montant du prix de la chambre.\"\n    }\n  ],\n  \"review\": [\n    {\n      \"field\": \"Name (Parties)\",\n      \"actual_content\": \"Le présent contrat est établi entre l'Hôtel Les Terrasses du Port et ASL AIRLINES.\",\n      \"compliant\": \"Y\",\n      \"comment\": \"Both parties are clearly stated.\"\n    },\n    {\n      \"field\": \"Start Date\",\n      \"actual_content\": \"1er janvier 2025\",\n      \"compliant\": \"Y\",\n      \"comment\": \"Start date is explicitly mentioned.\"\n    },\n    {\n      \"field\": \"End Date\",\n      \"actual_content\": \"31 décembre 2025\",\n      \"compliant\": \"Y\",\n      \"comment\": \"End date is explicitly mentioned.\"\n    },\n    {\n      \"field\": \"Room Capping\",\n      \"actual_content\": \"Le volume annuel estimé des chambres prévues par le présent contrat est de 77 chambres, pour l'année 2025.\",\n      \"compliant\": \"Y\",\n      \"comment\": \"Room capping is clearly defined.\"\n    },\n    {\n      \"field\": \"Ad Hoc Rate\",\n      \"actual_content\": \"\",\n      \"compliant\": \"N\",\n      \"comment\": \"No ad hoc rate mentioned.\"\n    },\n    {\n      \"field\": \"Currency\",\n      \"actual_content\": \"€\",\n      \"compliant\": \"Y\",\n      \"comment\": \"Currency is clearly stated as Euro.\"\n    },\n    {\n      \"field\": \"Tax Rate and Exemption\",\n      \"actual_content\": \"Depuis le 1er Janvier 2023, une taxe de séjour est applicable sur l'archipel de Saint-Pierre et Miquelon. Elle correspond à 5% du montant du prix de la chambre.\",\n      \"compliant\": \"Y\",\n      \"comment\": \"Tax rate and application are clearly defined.\"\n    },\n    {\n      \"field\": \"Early Check-ins and Check-outs\",\n      \"actual_content\": \"\",\n      \"compliant\": \"N\",\n      \"comment\": \"No specific early/late check-in/out policy mentioned.\"\n    },\n    {\n      \"field\": \"Weekend/Special-Day Rates\",\n      \"actual_content\": \"\",\n      \"compliant\": \"N\",\n      \"comment\": \"No mention of different rates for weekends or special days.\"\n    },\n    {\n      \"field\": \"Layover Rules\",\n      \"actual_content\": \"\",\n      \"compliant\": \"N\",\n      \"comment\": \"No specific layover rules mentioned.\"\n    },\n    {\n      \"field\": \"Cancellation Policy\",\n      \"actual_content\": \"ASL AIRLINES confirmera par e-mail toute demande d'annulation de chambre avant 16h le jour de l'arrivée de l'équipage. Aucune pénalité ne sera facturée.\",\n      \"compliant\": \"Y\",\n      \"comment\": \"Cancellation policy is clearly defined.\"\n    },\n    {\n      \"field\": \"Additional Room Rules\",\n      \"actual_content\": \"\",\n      \"compliant\": \"N\",\n      \"comment\": \"No additional room rules mentioned.\"\n    },\n    {\n      \"field\": \"Commission Rate\",\n      \"actual_content\": \"La commission convenue est de 10%.\",\n      \"compliant\": \"Y\",\n      \"comment\": \"Commission rate is clearly stated.\"\n    },\n    {\n      \"field\": \"Single Room Rate\",\n      \"actual_content\": \"Le tarif proposé par l'Hôtel Les Terrasses du port à ASL AIRLINE est de 100€.\",\n      \"compliant\": \"Y\",\n      \"comment\": \"Single room rate is clearly stated.\"\n    },\n    {\n      \"field\": \"Check-In Time\",\n      \"actual_content\": \"\",\n      \"compliant\": \"N\",\n      \"comment\": \"No check-in time mentioned.\"\n    },\n    {\n      \"field\": \"Check-Out Time\",\n      \"actual_content\": \"\",\n      \"compliant\": \"N\",\n      \"comment\": \"No check-out time mentioned.\"\n    },\n    {\n      \"field\": \"Other Tax / Flat Tax\",\n      \"actual_content\": \"\",\n      \"compliant\": \"N\",\n      \"comment\": \"No other tax or flat tax mentioned.\"\n    },\n    {\n      \"field\": \"Is Contract Signed\",\n      \"actual_content\": \"Signature: illegible Readable Text: Pour l'hôtel, GRASSES DU PORT * SAINT-PIERRE ET MIQUELON, Quartier des Graves, BP 481, www.tdpspm.com, Tél. 05.08.41.17.00 A circular blue stamp partially overlaps an illegible blue signature, both positioned below the text \\\"Pour l'hôtel,\\\". Signature: legible Pour ASL AIRLINES Mark O'Kelly Chief Financial Officer ASL Aviation Holdings DAC A handwritten signature appears above the printed name \\\"Mark O'Kelly\\\" and his title, all centered on the page.\",\n      \"compliant\": \"Y\",\n      \"comment\": \"Contract is signed by both parties.\"\n    },\n    {\n      \"field\": \"Operational Memo\",\n      \"actual_content\": \"\",\n      \"compliant\": \"N\",\n      \"comment\": \"No specific operational memo mentioned.\"\n    }\n  ],\n  \"snippets\": [\n    {\n      \"label\": \"Room Rate & Reservations\",\n      \"text\": \"Le tarif proposé par l'Hôtel Les Terrasses du port à ASL AIRLINE est de 100€. Les tarifs sont des tarifs nets TTC.\",\n      \"page_or_section\": \"2°) PRIX DE VENTE\"\n    },\n    {\n      \"label\": \"Tax / Exemption / Refund\",\n      \"text\": \"Depuis le 1er Janvier 2023, une taxe de séjour est applicable sur l'archipel de Saint-Pierre et Miquelon. Elle correspond à 5% du montant du prix de la chambre.\",\n      \"page_or_section\": \"2°) PRIX DE VENTE\"\n    },\n    {\n      \"label\": \"Term (Start/End)\",\n      \"text\": \"Le présent contrat prendra effet à sa date de signature, et couvrira la période 1er janvier 2025 au 31 décembre 2025.\",\n      \"page_or_section\": \"9°) DURÉE\"\n    },\n    {\n      \"label\": \"Early/Late Check-in/out / Layover\",\n      \"text\": \"\",\n      \"page_or_section\": \"\"\n    },\n    {\n      \"label\": \"Cancellation Policy\",\n      \"text\": \"ASL AIRLINES confirmera par e-mail toute demande d'annulation de chambre avant 16h le jour de l'arrivée de l'équipage. Aucune pénalité ne sera facturée.\",\n      \"page_or_section\": \"5°) CONDITIONS D'ANNULATION\"\n    },\n    {\n      \"label\": \"Additional Room Rules\",\n      \"text\": \"\",\n      \"page_or_section\": \"\"\n    }\n  ],\n  \"flags\": {\n    \"missing_fields\": [\n      \"Ad Hoc Rate\",\n      \"Early Check-ins and Check-outs\",\n      \"Weekend/Special-Day Rates\",\n      \"Layover Rules\",\n      \"Additional Room Rules\",\n      \"Check-In Time\",\n      \"Check-Out Time\",\n      \"Other Tax / Flat Tax\",\n      \"Operational Memo\"\n    ],\n    \"ambiguous_points\": []\n  }\n}",
      "output_parsed": {
        "meta": {
          "document_title": "FSP Hotel Contract 2025",
          "station_or_airport_code": null,
          "hotel_name": "Les Terrasses du Port",
          "airline_name": "ASL AIRLINES France SA"
        },
        "yearly_terms": [
          {
            "year": 2025,
            "start_date": "1er janvier 2025",
            "end_date": "31 décembre 2025",
            "room_rate": "100€",
            "currency": "€",
            "source_text": "Le présent contrat prendra effet à sa date de signature, et couvrira la période 1er janvier 2025 au 31 décembre 2025."
          }
        ],
        "rate_periods": [
          {
            "period_label": "",
            "start_date": "1er janvier 2025",
            "end_date": "31 décembre 2025",
            "room_rate": "100€",
            "currency": "€",
            "taxes_and_fees": "5% du montant du prix de la chambre",
            "source_text": "Le tarif proposé par l'Hôtel Les Terrasses du port à ASL AIRLINE est de 100€. Les tarifs sont des tarifs nets TTC. Depuis le 1er Janvier 2023, une taxe de séjour est applicable sur l'archipel de Saint-Pierre et Miquelon. Elle correspond à 5% du montant du prix de la chambre."
          }
        ],
        "review": [
          {
            "field": "Name (Parties)",
            "actual_content": "Le présent contrat est établi entre l'Hôtel Les Terrasses du Port et ASL AIRLINES.",
            "compliant": "Y",
            "comment": "Both parties are clearly stated."
          },
          {
            "field": "Start Date",
            "actual_content": "1er janvier 2025",
            "compliant": "Y",
            "comment": "Start date is explicitly mentioned."
          },
          {
            "field": "End Date",
            "actual_content": "31 décembre 2025",
            "compliant": "Y",
            "comment": "End date is explicitly mentioned."
          },
          {
            "field": "Room Capping",
            "actual_content": "Le volume annuel estimé des chambres prévues par le présent contrat est de 77 chambres, pour l'année 2025.",
            "compliant": "Y",
            "comment": "Room capping is clearly defined."
          },
          {
            "field": "Ad Hoc Rate",
            "actual_content": "",
            "compliant": "N",
            "comment": "No ad hoc rate mentioned."
          },
          {
            "field": "Currency",
            "actual_content": "€",
            "compliant": "Y",
            "comment": "Currency is clearly stated as Euro."
          },
          {
            "field": "Tax Rate and Exemption",
            "actual_content": "Depuis le 1er Janvier 2023, une taxe de séjour est applicable sur l'archipel de Saint-Pierre et Miquelon. Elle correspond à 5% du montant du prix de la chambre.",
            "compliant": "Y",
            "comment": "Tax rate and application are clearly defined."
          },
          {
            "field": "Early Check-ins and Check-outs",
            "actual_content": "",
            "compliant": "N",
            "comment": "No specific early/late check-in/out policy mentioned."
          },
          {
            "field": "Weekend/Special-Day Rates",
            "actual_content": "",
            "compliant": "N",
            "comment": "No mention of different rates for weekends or special days."
          },
          {
            "field": "Layover Rules",
            "actual_content": "",
            "compliant": "N",
            "comment": "No specific layover rules mentioned."
          },
          {
            "field": "Cancellation Policy",
            "actual_content": "ASL AIRLINES confirmera par e-mail toute demande d'annulation de chambre avant 16h le jour de l'arrivée de l'équipage. Aucune pénalité ne sera facturée.",
            "compliant": "Y",
            "comment": "Cancellation policy is clearly defined."
          },
          {
            "field": "Additional Room Rules",
            "actual_content": "",
            "compliant": "N",
            "comment": "No additional room rules mentioned."
          },
          {
            "field": "Commission Rate",
            "actual_content": "La commission convenue est de 10%.",
            "compliant": "Y",
            "comment": "Commission rate is clearly stated."
          },
          {
            "field": "Single Room Rate",
            "actual_content": "Le tarif proposé par l'Hôtel Les Terrasses du port à ASL AIRLINE est de 100€.",
            "compliant": "Y",
            "comment": "Single room rate is clearly stated."
          },
          {
            "field": "Check-In Time",
            "actual_content": "",
            "compliant": "N",
            "comment": "No check-in time mentioned."
          },
          {
            "field": "Check-Out Time",
            "actual_content": "",
            "compliant": "N",
            "comment": "No check-out time mentioned."
          },
          {
            "field": "Other Tax / Flat Tax",
            "actual_content": "",
            "compliant": "N",
            "comment": "No other tax or flat tax mentioned."
          },
          {
            "field": "Is Contract Signed",
            "actual_content": "Signature: illegible Readable Text: Pour l'hôtel, GRASSES DU PORT * SAINT-PIERRE ET MIQUELON, Quartier des Graves, BP 481, www.tdpspm.com, Tél. 05.08.41.17.00 A circular blue stamp partially overlaps an illegible blue signature, both positioned below the text \"Pour l'hôtel,\". Signature: legible Pour ASL AIRLINES Mark O'Kelly Chief Financial Officer ASL Aviation Holdings DAC A handwritten signature appears above the printed name \"Mark O'Kelly\" and his title, all centered on the page.",
            "compliant": "Y",
            "comment": "Contract is signed by both parties."
          },
          {
            "field": "Operational Memo",
            "actual_content": "",
            "compliant": "N",
            "comment": "No specific operational memo mentioned."
          }
        ],
        "snippets": [
          {
            "label": "Room Rate & Reservations",
            "text": "Le tarif proposé par l'Hôtel Les Terrasses du port à ASL AIRLINE est de 100€. Les tarifs sont des tarifs nets TTC.",
            "page_or_section": "2°) PRIX DE VENTE"
          },
          {
            "label": "Tax / Exemption / Refund",
            "text": "Depuis le 1er Janvier 2023, une taxe de séjour est applicable sur l'archipel de Saint-Pierre et Miquelon. Elle correspond à 5% du montant du prix de la chambre.",
            "page_or_section": "2°) PRIX DE VENTE"
          },
          {
            "label": "Term (Start/End)",
            "text": "Le présent contrat prendra effet à sa date de signature, et couvrira la période 1er janvier 2025 au 31 décembre 2025.",
            "page_or_section": "9°) DURÉE"
          },
          {
            "label": "Early/Late Check-in/out / Layover",
            "text": "",
            "page_or_section": ""
          },
          {
            "label": "Cancellation Policy",
            "text": "ASL AIRLINES confirmera par e-mail toute demande d'annulation de chambre avant 16h le jour de l'arrivée de l'équipage. Aucune pénalité ne sera facturée.",
            "page_or_section": "5°) CONDITIONS D'ANNULATION"
          },
          {
            "label": "Additional Room Rules",
            "text": "",
            "page_or_section": ""
          }
        ],
        "flags": {
          "missing_fields": [
            "Ad Hoc Rate",
            "Early Check-ins and Check-outs",
            "Weekend/Special-Day Rates",
            "Layover Rules",
            "Additional Room Rules",
            "Check-In Time",
            "Check-Out Time",
            "Other Tax / Flat Tax",
            "Operational Memo"
          ],
          "ambiguous_points": []
        }
      },
      "flat_rows": [
        {
          "run_id": "69a10ea870199a6ebe8293c1",
          "file_name": "ASLF - FSP Hotel Contract 2025.pdf",
          "timestamp": "2026-02-27 08:55:09",
          "yearly_terms": [
            {
              "year": 2025,
              "start_date": "1er janvier 2025",
              "end_date": "31 décembre 2025",
              "room_rate": "100€",
              "currency": "€",
              "source_text": "Le présent contrat prendra effet à sa date de signature, et couvrira la période 1er janvier 2025 au 31 décembre 2025."
            }
          ],
          "rate_periods": [
            {
              "period_label": "",
              "start_date": "1er janvier 2025",
              "end_date": "31 décembre 2025",
              "room_rate": "100€",
              "currency": "€",
              "taxes_and_fees": "5% du montant du prix de la chambre",
              "source_text": "Le tarif proposé par l'Hôtel Les Terrasses du port à ASL AIRLINE est de 100€. Les tarifs sont des tarifs nets TTC. Depuis le 1er Janvier 2023, une taxe de séjour est applicable sur l'archipel de Saint-Pierre et Miquelon. Elle correspond à 5% du montant du prix de la chambre."
            }
          ],
          "review": [
            {
              "field": "Name (Parties)",
              "actual_content": "Le présent contrat est établi entre l'Hôtel Les Terrasses du Port et ASL AIRLINES.",
              "compliant": "Y",
              "comment": "Both parties are clearly stated."
            },
            {
              "field": "Start Date",
              "actual_content": "1er janvier 2025",
              "compliant": "Y",
              "comment": "Start date is explicitly mentioned."
            },
            {
              "field": "End Date",
              "actual_content": "31 décembre 2025",
              "compliant": "Y",
              "comment": "End date is explicitly mentioned."
            },
            {
              "field": "Room Capping",
              "actual_content": "Le volume annuel estimé des chambres prévues par le présent contrat est de 77 chambres, pour l'année 2025.",
              "compliant": "Y",
              "comment": "Room capping is clearly defined."
            },
            {
              "field": "Ad Hoc Rate",
              "actual_content": "",
              "compliant": "N",
              "comment": "No ad hoc rate mentioned."
            },
            {
              "field": "Currency",
              "actual_content": "€",
              "compliant": "Y",
              "comment": "Currency is clearly stated as Euro."
            },
            {
              "field": "Tax Rate and Exemption",
              "actual_content": "Depuis le 1er Janvier 2023, une taxe de séjour est applicable sur l'archipel de Saint-Pierre et Miquelon. Elle correspond à 5% du montant du prix de la chambre.",
              "compliant": "Y",
              "comment": "Tax rate and application are clearly defined."
            },
            {
              "field": "Early Check-ins and Check-outs",
              "actual_content": "",
              "compliant": "N",
              "comment": "No specific early/late check-in/out policy mentioned."
            },
            {
              "field": "Weekend/Special-Day Rates",
              "actual_content": "",
              "compliant": "N",
              "comment": "No mention of different rates for weekends or special days."
            },
            {
              "field": "Layover Rules",
              "actual_content": "",
              "compliant": "N",
              "comment": "No specific layover rules mentioned."
            },
            {
              "field": "Cancellation Policy",
              "actual_content": "ASL AIRLINES confirmera par e-mail toute demande d'annulation de chambre avant 16h le jour de l'arrivée de l'équipage. Aucune pénalité ne sera facturée.",
              "compliant": "Y",
              "comment": "Cancellation policy is clearly defined."
            },
            {
              "field": "Additional Room Rules",
              "actual_content": "",
              "compliant": "N",
              "comment": "No additional room rules mentioned."
            },
            {
              "field": "Commission Rate",
              "actual_content": "La commission convenue est de 10%.",
              "compliant": "Y",
              "comment": "Commission rate is clearly stated."
            },
            {
              "field": "Single Room Rate",
              "actual_content": "Le tarif proposé par l'Hôtel Les Terrasses du port à ASL AIRLINE est de 100€.",
              "compliant": "Y",
              "comment": "Single room rate is clearly stated."
            },
            {
              "field": "Check-In Time",
              "actual_content": "",
              "compliant": "N",
              "comment": "No check-in time mentioned."
            },
            {
              "field": "Check-Out Time",
              "actual_content": "",
              "compliant": "N",
              "comment": "No check-out time mentioned."
            },
            {
              "field": "Other Tax / Flat Tax",
              "actual_content": "",
              "compliant": "N",
              "comment": "No other tax or flat tax mentioned."
            },
            {
              "field": "Is Contract Signed",
              "actual_content": "Signature: illegible Readable Text: Pour l'hôtel, GRASSES DU PORT * SAINT-PIERRE ET MIQUELON, Quartier des Graves, BP 481, www.tdpspm.com, Tél. 05.08.41.17.00 A circular blue stamp partially overlaps an illegible blue signature, both positioned below the text \"Pour l'hôtel,\". Signature: legible Pour ASL AIRLINES Mark O'Kelly Chief Financial Officer ASL Aviation Holdings DAC A handwritten signature appears above the printed name \"Mark O'Kelly\" and his title, all centered on the page.",
              "compliant": "Y",
              "comment": "Contract is signed by both parties."
            },
            {
              "field": "Operational Memo",
              "actual_content": "",
              "compliant": "N",
              "comment": "No specific operational memo mentioned."
            }
          ],
          "snippets": [
            {
              "label": "Room Rate & Reservations",
              "text": "Le tarif proposé par l'Hôtel Les Terrasses du port à ASL AIRLINE est de 100€. Les tarifs sont des tarifs nets TTC.",
              "page_or_section": "2°) PRIX DE VENTE"
            },
            {
              "label": "Tax / Exemption / Refund",
              "text": "Depuis le 1er Janvier 2023, une taxe de séjour est applicable sur l'archipel de Saint-Pierre et Miquelon. Elle correspond à 5% du montant du prix de la chambre.",
              "page_or_section": "2°) PRIX DE VENTE"
            },
            {
              "label": "Term (Start/End)",
              "text": "Le présent contrat prendra effet à sa date de signature, et couvrira la période 1er janvier 2025 au 31 décembre 2025.",
              "page_or_section": "9°) DURÉE"
            },
            {
              "label": "Early/Late Check-in/out / Layover",
              "text": "",
              "page_or_section": ""
            },
            {
              "label": "Cancellation Policy",
              "text": "ASL AIRLINES confirmera par e-mail toute demande d'annulation de chambre avant 16h le jour de l'arrivée de l'équipage. Aucune pénalité ne sera facturée.",
              "page_or_section": "5°) CONDITIONS D'ANNULATION"
            },
            {
              "label": "Additional Room Rules",
              "text": "",
              "page_or_section": ""
            }
          ],
          "meta.document_title": "FSP Hotel Contract 2025",
          "meta.station_or_airport_code": null,
          "meta.hotel_name": "Les Terrasses du Port",
          "meta.airline_name": "ASL AIRLINES France SA",
          "flags.missing_fields": [
            "Ad Hoc Rate",
            "Early Check-ins and Check-outs",
            "Weekend/Special-Day Rates",
            "Layover Rules",
            "Additional Room Rules",
            "Check-In Time",
            "Check-Out Time",
            "Other Tax / Flat Tax",
            "Operational Memo"
          ],
          "flags.ambiguous_points": []
        }
      ],
      "meta": {
        "timestamp": "2026-02-27 08:55:09",
        "file_name": "ASLF - FSP Hotel Contract 2025.pdf",
        "run_id": "69a10ea870199a6ebe8293c1"
      }
    },
    {
      "status": "success",
      "run_id": "69a10eb270199a6ebe8293c7",
      "file_name": "DWC - Grand Millennium Contract 2025-27 (signed).pdf",
      "ocr_markdown": null,
      "output_raw": "{\n  \"meta\": {\n    \"document_title\": \"Grand Millennium Contract 2025\",\n    \"station_or_airport_code\": \"DWC\",\n    \"hotel_name\": \"Grand Millennium Hotel Dubai\",\n    \"airline_name\": \"ASL Aviation Holdings DAC\"\n  },\n  \"yearly_terms\": [\n    {\n      \"year\": 2025,\n      \"start_date\": \"01st May 2025\",\n      \"end_date\": \"31st December 2025\",\n      \"room_rate\": \"400 AED (510 AED Rate including all Taxes)\",\n      \"currency\": \"AED\",\n      \"source_text\": \"Year 1 & 2 (01st May 2025 to 30th April 2027) 400 AED (510 AED Rate including all Taxes)\"\n    },\n    {\n      \"year\": 2026,\n      \"start_date\": \"01st January 2026\",\n      \"end_date\": \"31st December 2026\",\n      \"room_rate\": \"400 AED (510 AED Rate including all Taxes)\",\n      \"currency\": \"AED\",\n      \"source_text\": \"Year 1 & 2 (01st May 2025 to 30th April 2027) 400 AED (510 AED Rate including all Taxes)\"\n    },\n    {\n      \"year\": 2027,\n      \"start_date\": \"01st January 2027\",\n      \"end_date\": \"30th April 2027\",\n      \"room_rate\": \"400 AED (510 AED Rate including all Taxes)\",\n      \"currency\": \"AED\",\n      \"source_text\": \"Year 1 & 2 (01st May 2025 to 30th April 2027) 400 AED (510 AED Rate including all Taxes)\"\n    }\n  ],\n  \"rate_periods\": [\n    {\n      \"period_label\": \"\",\n      \"start_date\": \"01st May 2025\",\n      \"end_date\": \"30th April 2027\",\n      \"room_rate\": \"400 AED (510 AED Rate including all Taxes)\",\n      \"currency\": \"AED\",\n      \"taxes_and_fees\": \"10% Service charge, 07% Municipal fee, 05% VAT and 20 AED tourism fee\",\n      \"source_text\": \"Year 1 & 2 (01st May 2025 to 30th April 2027) 400 AED (510 AED Rate including all Taxes)\"\n    }\n  ],\n  \"review\": [\n    {\n      \"field\": \"Name (Parties)\",\n      \"actual_content\": \"ASL Aviation Holdings DAC VAT No IE 6381394H Registered in Ireland No 361394 and its directly or indirectly fully-owned subsidiaries: ASL Airlines Belgium SA, DBA ASL Airlines Belgium (ASLB) ASL Airlines France, DBA ASL Airlines France (ASLF) ASL Airlines Hungary Kft., Dba ASL Airlines Hungary (ASLH). ASL Airlines (Ireland) Limited, Dba ASL Airlines Ireland (ASLI) ASL Airlines Switzerland AG, Dba ASL Airlines Switzerland (ASLS) (hereinafter referred to as \\\"Airline\\\")\\\" AND GRAND MILLENNIUM HOTEL DUBAI (FZ) DBA # 561456349 Sheikh Zayed Road, Exit 36 Registration # 2071053 (hereinafter referred to as \\\"Hotel\\\")\",\n      \"compliant\": \"Y\",\n      \"comment\": \"Parties are clearly defined.\"\n    },\n    {\n      \"field\": \"Start Date\",\n      \"actual_content\": \"01st May 2025\",\n      \"compliant\": \"Y\",\n      \"comment\": \"Start date is clearly defined.\"\n    },\n    {\n      \"field\": \"End Date\",\n      \"actual_content\": \"30th April 2027\",\n      \"compliant\": \"Y\",\n      \"comment\": \"End date is clearly defined.\"\n    },\n    {\n      \"field\": \"Room Capping\",\n      \"actual_content\": \"Hotel shall set aside a minimum of zero (0) to a maximum of 6 rooms per night, specifically for the purpose of accommodating Airline crew from 01st May 2025 to 30th April 2027, each day regardless of arrival or departure time.\",\n      \"compliant\": \"Y\",\n      \"comment\": \"Room capping is clearly defined.\"\n    },\n    {\n      \"field\": \"Ad Hoc Rate\",\n      \"actual_content\": \"\",\n      \"compliant\": \"N\",\n      \"comment\": \"Ad Hoc Rate is not explicitly mentioned.\"\n    },\n    {\n      \"field\": \"Currency\",\n      \"actual_content\": \"AED\",\n      \"compliant\": \"Y\",\n      \"comment\": \"Currency is clearly defined.\"\n    },\n    {\n      \"field\": \"Tax Rate and Exemption\",\n      \"actual_content\": \"10% Service charge, 07% Municipal fee, 05% VAT and 20 AED tourism fee\",\n      \"compliant\": \"Y\",\n      \"comment\": \"Tax rates and fees are clearly defined.\"\n    },\n    {\n      \"field\": \"Early Check-ins and Check-outs\",\n      \"actual_content\": \"Hotel will not charge Airline for the scheduled rooms being held the night prior. Hotel will not charge Airline a second day charge for rooms checking out late for evening flight departures.\",\n      \"compliant\": \"Y\",\n      \"comment\": \"Early and late check-in/out policies are clearly defined.\"\n    },\n    {\n      \"field\": \"Weekend/Special-Day Rates\",\n      \"actual_content\": \"\",\n      \"compliant\": \"N\",\n      \"comment\": \"Weekend/Special-Day Rates are not explicitly mentioned.\"\n    },\n    {\n      \"field\": \"Layover Rules\",\n      \"actual_content\": \"The hotel agrees to the 24-hour rule for the crew check-in and check-out, which means the second-night charges will apply only from the 25th hour from the check-in time.\",\n      \"compliant\": \"Y\",\n      \"comment\": \"Layover rules are clearly defined.\"\n    },\n    {\n      \"field\": \"Cancellation Policy\",\n      \"actual_content\": \"Airline may cancel the rooms up until 24 hours prior to the day of arrival\",\n      \"compliant\": \"Y\",\n      \"comment\": \"Cancellation policy is clearly defined.\"\n    },\n    {\n      \"field\": \"Additional Room Rules\",\n      \"actual_content\": \"All rooms must: i. Be between floors 2 and no higher than where local Fire Department ladders can reach and ii. in a part of the Hotel conducive to rest during day and night hours, and iii. must contain blackout shades, iron, ironing board and iv. Away from elevators, housekeeping closets, ice and vending machines, busy roads or other potentially noisy areas or activities. v. Rooms allocated to Airline will not be handicapped accessible, unless requested by the crew member. vi. Rooms must be non-smoking.\",\n      \"compliant\": \"Y\",\n      \"comment\": \"Additional room rules are clearly defined.\"\n    },\n    {\n      \"field\": \"Commission Rate\",\n      \"actual_content\": \"\",\n      \"compliant\": \"N\",\n      \"comment\": \"Commission rate is not mentioned.\"\n    },\n    {\n      \"field\": \"Single Room Rate\",\n      \"actual_content\": \"400 AED (510 AED Rate including all Taxes)\",\n      \"compliant\": \"Y\",\n      \"comment\": \"Single room rate is clearly defined.\"\n    },\n    {\n      \"field\": \"Check-In Time\",\n      \"actual_content\": \"\",\n      \"compliant\": \"N\",\n      \"comment\": \"Check-in time is not explicitly mentioned.\"\n    },\n    {\n      \"field\": \"Check-Out Time\",\n      \"actual_content\": \"\",\n      \"compliant\": \"N\",\n      \"comment\": \"Check-out time is not explicitly mentioned.\"\n    },\n    {\n      \"field\": \"Other Tax / Flat Tax\",\n      \"actual_content\": \"20 AED tourism fee\",\n      \"compliant\": \"Y\",\n      \"comment\": \"Flat tax is clearly defined.\"\n    },\n    {\n      \"field\": \"Is Contract Signed\",\n      \"actual_content\": \"Signature: Mark O'Kelly\",\n      \"compliant\": \"Y\",\n      \"comment\": \"Contract is signed by the airline representative.\"\n    },\n    {\n      \"field\": \"Operational Memo\",\n      \"actual_content\": \"Airline will only pay for rooms used and only the official Airline sign-in sheet is authorized to qualify for payment.\",\n      \"compliant\": \"Y\",\n      \"comment\": \"Operational memo is clearly defined.\"\n    }\n  ],\n  \"snippets\": [\n    {\n      \"label\": \"Room Rate & Reservations\",\n      \"text\": \"Year 1 & 2 (01st May 2025 to 30th April 2027) 400 AED (510 AED Rate including all Taxes)\",\n      \"page_or_section\": \"Section C\"\n    },\n    {\n      \"label\": \"Tax / Exemption / Refund\",\n      \"text\": \"10% Service charge, 07% Municipal fee, 05% VAT and 20 AED tourism fee\",\n      \"page_or_section\": \"Section C\"\n    },\n    {\n      \"label\": \"Term (Start/End)\",\n      \"text\": \"This Agreement shall commence 01st May 2025 until 30th April 2027\",\n      \"page_or_section\": \"Section B\"\n    },\n    {\n      \"label\": \"Early/Late Check-in/out / Layover\",\n      \"text\": \"Hotel will not charge Airline for the scheduled rooms being held the night prior. Hotel will not charge Airline a second day charge for rooms checking out late for evening flight departures.\",\n      \"page_or_section\": \"Section A\"\n    },\n    {\n      \"label\": \"Cancellation Policy\",\n      \"text\": \"Airline may cancel the rooms up until 24 hours prior to the day of arrival\",\n      \"page_or_section\": \"Section A\"\n    },\n    {\n      \"label\": \"Additional Room Rules\",\n      \"text\": \"All rooms must: i. Be between floors 2 and no higher than where local Fire Department ladders can reach and ii. in a part of the Hotel conducive to rest during day and night hours, and iii. must contain blackout shades, iron, ironing board and iv. Away from elevators, housekeeping closets, ice and vending machines, busy roads or other potentially noisy areas or activities. v. Rooms allocated to Airline will not be handicapped accessible, unless requested by the crew member. vi. Rooms must be non-smoking.\",\n      \"page_or_section\": \"Section A\"\n    }\n  ],\n  \"flags\": {\n    \"missing_fields\": [\n      \"Ad Hoc Rate\",\n      \"Weekend/Special-Day Rates\",\n      \"Commission Rate\",\n      \"Check-In Time\",\n      \"Check-Out Time\"\n    ],\n    \"ambiguous_points\": []\n  }\n}",
      "output_parsed": {
        "meta": {
          "document_title": "Grand Millennium Contract 2025",
          "station_or_airport_code": "DWC",
          "hotel_name": "Grand Millennium Hotel Dubai",
          "airline_name": "ASL Aviation Holdings DAC"
        },
        "yearly_terms": [
          {
            "year": 2025,
            "start_date": "01st May 2025",
            "end_date": "31st December 2025",
            "room_rate": "400 AED (510 AED Rate including all Taxes)",
            "currency": "AED",
            "source_text": "Year 1 & 2 (01st May 2025 to 30th April 2027) 400 AED (510 AED Rate including all Taxes)"
          },
          {
            "year": 2026,
            "start_date": "01st January 2026",
            "end_date": "31st December 2026",
            "room_rate": "400 AED (510 AED Rate including all Taxes)",
            "currency": "AED",
            "source_text": "Year 1 & 2 (01st May 2025 to 30th April 2027) 400 AED (510 AED Rate including all Taxes)"
          },
          {
            "year": 2027,
            "start_date": "01st January 2027",
            "end_date": "30th April 2027",
            "room_rate": "400 AED (510 AED Rate including all Taxes)",
            "currency": "AED",
            "source_text": "Year 1 & 2 (01st May 2025 to 30th April 2027) 400 AED (510 AED Rate including all Taxes)"
          }
        ],
        "rate_periods": [
          {
            "period_label": "",
            "start_date": "01st May 2025",
            "end_date": "30th April 2027",
            "room_rate": "400 AED (510 AED Rate including all Taxes)",
            "currency": "AED",
            "taxes_and_fees": "10% Service charge, 07% Municipal fee, 05% VAT and 20 AED tourism fee",
            "source_text": "Year 1 & 2 (01st May 2025 to 30th April 2027) 400 AED (510 AED Rate including all Taxes)"
          }
        ],
        "review": [
          {
            "field": "Name (Parties)",
            "actual_content": "ASL Aviation Holdings DAC VAT No IE 6381394H Registered in Ireland No 361394 and its directly or indirectly fully-owned subsidiaries: ASL Airlines Belgium SA, DBA ASL Airlines Belgium (ASLB) ASL Airlines France, DBA ASL Airlines France (ASLF) ASL Airlines Hungary Kft., Dba ASL Airlines Hungary (ASLH). ASL Airlines (Ireland) Limited, Dba ASL Airlines Ireland (ASLI) ASL Airlines Switzerland AG, Dba ASL Airlines Switzerland (ASLS) (hereinafter referred to as \"Airline\")\" AND GRAND MILLENNIUM HOTEL DUBAI (FZ) DBA # 561456349 Sheikh Zayed Road, Exit 36 Registration # 2071053 (hereinafter referred to as \"Hotel\")",
            "compliant": "Y",
            "comment": "Parties are clearly defined."
          },
          {
            "field": "Start Date",
            "actual_content": "01st May 2025",
            "compliant": "Y",
            "comment": "Start date is clearly defined."
          },
          {
            "field": "End Date",
            "actual_content": "30th April 2027",
            "compliant": "Y",
            "comment": "End date is clearly defined."
          },
          {
            "field": "Room Capping",
            "actual_content": "Hotel shall set aside a minimum of zero (0) to a maximum of 6 rooms per night, specifically for the purpose of accommodating Airline crew from 01st May 2025 to 30th April 2027, each day regardless of arrival or departure time.",
            "compliant": "Y",
            "comment": "Room capping is clearly defined."
          },
          {
            "field": "Ad Hoc Rate",
            "actual_content": "",
            "compliant": "N",
            "comment": "Ad Hoc Rate is not explicitly mentioned."
          },
          {
            "field": "Currency",
            "actual_content": "AED",
            "compliant": "Y",
            "comment": "Currency is clearly defined."
          },
          {
            "field": "Tax Rate and Exemption",
            "actual_content": "10% Service charge, 07% Municipal fee, 05% VAT and 20 AED tourism fee",
            "compliant": "Y",
            "comment": "Tax rates and fees are clearly defined."
          },
          {
            "field": "Early Check-ins and Check-outs",
            "actual_content": "Hotel will not charge Airline for the scheduled rooms being held the night prior. Hotel will not charge Airline a second day charge for rooms checking out late for evening flight departures.",
            "compliant": "Y",
            "comment": "Early and late check-in/out policies are clearly defined."
          },
          {
            "field": "Weekend/Special-Day Rates",
            "actual_content": "",
            "compliant": "N",
            "comment": "Weekend/Special-Day Rates are not explicitly mentioned."
          },
          {
            "field": "Layover Rules",
            "actual_content": "The hotel agrees to the 24-hour rule for the crew check-in and check-out, which means the second-night charges will apply only from the 25th hour from the check-in time.",
            "compliant": "Y",
            "comment": "Layover rules are clearly defined."
          },
          {
            "field": "Cancellation Policy",
            "actual_content": "Airline may cancel the rooms up until 24 hours prior to the day of arrival",
            "compliant": "Y",
            "comment": "Cancellation policy is clearly defined."
          },
          {
            "field": "Additional Room Rules",
            "actual_content": "All rooms must: i. Be between floors 2 and no higher than where local Fire Department ladders can reach and ii. in a part of the Hotel conducive to rest during day and night hours, and iii. must contain blackout shades, iron, ironing board and iv. Away from elevators, housekeeping closets, ice and vending machines, busy roads or other potentially noisy areas or activities. v. Rooms allocated to Airline will not be handicapped accessible, unless requested by the crew member. vi. Rooms must be non-smoking.",
            "compliant": "Y",
            "comment": "Additional room rules are clearly defined."
          },
          {
            "field": "Commission Rate",
            "actual_content": "",
            "compliant": "N",
            "comment": "Commission rate is not mentioned."
          },
          {
            "field": "Single Room Rate",
            "actual_content": "400 AED (510 AED Rate including all Taxes)",
            "compliant": "Y",
            "comment": "Single room rate is clearly defined."
          },
          {
            "field": "Check-In Time",
            "actual_content": "",
            "compliant": "N",
            "comment": "Check-in time is not explicitly mentioned."
          },
          {
            "field": "Check-Out Time",
            "actual_content": "",
            "compliant": "N",
            "comment": "Check-out time is not explicitly mentioned."
          },
          {
            "field": "Other Tax / Flat Tax",
            "actual_content": "20 AED tourism fee",
            "compliant": "Y",
            "comment": "Flat tax is clearly defined."
          },
          {
            "field": "Is Contract Signed",
            "actual_content": "Signature: Mark O'Kelly",
            "compliant": "Y",
            "comment": "Contract is signed by the airline representative."
          },
          {
            "field": "Operational Memo",
            "actual_content": "Airline will only pay for rooms used and only the official Airline sign-in sheet is authorized to qualify for payment.",
            "compliant": "Y",
            "comment": "Operational memo is clearly defined."
          }
        ],
        "snippets": [
          {
            "label": "Room Rate & Reservations",
            "text": "Year 1 & 2 (01st May 2025 to 30th April 2027) 400 AED (510 AED Rate including all Taxes)",
            "page_or_section": "Section C"
          },
          {
            "label": "Tax / Exemption / Refund",
            "text": "10% Service charge, 07% Municipal fee, 05% VAT and 20 AED tourism fee",
            "page_or_section": "Section C"
          },
          {
            "label": "Term (Start/End)",
            "text": "This Agreement shall commence 01st May 2025 until 30th April 2027",
            "page_or_section": "Section B"
          },
          {
            "label": "Early/Late Check-in/out / Layover",
            "text": "Hotel will not charge Airline for the scheduled rooms being held the night prior. Hotel will not charge Airline a second day charge for rooms checking out late for evening flight departures.",
            "page_or_section": "Section A"
          },
          {
            "label": "Cancellation Policy",
            "text": "Airline may cancel the rooms up until 24 hours prior to the day of arrival",
            "page_or_section": "Section A"
          },
          {
            "label": "Additional Room Rules",
            "text": "All rooms must: i. Be between floors 2 and no higher than where local Fire Department ladders can reach and ii. in a part of the Hotel conducive to rest during day and night hours, and iii. must contain blackout shades, iron, ironing board and iv. Away from elevators, housekeeping closets, ice and vending machines, busy roads or other potentially noisy areas or activities. v. Rooms allocated to Airline will not be handicapped accessible, unless requested by the crew member. vi. Rooms must be non-smoking.",
            "page_or_section": "Section A"
          }
        ],
        "flags": {
          "missing_fields": [
            "Ad Hoc Rate",
            "Weekend/Special-Day Rates",
            "Commission Rate",
            "Check-In Time",
            "Check-Out Time"
          ],
          "ambiguous_points": []
        }
      },
      "flat_rows": [
        {
          "run_id": "69a10eb270199a6ebe8293c7",
          "file_name": "DWC - Grand Millennium Contract 2025-27 (signed).pdf",
          "timestamp": "2026-02-27 08:55:09",
          "yearly_terms": [
            {
              "year": 2025,
              "start_date": "01st May 2025",
              "end_date": "31st December 2025",
              "room_rate": "400 AED (510 AED Rate including all Taxes)",
              "currency": "AED",
              "source_text": "Year 1 & 2 (01st May 2025 to 30th April 2027) 400 AED (510 AED Rate including all Taxes)"
            },
            {
              "year": 2026,
              "start_date": "01st January 2026",
              "end_date": "31st December 2026",
              "room_rate": "400 AED (510 AED Rate including all Taxes)",
              "currency": "AED",
              "source_text": "Year 1 & 2 (01st May 2025 to 30th April 2027) 400 AED (510 AED Rate including all Taxes)"
            },
            {
              "year": 2027,
              "start_date": "01st January 2027",
              "end_date": "30th April 2027",
              "room_rate": "400 AED (510 AED Rate including all Taxes)",
              "currency": "AED",
              "source_text": "Year 1 & 2 (01st May 2025 to 30th April 2027) 400 AED (510 AED Rate including all Taxes)"
            }
          ],
          "rate_periods": [
            {
              "period_label": "",
              "start_date": "01st May 2025",
              "end_date": "30th April 2027",
              "room_rate": "400 AED (510 AED Rate including all Taxes)",
              "currency": "AED",
              "taxes_and_fees": "10% Service charge, 07% Municipal fee, 05% VAT and 20 AED tourism fee",
              "source_text": "Year 1 & 2 (01st May 2025 to 30th April 2027) 400 AED (510 AED Rate including all Taxes)"
            }
          ],
          "review": [
            {
              "field": "Name (Parties)",
              "actual_content": "ASL Aviation Holdings DAC VAT No IE 6381394H Registered in Ireland No 361394 and its directly or indirectly fully-owned subsidiaries: ASL Airlines Belgium SA, DBA ASL Airlines Belgium (ASLB) ASL Airlines France, DBA ASL Airlines France (ASLF) ASL Airlines Hungary Kft., Dba ASL Airlines Hungary (ASLH). ASL Airlines (Ireland) Limited, Dba ASL Airlines Ireland (ASLI) ASL Airlines Switzerland AG, Dba ASL Airlines Switzerland (ASLS) (hereinafter referred to as \"Airline\")\" AND GRAND MILLENNIUM HOTEL DUBAI (FZ) DBA # 561456349 Sheikh Zayed Road, Exit 36 Registration # 2071053 (hereinafter referred to as \"Hotel\")",
              "compliant": "Y",
              "comment": "Parties are clearly defined."
            },
            {
              "field": "Start Date",
              "actual_content": "01st May 2025",
              "compliant": "Y",
              "comment": "Start date is clearly defined."
            },
            {
              "field": "End Date",
              "actual_content": "30th April 2027",
              "compliant": "Y",
              "comment": "End date is clearly defined."
            },
            {
              "field": "Room Capping",
              "actual_content": "Hotel shall set aside a minimum of zero (0) to a maximum of 6 rooms per night, specifically for the purpose of accommodating Airline crew from 01st May 2025 to 30th April 2027, each day regardless of arrival or departure time.",
              "compliant": "Y",
              "comment": "Room capping is clearly defined."
            },
            {
              "field": "Ad Hoc Rate",
              "actual_content": "",
              "compliant": "N",
              "comment": "Ad Hoc Rate is not explicitly mentioned."
            },
            {
              "field": "Currency",
              "actual_content": "AED",
              "compliant": "Y",
              "comment": "Currency is clearly defined."
            },
            {
              "field": "Tax Rate and Exemption",
              "actual_content": "10% Service charge, 07% Municipal fee, 05% VAT and 20 AED tourism fee",
              "compliant": "Y",
              "comment": "Tax rates and fees are clearly defined."
            },
            {
              "field": "Early Check-ins and Check-outs",
              "actual_content": "Hotel will not charge Airline for the scheduled rooms being held the night prior. Hotel will not charge Airline a second day charge for rooms checking out late for evening flight departures.",
              "compliant": "Y",
              "comment": "Early and late check-in/out policies are clearly defined."
            },
            {
              "field": "Weekend/Special-Day Rates",
              "actual_content": "",
              "compliant": "N",
              "comment": "Weekend/Special-Day Rates are not explicitly mentioned."
            },
            {
              "field": "Layover Rules",
              "actual_content": "The hotel agrees to the 24-hour rule for the crew check-in and check-out, which means the second-night charges will apply only from the 25th hour from the check-in time.",
              "compliant": "Y",
              "comment": "Layover rules are clearly defined."
            },
            {
              "field": "Cancellation Policy",
              "actual_content": "Airline may cancel the rooms up until 24 hours prior to the day of arrival",
              "compliant": "Y",
              "comment": "Cancellation policy is clearly defined."
            },
            {
              "field": "Additional Room Rules",
              "actual_content": "All rooms must: i. Be between floors 2 and no higher than where local Fire Department ladders can reach and ii. in a part of the Hotel conducive to rest during day and night hours, and iii. must contain blackout shades, iron, ironing board and iv. Away from elevators, housekeeping closets, ice and vending machines, busy roads or other potentially noisy areas or activities. v. Rooms allocated to Airline will not be handicapped accessible, unless requested by the crew member. vi. Rooms must be non-smoking.",
              "compliant": "Y",
              "comment": "Additional room rules are clearly defined."
            },
            {
              "field": "Commission Rate",
              "actual_content": "",
              "compliant": "N",
              "comment": "Commission rate is not mentioned."
            },
            {
              "field": "Single Room Rate",
              "actual_content": "400 AED (510 AED Rate including all Taxes)",
              "compliant": "Y",
              "comment": "Single room rate is clearly defined."
            },
            {
              "field": "Check-In Time",
              "actual_content": "",
              "compliant": "N",
              "comment": "Check-in time is not explicitly mentioned."
            },
            {
              "field": "Check-Out Time",
              "actual_content": "",
              "compliant": "N",
              "comment": "Check-out time is not explicitly mentioned."
            },
            {
              "field": "Other Tax / Flat Tax",
              "actual_content": "20 AED tourism fee",
              "compliant": "Y",
              "comment": "Flat tax is clearly defined."
            },
            {
              "field": "Is Contract Signed",
              "actual_content": "Signature: Mark O'Kelly",
              "compliant": "Y",
              "comment": "Contract is signed by the airline representative."
            },
            {
              "field": "Operational Memo",
              "actual_content": "Airline will only pay for rooms used and only the official Airline sign-in sheet is authorized to qualify for payment.",
              "compliant": "Y",
              "comment": "Operational memo is clearly defined."
            }
          ],
          "snippets": [
            {
              "label": "Room Rate & Reservations",
              "text": "Year 1 & 2 (01st May 2025 to 30th April 2027) 400 AED (510 AED Rate including all Taxes)",
              "page_or_section": "Section C"
            },
            {
              "label": "Tax / Exemption / Refund",
              "text": "10% Service charge, 07% Municipal fee, 05% VAT and 20 AED tourism fee",
              "page_or_section": "Section C"
            },
            {
              "label": "Term (Start/End)",
              "text": "This Agreement shall commence 01st May 2025 until 30th April 2027",
              "page_or_section": "Section B"
            },
            {
              "label": "Early/Late Check-in/out / Layover",
              "text": "Hotel will not charge Airline for the scheduled rooms being held the night prior. Hotel will not charge Airline a second day charge for rooms checking out late for evening flight departures.",
              "page_or_section": "Section A"
            },
            {
              "label": "Cancellation Policy",
              "text": "Airline may cancel the rooms up until 24 hours prior to the day of arrival",
              "page_or_section": "Section A"
            },
            {
              "label": "Additional Room Rules",
              "text": "All rooms must: i. Be between floors 2 and no higher than where local Fire Department ladders can reach and ii. in a part of the Hotel conducive to rest during day and night hours, and iii. must contain blackout shades, iron, ironing board and iv. Away from elevators, housekeeping closets, ice and vending machines, busy roads or other potentially noisy areas or activities. v. Rooms allocated to Airline will not be handicapped accessible, unless requested by the crew member. vi. Rooms must be non-smoking.",
              "page_or_section": "Section A"
            }
          ],
          "meta.document_title": "Grand Millennium Contract 2025",
          "meta.station_or_airport_code": "DWC",
          "meta.hotel_name": "Grand Millennium Hotel Dubai",
          "meta.airline_name": "ASL Aviation Holdings DAC",
          "flags.missing_fields": [
            "Ad Hoc Rate",
            "Weekend/Special-Day Rates",
            "Commission Rate",
            "Check-In Time",
            "Check-Out Time"
          ],
          "flags.ambiguous_points": []
        }
      ],
      "meta": {
        "timestamp": "2026-02-27 08:55:09",
        "file_name": "DWC - Grand Millennium Contract 2025-27 (signed).pdf",
        "run_id": "69a10eb270199a6ebe8293c7"
      }
    },
    {
      "status": "success",
      "run_id": "69a10ea470199a6ebe8293bf",
      "file_name": "ATLTE 2024 Sun Country Rate Agreement.pdf",
      "ocr_markdown": null,
      "output_raw": "{\n  \"meta\": {\n    \"document_title\": \"ATLTE 2024 Sun Country Rate Agreement\",\n    \"station_or_airport_code\": \"ATL\",\n    \"hotel_name\": \"ELLIS HOTEL, A TRIBUTE HOTEL BY MARRIOTT\",\n    \"airline_name\": \"Sun Country Airlines Airline Services, LLC\"\n  },\n  \"yearly_terms\": [\n    {\n      \"year\": 2024,\n      \"start_date\": \"3/11/2024\",\n      \"end_date\": \"12/31/2024\",\n      \"room_rate\": \"$139- LRA $109- Non-LRA\",\n      \"currency\": \"\",\n      \"source_text\": \"Sun Country Rate Start Date End Date Tax % LRA Last Room Ava. Room Type Will load to GDS Commission $139- LRA $109- Non-LRA 3/11/2024 3/11/2025 16.9% + $5.00 YES at $139 $109 Non LRA ROH YES 10%\"\n    },\n    {\n      \"year\": 2025,\n      \"start_date\": \"1/1/2025\",\n      \"end_date\": \"3/11/2025\",\n      \"room_rate\": \"$139- LRA $109- Non-LRA\",\n      \"currency\": \"\",\n      \"source_text\": \"Sun Country Rate Start Date End Date Tax % LRA Last Room Ava. Room Type Will load to GDS Commission $139- LRA $109- Non-LRA 3/11/2024 3/11/2025 16.9% + $5.00 YES at $139 $109 Non LRA ROH YES 10%\"\n    }\n  ],\n  \"rate_periods\": [\n    {\n      \"period_label\": \"\",\n      \"start_date\": \"3/11/2024\",\n      \"end_date\": \"3/11/2025\",\n      \"room_rate\": \"$139- LRA $109- Non-LRA\",\n      \"currency\": \"\",\n      \"taxes_and_fees\": \"16.9% + $5.00\",\n      \"source_text\": \"Sun Country Rate Start Date End Date Tax % LRA Last Room Ava. Room Type Will load to GDS Commission $139- LRA $109- Non-LRA 3/11/2024 3/11/2025 16.9% + $5.00 YES at $139 $109 Non LRA ROH YES 10%\"\n    }\n  ],\n  \"review\": [\n    {\n      \"field\": \"Name (Parties)\",\n      \"actual_content\": \"TA Connections IL, LLC d/b/a TA Connections, HOTEL: ELLIS HOTEL, A TRIBUTE HOTEL BY MARRIOTT\",\n      \"compliant\": \"Y\",\n      \"comment\": \"Both parties' names are present.\"\n    },\n    {\n      \"field\": \"Start Date\",\n      \"actual_content\": \"3/11/2024\",\n      \"compliant\": \"Y\",\n      \"comment\": \"Start date is clearly stated.\"\n    },\n    {\n      \"field\": \"End Date\",\n      \"actual_content\": \"3/11/2025\",\n      \"compliant\": \"Y\",\n      \"comment\": \"End date is clearly stated.\"\n    },\n    {\n      \"field\": \"Room Capping\",\n      \"actual_content\": \"YES at $139 $109 Non LRA ROH\",\n      \"compliant\": \"Y\",\n      \"comment\": \"Last Room Availability is confirmed.\"\n    },\n    {\n      \"field\": \"Ad Hoc Rate\",\n      \"actual_content\": \"\",\n      \"compliant\": \"N\",\n      \"comment\": \"No specific ad hoc rate mentioned.\"\n    },\n    {\n      \"field\": \"Currency\",\n      \"actual_content\": \"\",\n      \"compliant\": \"N\",\n      \"comment\": \"Currency not explicitly stated.\"\n    },\n    {\n      \"field\": \"Tax Rate and Exemption\",\n      \"actual_content\": \"16.9% + $5.00\",\n      \"compliant\": \"Y\",\n      \"comment\": \"Tax rate and additional fee are specified.\"\n    },\n    {\n      \"field\": \"Early Check-ins and Check-outs\",\n      \"actual_content\": \"Rate is based on 11 am check in, 2 pm check out.\",\n      \"compliant\": \"Y\",\n      \"comment\": \"Check-in and check-out times are specified.\"\n    },\n    {\n      \"field\": \"Weekend/Special-Day Rates\",\n      \"actual_content\": \"\",\n      \"compliant\": \"N\",\n      \"comment\": \"No specific weekend or special-day rates mentioned.\"\n    },\n    {\n      \"field\": \"Layover Rules\",\n      \"actual_content\": \"\",\n      \"compliant\": \"N\",\n      \"comment\": \"No specific layover rules mentioned.\"\n    },\n    {\n      \"field\": \"Cancellation Policy\",\n      \"actual_content\": \"Reservation is cancelable prior to 6 p.m. on date of arrival with no penalty.\",\n      \"compliant\": \"Y\",\n      \"comment\": \"Cancellation policy is clearly stated.\"\n    },\n    {\n      \"field\": \"Additional Room Rules\",\n      \"actual_content\": \"Hotel agrees not to walk or displace an airline employee to another property unless Airline agrees to said move in writing two (2) weeks in advance of arrival date.\",\n      \"compliant\": \"Y\",\n      \"comment\": \"Additional room rules regarding displacement are specified.\"\n    },\n    {\n      \"field\": \"Commission Rate\",\n      \"actual_content\": \"10%\",\n      \"compliant\": \"Y\",\n      \"comment\": \"Commission rate is specified.\"\n    },\n    {\n      \"field\": \"Single Room Rate\",\n      \"actual_content\": \"$139- LRA $109- Non-LRA\",\n      \"compliant\": \"Y\",\n      \"comment\": \"Single room rates are specified.\"\n    },\n    {\n      \"field\": \"Check-In Time\",\n      \"actual_content\": \"11 am\",\n      \"compliant\": \"Y\",\n      \"comment\": \"Check-in time is specified.\"\n    },\n    {\n      \"field\": \"Check-Out Time\",\n      \"actual_content\": \"2 pm\",\n      \"compliant\": \"Y\",\n      \"comment\": \"Check-out time is specified.\"\n    },\n    {\n      \"field\": \"Other Tax / Flat Tax\",\n      \"actual_content\": \"$5.00\",\n      \"compliant\": \"Y\",\n      \"comment\": \"Flat tax amount is specified.\"\n    },\n    {\n      \"field\": \"Is Contract Signed\",\n      \"actual_content\": \"Name: Maria Ellie Maldonado Title: Senior Director Client Services Date: 3/13/2024 Name: Raleih Bennett Title: Regional Director of Sales Date: 3/13/2024\",\n      \"compliant\": \"Y\",\n      \"comment\": \"Contract is signed by both parties.\"\n    },\n    {\n      \"field\": \"Operational Memo\",\n      \"actual_content\": \"Hotel agrees not to walk or displace an airline employee to another property unless Airline agrees to said move in writing two (2) weeks in advance of arrival date.\",\n      \"compliant\": \"Y\",\n      \"comment\": \"Operational impact regarding displacement is specified.\"\n    }\n  ],\n  \"snippets\": [\n    {\n      \"label\": \"Room Rate & Reservations\",\n      \"text\": \"Sun Country Rate Start Date End Date Tax % LRA Last Room Ava. Room Type Will load to GDS Commission $139- LRA $109- Non-LRA 3/11/2024 3/11/2025 16.9% + $5.00 YES at $139 $109 Non LRA ROH YES 10%\",\n      \"page_or_section\": \"1\"\n    },\n    {\n      \"label\": \"Tax / Exemption / Refund\",\n      \"text\": \"16.9% + $5.00\",\n      \"page_or_section\": \"1\"\n    },\n    {\n      \"label\": \"Term (Start/End)\",\n      \"text\": \"The term of this agreement shall commence on above start date for a period of one year and shall renew automatically each year unless Hotel gives written notice to TA Connections 30 days prior to expiration.\",\n      \"page_or_section\": \"1\"\n    },\n    {\n      \"label\": \"Early/Late Check-in/out / Layover\",\n      \"text\": \"Rate is based on 11 am check in, 2 pm check out.\",\n      \"page_or_section\": \"1\"\n    },\n    {\n      \"label\": \"Cancellation Policy\",\n      \"text\": \"Reservation is cancelable prior to 6 p.m. on date of arrival with no penalty.\",\n      \"page_or_section\": \"1\"\n    },\n    {\n      \"label\": \"Additional Room Rules\",\n      \"text\": \"Hotel agrees not to walk or displace an airline employee to another property unless Airline agrees to said move in writing two (2) weeks in advance of arrival date.\",\n      \"page_or_section\": \"1\"\n    }\n  ],\n  \"flags\": {\n    \"missing_fields\": [\n      \"Ad Hoc Rate\",\n      \"Currency\",\n      \"Weekend/Special-Day Rates\",\n      \"Layover Rules\"\n    ],\n    \"ambiguous_points\": []\n  }\n}",
      "output_parsed": {
        "meta": {
          "document_title": "ATLTE 2024 Sun Country Rate Agreement",
          "station_or_airport_code": "ATL",
          "hotel_name": "ELLIS HOTEL, A TRIBUTE HOTEL BY MARRIOTT",
          "airline_name": "Sun Country Airlines Airline Services, LLC"
        },
        "yearly_terms": [
          {
            "year": 2024,
            "start_date": "3/11/2024",
            "end_date": "12/31/2024",
            "room_rate": "$139- LRA $109- Non-LRA",
            "currency": "",
            "source_text": "Sun Country Rate Start Date End Date Tax % LRA Last Room Ava. Room Type Will load to GDS Commission $139- LRA $109- Non-LRA 3/11/2024 3/11/2025 16.9% + $5.00 YES at $139 $109 Non LRA ROH YES 10%"
          },
          {
            "year": 2025,
            "start_date": "1/1/2025",
            "end_date": "3/11/2025",
            "room_rate": "$139- LRA $109- Non-LRA",
            "currency": "",
            "source_text": "Sun Country Rate Start Date End Date Tax % LRA Last Room Ava. Room Type Will load to GDS Commission $139- LRA $109- Non-LRA 3/11/2024 3/11/2025 16.9% + $5.00 YES at $139 $109 Non LRA ROH YES 10%"
          }
        ],
        "rate_periods": [
          {
            "period_label": "",
            "start_date": "3/11/2024",
            "end_date": "3/11/2025",
            "room_rate": "$139- LRA $109- Non-LRA",
            "currency": "",
            "taxes_and_fees": "16.9% + $5.00",
            "source_text": "Sun Country Rate Start Date End Date Tax % LRA Last Room Ava. Room Type Will load to GDS Commission $139- LRA $109- Non-LRA 3/11/2024 3/11/2025 16.9% + $5.00 YES at $139 $109 Non LRA ROH YES 10%"
          }
        ],
        "review": [
          {
            "field": "Name (Parties)",
            "actual_content": "TA Connections IL, LLC d/b/a TA Connections, HOTEL: ELLIS HOTEL, A TRIBUTE HOTEL BY MARRIOTT",
            "compliant": "Y",
            "comment": "Both parties' names are present."
          },
          {
            "field": "Start Date",
            "actual_content": "3/11/2024",
            "compliant": "Y",
            "comment": "Start date is clearly stated."
          },
          {
            "field": "End Date",
            "actual_content": "3/11/2025",
            "compliant": "Y",
            "comment": "End date is clearly stated."
          },
          {
            "field": "Room Capping",
            "actual_content": "YES at $139 $109 Non LRA ROH",
            "compliant": "Y",
            "comment": "Last Room Availability is confirmed."
          },
          {
            "field": "Ad Hoc Rate",
            "actual_content": "",
            "compliant": "N",
            "comment": "No specific ad hoc rate mentioned."
          },
          {
            "field": "Currency",
            "actual_content": "",
            "compliant": "N",
            "comment": "Currency not explicitly stated."
          },
          {
            "field": "Tax Rate and Exemption",
            "actual_content": "16.9% + $5.00",
            "compliant": "Y",
            "comment": "Tax rate and additional fee are specified."
          },
          {
            "field": "Early Check-ins and Check-outs",
            "actual_content": "Rate is based on 11 am check in, 2 pm check out.",
            "compliant": "Y",
            "comment": "Check-in and check-out times are specified."
          },
          {
            "field": "Weekend/Special-Day Rates",
            "actual_content": "",
            "compliant": "N",
            "comment": "No specific weekend or special-day rates mentioned."
          },
          {
            "field": "Layover Rules",
            "actual_content": "",
            "compliant": "N",
            "comment": "No specific layover rules mentioned."
          },
          {
            "field": "Cancellation Policy",
            "actual_content": "Reservation is cancelable prior to 6 p.m. on date of arrival with no penalty.",
            "compliant": "Y",
            "comment": "Cancellation policy is clearly stated."
          },
          {
            "field": "Additional Room Rules",
            "actual_content": "Hotel agrees not to walk or displace an airline employee to another property unless Airline agrees to said move in writing two (2) weeks in advance of arrival date.",
            "compliant": "Y",
            "comment": "Additional room rules regarding displacement are specified."
          },
          {
            "field": "Commission Rate",
            "actual_content": "10%",
            "compliant": "Y",
            "comment": "Commission rate is specified."
          },
          {
            "field": "Single Room Rate",
            "actual_content": "$139- LRA $109- Non-LRA",
            "compliant": "Y",
            "comment": "Single room rates are specified."
          },
          {
            "field": "Check-In Time",
            "actual_content": "11 am",
            "compliant": "Y",
            "comment": "Check-in time is specified."
          },
          {
            "field": "Check-Out Time",
            "actual_content": "2 pm",
            "compliant": "Y",
            "comment": "Check-out time is specified."
          },
          {
            "field": "Other Tax / Flat Tax",
            "actual_content": "$5.00",
            "compliant": "Y",
            "comment": "Flat tax amount is specified."
          },
          {
            "field": "Is Contract Signed",
            "actual_content": "Name: Maria Ellie Maldonado Title: Senior Director Client Services Date: 3/13/2024 Name: Raleih Bennett Title: Regional Director of Sales Date: 3/13/2024",
            "compliant": "Y",
            "comment": "Contract is signed by both parties."
          },
          {
            "field": "Operational Memo",
            "actual_content": "Hotel agrees not to walk or displace an airline employee to another property unless Airline agrees to said move in writing two (2) weeks in advance of arrival date.",
            "compliant": "Y",
            "comment": "Operational impact regarding displacement is specified."
          }
        ],
        "snippets": [
          {
            "label": "Room Rate & Reservations",
            "text": "Sun Country Rate Start Date End Date Tax % LRA Last Room Ava. Room Type Will load to GDS Commission $139- LRA $109- Non-LRA 3/11/2024 3/11/2025 16.9% + $5.00 YES at $139 $109 Non LRA ROH YES 10%",
            "page_or_section": "1"
          },
          {
            "label": "Tax / Exemption / Refund",
            "text": "16.9% + $5.00",
            "page_or_section": "1"
          },
          {
            "label": "Term (Start/End)",
            "text": "The term of this agreement shall commence on above start date for a period of one year and shall renew automatically each year unless Hotel gives written notice to TA Connections 30 days prior to expiration.",
            "page_or_section": "1"
          },
          {
            "label": "Early/Late Check-in/out / Layover",
            "text": "Rate is based on 11 am check in, 2 pm check out.",
            "page_or_section": "1"
          },
          {
            "label": "Cancellation Policy",
            "text": "Reservation is cancelable prior to 6 p.m. on date of arrival with no penalty.",
            "page_or_section": "1"
          },
          {
            "label": "Additional Room Rules",
            "text": "Hotel agrees not to walk or displace an airline employee to another property unless Airline agrees to said move in writing two (2) weeks in advance of arrival date.",
            "page_or_section": "1"
          }
        ],
        "flags": {
          "missing_fields": [
            "Ad Hoc Rate",
            "Currency",
            "Weekend/Special-Day Rates",
            "Layover Rules"
          ],
          "ambiguous_points": []
        }
      },
      "flat_rows": [
        {
          "run_id": "69a10ea470199a6ebe8293bf",
          "file_name": "ATLTE 2024 Sun Country Rate Agreement.pdf",
          "timestamp": "2026-02-27 08:55:09",
          "yearly_terms": [
            {
              "year": 2024,
              "start_date": "3/11/2024",
              "end_date": "12/31/2024",
              "room_rate": "$139- LRA $109- Non-LRA",
              "currency": "",
              "source_text": "Sun Country Rate Start Date End Date Tax % LRA Last Room Ava. Room Type Will load to GDS Commission $139- LRA $109- Non-LRA 3/11/2024 3/11/2025 16.9% + $5.00 YES at $139 $109 Non LRA ROH YES 10%"
            },
            {
              "year": 2025,
              "start_date": "1/1/2025",
              "end_date": "3/11/2025",
              "room_rate": "$139- LRA $109- Non-LRA",
              "currency": "",
              "source_text": "Sun Country Rate Start Date End Date Tax % LRA Last Room Ava. Room Type Will load to GDS Commission $139- LRA $109- Non-LRA 3/11/2024 3/11/2025 16.9% + $5.00 YES at $139 $109 Non LRA ROH YES 10%"
            }
          ],
          "rate_periods": [
            {
              "period_label": "",
              "start_date": "3/11/2024",
              "end_date": "3/11/2025",
              "room_rate": "$139- LRA $109- Non-LRA",
              "currency": "",
              "taxes_and_fees": "16.9% + $5.00",
              "source_text": "Sun Country Rate Start Date End Date Tax % LRA Last Room Ava. Room Type Will load to GDS Commission $139- LRA $109- Non-LRA 3/11/2024 3/11/2025 16.9% + $5.00 YES at $139 $109 Non LRA ROH YES 10%"
            }
          ],
          "review": [
            {
              "field": "Name (Parties)",
              "actual_content": "TA Connections IL, LLC d/b/a TA Connections, HOTEL: ELLIS HOTEL, A TRIBUTE HOTEL BY MARRIOTT",
              "compliant": "Y",
              "comment": "Both parties' names are present."
            },
            {
              "field": "Start Date",
              "actual_content": "3/11/2024",
              "compliant": "Y",
              "comment": "Start date is clearly stated."
            },
            {
              "field": "End Date",
              "actual_content": "3/11/2025",
              "compliant": "Y",
              "comment": "End date is clearly stated."
            },
            {
              "field": "Room Capping",
              "actual_content": "YES at $139 $109 Non LRA ROH",
              "compliant": "Y",
              "comment": "Last Room Availability is confirmed."
            },
            {
              "field": "Ad Hoc Rate",
              "actual_content": "",
              "compliant": "N",
              "comment": "No specific ad hoc rate mentioned."
            },
            {
              "field": "Currency",
              "actual_content": "",
              "compliant": "N",
              "comment": "Currency not explicitly stated."
            },
            {
              "field": "Tax Rate and Exemption",
              "actual_content": "16.9% + $5.00",
              "compliant": "Y",
              "comment": "Tax rate and additional fee are specified."
            },
            {
              "field": "Early Check-ins and Check-outs",
              "actual_content": "Rate is based on 11 am check in, 2 pm check out.",
              "compliant": "Y",
              "comment": "Check-in and check-out times are specified."
            },
            {
              "field": "Weekend/Special-Day Rates",
              "actual_content": "",
              "compliant": "N",
              "comment": "No specific weekend or special-day rates mentioned."
            },
            {
              "field": "Layover Rules",
              "actual_content": "",
              "compliant": "N",
              "comment": "No specific layover rules mentioned."
            },
            {
              "field": "Cancellation Policy",
              "actual_content": "Reservation is cancelable prior to 6 p.m. on date of arrival with no penalty.",
              "compliant": "Y",
              "comment": "Cancellation policy is clearly stated."
            },
            {
              "field": "Additional Room Rules",
              "actual_content": "Hotel agrees not to walk or displace an airline employee to another property unless Airline agrees to said move in writing two (2) weeks in advance of arrival date.",
              "compliant": "Y",
              "comment": "Additional room rules regarding displacement are specified."
            },
            {
              "field": "Commission Rate",
              "actual_content": "10%",
              "compliant": "Y",
              "comment": "Commission rate is specified."
            },
            {
              "field": "Single Room Rate",
              "actual_content": "$139- LRA $109- Non-LRA",
              "compliant": "Y",
              "comment": "Single room rates are specified."
            },
            {
              "field": "Check-In Time",
              "actual_content": "11 am",
              "compliant": "Y",
              "comment": "Check-in time is specified."
            },
            {
              "field": "Check-Out Time",
              "actual_content": "2 pm",
              "compliant": "Y",
              "comment": "Check-out time is specified."
            },
            {
              "field": "Other Tax / Flat Tax",
              "actual_content": "$5.00",
              "compliant": "Y",
              "comment": "Flat tax amount is specified."
            },
            {
              "field": "Is Contract Signed",
              "actual_content": "Name: Maria Ellie Maldonado Title: Senior Director Client Services Date: 3/13/2024 Name: Raleih Bennett Title: Regional Director of Sales Date: 3/13/2024",
              "compliant": "Y",
              "comment": "Contract is signed by both parties."
            },
            {
              "field": "Operational Memo",
              "actual_content": "Hotel agrees not to walk or displace an airline employee to another property unless Airline agrees to said move in writing two (2) weeks in advance of arrival date.",
              "compliant": "Y",
              "comment": "Operational impact regarding displacement is specified."
            }
          ],
          "snippets": [
            {
              "label": "Room Rate & Reservations",
              "text": "Sun Country Rate Start Date End Date Tax % LRA Last Room Ava. Room Type Will load to GDS Commission $139- LRA $109- Non-LRA 3/11/2024 3/11/2025 16.9% + $5.00 YES at $139 $109 Non LRA ROH YES 10%",
              "page_or_section": "1"
            },
            {
              "label": "Tax / Exemption / Refund",
              "text": "16.9% + $5.00",
              "page_or_section": "1"
            },
            {
              "label": "Term (Start/End)",
              "text": "The term of this agreement shall commence on above start date for a period of one year and shall renew automatically each year unless Hotel gives written notice to TA Connections 30 days prior to expiration.",
              "page_or_section": "1"
            },
            {
              "label": "Early/Late Check-in/out / Layover",
              "text": "Rate is based on 11 am check in, 2 pm check out.",
              "page_or_section": "1"
            },
            {
              "label": "Cancellation Policy",
              "text": "Reservation is cancelable prior to 6 p.m. on date of arrival with no penalty.",
              "page_or_section": "1"
            },
            {
              "label": "Additional Room Rules",
              "text": "Hotel agrees not to walk or displace an airline employee to another property unless Airline agrees to said move in writing two (2) weeks in advance of arrival date.",
              "page_or_section": "1"
            }
          ],
          "meta.document_title": "ATLTE 2024 Sun Country Rate Agreement",
          "meta.station_or_airport_code": "ATL",
          "meta.hotel_name": "ELLIS HOTEL, A TRIBUTE HOTEL BY MARRIOTT",
          "meta.airline_name": "Sun Country Airlines Airline Services, LLC",
          "flags.missing_fields": [
            "Ad Hoc Rate",
            "Currency",
            "Weekend/Special-Day Rates",
            "Layover Rules"
          ],
          "flags.ambiguous_points": []
        }
      ],
      "meta": {
        "timestamp": "2026-02-27 08:55:09",
        "file_name": "ATLTE 2024 Sun Country Rate Agreement.pdf",
        "run_id": "69a10ea470199a6ebe8293bf"
      }
    },
    {
      "status": "success",
      "run_id": "69a10eb170199a6ebe8293c5",
      "file_name": "4_WJ YYC Delta Calgary Airport 2025 Amendment #1.pdf",
      "ocr_markdown": null,
      "output_raw": "{\n  \"meta\": {\n    \"document_title\": \"4_WJ YYC Delta Calgary Airport 2025 Amendment #1\",\n    \"station_or_airport_code\": \"YYC\",\n    \"hotel_name\": \"Delta Hotels Calgary Airport In-Terminal\",\n    \"airline_name\": \"WestJet\"\n  },\n  \"yearly_terms\": [\n    {\n      \"year\": 2025,\n      \"start_date\": \"December 1, 2024\",\n      \"end_date\": \"November 30, 2025\",\n      \"room_rate\": \"Rate: $119.00 CAD plus 5% GST, 4% Alberta Hotel Tax & 3% DMF\",\n      \"currency\": \"CAD\",\n      \"source_text\": \"3.2.3. December 1, 2024 to November 30, 2025 Rate: $119.00 CAD plus 5% GST, 4% Alberta Hotel Tax & 3% DMF\"\n    },\n    {\n      \"year\": 2026,\n      \"start_date\": \"December 1, 2025\",\n      \"end_date\": \"November 30, 2026\",\n      \"room_rate\": \"Rate: $125.00 CAD plus 5% GST, 4% Alberta Hotel Tax & 6% DMF\",\n      \"currency\": \"CAD\",\n      \"source_text\": \"3.2.4. December 1, 2025 to November 30, 2026 Rate: $125.00 CAD plus 5% GST, 4% Alberta Hotel Tax & 6% DMF\"\n    },\n    {\n      \"year\": 2027,\n      \"start_date\": \"December 1, 2026\",\n      \"end_date\": \"November 30, 2027\",\n      \"room_rate\": \"Rate: $131.00 CAD plus 5% GST, 4% Alberta Hotel Tax & 6% DMF\",\n      \"currency\": \"CAD\",\n      \"source_text\": \"3.2.5. December 1, 2026 to November 30, 2027 Rate: $131.00 CAD plus 5% GST, 4% Alberta Hotel Tax & 6% DMF\"\n    },\n    {\n      \"year\": 2028,\n      \"start_date\": \"December 1, 2027\",\n      \"end_date\": \"November 30, 2028\",\n      \"room_rate\": \"Rate: $138.00 CAD plus 5% GST, 4% Alberta Hotel Tax & 6% DMF\",\n      \"currency\": \"CAD\",\n      \"source_text\": \"3.2.6. December 1, 2027 to November 30, 2028 Rate: $138.00 CAD plus 5% GST, 4% Alberta Hotel Tax & 6% DMF\"\n    }\n  ],\n  \"rate_periods\": [\n    {\n      \"period_label\": \"3.2.1\",\n      \"start_date\": \"December 1, 2022\",\n      \"end_date\": \"November 30, 2023\",\n      \"room_rate\": \"Rate: $109.00 CAD plus 5% GST, 4% Alberta Hotel Tax & 3% DMF\",\n      \"currency\": \"CAD\",\n      \"taxes_and_fees\": \"5% GST, 4% Alberta Hotel Tax & 3% DMF\",\n      \"source_text\": \"3.2.1. December 1, 2022 to November 30, 2023 Rate: $109.00 CAD plus 5% GST, 4% Alberta Hotel Tax & 3% DMF\"\n    },\n    {\n      \"period_label\": \"3.2.2\",\n      \"start_date\": \"December 1, 2023\",\n      \"end_date\": \"November 30, 2024\",\n      \"room_rate\": \"Rate: $114.00 CAD plus 5% GST, 4% Alberta Hotel Tax & 3% DMF\",\n      \"currency\": \"CAD\",\n      \"taxes_and_fees\": \"5% GST, 4% Alberta Hotel Tax & 3% DMF\",\n      \"source_text\": \"3.2.2. December 1, 2023 to November 30, 2024 Rate: $114.00 CAD plus 5% GST, 4% Alberta Hotel Tax & 3% DMF\"\n    },\n    {\n      \"period_label\": \"3.2.3\",\n      \"start_date\": \"December 1, 2024\",\n      \"end_date\": \"November 30, 2025\",\n      \"room_rate\": \"Rate: $119.00 CAD plus 5% GST, 4% Alberta Hotel Tax & 3% DMF\",\n      \"currency\": \"CAD\",\n      \"taxes_and_fees\": \"5% GST, 4% Alberta Hotel Tax & 3% DMF\",\n      \"source_text\": \"3.2.3. December 1, 2024 to November 30, 2025 Rate: $119.00 CAD plus 5% GST, 4% Alberta Hotel Tax & 3% DMF\"\n    },\n    {\n      \"period_label\": \"3.2.4\",\n      \"start_date\": \"December 1, 2025\",\n      \"end_date\": \"November 30, 2026\",\n      \"room_rate\": \"Rate: $125.00 CAD plus 5% GST, 4% Alberta Hotel Tax & 6% DMF\",\n      \"currency\": \"CAD\",\n      \"taxes_and_fees\": \"5% GST, 4% Alberta Hotel Tax & 6% DMF\",\n      \"source_text\": \"3.2.4. December 1, 2025 to November 30, 2026 Rate: $125.00 CAD plus 5% GST, 4% Alberta Hotel Tax & 6% DMF\"\n    },\n    {\n      \"period_label\": \"3.2.5\",\n      \"start_date\": \"December 1, 2026\",\n      \"end_date\": \"November 30, 2027\",\n      \"room_rate\": \"Rate: $131.00 CAD plus 5% GST, 4% Alberta Hotel Tax & 6% DMF\",\n      \"currency\": \"CAD\",\n      \"taxes_and_fees\": \"5% GST, 4% Alberta Hotel Tax & 6% DMF\",\n      \"source_text\": \"3.2.5. December 1, 2026 to November 30, 2027 Rate: $131.00 CAD plus 5% GST, 4% Alberta Hotel Tax & 6% DMF\"\n    },\n    {\n      \"period_label\": \"3.2.6\",\n      \"start_date\": \"December 1, 2027\",\n      \"end_date\": \"November 30, 2028\",\n      \"room_rate\": \"Rate: $138.00 CAD plus 5% GST, 4% Alberta Hotel Tax & 6% DMF\",\n      \"currency\": \"CAD\",\n      \"taxes_and_fees\": \"5% GST, 4% Alberta Hotel Tax & 6% DMF\",\n      \"source_text\": \"3.2.6. December 1, 2027 to November 30, 2028 Rate: $138.00 CAD plus 5% GST, 4% Alberta Hotel Tax & 6% DMF\"\n    },\n    {\n      \"period_label\": \"3.2.7\",\n      \"start_date\": \"December 1, 2025\",\n      \"end_date\": \"November 30, 2027\",\n      \"room_rate\": \"Rate: $179.00 CAD plus 5% GST, 4% Alberta Hotel Tax & 6% DMF\",\n      \"currency\": \"CAD\",\n      \"taxes_and_fees\": \"5% GST, 4% Alberta Hotel Tax & 6% DMF\",\n      \"source_text\": \"3.2.7. December 1, 2025 to November 30, 2027 Rate: $179.00 CAD plus 5% GST, 4% Alberta Hotel Tax & 6% DMF\"\n    },\n    {\n      \"period_label\": \"3.2.8\",\n      \"start_date\": \"December 1, 2027\",\n      \"end_date\": \"November 30, 2028\",\n      \"room_rate\": \"Rate: $189.00 CAD plus 5% GST, 4% Alberta Hotel Tax & 6% DMF\",\n      \"currency\": \"CAD\",\n      \"taxes_and_fees\": \"5% GST, 4% Alberta Hotel Tax & 6% DMF\",\n      \"source_text\": \"3.2.8. December 1, 2027 to November 30, 2028 Rate: $189.00 CAD plus 5% GST, 4% Alberta Hotel Tax & 6% DMF\"\n    },\n    {\n      \"period_label\": \"3.2.9\",\n      \"start_date\": \"July 3, 2026\",\n      \"end_date\": \"July 12, 2026\",\n      \"room_rate\": \"Rate: $409.00 CAD plus 5% GST, 4% Alberta Hotel Tax & 6% DMF\",\n      \"currency\": \"CAD\",\n      \"taxes_and_fees\": \"5% GST, 4% Alberta Hotel Tax & 6% DMF\",\n      \"source_text\": \"3.2.9. Stampede dates Room Rate Rate: $409.00 CAD plus 5% GST, 4% Alberta Hotel Tax & 6% DMF 3.2.9.1. Annually, Hotel is allowed to charge premium Rate for ten (10) days during Stampede * 2026: July 3–12\"\n    },\n    {\n      \"period_label\": \"3.2.9\",\n      \"start_date\": \"July 9, 2027\",\n      \"end_date\": \"July 18, 2027\",\n      \"room_rate\": \"Rate: $409.00 CAD plus 5% GST, 4% Alberta Hotel Tax & 6% DMF\",\n      \"currency\": \"CAD\",\n      \"taxes_and_fees\": \"5% GST, 4% Alberta Hotel Tax & 6% DMF\",\n      \"source_text\": \"3.2.9. Stampede dates Room Rate Rate: $409.00 CAD plus 5% GST, 4% Alberta Hotel Tax & 6% DMF 3.2.9.1. Annually, Hotel is allowed to charge premium Rate for ten (10) days during Stampede * 2027: July 9–18\"\n    },\n    {\n      \"period_label\": \"3.2.9\",\n      \"start_date\": \"July 7, 2028\",\n      \"end_date\": \"July 16, 2028\",\n      \"room_rate\": \"Rate: $409.00 CAD plus 5% GST, 4% Alberta Hotel Tax & 6% DMF\",\n      \"currency\": \"CAD\",\n      \"taxes_and_fees\": \"5% GST, 4% Alberta Hotel Tax & 6% DMF\",\n      \"source_text\": \"3.2.9. Stampede dates Room Rate Rate: $409.00 CAD plus 5% GST, 4% Alberta Hotel Tax & 6% DMF 3.2.9.1. Annually, Hotel is allowed to charge premium Rate for ten (10) days during Stampede * 2028: July 7–16\"\n    }\n  ],\n  \"review\": [\n    {\n      \"field\": \"Name (Parties)\",\n      \"actual_content\": \"TA Connections IL, LLC d/b/a TA CONNECTIONS 1900 East Golf Road, Suite M150 Schaumburg, IL 60173 (Hereinafter called \\\"TAC/TA Connections\\\") AND DELTA HOTELS CALGARY AIRPORT IN-TERMINAL 2011 Airport Road NE Calgary AB T2E 6Z8 Canada (hereinafter referred to as \\\"Hotel\\\")\",\n      \"compliant\": \"Y\",\n      \"comment\": \"Both parties' names are clearly stated.\"\n    },\n    {\n      \"field\": \"Start Date\",\n      \"actual_content\": \"December 1, 2022\",\n      \"compliant\": \"Y\",\n      \"comment\": \"Start date is clearly stated as December 1, 2022.\"\n    },\n    {\n      \"field\": \"End Date\",\n      \"actual_content\": \"November 30, 2028\",\n      \"compliant\": \"Y\",\n      \"comment\": \"End date is clearly stated as November 30, 2028.\"\n    },\n    {\n      \"field\": \"Room Capping\",\n      \"actual_content\": \"Hotel agrees to offer and make available during the Term of this Agreement up to 51 Rooms on a daily basis until November 30, 2025 and then up to 72 Rooms daily for duration of Agreement\",\n      \"compliant\": \"Y\",\n      \"comment\": \"Room capping is clearly defined with specific numbers.\"\n    },\n    {\n      \"field\": \"Ad Hoc Rate\",\n      \"actual_content\": \"Room Rates are applicable to Crew Rooms, Corporate Travel, Ad Hoc / IROP Crew.\",\n      \"compliant\": \"Y\",\n      \"comment\": \"Ad Hoc rate applicability is mentioned.\"\n    },\n    {\n      \"field\": \"Currency\",\n      \"actual_content\": \"CAD\",\n      \"compliant\": \"Y\",\n      \"comment\": \"Currency is clearly stated as CAD.\"\n    },\n    {\n      \"field\": \"Tax Rate and Exemption\",\n      \"actual_content\": \"5% GST, 4% Alberta Hotel Tax & 6% DMF\",\n      \"compliant\": \"Y\",\n      \"comment\": \"Tax rates are clearly defined.\"\n    },\n    {\n      \"field\": \"Early Check-ins and Check-outs\",\n      \"actual_content\": \"Hotel will not issue early check-in or late check-out charges. Hotel will honor a single daily rate for a thirty (30) hour period of stay based on time in the Hotel, regardless of check-in and check-out times.\",\n      \"compliant\": \"Y\",\n      \"comment\": \"Early and late check-in/out policy is clearly defined with no extra charges.\"\n    },\n    {\n      \"field\": \"Weekend/Special-Day Rates\",\n      \"actual_content\": \"Stampede dates Room Rate Rate: $409.00 CAD plus 5% GST, 4% Alberta Hotel Tax & 6% DMF\",\n      \"compliant\": \"Y\",\n      \"comment\": \"Special rates for Stampede dates are clearly defined.\"\n    },\n    {\n      \"field\": \"Layover Rules\",\n      \"actual_content\": \"\",\n      \"compliant\": \"N\",\n      \"comment\": \"No specific layover rules mentioned.\"\n    },\n    {\n      \"field\": \"Cancellation Policy\",\n      \"actual_content\": \"Hotel agrees not to charge for cancellations.\",\n      \"compliant\": \"Y\",\n      \"comment\": \"Cancellation policy is clearly defined.\"\n    },\n    {\n      \"field\": \"Additional Room Rules\",\n      \"actual_content\": \"Hotel will charge for no-shows when Hotel Occupancy is at 95% or higher at the time of night audit for the date in question.\",\n      \"compliant\": \"Y\",\n      \"comment\": \"Additional room rules regarding no-shows are clearly defined.\"\n    },\n    {\n      \"field\": \"Commission Rate\",\n      \"actual_content\": \"The Room Rate, excluding taxes, will be commissionable to TAC at a rate of 10% commission per Room, per night.\",\n      \"compliant\": \"Y\",\n      \"comment\": \"Commission rate is clearly stated.\"\n    },\n    {\n      \"field\": \"Single Room Rate\",\n      \"actual_content\": \"Rate: $109.00 CAD plus 5% GST, 4% Alberta Hotel Tax & 3% DMF\",\n      \"compliant\": \"Y\",\n      \"comment\": \"Single room rate is clearly stated for the period December 1, 2022 to November 30, 2023.\"\n    },\n    {\n      \"field\": \"Check-In Time\",\n      \"actual_content\": \"\",\n      \"compliant\": \"N\",\n      \"comment\": \"No specific check-in time mentioned.\"\n    },\n    {\n      \"field\": \"Check-Out Time\",\n      \"actual_content\": \"\",\n      \"compliant\": \"N\",\n      \"comment\": \"No specific check-out time mentioned.\"\n    },\n    {\n      \"field\": \"Other Tax / Flat Tax\",\n      \"actual_content\": \"\",\n      \"compliant\": \"N\",\n      \"comment\": \"No other tax or flat tax mentioned separately.\"\n    },\n    {\n      \"field\": \"Is Contract Signed\",\n      \"actual_content\": \"Signature: illegible (Signature of Authorized Individual with power to bind ownership) Dan DeSantis General Manager\",\n      \"compliant\": \"Y\",\n      \"comment\": \"Contract is signed by Dan DeSantis, General Manager.\"\n    },\n    {\n      \"field\": \"Operational Memo\",\n      \"actual_content\": \"Hotel: Fax this completed report nightly to Travelliance Airline Services. Fax: 952-225-1063 Email: westjetbilling@travellianceinc.com\",\n      \"compliant\": \"Y\",\n      \"comment\": \"Operational memo regarding billing process is present.\"\n    }\n  ],\n  \"snippets\": [\n    {\n      \"label\": \"Room Rate & Reservations\",\n      \"text\": \"3.2.1. December 1, 2022 to November 30, 2023 Rate: $109.00 CAD plus 5% GST, 4% Alberta Hotel Tax & 3% DMF\",\n      \"page_or_section\": \"3.2.1\"\n    },\n    {\n      \"label\": \"Tax / Exemption / Refund\",\n      \"text\": \"5% GST, 4% Alberta Hotel Tax & 6% DMF\",\n      \"page_or_section\": \"3.2.4\"\n    },\n    {\n      \"label\": \"Term (Start/End)\",\n      \"text\": \"The term of this Agreement shall be for a period of 72 months, from December 1, 2022 through November 30, 2028\",\n      \"page_or_section\": \"2.1\"\n    },\n    {\n      \"label\": \"Early/Late Check-in/out / Layover\",\n      \"text\": \"Hotel will not issue early check-in or late check-out charges. Hotel will honor a single daily rate for a thirty (30) hour period of stay based on time in the Hotel, regardless of check-in and check-out times.\",\n      \"page_or_section\": \"3.4\"\n    },\n    {\n      \"label\": \"Cancellation Policy\",\n      \"text\": \"Hotel agrees not to charge for cancellations.\",\n      \"page_or_section\": \"3.6\"\n    },\n    {\n      \"label\": \"Additional Room Rules\",\n      \"text\": \"Hotel will charge for no-shows when Hotel Occupancy is at 95% or higher at the time of night audit for the date in question.\",\n      \"page_or_section\": \"3.5\"\n    }\n  ],\n  \"flags\": {\n    \"missing_fields\": [\n      \"Layover Rules\",\n      \"Check-In Time\",\n      \"Check-Out Time\",\n      \"Other Tax / Flat Tax\"\n    ],\n    \"ambiguous_points\": []\n  }\n}",
      "output_parsed": {
        "meta": {
          "document_title": "4_WJ YYC Delta Calgary Airport 2025 Amendment #1",
          "station_or_airport_code": "YYC",
          "hotel_name": "Delta Hotels Calgary Airport In-Terminal",
          "airline_name": "WestJet"
        },
        "yearly_terms": [
          {
            "year": 2025,
            "start_date": "December 1, 2024",
            "end_date": "November 30, 2025",
            "room_rate": "Rate: $119.00 CAD plus 5% GST, 4% Alberta Hotel Tax & 3% DMF",
            "currency": "CAD",
            "source_text": "3.2.3. December 1, 2024 to November 30, 2025 Rate: $119.00 CAD plus 5% GST, 4% Alberta Hotel Tax & 3% DMF"
          },
          {
            "year": 2026,
            "start_date": "December 1, 2025",
            "end_date": "November 30, 2026",
            "room_rate": "Rate: $125.00 CAD plus 5% GST, 4% Alberta Hotel Tax & 6% DMF",
            "currency": "CAD",
            "source_text": "3.2.4. December 1, 2025 to November 30, 2026 Rate: $125.00 CAD plus 5% GST, 4% Alberta Hotel Tax & 6% DMF"
          },
          {
            "year": 2027,
            "start_date": "December 1, 2026",
            "end_date": "November 30, 2027",
            "room_rate": "Rate: $131.00 CAD plus 5% GST, 4% Alberta Hotel Tax & 6% DMF",
            "currency": "CAD",
            "source_text": "3.2.5. December 1, 2026 to November 30, 2027 Rate: $131.00 CAD plus 5% GST, 4% Alberta Hotel Tax & 6% DMF"
          },
          {
            "year": 2028,
            "start_date": "December 1, 2027",
            "end_date": "November 30, 2028",
            "room_rate": "Rate: $138.00 CAD plus 5% GST, 4% Alberta Hotel Tax & 6% DMF",
            "currency": "CAD",
            "source_text": "3.2.6. December 1, 2027 to November 30, 2028 Rate: $138.00 CAD plus 5% GST, 4% Alberta Hotel Tax & 6% DMF"
          }
        ],
        "rate_periods": [
          {
            "period_label": "3.2.1",
            "start_date": "December 1, 2022",
            "end_date": "November 30, 2023",
            "room_rate": "Rate: $109.00 CAD plus 5% GST, 4% Alberta Hotel Tax & 3% DMF",
            "currency": "CAD",
            "taxes_and_fees": "5% GST, 4% Alberta Hotel Tax & 3% DMF",
            "source_text": "3.2.1. December 1, 2022 to November 30, 2023 Rate: $109.00 CAD plus 5% GST, 4% Alberta Hotel Tax & 3% DMF"
          },
          {
            "period_label": "3.2.2",
            "start_date": "December 1, 2023",
            "end_date": "November 30, 2024",
            "room_rate": "Rate: $114.00 CAD plus 5% GST, 4% Alberta Hotel Tax & 3% DMF",
            "currency": "CAD",
            "taxes_and_fees": "5% GST, 4% Alberta Hotel Tax & 3% DMF",
            "source_text": "3.2.2. December 1, 2023 to November 30, 2024 Rate: $114.00 CAD plus 5% GST, 4% Alberta Hotel Tax & 3% DMF"
          },
          {
            "period_label": "3.2.3",
            "start_date": "December 1, 2024",
            "end_date": "November 30, 2025",
            "room_rate": "Rate: $119.00 CAD plus 5% GST, 4% Alberta Hotel Tax & 3% DMF",
            "currency": "CAD",
            "taxes_and_fees": "5% GST, 4% Alberta Hotel Tax & 3% DMF",
            "source_text": "3.2.3. December 1, 2024 to November 30, 2025 Rate: $119.00 CAD plus 5% GST, 4% Alberta Hotel Tax & 3% DMF"
          },
          {
            "period_label": "3.2.4",
            "start_date": "December 1, 2025",
            "end_date": "November 30, 2026",
            "room_rate": "Rate: $125.00 CAD plus 5% GST, 4% Alberta Hotel Tax & 6% DMF",
            "currency": "CAD",
            "taxes_and_fees": "5% GST, 4% Alberta Hotel Tax & 6% DMF",
            "source_text": "3.2.4. December 1, 2025 to November 30, 2026 Rate: $125.00 CAD plus 5% GST, 4% Alberta Hotel Tax & 6% DMF"
          },
          {
            "period_label": "3.2.5",
            "start_date": "December 1, 2026",
            "end_date": "November 30, 2027",
            "room_rate": "Rate: $131.00 CAD plus 5% GST, 4% Alberta Hotel Tax & 6% DMF",
            "currency": "CAD",
            "taxes_and_fees": "5% GST, 4% Alberta Hotel Tax & 6% DMF",
            "source_text": "3.2.5. December 1, 2026 to November 30, 2027 Rate: $131.00 CAD plus 5% GST, 4% Alberta Hotel Tax & 6% DMF"
          },
          {
            "period_label": "3.2.6",
            "start_date": "December 1, 2027",
            "end_date": "November 30, 2028",
            "room_rate": "Rate: $138.00 CAD plus 5% GST, 4% Alberta Hotel Tax & 6% DMF",
            "currency": "CAD",
            "taxes_and_fees": "5% GST, 4% Alberta Hotel Tax & 6% DMF",
            "source_text": "3.2.6. December 1, 2027 to November 30, 2028 Rate: $138.00 CAD plus 5% GST, 4% Alberta Hotel Tax & 6% DMF"
          },
          {
            "period_label": "3.2.7",
            "start_date": "December 1, 2025",
            "end_date": "November 30, 2027",
            "room_rate": "Rate: $179.00 CAD plus 5% GST, 4% Alberta Hotel Tax & 6% DMF",
            "currency": "CAD",
            "taxes_and_fees": "5% GST, 4% Alberta Hotel Tax & 6% DMF",
            "source_text": "3.2.7. December 1, 2025 to November 30, 2027 Rate: $179.00 CAD plus 5% GST, 4% Alberta Hotel Tax & 6% DMF"
          },
          {
            "period_label": "3.2.8",
            "start_date": "December 1, 2027",
            "end_date": "November 30, 2028",
            "room_rate": "Rate: $189.00 CAD plus 5% GST, 4% Alberta Hotel Tax & 6% DMF",
            "currency": "CAD",
            "taxes_and_fees": "5% GST, 4% Alberta Hotel Tax & 6% DMF",
            "source_text": "3.2.8. December 1, 2027 to November 30, 2028 Rate: $189.00 CAD plus 5% GST, 4% Alberta Hotel Tax & 6% DMF"
          },
          {
            "period_label": "3.2.9",
            "start_date": "July 3, 2026",
            "end_date": "July 12, 2026",
            "room_rate": "Rate: $409.00 CAD plus 5% GST, 4% Alberta Hotel Tax & 6% DMF",
            "currency": "CAD",
            "taxes_and_fees": "5% GST, 4% Alberta Hotel Tax & 6% DMF",
            "source_text": "3.2.9. Stampede dates Room Rate Rate: $409.00 CAD plus 5% GST, 4% Alberta Hotel Tax & 6% DMF 3.2.9.1. Annually, Hotel is allowed to charge premium Rate for ten (10) days during Stampede * 2026: July 3–12"
          },
          {
            "period_label": "3.2.9",
            "start_date": "July 9, 2027",
            "end_date": "July 18, 2027",
            "room_rate": "Rate: $409.00 CAD plus 5% GST, 4% Alberta Hotel Tax & 6% DMF",
            "currency": "CAD",
            "taxes_and_fees": "5% GST, 4% Alberta Hotel Tax & 6% DMF",
            "source_text": "3.2.9. Stampede dates Room Rate Rate: $409.00 CAD plus 5% GST, 4% Alberta Hotel Tax & 6% DMF 3.2.9.1. Annually, Hotel is allowed to charge premium Rate for ten (10) days during Stampede * 2027: July 9–18"
          },
          {
            "period_label": "3.2.9",
            "start_date": "July 7, 2028",
            "end_date": "July 16, 2028",
            "room_rate": "Rate: $409.00 CAD plus 5% GST, 4% Alberta Hotel Tax & 6% DMF",
            "currency": "CAD",
            "taxes_and_fees": "5% GST, 4% Alberta Hotel Tax & 6% DMF",
            "source_text": "3.2.9. Stampede dates Room Rate Rate: $409.00 CAD plus 5% GST, 4% Alberta Hotel Tax & 6% DMF 3.2.9.1. Annually, Hotel is allowed to charge premium Rate for ten (10) days during Stampede * 2028: July 7–16"
          }
        ],
        "review": [
          {
            "field": "Name (Parties)",
            "actual_content": "TA Connections IL, LLC d/b/a TA CONNECTIONS 1900 East Golf Road, Suite M150 Schaumburg, IL 60173 (Hereinafter called \"TAC/TA Connections\") AND DELTA HOTELS CALGARY AIRPORT IN-TERMINAL 2011 Airport Road NE Calgary AB T2E 6Z8 Canada (hereinafter referred to as \"Hotel\")",
            "compliant": "Y",
            "comment": "Both parties' names are clearly stated."
          },
          {
            "field": "Start Date",
            "actual_content": "December 1, 2022",
            "compliant": "Y",
            "comment": "Start date is clearly stated as December 1, 2022."
          },
          {
            "field": "End Date",
            "actual_content": "November 30, 2028",
            "compliant": "Y",
            "comment": "End date is clearly stated as November 30, 2028."
          },
          {
            "field": "Room Capping",
            "actual_content": "Hotel agrees to offer and make available during the Term of this Agreement up to 51 Rooms on a daily basis until November 30, 2025 and then up to 72 Rooms daily for duration of Agreement",
            "compliant": "Y",
            "comment": "Room capping is clearly defined with specific numbers."
          },
          {
            "field": "Ad Hoc Rate",
            "actual_content": "Room Rates are applicable to Crew Rooms, Corporate Travel, Ad Hoc / IROP Crew.",
            "compliant": "Y",
            "comment": "Ad Hoc rate applicability is mentioned."
          },
          {
            "field": "Currency",
            "actual_content": "CAD",
            "compliant": "Y",
            "comment": "Currency is clearly stated as CAD."
          },
          {
            "field": "Tax Rate and Exemption",
            "actual_content": "5% GST, 4% Alberta Hotel Tax & 6% DMF",
            "compliant": "Y",
            "comment": "Tax rates are clearly defined."
          },
          {
            "field": "Early Check-ins and Check-outs",
            "actual_content": "Hotel will not issue early check-in or late check-out charges. Hotel will honor a single daily rate for a thirty (30) hour period of stay based on time in the Hotel, regardless of check-in and check-out times.",
            "compliant": "Y",
            "comment": "Early and late check-in/out policy is clearly defined with no extra charges."
          },
          {
            "field": "Weekend/Special-Day Rates",
            "actual_content": "Stampede dates Room Rate Rate: $409.00 CAD plus 5% GST, 4% Alberta Hotel Tax & 6% DMF",
            "compliant": "Y",
            "comment": "Special rates for Stampede dates are clearly defined."
          },
          {
            "field": "Layover Rules",
            "actual_content": "",
            "compliant": "N",
            "comment": "No specific layover rules mentioned."
          },
          {
            "field": "Cancellation Policy",
            "actual_content": "Hotel agrees not to charge for cancellations.",
            "compliant": "Y",
            "comment": "Cancellation policy is clearly defined."
          },
          {
            "field": "Additional Room Rules",
            "actual_content": "Hotel will charge for no-shows when Hotel Occupancy is at 95% or higher at the time of night audit for the date in question.",
            "compliant": "Y",
            "comment": "Additional room rules regarding no-shows are clearly defined."
          },
          {
            "field": "Commission Rate",
            "actual_content": "The Room Rate, excluding taxes, will be commissionable to TAC at a rate of 10% commission per Room, per night.",
            "compliant": "Y",
            "comment": "Commission rate is clearly stated."
          },
          {
            "field": "Single Room Rate",
            "actual_content": "Rate: $109.00 CAD plus 5% GST, 4% Alberta Hotel Tax & 3% DMF",
            "compliant": "Y",
            "comment": "Single room rate is clearly stated for the period December 1, 2022 to November 30, 2023."
          },
          {
            "field": "Check-In Time",
            "actual_content": "",
            "compliant": "N",
            "comment": "No specific check-in time mentioned."
          },
          {
            "field": "Check-Out Time",
            "actual_content": "",
            "compliant": "N",
            "comment": "No specific check-out time mentioned."
          },
          {
            "field": "Other Tax / Flat Tax",
            "actual_content": "",
            "compliant": "N",
            "comment": "No other tax or flat tax mentioned separately."
          },
          {
            "field": "Is Contract Signed",
            "actual_content": "Signature: illegible (Signature of Authorized Individual with power to bind ownership) Dan DeSantis General Manager",
            "compliant": "Y",
            "comment": "Contract is signed by Dan DeSantis, General Manager."
          },
          {
            "field": "Operational Memo",
            "actual_content": "Hotel: Fax this completed report nightly to Travelliance Airline Services. Fax: 952-225-1063 Email: westjetbilling@travellianceinc.com",
            "compliant": "Y",
            "comment": "Operational memo regarding billing process is present."
          }
        ],
        "snippets": [
          {
            "label": "Room Rate & Reservations",
            "text": "3.2.1. December 1, 2022 to November 30, 2023 Rate: $109.00 CAD plus 5% GST, 4% Alberta Hotel Tax & 3% DMF",
            "page_or_section": "3.2.1"
          },
          {
            "label": "Tax / Exemption / Refund",
            "text": "5% GST, 4% Alberta Hotel Tax & 6% DMF",
            "page_or_section": "3.2.4"
          },
          {
            "label": "Term (Start/End)",
            "text": "The term of this Agreement shall be for a period of 72 months, from December 1, 2022 through November 30, 2028",
            "page_or_section": "2.1"
          },
          {
            "label": "Early/Late Check-in/out / Layover",
            "text": "Hotel will not issue early check-in or late check-out charges. Hotel will honor a single daily rate for a thirty (30) hour period of stay based on time in the Hotel, regardless of check-in and check-out times.",
            "page_or_section": "3.4"
          },
          {
            "label": "Cancellation Policy",
            "text": "Hotel agrees not to charge for cancellations.",
            "page_or_section": "3.6"
          },
          {
            "label": "Additional Room Rules",
            "text": "Hotel will charge for no-shows when Hotel Occupancy is at 95% or higher at the time of night audit for the date in question.",
            "page_or_section": "3.5"
          }
        ],
        "flags": {
          "missing_fields": [
            "Layover Rules",
            "Check-In Time",
            "Check-Out Time",
            "Other Tax / Flat Tax"
          ],
          "ambiguous_points": []
        }
      },
      "flat_rows": [
        {
          "run_id": "69a10eb170199a6ebe8293c5",
          "file_name": "4_WJ YYC Delta Calgary Airport 2025 Amendment #1.pdf",
          "timestamp": "2026-02-27 08:55:09",
          "yearly_terms": [
            {
              "year": 2025,
              "start_date": "December 1, 2024",
              "end_date": "November 30, 2025",
              "room_rate": "Rate: $119.00 CAD plus 5% GST, 4% Alberta Hotel Tax & 3% DMF",
              "currency": "CAD",
              "source_text": "3.2.3. December 1, 2024 to November 30, 2025 Rate: $119.00 CAD plus 5% GST, 4% Alberta Hotel Tax & 3% DMF"
            },
            {
              "year": 2026,
              "start_date": "December 1, 2025",
              "end_date": "November 30, 2026",
              "room_rate": "Rate: $125.00 CAD plus 5% GST, 4% Alberta Hotel Tax & 6% DMF",
              "currency": "CAD",
              "source_text": "3.2.4. December 1, 2025 to November 30, 2026 Rate: $125.00 CAD plus 5% GST, 4% Alberta Hotel Tax & 6% DMF"
            },
            {
              "year": 2027,
              "start_date": "December 1, 2026",
              "end_date": "November 30, 2027",
              "room_rate": "Rate: $131.00 CAD plus 5% GST, 4% Alberta Hotel Tax & 6% DMF",
              "currency": "CAD",
              "source_text": "3.2.5. December 1, 2026 to November 30, 2027 Rate: $131.00 CAD plus 5% GST, 4% Alberta Hotel Tax & 6% DMF"
            },
            {
              "year": 2028,
              "start_date": "December 1, 2027",
              "end_date": "November 30, 2028",
              "room_rate": "Rate: $138.00 CAD plus 5% GST, 4% Alberta Hotel Tax & 6% DMF",
              "currency": "CAD",
              "source_text": "3.2.6. December 1, 2027 to November 30, 2028 Rate: $138.00 CAD plus 5% GST, 4% Alberta Hotel Tax & 6% DMF"
            }
          ],
          "rate_periods": [
            {
              "period_label": "3.2.1",
              "start_date": "December 1, 2022",
              "end_date": "November 30, 2023",
              "room_rate": "Rate: $109.00 CAD plus 5% GST, 4% Alberta Hotel Tax & 3% DMF",
              "currency": "CAD",
              "taxes_and_fees": "5% GST, 4% Alberta Hotel Tax & 3% DMF",
              "source_text": "3.2.1. December 1, 2022 to November 30, 2023 Rate: $109.00 CAD plus 5% GST, 4% Alberta Hotel Tax & 3% DMF"
            },
            {
              "period_label": "3.2.2",
              "start_date": "December 1, 2023",
              "end_date": "November 30, 2024",
              "room_rate": "Rate: $114.00 CAD plus 5% GST, 4% Alberta Hotel Tax & 3% DMF",
              "currency": "CAD",
              "taxes_and_fees": "5% GST, 4% Alberta Hotel Tax & 3% DMF",
              "source_text": "3.2.2. December 1, 2023 to November 30, 2024 Rate: $114.00 CAD plus 5% GST, 4% Alberta Hotel Tax & 3% DMF"
            },
            {
              "period_label": "3.2.3",
              "start_date": "December 1, 2024",
              "end_date": "November 30, 2025",
              "room_rate": "Rate: $119.00 CAD plus 5% GST, 4% Alberta Hotel Tax & 3% DMF",
              "currency": "CAD",
              "taxes_and_fees": "5% GST, 4% Alberta Hotel Tax & 3% DMF",
              "source_text": "3.2.3. December 1, 2024 to November 30, 2025 Rate: $119.00 CAD plus 5% GST, 4% Alberta Hotel Tax & 3% DMF"
            },
            {
              "period_label": "3.2.4",
              "start_date": "December 1, 2025",
              "end_date": "November 30, 2026",
              "room_rate": "Rate: $125.00 CAD plus 5% GST, 4% Alberta Hotel Tax & 6% DMF",
              "currency": "CAD",
              "taxes_and_fees": "5% GST, 4% Alberta Hotel Tax & 6% DMF",
              "source_text": "3.2.4. December 1, 2025 to November 30, 2026 Rate: $125.00 CAD plus 5% GST, 4% Alberta Hotel Tax & 6% DMF"
            },
            {
              "period_label": "3.2.5",
              "start_date": "December 1, 2026",
              "end_date": "November 30, 2027",
              "room_rate": "Rate: $131.00 CAD plus 5% GST, 4% Alberta Hotel Tax & 6% DMF",
              "currency": "CAD",
              "taxes_and_fees": "5% GST, 4% Alberta Hotel Tax & 6% DMF",
              "source_text": "3.2.5. December 1, 2026 to November 30, 2027 Rate: $131.00 CAD plus 5% GST, 4% Alberta Hotel Tax & 6% DMF"
            },
            {
              "period_label": "3.2.6",
              "start_date": "December 1, 2027",
              "end_date": "November 30, 2028",
              "room_rate": "Rate: $138.00 CAD plus 5% GST, 4% Alberta Hotel Tax & 6% DMF",
              "currency": "CAD",
              "taxes_and_fees": "5% GST, 4% Alberta Hotel Tax & 6% DMF",
              "source_text": "3.2.6. December 1, 2027 to November 30, 2028 Rate: $138.00 CAD plus 5% GST, 4% Alberta Hotel Tax & 6% DMF"
            },
            {
              "period_label": "3.2.7",
              "start_date": "December 1, 2025",
              "end_date": "November 30, 2027",
              "room_rate": "Rate: $179.00 CAD plus 5% GST, 4% Alberta Hotel Tax & 6% DMF",
              "currency": "CAD",
              "taxes_and_fees": "5% GST, 4% Alberta Hotel Tax & 6% DMF",
              "source_text": "3.2.7. December 1, 2025 to November 30, 2027 Rate: $179.00 CAD plus 5% GST, 4% Alberta Hotel Tax & 6% DMF"
            },
            {
              "period_label": "3.2.8",
              "start_date": "December 1, 2027",
              "end_date": "November 30, 2028",
              "room_rate": "Rate: $189.00 CAD plus 5% GST, 4% Alberta Hotel Tax & 6% DMF",
              "currency": "CAD",
              "taxes_and_fees": "5% GST, 4% Alberta Hotel Tax & 6% DMF",
              "source_text": "3.2.8. December 1, 2027 to November 30, 2028 Rate: $189.00 CAD plus 5% GST, 4% Alberta Hotel Tax & 6% DMF"
            },
            {
              "period_label": "3.2.9",
              "start_date": "July 3, 2026",
              "end_date": "July 12, 2026",
              "room_rate": "Rate: $409.00 CAD plus 5% GST, 4% Alberta Hotel Tax & 6% DMF",
              "currency": "CAD",
              "taxes_and_fees": "5% GST, 4% Alberta Hotel Tax & 6% DMF",
              "source_text": "3.2.9. Stampede dates Room Rate Rate: $409.00 CAD plus 5% GST, 4% Alberta Hotel Tax & 6% DMF 3.2.9.1. Annually, Hotel is allowed to charge premium Rate for ten (10) days during Stampede * 2026: July 3–12"
            },
            {
              "period_label": "3.2.9",
              "start_date": "July 9, 2027",
              "end_date": "July 18, 2027",
              "room_rate": "Rate: $409.00 CAD plus 5% GST, 4% Alberta Hotel Tax & 6% DMF",
              "currency": "CAD",
              "taxes_and_fees": "5% GST, 4% Alberta Hotel Tax & 6% DMF",
              "source_text": "3.2.9. Stampede dates Room Rate Rate: $409.00 CAD plus 5% GST, 4% Alberta Hotel Tax & 6% DMF 3.2.9.1. Annually, Hotel is allowed to charge premium Rate for ten (10) days during Stampede * 2027: July 9–18"
            },
            {
              "period_label": "3.2.9",
              "start_date": "July 7, 2028",
              "end_date": "July 16, 2028",
              "room_rate": "Rate: $409.00 CAD plus 5% GST, 4% Alberta Hotel Tax & 6% DMF",
              "currency": "CAD",
              "taxes_and_fees": "5% GST, 4% Alberta Hotel Tax & 6% DMF",
              "source_text": "3.2.9. Stampede dates Room Rate Rate: $409.00 CAD plus 5% GST, 4% Alberta Hotel Tax & 6% DMF 3.2.9.1. Annually, Hotel is allowed to charge premium Rate for ten (10) days during Stampede * 2028: July 7–16"
            }
          ],
          "review": [
            {
              "field": "Name (Parties)",
              "actual_content": "TA Connections IL, LLC d/b/a TA CONNECTIONS 1900 East Golf Road, Suite M150 Schaumburg, IL 60173 (Hereinafter called \"TAC/TA Connections\") AND DELTA HOTELS CALGARY AIRPORT IN-TERMINAL 2011 Airport Road NE Calgary AB T2E 6Z8 Canada (hereinafter referred to as \"Hotel\")",
              "compliant": "Y",
              "comment": "Both parties' names are clearly stated."
            },
            {
              "field": "Start Date",
              "actual_content": "December 1, 2022",
              "compliant": "Y",
              "comment": "Start date is clearly stated as December 1, 2022."
            },
            {
              "field": "End Date",
              "actual_content": "November 30, 2028",
              "compliant": "Y",
              "comment": "End date is clearly stated as November 30, 2028."
            },
            {
              "field": "Room Capping",
              "actual_content": "Hotel agrees to offer and make available during the Term of this Agreement up to 51 Rooms on a daily basis until November 30, 2025 and then up to 72 Rooms daily for duration of Agreement",
              "compliant": "Y",
              "comment": "Room capping is clearly defined with specific numbers."
            },
            {
              "field": "Ad Hoc Rate",
              "actual_content": "Room Rates are applicable to Crew Rooms, Corporate Travel, Ad Hoc / IROP Crew.",
              "compliant": "Y",
              "comment": "Ad Hoc rate applicability is mentioned."
            },
            {
              "field": "Currency",
              "actual_content": "CAD",
              "compliant": "Y",
              "comment": "Currency is clearly stated as CAD."
            },
            {
              "field": "Tax Rate and Exemption",
              "actual_content": "5% GST, 4% Alberta Hotel Tax & 6% DMF",
              "compliant": "Y",
              "comment": "Tax rates are clearly defined."
            },
            {
              "field": "Early Check-ins and Check-outs",
              "actual_content": "Hotel will not issue early check-in or late check-out charges. Hotel will honor a single daily rate for a thirty (30) hour period of stay based on time in the Hotel, regardless of check-in and check-out times.",
              "compliant": "Y",
              "comment": "Early and late check-in/out policy is clearly defined with no extra charges."
            },
            {
              "field": "Weekend/Special-Day Rates",
              "actual_content": "Stampede dates Room Rate Rate: $409.00 CAD plus 5% GST, 4% Alberta Hotel Tax & 6% DMF",
              "compliant": "Y",
              "comment": "Special rates for Stampede dates are clearly defined."
            },
            {
              "field": "Layover Rules",
              "actual_content": "",
              "compliant": "N",
              "comment": "No specific layover rules mentioned."
            },
            {
              "field": "Cancellation Policy",
              "actual_content": "Hotel agrees not to charge for cancellations.",
              "compliant": "Y",
              "comment": "Cancellation policy is clearly defined."
            },
            {
              "field": "Additional Room Rules",
              "actual_content": "Hotel will charge for no-shows when Hotel Occupancy is at 95% or higher at the time of night audit for the date in question.",
              "compliant": "Y",
              "comment": "Additional room rules regarding no-shows are clearly defined."
            },
            {
              "field": "Commission Rate",
              "actual_content": "The Room Rate, excluding taxes, will be commissionable to TAC at a rate of 10% commission per Room, per night.",
              "compliant": "Y",
              "comment": "Commission rate is clearly stated."
            },
            {
              "field": "Single Room Rate",
              "actual_content": "Rate: $109.00 CAD plus 5% GST, 4% Alberta Hotel Tax & 3% DMF",
              "compliant": "Y",
              "comment": "Single room rate is clearly stated for the period December 1, 2022 to November 30, 2023."
            },
            {
              "field": "Check-In Time",
              "actual_content": "",
              "compliant": "N",
              "comment": "No specific check-in time mentioned."
            },
            {
              "field": "Check-Out Time",
              "actual_content": "",
              "compliant": "N",
              "comment": "No specific check-out time mentioned."
            },
            {
              "field": "Other Tax / Flat Tax",
              "actual_content": "",
              "compliant": "N",
              "comment": "No other tax or flat tax mentioned separately."
            },
            {
              "field": "Is Contract Signed",
              "actual_content": "Signature: illegible (Signature of Authorized Individual with power to bind ownership) Dan DeSantis General Manager",
              "compliant": "Y",
              "comment": "Contract is signed by Dan DeSantis, General Manager."
            },
            {
              "field": "Operational Memo",
              "actual_content": "Hotel: Fax this completed report nightly to Travelliance Airline Services. Fax: 952-225-1063 Email: westjetbilling@travellianceinc.com",
              "compliant": "Y",
              "comment": "Operational memo regarding billing process is present."
            }
          ],
          "snippets": [
            {
              "label": "Room Rate & Reservations",
              "text": "3.2.1. December 1, 2022 to November 30, 2023 Rate: $109.00 CAD plus 5% GST, 4% Alberta Hotel Tax & 3% DMF",
              "page_or_section": "3.2.1"
            },
            {
              "label": "Tax / Exemption / Refund",
              "text": "5% GST, 4% Alberta Hotel Tax & 6% DMF",
              "page_or_section": "3.2.4"
            },
            {
              "label": "Term (Start/End)",
              "text": "The term of this Agreement shall be for a period of 72 months, from December 1, 2022 through November 30, 2028",
              "page_or_section": "2.1"
            },
            {
              "label": "Early/Late Check-in/out / Layover",
              "text": "Hotel will not issue early check-in or late check-out charges. Hotel will honor a single daily rate for a thirty (30) hour period of stay based on time in the Hotel, regardless of check-in and check-out times.",
              "page_or_section": "3.4"
            },
            {
              "label": "Cancellation Policy",
              "text": "Hotel agrees not to charge for cancellations.",
              "page_or_section": "3.6"
            },
            {
              "label": "Additional Room Rules",
              "text": "Hotel will charge for no-shows when Hotel Occupancy is at 95% or higher at the time of night audit for the date in question.",
              "page_or_section": "3.5"
            }
          ],
          "meta.document_title": "4_WJ YYC Delta Calgary Airport 2025 Amendment #1",
          "meta.station_or_airport_code": "YYC",
          "meta.hotel_name": "Delta Hotels Calgary Airport In-Terminal",
          "meta.airline_name": "WestJet",
          "flags.missing_fields": [
            "Layover Rules",
            "Check-In Time",
            "Check-Out Time",
            "Other Tax / Flat Tax"
          ],
          "flags.ambiguous_points": []
        }
      ],
      "meta": {
        "timestamp": "2026-02-27 08:55:09",
        "file_name": "4_WJ YYC Delta Calgary Airport 2025 Amendment #1.pdf",
        "run_id": "69a10eb170199a6ebe8293c5"
      }
    }
  ]
};
