import { useState, useRef, useMemo } from 'react';
import Header from './components/Header';
import SatelliteUploader from './components/SatelliteUploader';
import EnvironmentalInputs from './components/EnvironmentalInputs';
import PredictionResultCard from './components/PredictionResultCard';
import CycloneDashboard from './components/CycloneDashboard';
import Footer from './components/Footer';
import { 
  EnvironmentalParameters, 
  PredictionResult,
  SatelliteImageItem,
  MultiPredictionResult
} from './types';
import { 
  SAMPLE_ENVIRONMENTAL_PARAMETERS, 
  SAMPLE_COMPARISON_SET,
  predictCycloneBatch 
} from './services/cyclonePrediction';

export default function App() {
  // Up to 3 images state (pre-filled with 3 comparison samples for instant SIH demonstration)
  const [images, setImages] = useState<SatelliteImageItem[]>(SAMPLE_COMPARISON_SET);
  const [selectedImageId, setSelectedImageId] = useState<string>(SAMPLE_COMPARISON_SET[0].id);
  const [parameters, setParameters] = useState<EnvironmentalParameters>(SAMPLE_ENVIRONMENTAL_PARAMETERS);

  // Prediction state
  const [isPredicting, setIsPredicting] = useState<boolean>(false);
  const [predictionStep, setPredictionStep] = useState<string>('');
  
  // Initial multi-image prediction pre-populated for immediate interactive comparison
  const [multiPrediction, setMultiPrediction] = useState<MultiPredictionResult | null>({
    items: [
      {
        imageId: 'sample-1',
        imageName: 'INSAT-3D_Severe_Cyclone_Vortex.svg',
        dataUrl: SAMPLE_COMPARISON_SET[0].dataUrl,
        prediction: {
          cycloneDetected: true,
          classification: 'Very Severe Cyclonic Storm',
          predictedWindSpeed: 145,
          confidence: 91,
          developmentStage: 'Intensifying',
          riskLevel: 'High',
          summaryExplanation: 'Dense overcast eyewall with high-velocity spiral rainbands detected. Favorable thermodynamic conditions indicate high intensity.',
          intensityHistory: [
            { time: 'T-18h', windSpeed: 109 },
            { time: 'T-12h', windSpeed: 122 },
            { time: 'T-6h', windSpeed: 133 },
            { time: 'Present', windSpeed: 145 },
            { time: 'T+6h', windSpeed: 157, isProjected: true },
            { time: 'T+12h', windSpeed: 169, isProjected: true },
            { time: 'T+24h', windSpeed: 178, isProjected: true },
          ],
          timestamp: 'Initial Demo',
          isDemo: true,
        },
      },
      {
        imageId: 'sample-2',
        imageName: 'INSAT-3D_Tropical_Depression.svg',
        dataUrl: SAMPLE_COMPARISON_SET[1].dataUrl,
        prediction: {
          cycloneDetected: true,
          classification: 'Tropical Depression (Low Intensity)',
          predictedWindSpeed: 48,
          confidence: 86,
          developmentStage: 'Steady',
          riskLevel: 'Moderate',
          summaryExplanation: 'A developing tropical depression is visible with moderate convective rainbands, but without an organized storm eye.',
          intensityHistory: [
            { time: 'T-18h', windSpeed: 37 },
            { time: 'T-12h', windSpeed: 42 },
            { time: 'T-6h', windSpeed: 45 },
            { time: 'Present', windSpeed: 48 },
            { time: 'T+6h', windSpeed: 50, isProjected: true },
            { time: 'T+12h', windSpeed: 52, isProjected: true },
            { time: 'T+24h', windSpeed: 54, isProjected: true },
          ],
          timestamp: 'Initial Demo',
          isDemo: true,
        },
      },
      {
        imageId: 'sample-3',
        imageName: 'INSAT-3D_Calm_Ocean_No_Cyclone.svg',
        dataUrl: SAMPLE_COMPARISON_SET[2].dataUrl,
        prediction: {
          cycloneDetected: false,
          classification: 'No Cyclone / Calm Ocean',
          predictedWindSpeed: 16,
          confidence: 98,
          developmentStage: 'Dissipating',
          riskLevel: 'Low',
          summaryExplanation: 'No organized tropical vortex or cyclonic circulation detected. Satellite imagery shows clear ocean waters with sparse non-convective clouds.',
          intensityHistory: [
            { time: 'T-18h', windSpeed: 14 },
            { time: 'T-12h', windSpeed: 15 },
            { time: 'T-6h', windSpeed: 15 },
            { time: 'Present', windSpeed: 16 },
            { time: 'T+6h', windSpeed: 15, isProjected: true },
            { time: 'T+12h', windSpeed: 14, isProjected: true },
            { time: 'T+24h', windSpeed: 12, isProjected: true },
          ],
          timestamp: 'Initial Demo',
          isDemo: true,
        },
      },
    ],
    selectedImageId: 'sample-1',
    comparison: {
      totalImages: 3,
      cycloneCount: 2,
      nonCycloneCount: 1,
      maxIntensity: 145,
      minIntensity: 16,
      intensityDelta: 129,
      maxIntensityImageName: 'INSAT-3D_Severe_Cyclone_Vortex.svg',
      minIntensityImageName: 'INSAT-3D_Calm_Ocean_No_Cyclone.svg',
    },
  });

  const analyzeRef = useRef<HTMLDivElement>(null);
  const dashboardRef = useRef<HTMLDivElement>(null);

  // Derived map of predictions by image id
  const predictionMap = useMemo<Record<string, PredictionResult>>(() => {
    if (!multiPrediction) return {};
    return multiPrediction.items.reduce((acc, it) => {
      acc[it.imageId] = it.prediction;
      return acc;
    }, {} as Record<string, PredictionResult>);
  }, [multiPrediction]);

  // Currently focused prediction for detailed telemetry
  const activePrediction = useMemo<PredictionResult | null>(() => {
    if (!multiPrediction || multiPrediction.items.length === 0) return null;
    const item = multiPrediction.items.find((it) => it.imageId === selectedImageId);
    return item ? item.prediction : multiPrediction.items[0].prediction;
  }, [multiPrediction, selectedImageId]);

  const activeImageItem = useMemo(() => {
    return images.find((it) => it.id === selectedImageId) || images[0] || null;
  }, [images, selectedImageId]);

  const handleParameterChange = (key: keyof EnvironmentalParameters, value: number) => {
    setParameters((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleLoadSampleData = () => {
    setParameters(SAMPLE_ENVIRONMENTAL_PARAMETERS);
  };

  const handleAddImages = (newImages: SatelliteImageItem[]) => {
    setImages((prev) => {
      const combined = [...prev, ...newImages].slice(0, 3);
      return combined;
    });
    if (newImages.length > 0) {
      setSelectedImageId(newImages[0].id);
    }
  };

  const handleRemoveImage = (id: string) => {
    setImages((prev) => {
      const updated = prev.filter((img) => img.id !== id);
      if (selectedImageId === id && updated.length > 0) {
        setSelectedImageId(updated[0].id);
      }
      return updated;
    });

    // Update multi-prediction if exists
    setMultiPrediction((prev) => {
      if (!prev) return null;
      const updatedItems = prev.items.filter((it) => it.imageId !== id);
      if (updatedItems.length === 0) return null;
      const cycloneCount = updatedItems.filter((it) => it.prediction.cycloneDetected).length;
      const speeds = updatedItems.map((it) => it.prediction.predictedWindSpeed);
      const maxIntensity = Math.max(...speeds);
      const minIntensity = Math.min(...speeds);

      return {
        ...prev,
        items: updatedItems,
        selectedImageId: selectedImageId === id ? updatedItems[0].imageId : selectedImageId,
        comparison: {
          totalImages: updatedItems.length,
          cycloneCount,
          nonCycloneCount: updatedItems.length - cycloneCount,
          maxIntensity,
          minIntensity,
          intensityDelta: maxIntensity - minIntensity,
          maxIntensityImageName: updatedItems.find((it) => it.prediction.predictedWindSpeed === maxIntensity)?.imageName || '',
          minIntensityImageName: updatedItems.find((it) => it.prediction.predictedWindSpeed === minIntensity)?.imageName || '',
        },
      };
    });
  };

  const handleClearAllImages = () => {
    setImages([]);
    setSelectedImageId('');
    setMultiPrediction(null);
  };

  const handleLoadComparisonSet = () => {
    setImages(SAMPLE_COMPARISON_SET);
    setSelectedImageId(SAMPLE_COMPARISON_SET[0].id);
  };

  const handleSelectImage = (id: string) => {
    setSelectedImageId(id);
  };

  const handlePredict = async () => {
    if (images.length === 0) return;

    setIsPredicting(true);
    setPredictionStep(`Analyzing ${images.length} satellite image(s) for cyclonic vorticity...`);

    try {
      // Imagery analysis step
      await new Promise((r) => setTimeout(r, 600));
      setPredictionStep('Validating multi-source satellite rainbands & eye convection...');

      // Atmospheric feature analysis step
      await new Promise((r) => setTimeout(r, 600));
      setPredictionStep('Calculating wind speed gradients & intensity differences...');

      // Run batch prediction across all uploaded images
      const result = await predictCycloneBatch(images, parameters);
      setMultiPrediction(result);
      setSelectedImageId(result.selectedImageId);
    } catch (err) {
      console.error('Batch prediction failed:', err);
    } finally {
      setIsPredicting(false);
      setPredictionStep('');

      // Smooth scroll to prediction result/dashboard
      setTimeout(() => {
        const resultCard = document.getElementById('cyclone-prediction-result-card');
        if (resultCard) {
          resultCard.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 100);
    }
  };

  const scrollToAnalyze = () => {
    analyzeRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const scrollToDashboard = () => {
    if (dashboardRef.current) {
      dashboardRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F8F5EE] text-[#2D2320]">
      {/* Header */}
      <Header
        onNavigateToAnalyze={scrollToAnalyze}
        onNavigateToDashboard={scrollToDashboard}
        hasPrediction={!!activePrediction}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 pt-8 pb-16 space-y-10">
        
        {/* HERO TITLE SECTION */}
        <section ref={analyzeRef} className="text-center space-y-3 pt-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white border border-[#EBE4D8] shadow-xs text-xs font-semibold text-[#5C4F48] mb-1">
            <span className="w-2 h-2 rounded-full bg-[#FF654E]"></span>
            SIH 2026 Prototype • Problem Statement 26070
          </div>
          
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-[#2D2320]">
            CycloVision
          </h1>
          
          <p className="text-lg sm:text-xl font-bold text-[#FF654E]">
            “AI-Powered Cyclone Prediction”
          </p>
          
          <p className="text-sm sm:text-base text-[#6C5E57] max-w-2xl mx-auto leading-relaxed">
            Upload up to 3 satellite images at once to compare cyclone presence and visually highlight intensity differences.
          </p>
        </section>

        {/* STEP 1: SATELLITE IMAGE UPLOAD CARD (UP TO 3 IMAGES IN RESPONSIVE FLEX GRID) */}
        <SatelliteUploader
          images={images}
          selectedImageId={selectedImageId}
          onSelectImage={handleSelectImage}
          onAddImages={handleAddImages}
          onRemoveImage={handleRemoveImage}
          onClearAllImages={handleClearAllImages}
          onLoadComparisonSet={handleLoadComparisonSet}
          onPredict={handlePredict}
          isPredicting={isPredicting}
          predictionMap={predictionMap}
        />

        {/* STEP 2: ENVIRONMENTAL PARAMETERS (COMPACT SECTION) */}
        <EnvironmentalInputs
          parameters={parameters}
          onChange={handleParameterChange}
          onLoadSampleData={handleLoadSampleData}
        />

        {/* STEP 3 & 4: PREDICTION RESULT CARD (OR LOADING ANIMATION) */}
        <PredictionResultCard
          prediction={activePrediction}
          multiPrediction={multiPrediction}
          activeImageName={activeImageItem?.name}
          isPredicting={isPredicting}
          predictionStep={predictionStep}
        />

        {/* STEP 5: CYCLONE DASHBOARD (WITH MULTI-IMAGE INTENSITY COMPARISON) */}
        {activePrediction && (
          <div ref={dashboardRef}>
            <CycloneDashboard
              prediction={activePrediction}
              parameters={parameters}
              multiPrediction={multiPrediction}
              selectedImageId={selectedImageId}
              onSelectImage={handleSelectImage}
              activeImageName={activeImageItem?.name}
            />
          </div>
        )}
      </main>

      {/* FOOTER */}
      <Footer />
    </div>
  );
}
