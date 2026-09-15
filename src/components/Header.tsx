export type AppViewMode = 'command' | 'comparison' | 'taxonomy' | 'dossier';

interface HeaderProps {
  onNavigateToAnalyze: () => void;
  onNavigateToDashboard: () => void;
  hasPrediction: boolean;
  activeViewMode: AppViewMode;
  onSelectViewMode: (mode: AppViewMode) => void;
  hasMultipleImages?: boolean;
}

export default function Header({
  onNavigateToAnalyze,
  onNavigateToDashboard,
  hasPrediction,
  activeViewMode,
  onSelectViewMode,
  hasMultipleImages = false,
}: HeaderProps) {
  return (
    <header id="main-header" className="sticky top-0 z-40 bg-[#F8F5EE]/95 backdrop-blur-md border-b border-[#EADFCF]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between gap-4">
        {/* Left branding */}
        <div 
          id="header-brand" 
          onClick={onNavigateToAnalyze}
          className="flex flex-col cursor-pointer select-none group shrink-0"
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

        {/* Center / Right operational view tabs */}
        <nav id="header-navigation" className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto py-1">
          <button
            id="view-tab-command"
            type="button"
            onClick={() => onSelectViewMode('command')}
            className={`px-3 py-1.5 sm:px-3.5 sm:py-2 text-xs sm:text-sm font-bold rounded-xl transition-all duration-150 cursor-pointer whitespace-nowrap ${
              activeViewMode === 'command'
                ? 'bg-[#FF654E] text-white shadow-xs'
                : 'text-[#5C4F48] hover:text-[#2D2320] hover:bg-white/80'
            }`}
          >
            Command Center
          </button>

          <button
            id="view-tab-comparison"
            type="button"
            onClick={() => onSelectViewMode('comparison')}
            className={`px-3 py-1.5 sm:px-3.5 sm:py-2 text-xs sm:text-sm font-bold rounded-xl transition-all duration-150 cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
              activeViewMode === 'comparison'
                ? 'bg-[#FF654E] text-white shadow-xs'
                : 'text-[#5C4F48] hover:text-[#2D2320] hover:bg-white/80'
            }`}
          >
            Comparative View
            {hasMultipleImages && (
              <span className="w-2 h-2 rounded-full bg-[#FF654E] animate-pulse"></span>
            )}
          </button>

          <button
            id="view-tab-taxonomy"
            type="button"
            onClick={() => onSelectViewMode('taxonomy')}
            className={`px-3 py-1.5 sm:px-3.5 sm:py-2 text-xs sm:text-sm font-bold rounded-xl transition-all duration-150 cursor-pointer whitespace-nowrap ${
              activeViewMode === 'taxonomy'
                ? 'bg-[#FF654E] text-white shadow-xs'
                : 'text-[#5C4F48] hover:text-[#2D2320] hover:bg-white/80'
            }`}
          >
            Taxonomy Matrix
          </button>

          <button
            id="view-tab-dossier"
            type="button"
            onClick={() => onSelectViewMode('dossier')}
            className={`px-3 py-1.5 sm:px-3.5 sm:py-2 text-xs sm:text-sm font-bold rounded-xl transition-all duration-150 cursor-pointer whitespace-nowrap ${
              activeViewMode === 'dossier'
                ? 'bg-[#FF654E] text-white shadow-xs'
                : 'text-[#5C4F48] hover:text-[#2D2320] hover:bg-white/80'
            }`}
          >
            Full Dossier
          </button>
        </nav>
      </div>
    </header>
  );
}
