/**
 * Prototype fixtures. Every screen in this build reads from here so the demo
 * stays internally consistent — the same instrument IDs, officers and
 * districts surface across the citizen, trader, LMO and admin modules.
 */

export type Status =
  | "valid"
  | "expiring"
  | "expired"
  | "rejected"
  | "pending"
  | "scheduled"
  | "under-verification";

export const statusLabel: Record<Status, string> = {
  valid: "Valid",
  expiring: "Expiring Soon",
  expired: "Expired",
  rejected: "Rejected",
  pending: "Pending",
  scheduled: "Scheduled",
  "under-verification": "Under Verification",
};

export type Instrument = {
  id: string;
  serial: string;
  name: string;
  category: "Weighing" | "Measuring" | "Dispensing";
  make: string;
  model: string;
  accuracyClass: "Class I" | "Class II" | "Class III" | "Class IIII";
  capacity: string;
  location: string;
  stampedOn: string;
  validTill: string;
  status: Status;
  officer: string;
  certificateId?: string;
};

export const instruments: Instrument[] = [
  {
    id: "LM-UP-PRY-000123",
    serial: "ESSAE-DS-45219",
    name: "Digital Weighing Scale",
    category: "Weighing",
    make: "Essae Digitronics",
    model: "DS-415N",
    accuracyClass: "Class III",
    capacity: "30 kg / e = 10 g",
    location: "Counter 1 — Civil Lines, Prayagraj",
    stampedOn: "12 Jun 2025",
    validTill: "11 Jun 2026",
    status: "valid",
    officer: "Sh. Anil Verma (LMO/PRY/04)",
    certificateId: "LMC/UP/2025/0084219",
  },
  {
    id: "LM-UP-PRY-000124",
    serial: "AVERY-PS-77812",
    name: "Platform Scale",
    category: "Weighing",
    make: "Avery India",
    model: "PS-500",
    accuracyClass: "Class III",
    capacity: "500 kg / e = 100 g",
    location: "Godown — Mundera Mandi",
    stampedOn: "03 Sep 2024",
    validTill: "02 Sep 2025",
    status: "expiring",
    officer: "Sh. Anil Verma (LMO/PRY/04)",
    certificateId: "LMC/UP/2024/0061140",
  },
  {
    id: "LM-UP-PRY-000125",
    serial: "TOKHEIM-FD-2291",
    name: "Fuel Dispenser (Nozzle 2)",
    category: "Dispensing",
    make: "Tokheim",
    model: "Quantium 510",
    accuracyClass: "Class I",
    capacity: "5 L test measure",
    location: "Bharat Petroleum — GT Road Outlet",
    stampedOn: "18 Jan 2025",
    validTill: "17 Jan 2026",
    status: "valid",
    officer: "Smt. Kavita Rao (LMO/PRY/07)",
    certificateId: "LMC/UP/2025/0071008",
  },
  {
    id: "LM-UP-PRY-000126",
    serial: "SANSUI-MM-1102",
    name: "Milk Fat Meter",
    category: "Measuring",
    make: "Sansui Instruments",
    model: "MM-11",
    accuracyClass: "Class II",
    capacity: "2 L",
    location: "Dairy Booth — Katra",
    stampedOn: "28 Apr 2024",
    validTill: "27 Apr 2025",
    status: "expired",
    officer: "Sh. Anil Verma (LMO/PRY/04)",
  },
  {
    id: "LM-UP-PRY-000127",
    serial: "ESSAE-JB-9931",
    name: "Precision Jewellery Balance",
    category: "Weighing",
    make: "Essae Digitronics",
    model: "JB-220",
    accuracyClass: "Class II",
    capacity: "220 g / e = 1 mg",
    location: "Showroom — Chowk Gangadaspur",
    stampedOn: "02 Feb 2025",
    validTill: "01 Feb 2026",
    status: "rejected",
    officer: "Smt. Kavita Rao (LMO/PRY/07)",
  },
  {
    id: "LM-UP-PRY-000128",
    serial: "AVERY-BS-4410",
    name: "Bench Scale",
    category: "Weighing",
    make: "Avery India",
    model: "BS-44",
    accuracyClass: "Class III",
    capacity: "50 kg / e = 20 g",
    location: "Counter 2 — Civil Lines, Prayagraj",
    stampedOn: "20 Jul 2025",
    validTill: "19 Jul 2026",
    status: "valid",
    officer: "Sh. Anil Verma (LMO/PRY/04)",
    certificateId: "LMC/UP/2025/0090311",
  },
];

export const instrumentById = (id: string) =>
  instruments.find((item) => item.id === id) ?? instruments[0];

export type Application = {
  id: string;
  instrument: string;
  instrumentId: string;
  type: string;
  filedOn: string;
  status: Status;
  nextAction: string;
  fee: number;
};

export const applications: Application[] = [
  {
    id: "APP2025001245",
    instrument: "Digital Weighing Scale",
    instrumentId: "LM-UP-PRY-000123",
    type: "Periodic Renewal",
    filedOn: "18 May 2025",
    status: "pending",
    nextAction: "Document verification by dealing assistant",
    fee: 240,
  },
  {
    id: "APP2025001187",
    instrument: "Platform Scale",
    instrumentId: "LM-UP-PRY-000124",
    type: "Post-Repair Re-verification",
    filedOn: "15 May 2025",
    status: "scheduled",
    nextAction: "Inspection on 22 May 2025, 11:00 AM",
    fee: 1150,
  },
  {
    id: "APP2025001102",
    instrument: "Fuel Dispenser (Nozzle 2)",
    instrumentId: "LM-UP-PRY-000125",
    type: "Tatkal Re-verification",
    filedOn: "10 May 2025",
    status: "under-verification",
    nextAction: "Field readings being recorded",
    fee: 2400,
  },
  {
    id: "APP2025000987",
    instrument: "Bench Scale",
    instrumentId: "LM-UP-PRY-000128",
    type: "New Stamping",
    filedOn: "05 May 2025",
    status: "valid",
    nextAction: "Download certificate LMC/UP/2025/0090311",
    fee: 300,
  },
  {
    id: "APP2025000765",
    instrument: "Precision Jewellery Balance",
    instrumentId: "LM-UP-PRY-000127",
    type: "Periodic Renewal",
    filedOn: "28 Apr 2025",
    status: "rejected",
    nextAction: "Error beyond MPE at 200 g — rectify and re-test",
    fee: 480,
  },
];

export type Inspection = {
  id: string;
  business: string;
  address: string;
  instrument: string;
  instrumentId: string;
  slot: string;
  distanceKm: number;
  kind: "New Stamping" | "Renewal" | "Re-test" | "Surprise Raid";
  priority: "Normal" | "Tatkal" | "Urgent";
};

export const inspections: Inspection[] = [
  {
    id: "INS-2025-4412",
    business: "ABC Traders",
    address: "12/4 Civil Lines, Prayagraj — 211001",
    instrument: "Digital Weighing Scale",
    instrumentId: "LM-UP-PRY-000123",
    slot: "09:30 — 10:15",
    distanceKm: 1.2,
    kind: "Renewal",
    priority: "Normal",
  },
  {
    id: "INS-2025-4413",
    business: "Bharat Petroleum — GT Road",
    address: "GT Road, Naini, Prayagraj — 211008",
    instrument: "Fuel Dispenser (Nozzle 2)",
    instrumentId: "LM-UP-PRY-000125",
    slot: "11:00 — 12:00",
    distanceKm: 6.4,
    kind: "Re-test",
    priority: "Tatkal",
  },
  {
    id: "INS-2025-4414",
    business: "Shree Gold Jewellers",
    address: "Chowk Gangadaspur, Prayagraj — 211003",
    instrument: "Precision Jewellery Balance",
    instrumentId: "LM-UP-PRY-000127",
    slot: "13:30 — 14:15",
    distanceKm: 3.1,
    kind: "Re-test",
    priority: "Urgent",
  },
  {
    id: "INS-2025-4415",
    business: "Mundera Sabzi Mandi — Stall 44",
    address: "Mundera Mandi, Prayagraj — 211011",
    instrument: "Platform Scale",
    instrumentId: "LM-UP-PRY-000124",
    slot: "15:00 — 15:45",
    distanceKm: 8.9,
    kind: "Surprise Raid",
    priority: "Urgent",
  },
];

export const inspectionById = (id: string) =>
  inspections.find((item) => item.id === id) ?? inspections[0];

export type Camp = {
  id: string;
  market: string;
  district: string;
  day: string;
  date: string;
  window: string;
  van: string;
  officer: string;
  state: "active" | "upcoming" | "completed";
  done: number;
  target: number;
};

export const camps: Camp[] = [
  {
    id: "CAMP-PRY-11",
    market: "Mundera Sabzi Mandi",
    district: "Prayagraj",
    day: "Monday",
    date: "26 May 2025",
    window: "07:00 — 13:00",
    van: "UP70-LM-0114",
    officer: "Sh. Anil Verma",
    state: "active",
    done: 62,
    target: 90,
  },
  {
    id: "CAMP-PRY-12",
    market: "Sadar Bazaar Weekly Haat",
    district: "Prayagraj",
    day: "Tuesday",
    date: "27 May 2025",
    window: "08:00 — 14:00",
    van: "UP70-LM-0114",
    officer: "Smt. Kavita Rao",
    state: "upcoming",
    done: 0,
    target: 75,
  },
  {
    id: "CAMP-PRY-13",
    market: "Katra Fish & Meat Market",
    district: "Prayagraj",
    day: "Wednesday",
    date: "28 May 2025",
    window: "06:30 — 11:30",
    van: "UP70-LM-0209",
    officer: "Sh. Ramesh Yadav",
    state: "upcoming",
    done: 0,
    target: 40,
  },
  {
    id: "CAMP-KNP-04",
    market: "Naveen Galla Mandi",
    district: "Kanpur Nagar",
    day: "Saturday",
    date: "24 May 2025",
    window: "07:00 — 12:00",
    van: "UP78-LM-0031",
    officer: "Sh. Dinesh Pal",
    state: "completed",
    done: 118,
    target: 110,
  },
  {
    id: "CAMP-LKO-09",
    market: "Aminabad Retail Market",
    district: "Lucknow",
    day: "Thursday",
    date: "29 May 2025",
    window: "09:00 — 15:00",
    van: "UP32-LM-0077",
    officer: "Sh. Faizan Ahmad",
    state: "upcoming",
    done: 0,
    target: 130,
  },
];

export const districtCompliance = [
  { district: "Prayagraj", rate: 91, instruments: 41280, pending: 3712 },
  { district: "Lucknow", rate: 88, instruments: 68120, pending: 8174 },
  { district: "Agra", rate: 85, instruments: 42010, pending: 6301 },
  { district: "Varanasi", rate: 82, instruments: 47990, pending: 8638 },
  { district: "Meerut", rate: 78, instruments: 38470, pending: 8463 },
  { district: "Kanpur Nagar", rate: 74, instruments: 59340, pending: 15428 },
  { district: "Gorakhpur", rate: 69, instruments: 31210, pending: 9675 },
  { district: "Bareilly", rate: 63, instruments: 27880, pending: 10315 },
];

export const challans = [
  {
    id: "ECH/UP/2025/11204",
    trader: "Sunrise Kirana Store",
    district: "Kanpur Nagar",
    instrument: "LM-UP-KNP-004411",
    overdueDays: 62,
    fine: 6000,
    state: "Notice Dispatched",
  },
  {
    id: "ECH/UP/2025/11205",
    trader: "Maa Vaishno Petro Services",
    district: "Bareilly",
    instrument: "LM-UP-BLY-001902",
    overdueDays: 118,
    fine: 25000,
    state: "Escalated to Court",
  },
  {
    id: "ECH/UP/2025/11206",
    trader: "Gupta Sweets & Namkeen",
    district: "Lucknow",
    instrument: "LM-UP-LKO-008820",
    overdueDays: 41,
    fine: 4000,
    state: "Pending Payment",
  },
  {
    id: "ECH/UP/2025/11207",
    trader: "Shree Gold Jewellers",
    district: "Prayagraj",
    instrument: "LM-UP-PRY-000127",
    overdueDays: 35,
    fine: 12000,
    state: "Pending Payment",
  },
  {
    id: "ECH/UP/2025/11208",
    trader: "Annapurna Rice Mill",
    district: "Gorakhpur",
    instrument: "LM-UP-GKP-003318",
    overdueDays: 87,
    fine: 18000,
    state: "Notice Dispatched",
  },
];

export const fraudReports = [
  {
    id: "FR-2025-08841",
    filedOn: "20 May 2025, 10:42 AM",
    shop: "Sunrise Kirana Store",
    locality: "Govind Nagar, Kanpur Nagar",
    issue: "Scale manipulated",
    severity: "High" as const,
    anonymous: true,
    evidence: 2,
  },
  {
    id: "FR-2025-08840",
    filedOn: "20 May 2025, 09:10 AM",
    shop: "Maa Vaishno Petro Services",
    locality: "Civil Lines, Bareilly",
    issue: "Seal broken",
    severity: "High" as const,
    anonymous: false,
    evidence: 3,
  },
  {
    id: "FR-2025-08839",
    filedOn: "19 May 2025, 06:55 PM",
    shop: "Gupta Sweets & Namkeen",
    locality: "Aminabad, Lucknow",
    issue: "Charging on gross weight",
    severity: "Medium" as const,
    anonymous: true,
    evidence: 1,
  },
  {
    id: "FR-2025-08838",
    filedOn: "19 May 2025, 02:31 PM",
    shop: "Nandini Vegetable Stall",
    locality: "Mundera Mandi, Prayagraj",
    issue: "Refused to show certificate",
    severity: "Low" as const,
    anonymous: false,
    evidence: 0,
  },
];

export const certificates = [
  {
    id: "LMC/UP/2025/0084219",
    instrument: "Digital Weighing Scale",
    instrumentId: "LM-UP-PRY-000123",
    issuedOn: "12 Jun 2025",
    validTill: "11 Jun 2026",
    officer: "Sh. Anil Verma",
    hash: "9f2c:4ae1:77b0:c3d9",
  },
  {
    id: "LMC/UP/2025/0090311",
    instrument: "Bench Scale",
    instrumentId: "LM-UP-PRY-000128",
    issuedOn: "20 Jul 2025",
    validTill: "19 Jul 2026",
    officer: "Sh. Anil Verma",
    hash: "1b77:9e04:2fa8:60c1",
  },
  {
    id: "LMC/UP/2025/0071008",
    instrument: "Fuel Dispenser (Nozzle 2)",
    instrumentId: "LM-UP-PRY-000125",
    issuedOn: "18 Jan 2025",
    validTill: "17 Jan 2026",
    officer: "Smt. Kavita Rao",
    hash: "c40e:81bb:15d7:a992",
  },
  {
    id: "LMC/UP/2024/0061140",
    instrument: "Platform Scale",
    instrumentId: "LM-UP-PRY-000124",
    issuedOn: "03 Sep 2024",
    validTill: "02 Sep 2025",
    officer: "Sh. Anil Verma",
    hash: "77a1:3c0f:be52:04dd",
  },
];

/** Maximum Permissible Error table used by the field calibration workspace. */
export const mpeTable = [
  { load: "10% of Max", applied: 3, mpeGrams: 5 },
  { load: "50% of Max", applied: 15, mpeGrams: 10 },
  { load: "100% of Max", applied: 30, mpeGrams: 15 },
];

export const rupees = (value: number) => `₹${value.toLocaleString("en-IN")}`;
