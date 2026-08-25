import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getProjects } from "../Services/api";
import {
  ArrowRight,
  BookOpen,
  CheckCircle2,
  FolderKanban,
  Layers3,
} from "lucide-react";

function Projects() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const navigate = useNavigate();
  const [user] = useState(() => JSON.parse(localStorage.getItem("user") || "null"));

  useEffect(() => {
    if (!user) {
      navigate("/");
      return;
    }

    async function loadProjects() {
      try {
        const res = await getProjects();
        setProjects(res.data.projects || []);
      } catch (err) {
        console.error("Project loading error:", err);
        setError("Failed to load projects");
      } finally {
        setLoading(false);
      }
    }

    loadProjects();
  }, [navigate, user]);

  /*
   * Loading state
   */
  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50">
        <main className="max-w-6xl mx-auto px-6 py-10">

          <div className="animate-pulse">

            <div className="h-4 w-20 bg-slate-200 rounded mb-4" />

            <div className="h-8 w-48 bg-slate-200 rounded mb-3" />

            <div className="h-4 w-96 bg-slate-200 rounded mb-10" />

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">

              <div className="h-64 bg-white border border-slate-200 rounded-xl" />
              <div className="h-64 bg-white border border-slate-200 rounded-xl" />
              <div className="h-64 bg-white border border-slate-200 rounded-xl" />

            </div>

          </div>

        </main>
      </div>
    );
  }

  /*
   * Error state
   */
  if (error) {
    return (
      <div className="min-h-screen bg-slate-50">

        <main className="max-w-3xl mx-auto px-6 py-10">

          <div className="bg-white border border-slate-200 rounded-xl p-8 text-center">

            <div className="w-12 h-12 mx-auto rounded-full bg-slate-100 flex items-center justify-center">
              <FolderKanban size={22} className="text-slate-600" />
            </div>

            <h1 className="text-lg font-semibold text-slate-900 mt-4">
              Projects unavailable
            </h1>

            <p className="text-sm text-slate-500 mt-2">
              {error}
            </p>

            <button
              onClick={() => window.location.reload()}
              className="mt-6 bg-slate-800 hover:bg-slate-900 text-white px-4 py-2.5 rounded-lg text-sm font-medium transition"
            >
              Try again
            </button>

          </div>

        </main>

      </div>
    );
  }

  /*
   * Main page
   */
  return (
    <div className="min-h-screen bg-slate-50">

      <main className="max-w-6xl mx-auto px-6 py-10">

        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">

          <div>

            <div className="flex items-center gap-2 text-sm text-slate-500 mb-3">
              <FolderKanban size={16} />
              Project Library
            </div>

            <h1 className="text-3xl font-bold text-slate-900">
              Projects
            </h1>

            <p className="text-slate-500 mt-2 max-w-2xl">
              Build practical projects that demonstrate the skills you're
              developing on your path toward your career goal.
            </p>

          </div>

          {/* Project count */}
          <div className="bg-white border border-slate-200 rounded-xl px-5 py-4 min-w-[150px]">

            <p className="text-xs uppercase tracking-wide text-slate-500">
              Available projects
            </p>

            <p className="text-2xl font-bold text-slate-900 mt-1">
              {projects.length}
            </p>

          </div>

        </div>

        {/* Explanation */}
        <div className="mt-8 bg-white border border-slate-200 rounded-xl p-5">

          <div className="flex gap-4">

            <div className="w-10 h-10 shrink-0 rounded-lg bg-slate-100 flex items-center justify-center">
              <BookOpen size={19} className="text-slate-700" />
            </div>

            <div>

              <h2 className="font-semibold text-slate-900">
                Learn by building
              </h2>

              <p className="text-sm text-slate-500 mt-1 leading-6">
                Projects are connected to the skills they require. Use them
                to turn individual skills into practical experience you can
                demonstrate.
              </p>

            </div>

          </div>

        </div>

        {/* Projects */}
        <div className="mt-8">

          <div className="flex items-center justify-between mb-4">

            <div>
              <h2 className="font-semibold text-slate-900">
                Project library
              </h2>

              <p className="text-sm text-slate-500 mt-1">
                Choose a project that matches the skills you're learning.
              </p>
            </div>

          </div>

          {projects.length === 0 ? (

            /* Empty state */
            <div className="bg-white border border-slate-200 rounded-xl p-10 text-center">

              <div className="w-12 h-12 mx-auto rounded-full bg-slate-100 flex items-center justify-center">
                <FolderKanban size={22} className="text-slate-600" />
              </div>

              <h2 className="text-lg font-semibold text-slate-900 mt-4">
                No projects available
              </h2>

              <p className="text-sm text-slate-500 mt-2 max-w-md mx-auto">
                There aren't any projects in the library yet. Check back
                once more learning projects have been added.
              </p>

            </div>

          ) : (

            /* Project cards */
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">

              {projects.map((project) => (

                <article
                  key={project.id}
                  className="group bg-white border border-slate-200 rounded-xl p-6 hover:border-slate-300 transition"
                >

                  {/* Icon */}
                  <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center">
                    <Layers3
                      size={19}
                      className="text-slate-700"
                    />
                  </div>

                  {/* Title */}
                  <h3 className="text-lg font-semibold text-slate-900 mt-5">
                    {project.title}
                  </h3>

                  {/* Description */}
                  <p className="text-sm text-slate-500 mt-2 leading-6">
                    {project.description}
                  </p>

                  {/* Required skills */}
                  {project.skills && project.skills.length > 0 && (
                    <div className="mt-5">

                      <p className="text-xs uppercase tracking-wide text-slate-500 mb-2">
                        Skills
                      </p>

                      <div className="flex flex-wrap gap-2">

                        {project.skills.map((skill, index) => {

                          const skillName =
                            typeof skill === "string"
                              ? skill
                              : skill.name;

                          return (
                            <span
                              key={index}
                              className="inline-flex items-center gap-1.5 text-xs font-medium bg-slate-100 text-slate-700 px-2.5 py-1.5 rounded-md"
                            >
                              <CheckCircle2 size={12} />
                              {skillName}
                            </span>
                          );
                        })}

                      </div>

                    </div>
                  )}

                  {/* Footer */}
                  <div className="mt-6 pt-5 border-t border-slate-100 flex items-center justify-between">

                    <span className="text-xs text-slate-500">
                      Practical project
                    </span>

                    <button
                      className="text-sm font-medium text-slate-700 hover:text-slate-900 flex items-center gap-1"
                    >
                      Explore
                      <ArrowRight
                        size={15}
                        className="transition-transform group-hover:translate-x-0.5"
                      />
                    </button>

                  </div>

                </article>

              ))}

            </div>

          )}

        </div>

      </main>

    </div>
  );
}

export default Projects;
