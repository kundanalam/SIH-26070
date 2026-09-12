interface HeaderProps {
  onNavigateToAnalyze: () => void;
  onNavigateToDashboard: () => void;
  hasPrediction: boolean;
}

export default function Header({
  onNavigateToAnalyze,
  onNavigateToDashboard,
  hasPrediction,
}: HeaderProps) {
  return (
    <header id="main-header" className="sticky top-0 z-40 bg-[#F8F5EE]/90 backdrop-blur-md border-b border-[#EADFCF]">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 h-18 flex items-center justify-between">
        {/* Left branding */}
        <div 
          id="header-brand" 
          onClick={onNavigateToAnalyze}
          className="flex flex-col cursor-pointer select-none group"
        >
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#FF654E] transition-transform group-hover:scale-125 duration-200"></span>
            <span className="text-xl font-bold tracking-tight text-[#2D2320]">
              CycloVision
            </span>
          </div>
          <span className="text-xs font-medium text-[#7D7068] tracking-wide ml-4.5">
            AI-Powered Cyclone Prediction
          </span>
        </div>

        {/* Right nav buttons */}
        <nav id="header-navigation" className="flex items-center gap-2 sm:gap-3">
          <button
            id="nav-btn-analyze"
            type="button"
            onClick={onNavigateToAnalyze}
            className="px-4 py-2 text-sm font-semibold rounded-lg text-[#2D2320] hover:text-[#FF654E] hover:bg-white/80 transition-all duration-150"
          >
            Analyze
          </button>
          <button
            id="nav-btn-dashboard"
            type="button"
            onClick={onNavigateToDashboard}
            className={`px-4 py-2 text-sm font-semibold rounded-lg transition-all duration-150 flex items-center gap-1.5 ${
              hasPrediction
                ? 'bg-[#FF654E] text-white hover:bg-[#E8553F] shadow-sm'
                : 'text-[#61544E] hover:text-[#2D2320] hover:bg-white/80'
            }`}
          >
            Dashboard
            {hasPrediction && (
              <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse"></span>
            )}
          </button>
        </nav>
      </div>
    </header>
  );
}
