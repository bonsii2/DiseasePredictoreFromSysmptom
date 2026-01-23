"use client";
import { useState } from "react";
import {
  User,
  Stethoscope,
  Activity,
  AlertCircle,
  ChevronRight,
  CheckCircle2,
  Loader2,
} from "lucide-react";

// Define the expected shape of the API response
interface PredictionResult {
  predicted_disease: string;
  diagnosis_tools: string[];
}

export default function Home() {
  const [age, setAge] = useState("");
  const [gender, setGender] = useState("Male");
  const [symptoms, setSymptoms] = useState("");
  const [result, setResult] = useState<PredictionResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async () => {
    if (!age || !symptoms.trim()) {
      setError("Please fill in all required fields");
      return;
    }

    setLoading(true);
    setError("");
    setResult(null);

    try {
      const response = await fetch("http://127.0.0.1:8000/predict", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          age: parseInt(age),
          gender: gender,
          symptoms: symptoms
            .split(",")
            .map((s) => s.trim())
            .filter((s) => s !== ""),
        }),
      });

      if (!response.ok) {
        throw new Error("Prediction failed. Please try again.");
      }

      const data: PredictionResult = await response.json();
      setResult(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-emerald-50 p-4 md:p-8">
      {/* Header */}
      <header className="max-w-6xl mx-auto mb-10 md:mb-16">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-emerald-100 rounded-xl">
              <Stethoscope className="w-8 h-8 text-emerald-700" />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
              EMP Disease Detection
            </h1>
          </div>
          <div className="hidden md:flex items-center space-x-2 text-emerald-700">
            <Activity className="w-5 h-5" />
            <span className="font-medium">AI-Powered Diagnosis</span>
          </div>
        </div>
        <p className="mt-4 text-gray-600 max-w-3xl">
          Enter patient information and symptoms to get AI-powered disease
          prediction and recommended diagnostic tools. All predictions are based
          on medical data analysis.
        </p>
      </header>

      <main className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Panel - Input Form */}
          <div className="lg:col-span-2 space-y-8">
            <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8 border border-gray-100">
              <div className="flex items-center mb-6">
                <div className="p-2 bg-emerald-50 rounded-lg mr-3">
                  <User className="w-5 h-5 text-emerald-700" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900">
                  Patient Information
                </h2>
              </div>

              <div className="space-y-6">
                {/* Age Input */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Age <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      placeholder="Enter patient age"
                      value={age}
                      onChange={(e) => setAge(e.target.value)}
                      min="0"
                      max="120"
                      className="w-full px-4 py-3.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-gray-900 placeholder-gray-400 transition-all duration-200"
                    />
                    <div className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400">
                      years
                    </div>
                  </div>
                </div>

                {/* Gender Select */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Gender
                  </label>
                  <div className="grid grid-cols-2 gap-4">
                    <button
                      type="button"
                      onClick={() => setGender("Male")}
                      className={`px-6 py-3.5 rounded-xl border text-center transition-all duration-200 ${
                        gender === "Male"
                          ? "bg-emerald-50 border-emerald-500 text-emerald-700 font-medium"
                          : "border-gray-300 text-gray-700 hover:border-emerald-300"
                      }`}
                    >
                      Male
                    </button>
                    <button
                      type="button"
                      onClick={() => setGender("Female")}
                      className={`px-6 py-3.5 rounded-xl border text-center transition-all duration-200 ${
                        gender === "Female"
                          ? "bg-emerald-50 border-emerald-500 text-emerald-700 font-medium"
                          : "border-gray-300 text-gray-700 hover:border-emerald-300"
                      }`}
                    >
                      Female
                    </button>
                  </div>
                </div>

                {/* Symptoms Textarea */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Symptoms <span className="text-red-500">*</span>
                    <span className="text-sm text-gray-500 font-normal ml-2">
                      (separate with commas)
                    </span>
                  </label>
                  <textarea
                    placeholder="e.g., fever, cough, headache, fatigue, nausea"
                    value={symptoms}
                    onChange={(e) => setSymptoms(e.target.value)}
                    rows={5}
                    className="w-full px-4 py-3.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-gray-900 placeholder-gray-400 resize-none transition-all duration-200"
                  />
                  <p className="mt-2 text-sm text-gray-500">
                    Enter symptoms as comma-separated values for accurate
                    analysis
                  </p>
                </div>

                {/* Error Message */}
                {error && (
                  <div className="flex items-center p-4 bg-red-50 border border-red-200 rounded-xl">
                    <AlertCircle className="w-5 h-5 text-red-500 mr-3" />
                    <p className="text-red-700">{error}</p>
                  </div>
                )}

                {/* Submit Button */}
                <button
                  onClick={handleSubmit}
                  disabled={loading}
                  className="w-full py-4 bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-400 text-white font-semibold rounded-xl transition-all duration-200 transform hover:scale-[1.02] disabled:scale-100 disabled:cursor-not-allowed flex items-center justify-center"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-5 h-5 mr-3 animate-spin" />
                      Analyzing Symptoms...
                    </>
                  ) : (
                    <>
                      Predict Disease
                      <ChevronRight className="w-5 h-5 ml-2" />
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Tips Section */}
            <div className="bg-emerald-50 rounded-2xl p-6 border border-emerald-100">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <Activity className="w-5 h-5 mr-2 text-emerald-700" />
                Tips for Accurate Results
              </h3>
              <ul className="space-y-3">
                <li className="flex items-start">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 mr-3 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700">
                    Be specific with symptoms (e.g., "high fever" instead of
                    just "fever")
                  </span>
                </li>
                <li className="flex items-start">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 mr-3 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700">
                    Include all relevant symptoms, even if they seem minor
                  </span>
                </li>
                <li className="flex items-start">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 mr-3 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700">
                    This tool is for preliminary analysis only. Always consult a
                    healthcare professional
                  </span>
                </li>
              </ul>
            </div>
          </div>

          {/* Right Panel - Results */}
          <div className="lg:col-span-1">
            <div className="sticky top-8">
              <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8 border border-gray-100 h-full">
                <div className="flex items-center mb-6">
                  <div className="p-2 bg-emerald-50 rounded-lg mr-3">
                    <AlertCircle className="w-5 h-5 text-emerald-700" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900">
                    Prediction Results
                  </h2>
                </div>

                {result ? (
                  <div className="space-y-6 animate-fadeIn">
                    {/* Disease Prediction */}
                    <div className="bg-emerald-50 rounded-xl p-5 border border-emerald-100">
                      <div className="flex items-center mb-3">
                        <div className="p-2 bg-emerald-100 rounded-lg mr-3">
                          <Stethoscope className="w-4 h-4 text-emerald-700" />
                        </div>
                        <h3 className="text-lg font-semibold text-gray-900">
                          Predicted Disease
                        </h3>
                      </div>
                      <p className="text-2xl font-bold text-emerald-700">
                        {result.predicted_disease}
                      </p>
                      <div className="mt-3 pt-3 border-t border-emerald-200">
                        <p className="text-sm text-gray-600">
                          Based on the symptoms provided, this is the most
                          likely condition.
                        </p>
                      </div>
                    </div>

                    {/* Diagnosis Tools */}
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">
                        Recommended Diagnostic Tools
                      </h3>
                      <div className="space-y-3">
                        {result.diagnosis_tools.map((tool, i) => (
                          <div
                            key={i}
                            className="flex items-center p-4 bg-gray-50 hover:bg-gray-100 rounded-xl transition-colors duration-200 group"
                          >
                            <div className="flex-shrink-0 w-8 h-8 bg-white border border-gray-300 rounded-lg flex items-center justify-center mr-4 group-hover:border-emerald-300 transition-colors">
                              <span className="text-sm font-semibold text-gray-700">
                                {i + 1}
                              </span>
                            </div>
                            <span className="text-gray-800">{tool}</span>
                          </div>
                        ))}
                      </div>
                      <p className="mt-4 text-sm text-gray-600">
                        These diagnostic tools are recommended to confirm the
                        prediction.
                      </p>
                    </div>

                    {/* Reset Button */}
                    <button
                      onClick={() => {
                        setResult(null);
                        setAge("");
                        setSymptoms("");
                      }}
                      className="w-full py-3 border border-gray-300 hover:border-gray-400 text-gray-700 font-medium rounded-xl transition-all duration-200 hover:bg-gray-50"
                    >
                      Analyze Another Case
                    </button>
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-gray-100 flex items-center justify-center">
                      <AlertCircle className="w-8 h-8 text-gray-400" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-700 mb-2">
                      No Results Yet
                    </h3>
                    <p className="text-gray-500">
                      {loading
                        ? "Analyzing symptoms and generating prediction..."
                        : "Submit patient information to see disease prediction and diagnostic recommendations."}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="max-w-6xl mx-auto mt-12 pt-8 border-t border-gray-200">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <div className="flex items-center space-x-2">
              <Stethoscope className="w-5 h-5 text-emerald-600" />
              <span className="text-lg font-semibold text-gray-900">
                EMP Health Systems
              </span>
            </div>
            <p className="text-gray-600 text-sm mt-1">
              Advanced AI-powered medical diagnostics
            </p>
          </div>
          <div className="text-sm text-gray-500">
            <p>
              For medical emergencies, contact healthcare professionals
              immediately.
            </p>
            <p className="mt-1">
              This tool provides preliminary analysis only.
            </p>
          </div>
        </div>
      </footer>

      {/* Custom CSS for animations */}
      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fadeIn {
          animation: fadeIn 0.5s ease-out;
        }

        input[type="number"]::-webkit-inner-spin-button,
        input[type="number"]::-webkit-outer-spin-button {
          -webkit-appearance: none;
          margin: 0;
        }

        input[type="number"] {
          -moz-appearance: textfield;
        }
      `}</style>
    </div>
  );
}
