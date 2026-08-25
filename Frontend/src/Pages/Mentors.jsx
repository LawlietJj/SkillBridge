import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  getPathToGoal,
  getMentorCoverage,
} from "../Services/api";
import {
  ArrowLeft,
  ArrowRight,
  Award,
  Users,
  CheckCircle2,
} from "lucide-react";

const toSkillId = (name) =>
  name
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

function Mentors() {
  const location = useLocation();
  const navigate = useNavigate();

  const [user] = useState(() => JSON.parse(localStorage.getItem("user") || "null"));
  const careerName =
    location.state?.careerName || localStorage.getItem("selectedCareer");
  const missingCareerError = careerName
    ? ""
    : "No career goal selected. Go back to the Dashboard and pick one.";

  const [mentors, setMentors] = useState([]);
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

    async function loadMentors() {
      try {
        const pathRes = await getPathToGoal(user.id, careerName);
        const paths = pathRes.data.paths || [];

        if (paths.length === 0) {
          setMentors([]);
          setLoading(false);
          return;
        }

        // First skill = already known.
        // Remaining skills = upcoming learning requirements.
        const upcomingSkillIds = [
          ...new Set(paths.flatMap((p) => p.slice(1).map(toSkillId))),
        ];

        if (upcomingSkillIds.length === 0) {
          setMentors([]);
          setLoading(false);
          return;
        }

        const mentorRes = await getMentorCoverage(upcomingSkillIds);

        setMentors(mentorRes.data.mentors || []);
      } catch (err) {
        console.error("Mentor loading error:", err);
        setError("Failed to load mentors");
      } finally {
        setLoading(false);
      }
    }

    loadMentors();
  }, [careerName, navigate, user]);

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50">
        <main className="max-w-6xl mx-auto px-6 py-10">
          <div className="animate-pulse">
            <div className="h-4 w-20 bg-slate-200 rounded mb-4" />
            <div className="h-8 w-64 bg-slate-200 rounded mb-3" />
            <div className="h-4 w-96 bg-slate-200 rounded mb-10" />

            <div className="space-y-4">
              <div className="h-28 bg-white border border-slate-200 rounded-xl" />
              <div className="h-28 bg-white border border-slate-200 rounded-xl" />
              <div className="h-28 bg-white border border-slate-200 rounded-xl" />
            </div>
          </div>
        </main>
      </div>
    );
  }

  // Error state
  const pageError = missingCareerError || error;

  if (pageError) {
    return (
      <div className="min-h-screen bg-slate-50">
        <main className="max-w-3xl mx-auto px-6 py-10">
          <div className="bg-white border border-slate-200 rounded-xl p-8 text-center">
            <div className="w-12 h-12 mx-auto rounded-full bg-slate-100 flex items-center justify-center">
              <Users size={22} className="text-slate-600" />
            </div>

            <h1 className="text-lg font-semibold text-slate-900 mt-4">
              Mentor recommendations unavailable
            </h1>

            <p className="text-sm text-slate-500 mt-2">
              {pageError}
            </p>

            <button
              onClick={() => navigate("/dashboard")}
              className="mt-6 inline-flex items-center gap-2 bg-slate-800 hover:bg-slate-900 text-white px-4 py-2.5 rounded-lg text-sm font-medium transition"
            >
              <ArrowLeft size={16} />
              Back to Dashboard
            </button>
          </div>
        </main>
      </div>
    );
  }

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

        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 text-sm text-slate-500 mb-3">
              <Users size={16} />
              Mentor Network
            </div>

            <h1 className="text-3xl font-bold text-slate-900">
              Recommended mentors
            </h1>

            <p className="text-slate-500 mt-2 max-w-2xl">
              Mentors are ranked by how many of the skills in your
              upcoming learning path they can help you develop.
            </p>
          </div>

          {/* Career goal */}
          <div className="bg-white border border-slate-200 rounded-xl px-5 py-4 min-w-[210px]">
            <p className="text-xs uppercase tracking-wide text-slate-500">
              Career goal
            </p>

            <p className="font-semibold text-slate-900 mt-1">
              {careerName}
            </p>
          </div>
        </div>

        {/* Explanation */}
        <div className="mt-8 bg-white border border-slate-200 rounded-xl p-5">
          <div className="flex gap-4">
            <div className="w-10 h-10 shrink-0 rounded-lg bg-slate-100 flex items-center justify-center">
              <Award size={19} className="text-slate-700" />
            </div>

            <div>
              <h2 className="font-semibold text-slate-900">
                Why these mentors?
              </h2>

              <p className="text-sm text-slate-500 mt-1 leading-6">
                SkillBridge compares your remaining skills with the
                expertise connected to each mentor. Mentors who cover
                more of your upcoming requirements appear higher in
                the list.
              </p>
            </div>
          </div>
        </div>

        {/* Mentor section */}
        <div className="mt-8">

          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="font-semibold text-slate-900">
                Best matches
              </h2>

              <p className="text-sm text-slate-500 mt-1">
                Ranked by skill coverage
              </p>
            </div>

            <span className="text-sm text-slate-500">
              {mentors.length}{" "}
              {mentors.length === 1 ? "mentor" : "mentors"}
            </span>
          </div>

          {/* Empty */}
          {mentors.length === 0 ? (
            <div className="bg-white border border-slate-200 rounded-xl p-10 text-center">

              <div className="w-12 h-12 mx-auto rounded-full bg-slate-100 flex items-center justify-center">
                <Users size={22} className="text-slate-600" />
              </div>

              <h2 className="text-lg font-semibold text-slate-900 mt-4">
                No mentor matches found
              </h2>

              <p className="text-sm text-slate-500 mt-2 max-w-md mx-auto">
                We couldn't find mentors connected to the remaining
                skills in your learning path.
              </p>

              <button
                onClick={() =>
                  navigate("/skill-path", {
                    state: { careerName },
                  })
                }
                className="mt-5 inline-flex items-center gap-2 text-sm font-medium text-slate-800 hover:text-slate-900 hover:underline"
              >
                View skill path
                <ArrowRight size={15} />
              </button>
            </div>
          ) : (

            /* Mentor results */
            <div className="space-y-4">
              {mentors.map((mentor, index) => (
                <div
                  key={index}
                  className="bg-white border border-slate-200 rounded-xl p-6 hover:border-slate-300 transition"
                >
                  <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">

                    {/* Mentor identity */}
                    <div className="flex items-start gap-4">

                      <div className="w-12 h-12 rounded-lg bg-slate-800 text-white flex items-center justify-center font-semibold shrink-0">
                        {mentor.mentorName
                          ?.split(" ")
                          .map((name) => name[0])
                          .join("")
                          .slice(0, 2)
                          .toUpperCase()}
                      </div>

                      <div>
                        <div className="flex items-center gap-3 flex-wrap">
                          <h3 className="text-base font-semibold text-slate-900">
                            {mentor.mentorName}
                          </h3>

                          {index === 0 && (
                            <span className="text-xs font-medium bg-slate-100 text-slate-700 px-2.5 py-1 rounded-full">
                              Best match
                            </span>
                          )}
                        </div>

                        <p className="text-sm text-slate-500 mt-1">
                          Mentor in your learning network
                        </p>
                      </div>
                    </div>

                    {/* Skill coverage */}
                    <div className="lg:text-right">

                      <p className="text-xs uppercase tracking-wide text-slate-500 mb-2">
                        Skill coverage
                      </p>

                      <div className="flex flex-wrap lg:justify-end gap-2">
                        {mentor.covers?.map((skill, skillIndex) => (
                          <span
                            key={skillIndex}
                            className="inline-flex items-center gap-1.5 text-xs font-medium bg-slate-100 text-slate-700 px-2.5 py-1.5 rounded-md"
                          >
                            <CheckCircle2 size={13} />
                            {skill}
                          </span>
                        ))}
                      </div>

                    </div>
                  </div>

                  {/* Footer */}
                  <div className="mt-5 pt-5 border-t border-slate-100 flex items-center justify-between">

                    <p className="text-sm text-slate-500">
                      Covers{" "}
                      <span className="font-semibold text-slate-800">
                        {mentor.coverage}
                      </span>{" "}
                      upcoming{" "}
                      {mentor.coverage === 1 ? "skill" : "skills"}
                    </p>

                    <span className="text-sm text-slate-400">
                      Graph match
                    </span>

                  </div>
                </div>
              ))}
            </div>
          )}

        </div>
      </main>
    </div>
  );
}

export default Mentors;
