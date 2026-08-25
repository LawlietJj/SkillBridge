import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getStudent, getCareers } from "../Services/api";
import {
  BookOpen,
  Briefcase,
  Target,
  ArrowRight,
} from "lucide-react";

function Dashboard() {
  const [student, setStudent] = useState(null);
  const [careers, setCareers] = useState([]);
  const [selectedCareer, setSelectedCareer] = useState(
    () => localStorage.getItem("selectedCareer") || ""
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const navigate = useNavigate();
  const [user] = useState(() => JSON.parse(localStorage.getItem("user") || "null"));

  useEffect(() => {
    if (!user) {
      navigate("/");
      return;
    }

    async function loadData() {
      try {
        const [studentRes, careersRes] = await Promise.all([
          getStudent(user.id),
          getCareers(),
        ]);

        setStudent(studentRes.data.student);
        setCareers(careersRes.data.careers);

        const savedCareer = localStorage.getItem("selectedCareer");
        const defaultCareer = savedCareer || studentRes.data.student.interests?.[0] || "";

        if (defaultCareer) {
          setSelectedCareer(defaultCareer);
          localStorage.setItem("selectedCareer", defaultCareer);
        }
      } catch {
        setError("Failed to load dashboard");
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, [navigate, user]);

  const handleCareerChange = (careerName) => {
    setSelectedCareer(careerName);

    if (careerName) {
      localStorage.setItem("selectedCareer", careerName);
    } else {
      localStorage.removeItem("selectedCareer");
    }
  };

  const handleViewSkillPath = () => {
    if (!selectedCareer) return;

    localStorage.setItem("selectedCareer", selectedCareer);
    navigate("/skill-path", {
      state: { careerName: selectedCareer },
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center text-slate-500">
        Loading dashboard...
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center text-red-600">
        {error}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">

      <main className="max-w-7xl mx-auto px-6 py-8">

        {/* Welcome */}
        <div className="mb-8">
          <p className="text-sm text-slate-500">Dashboard</p>

          <h2 className="text-3xl font-bold text-slate-900 mt-1">
            Welcome back, {student.name}
          </h2>

          <p className="text-slate-500 mt-2">
            Track your skills, choose a career path, and discover your next learning milestone.
          </p>
        </div>

        {/* Stats */}
        <div className="grid md:grid-cols-3 gap-5 mb-8">

          <div className="bg-white border border-slate-200 rounded-xl p-5">
            <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center mb-4">
              <BookOpen size={20} className="text-slate-700" />
            </div>

            <p className="text-sm text-slate-500">Known Skills</p>
            <h3 className="text-3xl font-bold text-slate-900 mt-1">
              {student.knownSkills.length}
            </h3>
          </div>

          <div className="bg-white border border-slate-200 rounded-xl p-5">
            <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center mb-4">
              <Briefcase size={20} className="text-slate-700" />
            </div>

            <p className="text-sm text-slate-500">Career Goal</p>
            <h3 className="text-lg font-semibold text-slate-900 mt-1">
              {selectedCareer || "Not selected"}
            </h3>
          </div>

          <div className="bg-white border border-slate-200 rounded-xl p-5">
            <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center mb-4">
              <Target size={20} className="text-slate-700" />
            </div>

            <p className="text-sm text-slate-500">Learning Status</p>
            <h3 className="text-lg font-semibold text-slate-900 mt-1">
              {student.knownSkills.length > 0 ? "In Progress" : "Getting Started"}
            </h3>
          </div>

        </div>

        {/* Main Grid */}
        <div className="grid lg:grid-cols-3 gap-6">

          {/* Skills */}
          <div className="lg:col-span-2 bg-white border border-slate-200 rounded-xl p-6">

            <div className="flex items-center justify-between mb-5">
              <div>
                <h3 className="font-semibold text-slate-900">
                  Your Skills
                </h3>
                <p className="text-sm text-slate-500">
                  Skills currently connected to your profile
                </p>
              </div>
            </div>

            {student.knownSkills.length === 0 ? (
              <div className="border border-dashed border-slate-300 rounded-lg py-10 text-center">
                <p className="text-slate-500">No skills added yet.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {student.knownSkills.map((skill, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between border border-slate-200 rounded-lg px-4 py-3"
                  >
                    <div>
                      <p className="font-medium text-slate-800">
                        {skill.name}
                      </p>
                      <p className="text-xs text-slate-500">
                        Current proficiency
                      </p>
                    </div>

                    <span className="text-xs font-medium bg-slate-100 text-slate-700 px-3 py-1 rounded-full">
                      {skill.level}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Career Card */}
          <div className="bg-white border border-slate-200 rounded-xl p-6 h-fit">

            <h3 className="font-semibold text-slate-900">
              Career Path
            </h3>

            <p className="text-sm text-slate-500 mt-1 mb-5">
              Select the career you want to pursue.
            </p>

            <select
              value={selectedCareer}
              onChange={(e) => handleCareerChange(e.target.value)}
              className="w-full border border-slate-300 rounded-lg px-3 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-slate-800"
            >
              <option value="">Select a career</option>

              {careers.map((career) => (
                <option key={career.id} value={career.name}>
                  {career.name}
                </option>
              ))}
            </select>

            <div className="mt-6 p-4 bg-slate-50 rounded-lg border border-slate-200">
              <p className="text-xs uppercase tracking-wide text-slate-500">
                Selected Goal
              </p>

              <h4 className="font-semibold text-slate-900 mt-1">
                {selectedCareer || "None"}
              </h4>
            </div>

            <button
              onClick={handleViewSkillPath}
              disabled={!selectedCareer}
              className="w-full mt-6 bg-slate-800 hover:bg-slate-900 text-white rounded-lg py-3 font-medium disabled:opacity-40 flex items-center justify-center gap-2"
            >
              View Skill Path
              <ArrowRight size={18} />
            </button>
          </div>

        </div>
      </main>
    </div>
  );
}

export default Dashboard;
