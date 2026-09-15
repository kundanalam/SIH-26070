export default function Footer() {
  return (
    <footer id="main-footer" className="mt-20 border-t border-[#EAE0D2] bg-[#F4EFE6]/60 py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-3">
        <div className="flex items-center justify-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-[#FF654E]"></span>
          <span className="text-lg font-bold tracking-tight text-[#2D2320]">
            CycloVision
          </span>
        </div>

        <p className="text-sm font-semibold text-[#FF654E]">
          AI-Powered Cyclone Prediction
        </p>

        <p className="text-xs font-bold text-[#5C4F48] tracking-wider uppercase">
          SIH 2026 | Problem Statement 26070
        </p>

        <p className="text-xs text-[#8C7E76] max-w-xl mx-auto pt-2 border-t border-[#EAE0D2]/80 leading-relaxed">
          Prototype for educational and hackathon demonstration purposes. Predictions should not replace official meteorological warnings from the India Meteorological Department (IMD) or national disaster management authorities.
        </p>
      </div>
    </footer>
  );
}
