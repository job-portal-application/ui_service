import { useSelector } from "react-redux";

const Loader = () => {
  const { mode } = useSelector((state: any) => state.loader);

  if (mode === "full") {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-white/80 z-50">
        <div className="w-20 h-20 border-4 border-transparent text-blue-400 text-4xl animate-spin flex items-center justify-center border-t-blue-400 rounded-full"></div>
      </div>
    );
  }

  if (mode === "content") {
    return (
      <div className="absolute inset-0 flex items-center justify-center bg-white/70 z-40">
        <div className="w-20 h-20 border-4 border-transparent text-blue-400 text-4xl animate-spin flex items-center justify-center border-t-blue-400 rounded-full"></div>
      </div>
    );
  }

  return null;
};

export default Loader;
