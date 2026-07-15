import { Suspense } from "react";
import AlumniContent from "./AlumniContent";

export default function AlumniPage() {
  return (
    <Suspense
      fallback={
        <div className="container mx-auto py-20 text-center">
          Memuat data alumni...
        </div>
      }
    >
      <AlumniContent />
    </Suspense>
  );
}
