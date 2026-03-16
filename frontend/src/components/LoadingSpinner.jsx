/**
 * LoadingSpinner.jsx
 * Full-screen overlay with a spinning gradient ring shown
 * while the AI is generating the resume.
 */

const LoadingSpinner = () => (
  <div className="fixed inset-0 z-50 flex items-center justify-center
                  bg-slate-950/80 backdrop-blur-sm">
    <div className="flex flex-col items-center gap-5 animate-fade-in">
      {/* Spinning ring */}
      <div className="relative w-16 h-16">
        <div className="absolute inset-0 rounded-full border-4 border-violet-900/40" />
        <div className="absolute inset-0 rounded-full border-4 border-transparent
                        border-t-violet-500 border-r-purple-500
                        animate-spin" />
      </div>

      {/* Text */}
      <div className="text-center">
        <p className="text-white font-semibold text-sm tracking-wide">
          ✨ Crafting your resume…
        </p>
        <p className="text-slate-500 text-xs mt-1">
          GPT-4 is writing your content
        </p>
      </div>

      {/* Animated dots */}
      <div className="flex gap-1.5">
        {[0, 1, 2].map((i) => (
          <span
            key={i}
            className="w-1.5 h-1.5 rounded-full bg-violet-500"
            style={{
              animation: `bounce 1.2s ${i * 0.2}s ease-in-out infinite`,
            }}
          />
        ))}
      </div>
    </div>

    <style>{`
      @keyframes bounce {
        0%, 100% { transform: translateY(0); opacity: 0.4; }
        50% { transform: translateY(-6px); opacity: 1; }
      }
    `}</style>
  </div>
);

export default LoadingSpinner;
