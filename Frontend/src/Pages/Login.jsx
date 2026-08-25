import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { login, signup } from "../services/api";
import { GraduationCap, ArrowRight, Sparkles, Network } from "lucide-react";

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
    <div className="min-h-screen bg-[#09090B] text-white relative overflow-hidden">

      {/* Background Glow */}
      <div className="absolute -top-40 -left-32 w-[420px] h-[420px] bg-indigo-600/20 blur-[120px] rounded-full" />
      <div className="absolute bottom-0 right-0 w-[380px] h-[380px] bg-cyan-500/10 blur-[120px] rounded-full" />

      <div className="relative z-10 grid lg:grid-cols-2 min-h-screen">

        {/* Left Branding */}
        <div className="hidden lg:flex flex-col justify-between p-12 border-r border-white/10">

          <div>
            <div className="flex items-center gap-3 mb-8">
              <div className="w-11 h-11 rounded-2xl bg-white/10 flex items-center justify-center border border-white/10">
                <Network size={22} />
              </div>

              <div>
                <h1 className="font-bold text-xl">SkillBridge</h1>
                <p className="text-xs text-zinc-400">
                  AI Learning Graph
                </p>
              </div>
            </div>

            <div className="max-w-md">
              <h2 className="text-5xl font-semibold leading-tight tracking-tight">
                Learn through
                <span className="text-indigo-400"> connections.</span>
              </h2>

              <p className="mt-6 text-zinc-400 leading-7">
                Discover the shortest path to your dream career using
                graph-powered prerequisite mapping, mentor matching,
                and project recommendations.
              </p>
            </div>
          </div>

          {/* Feature Cards */}
          <div className="space-y-4">
            <div className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur">
              <div className="flex items-center gap-3">
                <Sparkles className="text-indigo-400" size={18} />
                <p className="font-medium">AI Career Path</p>
              </div>
              <p className="text-sm text-zinc-400 mt-2">
                Build personalized learning journeys from beginner to expert.
              </p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur">
              <div className="flex items-center gap-3">
                <GraduationCap className="text-cyan-400" size={18} />
                <p className="font-medium">Graph Recommendations</p>
              </div>
              <p className="text-sm text-zinc-400 mt-2">
                Find mentors and projects through multi-hop graph traversal.
              </p>
            </div>
          </div>
        </div>

        {/* Right Form */}
        <div className="flex items-center justify-center px-6 py-10">

          <div className="w-full max-w-md">

            <div className="lg:hidden flex items-center gap-3 mb-10 justify-center">
              <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center">
                <Network size={20} />
              </div>

              <div>
                <h1 className="font-bold text-lg">SkillBridge</h1>
                <p className="text-xs text-zinc-400">
                  AI Learning Graph
                </p>
              </div>
            </div>

            <div className="rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl p-8 shadow-2xl">

              <div className="mb-6">
                <h2 className="text-3xl font-semibold">
                  {isSignup ? "Create account" : "Welcome back"}
                </h2>

                <p className="text-zinc-400 mt-2 text-sm">
                  {isSignup
                    ? "Start building your personalized career journey."
                    : "Sign in to continue exploring your learning graph."}
                </p>
              </div>

              {error && (
                <div className="mb-5 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">

                {isSignup && (
                  <div>
                    <label className="text-sm text-zinc-300 mb-2 block">
                      Full Name
                    </label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                      className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 outline-none focus:border-indigo-400 transition"
                      placeholder="James Josiah"
                    />
                  </div>
                )}

                <div>
                  <label className="text-sm text-zinc-300 mb-2 block">
                    Email
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 outline-none focus:border-indigo-400 transition"
                    placeholder="you@example.com"
                  />
                </div>

                <div>
                  <label className="text-sm text-zinc-300 mb-2 block">
                    Password
                  </label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 outline-none focus:border-indigo-400 transition"
                    placeholder="••••••••"
                  />
                </div>

                <button
                  disabled={loading}
                  className="w-full mt-2 rounded-xl bg-white text-black py-3 font-semibold hover:bg-zinc-200 transition disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {loading ? "Please wait..." : isSignup ? "Create Account" : "Sign In"}
                  {!loading && <ArrowRight size={18} />}
                </button>
              </form>

              <div className="mt-6 text-center text-sm text-zinc-400">
                {isSignup ? "Already have an account?" : "Don't have an account?"}

                <button
                  onClick={() => setIsSignup(!isSignup)}
                  className="ml-2 text-white font-medium hover:text-indigo-400 transition"
                >
                  {isSignup ? "Sign In" : "Create one"}
                </button>
              </div>

            </div>

            <p className="text-center text-xs text-zinc-500 mt-6">
              Powered by CognoDB • Graph Database Learning Platform
            </p>

          </div>

        </div>

      </div>
    </div>
  );
}

export default Login;