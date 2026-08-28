import { ArrowRight } from "lucide-react";

const applications = [
  {
    id: "APP2025001245",
    instrument: "Digital Weighing Scale",
    type: "Weighing",
    date: "18 May 2025",
    status: "Pending",
    nextAction: "Document Verification",
  },
  {
    id: "APP2025001187",
    instrument: "Electronic Weighing Machine",
    type: "Weighing",
    date: "15 May 2025",
    status: "Scheduled",
    nextAction: "Verification on 22 May 2025",
  },
  {
    id: "APP2025001102",
    instrument: "Fuel Dispenser",
    type: "Measuring",
    date: "10 May 2025",
    status: "Under Verification",
    nextAction: "-",
  },
  {
    id: "APP2025000987",
    instrument: "Platform Scale",
    type: "Weighing",
    date: "05 May 2025",
    status: "Verified",
    nextAction: "Download Certificate",
  },
  {
    id: "APP2025000765",
    instrument: "Milk Meter",
    type: "Measuring",
    date: "28 Apr 2025",
    status: "Rejected",
    nextAction: "Rectification Required",
  },
];

const statusStyles: Record<string, string> = {
  Pending: "bg-amber-50 text-amber-700 border-amber-200",
  Scheduled: "bg-sky-50 text-sky-700 border-sky-200",
  "Under Verification": "bg-violet-50 text-violet-700 border-violet-200",
  Verified: "bg-emerald-50 text-emerald-700 border-emerald-200",
  Rejected: "bg-red-50 text-red-700 border-red-200",
};

const columns = [
  "Application ID",
  "Instrument Name",
  "Type",
  "Application Date",
  "Status",
  "Next Action",
];

const RecentApplications = () => {
  return (
    <section className="rounded-lg border border-slate-200 bg-white">
      <div className="flex items-center justify-between border-b border-slate-200 px-4 py-3">
        <h2 className="text-sm font-semibold text-slate-900">
          Recent Applications
        </h2>
        <a
          className="flex items-center gap-1 text-xs font-medium text-gov-accent hover:underline"
          href="#applications"
        >
          View All Applications
          <ArrowRight className="size-3.5" aria-hidden />
        </a>
      </div>

      <div className="w-full overflow-x-auto">
        <table className="w-full min-w-3xl text-left text-xs">
          <thead className="bg-slate-50 text-slate-600">
            <tr>
              {columns.map((column) => (
                <th className="px-4 py-2.5 font-semibold" key={column}>
                  {column}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-slate-700">
            {applications.map((application) => (
              <tr key={application.id}>
                <td className="px-4 py-3 font-medium text-slate-900">
                  {application.id}
                </td>
                <td className="px-4 py-3">{application.instrument}</td>
                <td className="px-4 py-3">{application.type}</td>
                <td className="px-4 py-3">{application.date}</td>
                <td className="px-4 py-3">
                  <span
                    className={`inline-flex rounded border px-2 py-0.5 text-[11px] font-medium ${statusStyles[application.status]}`}
                  >
                    {application.status}
                  </span>
                </td>
                <td className="px-4 py-3">{application.nextAction}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
};

export default RecentApplications;
