export const AboutPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-emerald-50/30 to-violet-50/30 py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <div className="relative inline-flex items-center justify-center mb-8">
            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-emerald-500 to-violet-500 flex items-center justify-center shadow-hero">
              <span className="text-5xl">📖</span>
            </div>
          </div>
          <h1 className="text-5xl md:text-6xl font-bold mb-6">
            <span className="bg-gradient-to-r from-emerald-500 to-violet-500 bg-clip-text text-transparent">
              About Islam4Kids Games
            </span>
          </h1>
        </div>

        {/* Beta Notice Card */}
        <section className="relative bg-white rounded-3xl p-8 mb-8 shadow-lg overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl">
          <div className="h-2 absolute top-0 left-0 right-0 bg-gradient-to-r from-amber-500 to-amber-400"></div>
          <div className="absolute -top-10 -right-10 w-32 h-32 rounded-full bg-gradient-to-br from-amber-100 to-amber-50 opacity-20"></div>

          <div className="flex items-start gap-4 mb-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-500 to-amber-400 flex items-center justify-center text-3xl shadow-lg flex-shrink-0">
              🧪
            </div>
            <div>
              <h2 className="text-3xl font-bold text-slate-700 mb-4">Beta Testing</h2>
              <p className="text-lg text-slate-600 mb-4">
                Welcome to the Islam4Kids Games beta! We're excited to have you try our
                educational Islamic games for children.
              </p>
              <p className="text-lg text-slate-600">
                <strong className="text-amber-600">Please Note:</strong> All games are currently in active development.
                You may encounter bugs or incomplete features as we continue to improve the experience.
              </p>
            </div>
          </div>
        </section>

        {/* Feedback Card */}
        <section className="relative bg-white rounded-3xl p-8 mb-8 shadow-lg overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl">
          <div className="h-2 absolute top-0 left-0 right-0 bg-gradient-to-r from-emerald-500 to-emerald-400"></div>
          <div className="absolute -top-10 -right-10 w-32 h-32 rounded-full bg-gradient-to-br from-emerald-100 to-emerald-50 opacity-20"></div>

          <div className="flex items-start gap-4 mb-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-500 to-emerald-400 flex items-center justify-center text-3xl shadow-lg flex-shrink-0">
              💬
            </div>
            <div className="flex-1">
              <h2 className="text-3xl font-bold text-slate-700 mb-4">We Value Your Feedback</h2>
              <p className="text-lg text-slate-600 mb-4">
                Your input helps us create better educational resources for Muslim children.
                Please share your thoughts, suggestions, or report any issues by emailing:
              </p>
              <a
                href="mailto:support@islam4kids.org"
                className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-emerald-500 to-emerald-400 text-white rounded-xl font-medium shadow-lg hover:-translate-y-0.5 hover:shadow-xl transition-all duration-200"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                support@islam4kids.org
              </a>
            </div>
          </div>
        </section>

        {/* Goals Card */}
        <section className="relative bg-white rounded-3xl p-8 mb-8 shadow-lg overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl">
          <div className="h-2 absolute top-0 left-0 right-0 bg-gradient-to-r from-violet-500 to-violet-400"></div>
          <div className="absolute -top-10 -right-10 w-32 h-32 rounded-full bg-gradient-to-br from-violet-100 to-violet-50 opacity-20"></div>

          <div className="flex items-start gap-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-violet-500 to-violet-400 flex items-center justify-center text-3xl shadow-lg flex-shrink-0">
              🎯
            </div>
            <div className="flex-1">
              <h2 className="text-3xl font-bold text-slate-700 mb-4">Our Goals</h2>
              <p className="text-lg text-slate-600 mb-4">
                Islam4Kids Games aims to make learning about Islamic concepts engaging and fun
                for children of all ages through interactive games and activities.
              </p>
              <ul className="space-y-3">
                <li className="flex items-start gap-3 text-lg text-slate-600">
                  <div className="w-6 h-6 rounded-full bg-gradient-to-br from-violet-500 to-violet-400 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  Create engaging educational content about Islam
                </li>
                <li className="flex items-start gap-3 text-lg text-slate-600">
                  <div className="w-6 h-6 rounded-full bg-gradient-to-br from-violet-500 to-violet-400 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  Help children learn Islamic terms, concepts, and history
                </li>
                <li className="flex items-start gap-3 text-lg text-slate-600">
                  <div className="w-6 h-6 rounded-full bg-gradient-to-br from-violet-500 to-violet-400 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  Provide a safe, ad-free environment for Muslim children
                </li>
              </ul>
            </div>
          </div>
        </section>

        {/* Coming Soon Card */}
        <section className="relative bg-white rounded-3xl p-8 shadow-lg overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl">
          <div className="h-2 absolute top-0 left-0 right-0 bg-gradient-to-r from-emerald-500 via-violet-500 to-amber-500"></div>
          <div className="absolute -top-10 -right-10 w-32 h-32 rounded-full bg-gradient-to-br from-emerald-100 to-violet-100 opacity-20"></div>

          <div className="flex items-start gap-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-500 to-violet-500 flex items-center justify-center text-3xl shadow-lg flex-shrink-0">
              ✨
            </div>
            <div>
              <h2 className="text-3xl font-bold text-slate-700 mb-4">Coming Soon</h2>
              <p className="text-lg text-slate-600">
                We're working on new games and features! Check back regularly for updates.
              </p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};
