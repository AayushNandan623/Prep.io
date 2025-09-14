import { useState, useEffect, useRef } from "react";
import { FaMicrophone, FaMicrophoneSlash, FaSpinner } from "react-icons/fa";

function Interview({
  question,
  questionNumber,
  totalQuestions,
  onSubmitAnswer,
  loading,
  error,
}) {
  const [answerText, setAnswerText] = useState("");
  const [isListening, setIsListening] = useState(false);
  const [recognition, setRecognition] = useState(null);
  const textareaRef = useRef(null);

  useEffect(() => {
    if ("webkitSpeechRecognition" in window || "SpeechRecognition" in window) {
      const SpeechRecognition =
        window.SpeechRecognition || window.webkitSpeechRecognition;
      const speechRecognizer = new SpeechRecognition();

      speechRecognizer.continuous = true;
      speechRecognizer.interimResults = true;
      speechRecognizer.lang = "en-US";

      speechRecognizer.onstart = () => {
        setIsListening(true);
      };

      speechRecognizer.onresult = (event) => {
        let transcript = "";

        for (let i = event.resultIndex; i < event.results.length; i++) {
          if (event.results[i].isFinal) {
            transcript += event.results[i][0].transcript + " ";
          }
        }

        if (transcript) {
          setAnswerText((prev) => prev + transcript);
        }
      };

      speechRecognizer.onerror = (event) => {
        console.error("Speech recognition error:", event.error);
        setIsListening(false);
        if (event.error !== "aborted") {
          alert("Speech recognition error: " + event.error);
        }
      };

      speechRecognizer.onend = () => {
        setIsListening(false);
      };

      setRecognition(speechRecognizer);
    }

    return () => {
      if (recognition) {
        recognition.stop();
      }
    };
  }, [recognition]);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height =
        textareaRef.current.scrollHeight + "px";
    }
  }, [answerText]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!answerText.trim()) {
      alert("Please provide an answer");
      return;
    }

    const success = await onSubmitAnswer(answerText.trim());
    if (success) {
      setAnswerText("");
    }
  };

  const toggleVoiceInput = () => {
    if (!recognition) {
      alert("Speech recognition not supported in your browser");
      return;
    }

    if (isListening) {
      recognition.stop();
      setIsListening(false);
    } else {
      recognition.start();
    }
  };

  const handleKeyPress = (event) => {
    if ((event.ctrlKey || event.metaKey) && event.key === "Enter") {
      event.preventDefault();
      handleSubmit(event);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="bg-gray-800 rounded-lg shadow-xl p-8">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-2xl font-bold text-white">
                prep.io Interview
              </h2>
              <p className="text-gray-400 text-sm mt-1">
                Question {questionNumber} of {totalQuestions}
              </p>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-blue-400">
                {questionNumber}/{totalQuestions}
              </div>
              <div className="text-xs text-gray-500">
                {Math.round((questionNumber / totalQuestions) * 100)}% complete
              </div>
            </div>
          </div>

          <div className="w-full bg-gray-700 rounded-full h-3 mb-8">
            <div
              className="bg-gradient-to-r from-blue-500 to-purple-500 h-3 rounded-full transition-all duration-500"
              style={{ width: `${(questionNumber / totalQuestions) * 100}%` }}
            />
          </div>

          <div className="mb-8">
            <div className="bg-gradient-to-r from-gray-700 to-gray-600 p-6 rounded-lg border-l-4 border-blue-500 shadow-lg">
              <p className="text-lg text-gray-100 leading-relaxed font-medium">
                {question}
              </p>
            </div>
          </div>

          <div className="space-y-6">
            <div>
              <div className="flex justify-between items-center mb-3">
                <label className="block text-sm font-medium text-gray-300">
                  Your Answer
                </label>
                <div className="text-xs text-gray-500 flex items-center space-x-4">
                  <span>Ctrl/Cmd + Enter to submit</span>
                  <span className="text-gray-600">|</span>
                  <span>{answerText.length} chars</span>
                </div>
              </div>

              <div className="relative">
                <textarea
                  ref={textareaRef}
                  value={answerText}
                  onChange={(e) => setAnswerText(e.target.value)}
                  onKeyDown={handleKeyPress}
                  placeholder="Type your answer here or use the microphone to dictate..."
                  className="w-full p-4 pb-16 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-400 resize-none min-h-[200px] overflow-hidden transition-colors"
                  disabled={loading}
                />

                <button
                  type="button"
                  onClick={toggleVoiceInput}
                  className={`absolute bottom-4 right-4 p-3 rounded-full transition-all shadow-lg ${
                    isListening
                      ? "bg-red-600 hover:bg-red-700 animate-pulse shadow-red-500/25"
                      : "bg-blue-600 hover:bg-blue-700 shadow-blue-500/25"
                  } ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
                  disabled={loading}
                  title={isListening ? "Stop listening" : "Start voice input"}
                >
                  {isListening ? (
                    <FaMicrophoneSlash className="text-white text-lg" />
                  ) : (
                    <FaMicrophone className="text-white text-lg" />
                  )}
                </button>
              </div>

              {isListening && (
                <div className="mt-3 text-sm text-red-400 flex items-center bg-red-900/20 p-3 rounded-lg border border-red-500/30">
                  <div className="animate-pulse w-2 h-2 bg-red-500 rounded-full mr-2" />
                  Recording... Speak clearly into your microphone
                </div>
              )}
            </div>

            {error && (
              <div className="bg-red-900 border border-red-700 text-red-100 px-4 py-3 rounded-lg">
                <p className="text-sm">{error}</p>
              </div>
            )}

            <button
              onClick={handleSubmit}
              disabled={loading || !answerText.trim()}
              className={`w-full py-4 px-6 rounded-lg font-semibold text-white transition-all ${
                loading || !answerText.trim()
                  ? "bg-gray-600 cursor-not-allowed"
                  : "bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 active:from-green-800 active:to-green-900 shadow-lg hover:shadow-green-500/25"
              }`}
            >
              {loading ? (
                <span className="flex items-center justify-center">
                  <FaSpinner className="animate-spin mr-2" />
                  Getting Feedback...
                </span>
              ) : (
                "Submit Answer"
              )}
            </button>
          </div>

          <div className="mt-6 text-center">
            <p className="text-gray-500 text-xs">
              💡 Take your time to provide a detailed answer. Voice input is
              available for convenience.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Interview;
