import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import Loader from "@/components/Loader";

export default function PageWrapper({ children }: Readonly<{ children: React.ReactNode }>) {
  const location = useLocation();
  const [pageLoading, setPageLoading] = useState(false);

  useEffect(() => {
    // Trigger loader whenever route changes
    setPageLoading(true);
    const timer = setTimeout(() => setPageLoading(false), 1000); // adjust duration
    return () => clearTimeout(timer);
  }, [location]);

  return (
    <div className="relative">
      {pageLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-white/70 z-40">
          <Loader />
        </div>
      )}
      {children}
    </div>
  );
}
