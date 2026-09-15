import { useState, useRef, DragEvent, ChangeEvent } from 'react';
import { 
  UploadCloud, 
  Image as ImageIcon, 
  Trash2, 
  Zap, 
  CheckCircle2, 
  Plus, 
  AlertTriangle, 
  Layers, 
  ShieldCheck,
  ShieldAlert,
  Sparkles 
} from 'lucide-react';
import { SatelliteImageItem, PredictionResult } from '../types';
import { ALL_BENCHMARK_SAMPLES, BenchmarkSample } from '../services/cyclonePrediction';

interface SatelliteUploaderProps {
  images: SatelliteImageItem[];
  selectedImageId: string | null;
  onSelectImage: (id: string) => void;
  onAddImages: (newImages: SatelliteImageItem[]) => void;
  onRemoveImage: (id: string) => void;
  onClearAllImages: () => void;
  onLoadComparisonSet: () => void;
  onPredict: () => void;
  isPredicting: boolean;
  predictionMap?: Record<string, PredictionResult>;
  onLoadBenchmark?: (sample: BenchmarkSample) => void;
}

export default function SatelliteUploader({
  images,
  selectedImageId,
  onSelectImage,
  onAddImages,
  onRemoveImage,
  onClearAllImages,
  onLoadComparisonSet,
  onPredict,
  isPredicting,
  predictionMap = {},
  onLoadBenchmark,
}: SatelliteUploaderProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const processFiles = (fileList: FileList | File[]) => {
    setErrorMessage(null);
    const validTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/webp'];
    const incoming = Array.from(fileList);

    const validFiles = incoming.filter(
      (f) => validTypes.includes(f.type) || f.name.match(/\.(jpg|jpeg|png|webp)$/i)
    );

    if (validFiles.length === 0) {
      setErrorMessage('Please upload valid image files (JPG, PNG, or WebP).');
      return;
    }

    const availableSlots = 3 - images.length;
    if (availableSlots <= 0) {
      setErrorMessage('Maximum of 3 images reached. Remove an image to add a new one.');
      return;
    }

    const toProcess = validFiles.slice(0, availableSlots);
    if (validFiles.length > availableSlots) {
      setErrorMessage(`Added ${availableSlots} image(s). A maximum of 3 images can be compared at once.`);
    }

    const readers = toProcess.map((file) => {
      return new Promise<SatelliteImageItem>((resolve) => {
        const reader = new FileReader();
        reader.onload = (event) => {
          resolve({
            id: `upload-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`,
            name: file.name,
            dataUrl: (event.target?.result as string) || '',
            size: file.size,
          });
        };
        reader.readAsDataURL(file);
      });
    });

    Promise.all(readers).then((newItems) => {
      onAddImages(newItems);
    });
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      processFiles(e.dataTransfer.files);
    }
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      processFiles(e.target.files);
      // Reset input value so re-uploading same file triggers change
      e.target.value = '';
    }
  };

  const hasImages = images.length > 0;
  const canAddMore = images.length < 3;

  return (
    <div id="satellite-upload-section" className="w-full">
      {/* Hidden File Input allowing multiple selection up to 3 */}
      <input
        ref={fileInputRef}
        id="satellite-file-input"
        type="file"
        accept="image/jpeg, image/jpg, image/png, image/webp"
        multiple
        className="hidden"
        onChange={handleFileChange}
      />

      {/* Main Upload / Comparison Grid Card */}
      <div className="bg-white rounded-2xl border border-[#EBE4D8] shadow-[0_4px_25px_rgba(45,35,32,0.04)] p-6 sm:p-8 transition-all">
        {/* Header Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 mb-4 border-b border-[#F4EFE6] gap-3">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#FF654E]/10 flex items-center justify-center text-[#FF654E]">
              <Layers className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-[#2D2320] uppercase tracking-wider flex items-center gap-2">
                Satellite Imagery (Multi-Source)
              </h2>
              <p className="text-xs text-[#7D7068]">
                Select up to 3 images at once to compare cyclone presence and intensity differences
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className={`inline-flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-full border ${
              images.length === 3 
                ? 'bg-[#FFEDE8] text-[#D94935] border-[#FFD3C7]' 
                : 'bg-[#FAF7F2] text-[#5C4F48] border-[#E8E0D2]'
            }`}>
              {images.length} / 3 Images Loaded
            </span>

            {hasImages && (
              <span className="hidden sm:inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full bg-[#EBF7EE] text-[#1E7235]">
                <CheckCircle2 className="w-3.5 h-3.5" /> Ready
              </span>
            )}
          </div>
        </div>

        {/* Quick Benchmark Preset Strip */}
        <div className="mb-5 p-3 rounded-xl bg-[#FAF7F2] border border-[#EAE2D5]">
          <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
            <span className="text-[11px] font-bold text-[#5C4F48] uppercase tracking-wider flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-[#FF654E]" />
              Quick Archetype Presets (1-Click Test & Verify)
            </span>
            <button
              type="button"
              onClick={onLoadComparisonSet}
              className="text-[11px] font-bold text-[#FF654E] hover:underline cursor-pointer"
            >
              + Load 3-Image Comparison Set
            </button>
          </div>
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
            {ALL_BENCHMARK_SAMPLES.map((b) => (
              <button
                key={b.id}
                type="button"
                onClick={() => onLoadBenchmark ? onLoadBenchmark(b) : onLoadComparisonSet()}
                className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-white hover:bg-[#FFEDE8] text-[#2D2320] hover:text-[#D94935] border border-[#E0D7C8] hover:border-[#FFD3C7] transition-all whitespace-nowrap flex items-center gap-1 cursor-pointer shrink-0 shadow-2xs"
                title={`${b.categoryLabel} (${b.cycloneType}) - ${b.parameters.windSpeed} km/h, SST ${b.parameters.seaSurfaceTemperature}°C`}
              >
                <span>{b.cycloneType.includes('Tropical') ? '🌀' : b.cycloneType.includes('Extratropical') ? '🌊' : b.cycloneType.includes('Polar') ? '❄️' : b.cycloneType.includes('Meso') ? '🌪️' : '☀️'}</span>
                <span>{b.categoryLabel.split('(')[0].trim()}</span>
                <span className="text-[10px] text-[#8C7E76] font-normal">({b.parameters.windSpeed}k)</span>
              </button>
            ))}
          </div>
        </div>

        {/* Error notification */}
        {errorMessage && (
          <div className="mb-4 p-3 rounded-xl bg-[#FFF5F5] border border-[#FED7D7] text-xs font-medium text-[#C53030] flex items-center justify-between">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 shrink-0" />
              <span>{errorMessage}</span>
            </div>
            <button
              type="button"
              onClick={() => setErrorMessage(null)}
              className="text-[#9B2C2C] font-bold hover:underline cursor-pointer ml-3"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* EMPTY STATE: Full Dropzone */}
        {!hasImages ? (
          <div
            id="dropzone-container"
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={`border-2 border-dashed rounded-xl p-8 sm:p-12 text-center transition-all duration-200 cursor-pointer ${
              isDragging
                ? 'border-[#FF654E] bg-[#FFF8F6]'
                : 'border-[#E0D7C8] hover:border-[#FF654E]/60 bg-[#FAF7F2]/60 hover:bg-[#FAF7F2]'
            }`}
            onClick={() => fileInputRef.current?.click()}
          >
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-white shadow-sm border border-[#EAE3D5] flex items-center justify-center text-[#FF654E]">
              <UploadCloud className="w-8 h-8" />
            </div>

            <p className="text-base sm:text-lg font-semibold text-[#2D2320] mb-1">
              Drag & drop up to 3 satellite images here
            </p>
            <p className="text-xs sm:text-sm text-[#7D7068] mb-5">
              Select multiple files simultaneously to compare cyclone presence & intensity differences
            </p>

            <button
              id="browse-image-btn"
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                fileInputRef.current?.click();
              }}
              className="px-6 py-2.5 bg-[#FF654E] hover:bg-[#E8553F] text-white text-sm font-semibold rounded-xl shadow-sm transition-all active:scale-98 cursor-pointer"
            >
              Browse Up to 3 Images
            </button>

            <div className="mt-6 pt-4 border-t border-[#EAE3D5]/60 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-[#8A7D75]">
              <span>Supported formats: <strong>JPG, JPEG, PNG, WebP</strong></span>
              <button
                id="load-sample-image-btn"
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onLoadComparisonSet();
                }}
                className="font-semibold text-[#FF654E] hover:underline hover:text-[#D94935] cursor-pointer"
              >
                + Load 3 Comparison Samples (Severe Cyclone, Depression, Clear Ocean)
              </button>
            </div>
          </div>
        ) : (
          /* MULTI-IMAGE RESPONSIVE FLEX GRID */
          <div className="space-y-6">
            <div 
              id="satellite-images-flex-grid" 
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
            >
              {images.map((img, index) => {
                const isSelected = img.id === selectedImageId;
                const prediction = predictionMap[img.id];

                return (
                  <div
                    key={img.id}
                    id={`uploaded-image-card-${index}`}
                    onClick={() => onSelectImage(img.id)}
                    className={`relative rounded-xl border p-3 flex flex-col justify-between transition-all duration-200 cursor-pointer ${
                      isSelected
                        ? 'border-[#FF654E] bg-[#FFF8F6] ring-2 ring-[#FF654E]/20 shadow-sm'
                        : 'border-[#E8E1D5] bg-[#FAF7F2]/40 hover:border-[#FF654E]/50 hover:bg-[#FAF7F2]'
                    }`}
                  >
                    {/* Top image metadata bar */}
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-1.5">
                        <span className={`text-[11px] font-bold px-2 py-0.5 rounded-md ${
                          isSelected 
                            ? 'bg-[#FF654E] text-white' 
                            : 'bg-white border border-[#E8E1D5] text-[#6C5E57]'
                        }`}>
                          Image {index + 1}
                        </span>
                        {isSelected && (
                          <span className="text-[10px] font-semibold text-[#FF654E] uppercase tracking-wider">
                            Active View
                          </span>
                        )}
                      </div>

                      <button
                        type="button"
                        title="Remove image"
                        onClick={(e) => {
                          e.stopPropagation();
                          onRemoveImage(img.id);
                        }}
                        disabled={isPredicting}
                        className="p-1 rounded-md text-[#8C7E76] hover:text-[#C53030] hover:bg-[#FFF5F5] transition-colors cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    {/* Image Preview */}
                    <div className="relative rounded-lg overflow-hidden bg-[#182026] border border-[#E8E1D5] aspect-4/3 flex items-center justify-center mb-2.5">
                      <img
                        src={img.dataUrl}
                        alt={`Satellite Image ${index + 1}`}
                        className="w-full h-full object-contain"
                      />

                      {/* Quick Cyclone Presence Pill if predicted */}
                      {prediction && (
                        <div className="absolute top-2 right-2">
                          {prediction.cycloneDetected ? (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#FF654E] text-white shadow-xs">
                              <ShieldAlert className="w-3 h-3" />
                              Cyclone ({prediction.predictedWindSpeed} km/h)
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#10B981] text-white shadow-xs">
                              <ShieldCheck className="w-3 h-3" />
                              No Cyclone
                            </span>
                          )}
                        </div>
                      )}
                    </div>

                    {/* Image details & filename */}
                    <div className="space-y-1">
                      <p className="text-xs font-semibold text-[#2D2320] truncate" title={img.name}>
                        {img.name}
                      </p>

                      {prediction ? (
                        <div className="flex items-center justify-between text-[11px] pt-1 border-t border-[#F0EAE1]">
                          <span className="text-[#6C5E57] truncate max-w-[130px]">
                            {prediction.classification}
                          </span>
                          <span className="font-bold text-[#FF654E]">
                            {prediction.predictedWindSpeed} km/h
                          </span>
                        </div>
                      ) : (
                        <p className="text-[11px] text-[#8C7E76]">
                          Pending AI cyclone & intensity analysis
                        </p>
                      )}
                    </div>
                  </div>
                );
              })}

              {/* Add More Slot if < 3 images */}
              {canAddMore && (
                <div
                  id="add-more-image-slot"
                  onClick={() => fileInputRef.current?.click()}
                  className={`border-2 border-dashed rounded-xl p-4 flex flex-col items-center justify-center text-center cursor-pointer transition-all min-h-[190px] ${
                    isDragging
                      ? 'border-[#FF654E] bg-[#FFF8F6]'
                      : 'border-[#E0D7C8] hover:border-[#FF654E]/60 bg-[#FAF7F2]/50 hover:bg-[#FAF7F2]'
                  }`}
                >
                  <div className="w-10 h-10 rounded-full bg-white border border-[#EAE3D5] flex items-center justify-center text-[#FF654E] mb-2 shadow-xs">
                    <Plus className="w-5 h-5" />
                  </div>
                  <p className="text-xs font-bold text-[#2D2320]">
                    Add Image ({images.length + 1} of 3)
                  </p>
                  <p className="text-[11px] text-[#8C7E76] mt-0.5">
                    Click to browse or drop file here
                  </p>
                </div>
              )}
            </div>

            {/* Action Bar Below Grid */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-3 border-t border-[#F4EFE6]">
              <div className="flex items-center gap-3 w-full sm:w-auto">
                <button
                  id="clear-all-images-btn"
                  type="button"
                  onClick={onClearAllImages}
                  disabled={isPredicting}
                  className="px-4 py-2 rounded-xl border border-[#E0D6C7] text-xs font-semibold text-[#5B4E47] hover:text-[#C53030] hover:border-[#F8B4B4] hover:bg-[#FFF5F5] transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  Clear All
                </button>

                <button
                  id="load-comparison-set-btn"
                  type="button"
                  onClick={onLoadComparisonSet}
                  disabled={isPredicting}
                  className="px-3 py-2 rounded-xl text-xs font-bold text-[#FF654E] hover:bg-[#FFEDE8] border border-transparent hover:border-[#FFD3C7] transition-all cursor-pointer"
                >
                  + Load 3 Comparison Samples
                </button>
              </div>

              <button
                id="predict-cyclone-btn"
                type="button"
                onClick={onPredict}
                disabled={isPredicting || images.length === 0}
                className="w-full sm:w-auto px-8 py-3 rounded-xl bg-[#FF654E] hover:bg-[#E8553F] text-white text-sm sm:text-base font-bold shadow-md shadow-[#FF654E]/20 transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-98 disabled:opacity-60"
              >
                <Zap className="w-5 h-5 fill-current" />
                {isPredicting
                  ? `Analyzing ${images.length} Image(s)...`
                  : `Predict & Compare ${images.length > 1 ? `${images.length} Images` : 'Cyclone'}`}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
