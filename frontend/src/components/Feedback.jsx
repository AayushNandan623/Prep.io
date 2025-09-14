import ReactMarkdown from "react-markdown";
import { FaCheckCircle, FaArrowRight, FaTrophy } from "react-icons/fa";

function Feedback({
  feedback,
  onNextQuestion,
  isLastQuestion,
  questionNumber,
  totalQuestions,
}) {
  const progressPercentage = (questionNumber / totalQuestions) * 100;

  return (
    <div className="min-h-screen bg-gray-900 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="bg-gray-800 rounded-lg shadow-xl p-8">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-2xl font-bold text-white flex items-center">
                <FaCheckCircle className="text-green-500 mr-3" />
                prep.io Feedback
              </h2>
              <p className="text-gray-400 text-sm mt-1">
                Question {questionNumber} of {totalQuestions}
              </p>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-green-400">
                {questionNumber}/{totalQuestions}
              </div>
              <div className="text-xs text-gray-500">
                {Math.round(progressPercentage)}% complete
              </div>
            </div>
          </div>

          <div className="w-full bg-gray-700 rounded-full h-3 mb-8">
            <div
              className="bg-gradient-to-r from-green-500 to-blue-500 h-3 rounded-full transition-all duration-500"
              style={{ width: `${progressPercentage}%` }}
            />
          </div>

          <div className="mb-8">
            <div className="bg-gray-700 rounded-lg p-6 border border-gray-600 shadow-inner">
              <div className="max-w-none text-gray-200">
                <ReactMarkdown
                  components={{
                    h1: ({ children }) => (
                      <h1 className="text-2xl font-bold text-white mb-4 border-b border-gray-600 pb-2">
                        {children}
                      </h1>
                    ),
                    h2: ({ children }) => (
                      <h2 className="text-xl font-semibold text-blue-400 mb-3 mt-6">
                        {children}
                      </h2>
                    ),
                    h3: ({ children }) => (
                      <h3 className="text-lg font-semibold text-green-400 mb-2 mt-4">
                        {children}
                      </h3>
                    ),
                    p: ({ children }) => (
                      <p className="text-gray-200 mb-3 leading-relaxed">
                        {children}
                      </p>
                    ),
                    ul: ({ children }) => (
                      <ul className="list-disc list-inside space-y-1 text-gray-200 mb-4">
                        {children}
                      </ul>
                    ),
                    ol: ({ children }) => (
                      <ol className="list-decimal list-inside space-y-1 text-gray-200 mb-4">
                        {children}
                      </ol>
                    ),
                    li: ({ children }) => (
                      <li className="text-gray-200 ml-2">{children}</li>
                    ),
                    strong: ({ children }) => (
                      <strong className="text-white font-semibold">
                        {children}
                      </strong>
                    ),
                    em: ({ children }) => (
                      <em className="text-blue-300 italic">{children}</em>
                    ),
                    blockquote: ({ children }) => (
                      <blockquote className="border-l-4 border-blue-500 pl-4 italic text-gray-300 bg-gray-800 p-3 rounded-r-lg my-4">
                        {children}
                      </blockquote>
                    ),
                    code: ({ children }) => (
                      <code className="bg-gray-800 text-green-400 px-2 py-1 rounded text-sm">
                        {children}
                      </code>
                    ),
                    pre: ({ children }) => (
                      <pre className="bg-gray-800 p-4 rounded-lg overflow-x-auto border border-gray-600 my-4">
                        {children}
                      </pre>
                    ),
                  }}
                >
                  {feedback}
                </ReactMarkdown>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
            <button
              onClick={onNextQuestion}
              className={`flex-1 py-4 px-6 rounded-lg font-semibold text-white transition-all flex items-center justify-center shadow-lg ${
                isLastQuestion
                  ? "bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 active:from-purple-800 active:to-pink-800 shadow-purple-500/25"
                  : "bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 active:from-blue-800 active:to-indigo-800 shadow-blue-500/25"
              }`}
            >
              {isLastQuestion ? (
                <>
                  <FaTrophy className="mr-2" />
                  Complete Interview
                </>
              ) : (
                <>
                  Next Question
                  <FaArrowRight className="ml-2" />
                </>
              )}
            </button>
          </div>

          <div className="mt-6 text-center">
            {isLastQuestion ? (
              <div className="bg-gradient-to-r from-purple-900/50 to-pink-900/50 border border-purple-500/30 rounded-lg p-4">
                <p className="text-purple-200 text-sm font-medium mb-1">
                  🎉 Congratulations! You've completed all {totalQuestions}{" "}
                  questions!
                </p>
                <p className="text-purple-300 text-xs">
                  Click "Complete Interview" to finish and start a new session
                </p>
              </div>
            ) : (
              <div className="bg-blue-900/20 border border-blue-500/30 rounded-lg p-3">
                <p className="text-blue-200 text-sm">
                  {totalQuestions - questionNumber} question
                  {totalQuestions - questionNumber !== 1 ? "s" : ""} remaining
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Feedback;
