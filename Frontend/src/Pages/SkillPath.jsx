import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { getPathToGoal } from "../Services/api";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Circle,
  GitBranch,
  Route,
} from "lucide-react";

function SkillPath() {
  const location = useLocation();
  const navigate = useNavigate();

  const [user] = useState(() => JSON.parse(localStorage.getItem("user") || "null"));
  const careerName =
    location.state?.careerName || localStorage.getItem("selectedCareer");
  const missingCareerError = careerName
    ? ""
    : "No career goal selected. Go back to the Dashboard and pick one.";

  const [paths, setPaths] = useState([]);
  const [loading, setLoading] = useState(Boolean(user && careerName));
  const [error, setError] = useState("");

  useEffect(() => {
    if (!user) {
      navigate("/");
      return;
    }

    if (!careerName) {
      return;
    }

    localStorage.setItem("selectedCareer", careerName);

    async function loadPath() {
      try {
        const res = await getPathToGoal(user.id, careerName);
        setPaths(res.data.paths || []);
      } catch {
        setError("Failed to load skill path");
      } finally {
        setLoading(false);
      }
    }

    loadPath();
  }, [careerName, navigate, user]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50">
        <main className="max-w-6xl mx-auto px-6 py-10">
          <div className="animate-pulse">
            <div className="h-4 w-24 bg-slate-200 rounded mb-4" />
            <div className="h-8 w-72 bg-slate-200 rounded mb-3" />
            <div className="h-4 w-96 bg-slate-200 rounded mb-10" />

            <div className="space-y-4">
              <div className="h-24 bg-white border border-slate-200 rounded-xl" />
              <div className="h-24 bg-white border border-slate-200 rounded-xl" />
              <div className="h-24 bg-white border border-slate-200 rounded-xl" />
            </div>
          </div>
        </main>
      </div>
    );
  }

  const pageError = missingCareerError || error;

  if (pageError) {
    return (
      <div className="min-h-screen bg-slate-50">
        <main className="max-w-3xl mx-auto px-6 py-10">
          <div className="bg-white border border-slate-200 rounded-xl p-8 text-center">
            <div className="w-12 h-12 mx-auto rounded-full bg-slate-100 flex items-center justify-center">
              <Route size={22} className="text-slate-600" />
            </div>

            <h1 className="text-lg font-semibold text-slate-900 mt-4">
              No learning path available
            </h1>

            <p className="text-sm text-slate-500 mt-2">
              {pageError}
            </p>

            <button
              onClick={() => navigate("/dashboard")}
              className="mt-6 inline-flex items-center gap-2 bg-slate-800 hover:bg-slate-900 text-white px-4 py-2.5 rounded-lg text-sm font-medium"
            >
              <ArrowLeft size={16} />
              Back to Dashboard
            </button>
          </div>
        </main>
      </div>
    );
  }

  /*
   * Flatten the returned paths so we can show
   * a useful overview of the learning journey.
   */
  const uniqueSkills = [
    ...new Set(paths.flat()),
  ];

  return (
    <div className="min-h-screen bg-slate-50">

      <main className="max-w-6xl mx-auto px-6 py-10">

        {/* Back */}
        <button
          onClick={() => navigate("/dashboard")}
          className="flex items-center gap-2 text-sm text-slate-500 hover:text-slate-900 mb-8 transition"
        >
          <ArrowLeft size={16} />
          Dashboard
        </button>

        {/* Page Header */}
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6">

          <div>
            <div className="flex items-center gap-2 text-sm text-slate-500 mb-3">
              <GitBranch size={16} />
              Learning Path
            </div>

            <h1 className="text-3xl font-bold text-slate-900">
              Path to {careerName}
            </h1>

            <p className="text-slate-500 mt-2 max-w-2xl">
              Your prerequisite-based learning route, generated from the
              relationships between your current skills and your career goal.
            </p>
          </div>

          {/* Summary */}
          <div className="bg-white border border-slate-200 rounded-xl px-5 py-4 min-w-[180px]">
            <p className="text-xs uppercase tracking-wide text-slate-500">
              Skills remaining
            </p>

            <p className="text-2xl font-bold text-slate-900 mt-1">
              {uniqueSkills.length}
            </p>
          </div>

        </div>

        {/* Explanation */}
        <div className="mt-8 bg-white border border-slate-200 rounded-xl p-5">

          <div className="flex gap-4">

            <div className="w-10 h-10 shrink-0 rounded-lg bg-slate-100 flex items-center justify-center">
              <Route size={19} className="text-slate-700" />
            </div>

            <div>
              <h2 className="font-semibold text-slate-900">
                How your path works
              </h2>

              <p className="text-sm text-slate-500 mt-1 leading-6">
                SkillBridge follows prerequisite relationships in the graph
                to determine which skills connect your current knowledge to
                your selected career.
              </p>
            </div>

          </div>
        </div>

        {/* Paths */}
        {paths.length === 0 ? (

          <div className="mt-6 bg-white border border-slate-200 rounded-xl p-10 text-center">

            <div className="w-12 h-12 mx-auto rounded-full bg-slate-100 flex items-center justify-center">
              <CheckCircle2 size={23} className="text-slate-700" />
            </div>

            <h2 className="text-lg font-semibold text-slate-900 mt-4">
              You're already on track
            </h2>

            <p className="text-sm text-slate-500 mt-2 max-w-md mx-auto">
              No remaining prerequisite path was found. You may already have
              the required skills for this career.
            </p>

          </div>

        ) : (

          <div className="mt-8">

            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="font-semibold text-slate-900">
                  Recommended routes
                </h2>

                <p className="text-sm text-slate-500 mt-1">
                  Follow the relationships from left to right.
                </p>
              </div>

              <span className="text-sm text-slate-500">
                {paths.length} {paths.length === 1 ? "route" : "routes"}
              </span>
            </div>

            <div className="space-y-4">

              {paths.map((path, i) => (

                <div
                  key={i}
                  className="bg-white border border-slate-200 rounded-xl p-6"
                >

                  {/* Route Header */}
                  <div className="flex items-center justify-between mb-5">

                    <div className="flex items-center gap-3">

                      <div className="w-8 h-8 rounded-lg bg-slate-800 text-white flex items-center justify-center text-sm font-semibold">
                        {i + 1}
                      </div>

                      <div>
                        <p className="text-sm font-semibold text-slate-900">
                          Learning route {i + 1}
                        </p>

                        <p className="text-xs text-slate-500">
                          {path.length} connected skills
                        </p>
                      </div>

                    </div>

                  </div>

                  {/* Skill Chain */}
                  <div className="overflow-x-auto pb-2">

                    <div className="flex items-center min-w-max">

                      {path.map((skillName, j) => {

                        const isFirst = j === 0;
                        const isLast = j === path.length - 1;

                        return (
                          <div
                            key={`${skillName}-${j}`}
                            className="flex items-center"
                          >

                            <div
                              className={`min-w-[150px] border rounded-lg px-4 py-3 ${
                                isFirst
                                  ? "bg-slate-800 border-slate-800 text-white"
                                  : isLast
                                  ? "bg-white border-slate-800 text-slate-900"
                                  : "bg-slate-50 border-slate-200 text-slate-800"
                              }`}
                            >

                              <div className="flex items-center gap-2">

                                {isFirst ? (
                                  <CheckCircle2 size={16} />
                                ) : isLast ? (
                                  <TargetIcon />
                                ) : (
                                  <Circle
                                    size={14}
                                    className="text-slate-400"
                                  />
                                )}

                                <span className="text-sm font-medium">
                                  {skillName}
                                </span>

                              </div>

                              <p
                                className={`text-xs mt-1 ${
                                  isFirst
                                    ? "text-slate-300"
                                    : "text-slate-500"
                                }`}
                              >
                                {isFirst
                                  ? "Starting point"
                                  : isLast
                                  ? "Career requirement"
                                  : "Prerequisite"}
                              </p>

                            </div>

                            {!isLast && (
                              <div className="w-12 flex items-center justify-center">
                                <ArrowRight
                                  size={17}
                                  className="text-slate-400"
                                />
                              </div>
                            )}

                          </div>
                        );
                      })}

                    </div>

                  </div>

                </div>

              ))}

            </div>

          </div>
        )}

      </main>
    </div>
  );
}

/* Small reusable target icon */
function TargetIcon() {
  return (
    <div className="w-3.5 h-3.5 rounded-full border-2 border-slate-800 flex items-center justify-center">
      <div className="w-1 h-1 rounded-full bg-slate-800" />
    </div>
  );
}

export default SkillPath;
