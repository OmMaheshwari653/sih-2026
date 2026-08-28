import { Scale } from "lucide-react";

const guidelines = [
  "Legal Metrology Act, 2009",
  "Legal Metrology (General) Rules, 2011",
  "User Manual",
  "Verification Fee Structure",
];

const Guidelines = () => {
  return (
    <section className="relative overflow-hidden rounded-lg border border-slate-200 bg-white">
      <div className="border-b border-slate-200 px-4 py-3">
        <h2 className="text-sm font-semibold text-slate-900">
          Important Guidelines
        </h2>
      </div>

      <Scale
        aria-hidden
        className="pointer-events-none absolute -bottom-4 right-4 size-32 text-slate-100"
      />

      <ul className="relative space-y-2 px-6 py-4 text-xs">
        {guidelines.map((guideline) => (
          <li className="list-disc text-slate-400" key={guideline}>
            <a className="text-gov-accent hover:underline" href="#guidelines">
              {guideline}
            </a>
          </li>
        ))}
      </ul>
    </section>
  );
};

export default Guidelines;
