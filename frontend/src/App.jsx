import { useState } from "react";
import axios from "axios";
import FileUpload from "./components/FileUpload";
import Interview from "./components/Interview";
import Feedback from "./components/Feedback";
import LoadingSpinner from "./components/LoadingSpinner";

function App() {
  const [currentScreen, setCurrentScreen] = useState("upload");
  const [allQuestions, setAllQuestions] = useState([]);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [aiFeedback, setAiFeedback] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const apiUrl = import.meta.env.VITE_API_BASE_URL || "http://localhost:3000";

  const handleFileSubmit = async (file, type, count) => {
    setIsLoading(true);
    setErrorMessage("");

    const formData = new FormData();
    formData.append("resume", file);
    formData.append("questionType", type);
    formData.append("questionCount", count.toString());

    try {
      const response = await axios.post(
        `${apiUrl}/api/generate-questions`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      setAllQuestions(response.data.questions);
      setQuestionIndex(0);
      setCurrentScreen("interview");
    } catch (error) {
      setErrorMessage(
        error.response?.data?.error || "Something went wrong. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleAnswerSubmit = async (userAnswer) => {
    setIsLoading(true);
    setErrorMessage("");

    try {
      const response = await axios.post(`${apiUrl}/api/get-feedback`, {
        question: allQuestions[questionIndex],
        answer: userAnswer,
      });

      setAiFeedback(response.data.feedback);
      setCurrentScreen("feedback");
      setIsLoading(false);
      return true;
    } catch (error) {
      setErrorMessage(
        error.response?.data?.error ||
          "Error getting feedback. Please try again."
      );
      setIsLoading(false);
      return false;
    }
  };

  const moveToNextQuestion = () => {
    if (questionIndex < allQuestions.length - 1) {
      setQuestionIndex(questionIndex + 1);
      setCurrentScreen("interview");
      setErrorMessage("");
    } else {
      setCurrentScreen("upload");
      setAllQuestions([]);
      setQuestionIndex(0);
      setAiFeedback("");
      setErrorMessage("");
    }
  };

  if (currentScreen === "upload" && isLoading) {
    return <LoadingSpinner message="Generating Questions..." />;
  }

  switch (currentScreen) {
    case "upload":
      return (
        <FileUpload
          onSubmit={handleFileSubmit}
          loading={isLoading}
          error={errorMessage}
        />
      );
    case "interview":
      return (
        <Interview
          question={allQuestions[questionIndex]}
          questionNumber={questionIndex + 1}
          totalQuestions={allQuestions.length}
          onSubmitAnswer={handleAnswerSubmit}
          loading={isLoading}
          error={errorMessage}
        />
      );
    case "feedback":
      return (
        <Feedback
          feedback={aiFeedback}
          onNextQuestion={moveToNextQuestion}
          isLastQuestion={questionIndex === allQuestions.length - 1}
          questionNumber={questionIndex + 1}
          totalQuestions={allQuestions.length}
        />
      );
    default:
      return (
        <FileUpload
          onSubmit={handleFileSubmit}
          loading={isLoading}
          error={errorMessage}
        />
      );
  }
}

export default App;
