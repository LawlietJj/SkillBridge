import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { login, signup } from "../services/api";

function Login() {
  const [isSignup, setIsSignup] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      if (isSignup) {
        await signup(name, email, password);
      }

      const res = await login(email, password);

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));

      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.error || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 grid lg:grid-cols-2">

      {/* Left Panel */}
      <div className="hidden lg:flex bg-slate-800 text-white p-14 flex-col justify-between">

        <div>
          <div className="w-12 h-12 bg-white text-slate-800 flex items-center justify-center font-bold text-xl rounded-md">
            SB
          </div>

          <h1 className="text-4xl font-semibold mt-10 leading-tight">
            Personalized Learning.
            <br />
            Connected Careers.
          </h1>

          <p className="text-slate-300 mt-6 leading-7 max-w-md">
            SkillBridge helps students discover the exact skills,
            mentors and projects required to reach their career goals
            using graph-powered learning paths.
          </p>
        </div>

        <div className="space-y-5 border-t border-slate-700 pt-8">

          <div>
            <p className="text-sm font-medium">Skill Graph</p>
            <p className="text-sm text-slate-400 mt-1">
              Visualize prerequisite relationships between skills.
            </p>
          </div>

          <div>
            <p className="text-sm font-medium">Mentor Matching</p>
            <p className="text-sm text-slate-400 mt-1">
              Find mentors connected to your learning journey.
            </p>
          </div>

          <div>
            <p className="text-sm font-medium">Project Roadmap</p>
            <p className="text-sm text-slate-400 mt-1">
              Build portfolio projects as you progress.
            </p>
          </div>

        </div>
      </div>

      {/* Right Panel */}
      <div className="flex items-center justify-center p-6 lg:p-12">

        <div className="w-full max-w-md">

          {/* Mobile Logo */}
          <div className="lg:hidden mb-8 flex items-center gap-3">
            <div className="w-11 h-11 bg-slate-800 text-white rounded-md flex items-center justify-center font-bold">
              SB
            </div>
            <div>
              <h1 className="font-semibold text-slate-900">SkillBridge</h1>
              <p className="text-sm text-slate-500">
                Learning Graph Platform
              </p>
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-md p-8">

            <div className="mb-8">
              <p className="text-sm text-slate-500">
                Welcome to SkillBridge
              </p>

              <h2 className="text-3xl font-semibold text-slate-900 mt-1">
                {isSignup ? "Create account" : "Sign in"}
              </h2>
            </div>

            {error && (
              <div className="mb-6 border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 rounded-md">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">

              {isSignup && (
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    className="w-full border border-slate-300 rounded-md px-4 py-3 focus:outline-none focus:ring-2 focus:ring-slate-800 focus:border-slate-800"
                    placeholder="James Josiah"
                  />
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full border border-slate-300 rounded-md px-4 py-3 focus:outline-none focus:ring-2 focus:ring-slate-800 focus:border-slate-800"
                  placeholder="you@example.com"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Password
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full border border-slate-300 rounded-md px-4 py-3 focus:outline-none focus:ring-2 focus:ring-slate-800 focus:border-slate-800"
                  placeholder="••••••••"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-slate-800 hover:bg-slate-900 text-white py-3 rounded-md font-medium transition disabled:opacity-60"
              >
                {loading
                  ? "Please wait..."
                  : isSignup
                  ? "Create Account"
                  : "Sign In"}
              </button>

            </form>

            <div className="mt-8 pt-6 border-t border-slate-200 text-center">
              <p className="text-sm text-slate-500">
                {isSignup
                  ? "Already have an account?"
                  : "Don't have an account?"}
              </p>

              <button
                onClick={() => setIsSignup(!isSignup)}
                className="mt-2 text-sm font-medium text-slate-800 hover:underline"
              >
                {isSignup ? "Sign In" : "Create Account"}
              </button>
            </div>

          </div>

          <p className="text-center text-xs text-slate-400 mt-6">
            © 2026 SkillBridge. Built with CognoDB.
          </p>

        </div>
      </div>
    </div>
  );
}

export default Login;