import { Construction } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface WorkInProgressProps {
  title?: string;
  message?: string;
  returnPath?: string;
  returnLabel?: string;
}

const WorkInProgress = ({
  title = "Under Construction",
  message = "This page is currently being built. Please check back later!",
  returnPath = "/dashboard",
  returnLabel = "Return to Dashboard",
}: WorkInProgressProps) => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900">
      <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-md text-center max-w-md mx-auto">
        <div className="flex justify-center mb-6">
          <Construction className="h-24 w-24 text-indigo-500 animate-pulse" />
        </div>
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">
          {title}
        </h1>
        <p className="text-gray-600 dark:text-gray-300 mb-8">{message}</p>
        <button
          onClick={() => navigate(returnPath)}
          className="bg-indigo-600 dark:bg-indigo-700 text-white px-6 py-2 rounded-md hover:bg-indigo-700 dark:hover:bg-indigo-600 transition-colors"
        >
          {returnLabel}
        </button>
      </div>
    </div>
  );
};

export default WorkInProgress;
