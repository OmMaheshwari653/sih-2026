import { CampLocator } from "@/components/public/CampLocator";

export const metadata = { title: "Mobile Verification Camps" };

const CampsPage = () => (
  <div className="mx-auto w-full max-w-360 px-4 py-6 sm:px-6 sm:py-8">
    <header className="mb-5">
      <h1 className="font-serif text-2xl font-bold text-ink">
        Mobile verification camps
      </h1>
      <p className="mt-1 max-w-3xl text-sm text-ink-muted">
        Departmental vans visit mandis, weekly haats and street markets so that
        vendors with a single scale need not travel to the district office.
        Carry the instrument, an ID proof and the cash fee — stamping is done on
        the spot in about a minute.
      </p>
    </header>

    <CampLocator />
  </div>
);

export default CampsPage;
