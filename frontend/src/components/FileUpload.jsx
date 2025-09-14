import { useState } from "react";
import { FaUpload, FaSpinner, FaQuestionCircle } from "react-icons/fa";

function FileUpload({ onSubmit, loading, error }) {
  const [selectedFile, setSelectedFile] = useState(null);
  const [category, setCategory] = useState("Technical");
  const [numQuestions, setNumQuestions] = useState(5);
  const [isDragOver, setIsDragOver] = useState(false);

  const validFileTypes = [
    "application/pdf",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    "text/plain",
  ];

  const handleFileSelect = (file) => {
    if (file && validFileTypes.includes(file.type)) {
      setSelectedFile(file);
    } else {
      alert("Please upload a valid file (.pdf, .docx, .txt)");
    }
  };

  const handleInputChange = (event) => {
    const file = event.target.files[0];
    handleFileSelect(file);
  };

  const handleDrop = (event) => {
    event.preventDefault();
    setIsDragOver(false);
    const file = event.dataTransfer.files[0];
    handleFileSelect(file);
  };

  const handleDragOver = (event) => {
    event.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (event) => {
    event.preventDefault();
    setIsDragOver(false);
  };

  const handleFormSubmit = (event) => {
    event.preventDefault();
    if (!selectedFile) {
      alert("Please select a resume file");
      return;
    }
    // Now this `numQuestions` will be the latest state value
    onSubmit(selectedFile, category, numQuestions);
  };

  const getFileSize = (bytes) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center p-6">
      <div className="bg-gray-800 rounded-lg shadow-xl p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">prep.io</h1>
          <p className="text-gray-400">
            Upload your resume and practice interview questions
          </p>
        </div>
        {/* CHANGE #1: Replaced a `div` with a `<form>` and added the onSubmit handler */}
        <form className="space-y-6" onSubmit={handleFormSubmit}>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Upload Resume
            </label>
            <div
              className={`relative border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
                isDragOver
                  ? "border-blue-500 bg-blue-50/10"
                  : "border-gray-600 hover:border-gray-500"
              }`}
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
            >
              <input
                type="file"
                onChange={handleInputChange}
                accept=".pdf,.docx,.txt"
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                disabled={loading}
              />

              <div className="flex flex-col items-center">
                <FaUpload className="text-4xl text-gray-400 mb-4" />
                {selectedFile ? (
                  <div className="text-center">
                    <p className="text-white font-medium">
                      {selectedFile.name}
                    </p>
                    <p className="text-gray-400 text-sm">
                      {getFileSize(selectedFile.size)}
                    </p>
                  </div>
                ) : (
                  <div>
                    <p className="text-white mb-2">Drop your resume here</p>
                    <p className="text-gray-400 text-sm">or click to browse</p>
                    <p className="text-gray-500 text-xs mt-2">
                      Supports PDF, DOCX, TXT files
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Question Category
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              disabled={loading}
            >
              <option value="Technical">Technical Questions</option>
              <option value="Project-related">Project-related Questions</option>
              <option value="HR">HR Questions</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2 flex items-center">
              <FaQuestionCircle className="mr-2" />
              Number of Questions
            </label>
            <select
              value={numQuestions}
              onChange={(e) => setNumQuestions(parseInt(e.target.value))}
              className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              disabled={loading}
            >
              {/* This map will now correctly update state before form submission */}
              {[...Array(12)].map((_, i) => (
                <option key={i + 1} value={i + 1}>
                  {i + 1} Question{i + 1 > 1 ? "s" : ""}
                </option>
              ))}
            </select>
            <p className="text-gray-500 text-xs mt-1">
              Choose between 1 and 12 questions
            </p>
          </div>

          {error && (
            <div className="bg-red-900 border border-red-700 text-red-100 px-4 py-3 rounded-lg">
              <p className="text-sm">{error}</p>
            </div>
          )}

          {/* CHANGE #2: Removed `onClick` and added `type="submit"` */}
          <button
            type="submit"
            disabled={loading || !selectedFile}
            className={`w-full py-3 px-4 rounded-lg font-semibold text-white transition-colors ${
              loading || !selectedFile
                ? "bg-gray-600 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700 active:bg-blue-800"
            }`}
          >
            {loading ? (
              <span className="flex items-center justify-center">
                <FaSpinner className="animate-spin mr-2" />
                Analyzing...
              </span>
            ) : (
              "Start Interview"
            )}
          </button>
        </form>{" "}
        {/* CHANGE #3: Closing the form tag */}
        <div className="mt-6 text-center">
          <p className="text-gray-500 text-xs">
            Your resume will be analyzed to generate {numQuestions} personalized
            interview question{numQuestions > 1 ? "s" : ""}
          </p>
        </div>
      </div>
    </div>
  );
}

export default FileUpload;
