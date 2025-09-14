import { FaSpinner, FaCog, FaBrain, FaRocket } from "react-icons/fa";

function LoadingSpinner({ message }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white">
      <div className="relative mb-8">
        <div className="relative">
          <FaSpinner className="animate-spin text-6xl text-blue-500" />

          <div className="absolute -top-3 -right-3">
            <FaCog
              className="animate-spin text-2xl text-green-400"
              style={{ animationDirection: "reverse", animationDuration: "3s" }}
            />
          </div>

          <div className="absolute -bottom-3 -left-3">
            <FaBrain className="animate-pulse text-2xl text-purple-400" />
          </div>

          <div className="absolute -top-3 -left-3">
            <FaRocket
              className="animate-bounce text-xl text-yellow-400"
              style={{ animationDelay: "0.5s" }}
            />
          </div>
        </div>
      </div>

      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-white mb-2">prep.io</h2>
        <p className="text-xl font-semibold mb-2">{message}</p>
        <p className="text-gray-400 text-sm max-w-md">
          {message.includes("Question")
            ? "Our AI is analyzing your resume to create personalized interview questions..."
            : "Please wait while we process your request..."}
        </p>
      </div>

      <div className="flex space-x-2 mb-8">
        <div className="w-3 h-3 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full animate-bounce" />
        <div
          className="w-3 h-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full animate-bounce"
          style={{ animationDelay: "0.1s" }}
        />
        <div
          className="w-3 h-3 bg-gradient-to-r from-pink-500 to-red-500 rounded-full animate-bounce"
          style={{ animationDelay: "0.2s" }}
        />
      </div>

      <div className="text-center max-w-md">
        <div className="bg-gray-800 border border-gray-700 rounded-lg p-4">
          <p className="text-gray-300 text-sm mb-2">💡 Did you know?</p>
          <p className="text-gray-400 text-xs">
            This usually takes 15-30 seconds depending on your resume complexity
            and the number of questions requested
          </p>
        </div>
      </div>
    </div>
  );
}

export default LoadingSpinner;
