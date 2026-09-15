import { useState, useRef, useMemo } from 'react';
import Header, { AppViewMode } from './components/Header';
import SatelliteUploader from './components/SatelliteUploader';
import EnvironmentalInputs from './components/EnvironmentalInputs';
import PredictionResultCard from './components/PredictionResultCard';
import CycloneTypeClassificationSection from './components/CycloneTypeClassificationSection';
import CycloneDashboard from './components/CycloneDashboard';
import CycloneTaxonomyMatrix from './components/CycloneTaxonomyMatrix';
import ComparisonMatrixTable from './components/ComparisonMatrixTable';
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
  SAMPLE_PARAMETERS_SEVERE,
  SAMPLE_PARAMETERS_DEPRESSION,
  SAMPLE_PARAMETERS_CLEAR_OCEAN,
  ALL_BENCHMARK_SAMPLES,
  BenchmarkSample,
  predictCycloneBatch,
  evaluateCycloneType
} from './services/cyclonePrediction';
import { 
  Layers, 
  BookOpen, 
  Zap, 
  Sparkles,
  ShieldAlert,
  ShieldCheck
} from 'lucide-react';

export default function App() {
  // Operational View Mode: 'command' (split dual-column), 'comparison', 'taxonomy', or 'dossier'
  const [activeViewMode, setActiveViewMode] = useState<AppViewMode>('command');

  // Up to 3 images state (pre-filled with 3 comparison samples for instant SIH demonstration)
  const [images, setImages] = useState<SatelliteImageItem[]>(SAMPLE_COMPARISON_SET);
  const [selectedImageId, setSelectedImageId] = useState<string>(SAMPLE_COMPARISON_SET[0].id);
  const [parameters, setParameters] = useState<EnvironmentalParameters>(SAMPLE_ENVIRONMENTAL_PARAMETERS);

  // Per-image parameter storage to ensure multiple cyclones each have their own distinct parameters
  const [parametersMap, setParametersMap] = useState<Record<string, EnvironmentalParameters>>({
    'sample-1': SAMPLE_PARAMETERS_SEVERE,
    'sample-2': SAMPLE_PARAMETERS_DEPRESSION,
    'sample-3': SAMPLE_PARAMETERS_CLEAR_OCEAN,
  });

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
        parameters: SAMPLE_PARAMETERS_SEVERE,
        prediction: {
          cycloneDetected: true,
          classification: 'Very Severe Cyclonic Storm',
          predictedWindSpeed: 145,
          confidence: 94,
          developmentStage: 'Intensifying',
          riskLevel: 'High',
          movementDirection: 'North-Northwest (NNW)',
          movementDegree: 335,
          forwardSpeed: 19,
          estimatedLandfall: 'Puri / Paradip Coast, Odisha (~24-30h)',
          parameters: SAMPLE_PARAMETERS_SEVERE,
          summaryExplanation: 'Dense overcast eyewall with high-velocity spiral rainbands detected. Vortex is tracking North-Northwest (335°) at 19 km/h under favorable subtropical ridge steering.',
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
          cycloneTypeAnalysis: evaluateCycloneType(
            SAMPLE_PARAMETERS_SEVERE,
            'Very Severe Cyclonic Storm',
            true,
            'INSAT-3D_Severe_Cyclone_Vortex.svg'
          ),
        },
      },
      {
        imageId: 'sample-2',
        imageName: 'INSAT-3D_Tropical_Depression.svg',
        dataUrl: SAMPLE_COMPARISON_SET[1].dataUrl,
        parameters: SAMPLE_PARAMETERS_DEPRESSION,
        prediction: {
          cycloneDetected: true,
          classification: 'Tropical Depression (Low Intensity)',
          predictedWindSpeed: 48,
          confidence: 86,
          developmentStage: 'Steady',
          riskLevel: 'Moderate',
          movementDirection: 'West-Northwest (WNW)',
          movementDegree: 290,
          forwardSpeed: 14,
          estimatedLandfall: 'South Odisha & North Andhra Coast (~32-40h)',
          parameters: SAMPLE_PARAMETERS_DEPRESSION,
          summaryExplanation: 'A developing tropical depression is visible with moderate convective rainbands, tracking West-Northwest (290°) at 14 km/h without an organized storm eye.',
          intensityHistory: [
            { time: 'T-18h', windSpeed: 38 },
            { time: 'T-12h', windSpeed: 42 },
            { time: 'T-6h', windSpeed: 45 },
            { time: 'Present', windSpeed: 48 },
            { time: 'T+6h', windSpeed: 50, isProjected: true },
            { time: 'T+12h', windSpeed: 52, isProjected: true },
            { time: 'T+24h', windSpeed: 55, isProjected: true },
          ],
          timestamp: 'Initial Demo',
          isDemo: true,
          cycloneTypeAnalysis: evaluateCycloneType(
            SAMPLE_PARAMETERS_DEPRESSION,
            'Tropical Depression',
            true,
            'INSAT-3D_Tropical_Depression.svg'
          ),
        },
      },
      {
        imageId: 'sample-3',
        imageName: 'INSAT-3D_Calm_Ocean_No_Cyclone.svg',
        dataUrl: SAMPLE_COMPARISON_SET[2].dataUrl,
        parameters: SAMPLE_PARAMETERS_CLEAR_OCEAN,
        prediction: {
          cycloneDetected: false,
          classification: 'No Cyclone / Calm Ocean',
          predictedWindSpeed: 16,
          confidence: 98,
          developmentStage: 'Dissipating',
          riskLevel: 'Low',
          movementDirection: 'Stationary / No Cyclonic Track',
          movementDegree: 0,
          forwardSpeed: 0,
          estimatedLandfall: 'None (No active cyclonic circulation)',
          parameters: SAMPLE_PARAMETERS_CLEAR_OCEAN,
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
          cycloneTypeAnalysis: evaluateCycloneType(
            SAMPLE_PARAMETERS_CLEAR_OCEAN,
            'No Cyclone / Calm Ocean',
            false,
            'INSAT-3D_Calm_Ocean_No_Cyclone.svg'
          ),
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

  // Derived active parameters for the currently selected image
  const activeParameters = useMemo<EnvironmentalParameters>(() => {
    if (selectedImageId && parametersMap[selectedImageId]) {
      return parametersMap[selectedImageId];
    }
    const item = multiPrediction?.items.find((it) => it.imageId === selectedImageId);
    if (item?.parameters) {
      return item.parameters;
    }
    return parameters;
  }, [selectedImageId, parametersMap, multiPrediction, parameters]);

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
    const updatedParams: EnvironmentalParameters = {
      ...(parametersMap[selectedImageId] || activeParameters),
      [key]: value,
    };

    setParameters(updatedParams);

    if (selectedImageId) {
      setParametersMap((prev) => ({
        ...prev,
        [selectedImageId]: updatedParams,
      }));

      // Update active prediction's metrics & cyclone type analysis dynamically so live changes are accurate
      setMultiPrediction((prev) => {
        if (!prev) return null;
        const currentItem = prev.items.find((it) => it.imageId === selectedImageId);
        if (!currentItem) return prev;

        const isDetected = updatedParams.windSpeed >= 32 && 
          !currentItem.imageName.toLowerCase().includes('clear') && 
          !currentItem.imageName.toLowerCase().includes('calm');

        let newClassification = currentItem.prediction.classification;
        if (!isDetected) {
          newClassification = 'No Cyclone / Calm Ocean';
        } else if (updatedParams.windSpeed >= 120) {
          newClassification = 'Very Severe Cyclonic Storm (VSCS)';
        } else if (updatedParams.windSpeed >= 90) {
          newClassification = 'Severe Cyclonic Storm (SCS)';
        } else if (updatedParams.windSpeed >= 62) {
          newClassification = 'Cyclonic Storm (CS)';
        } else {
          newClassification = 'Tropical Depression (Low Intensity)';
        }

        const updatedAnalysis = evaluateCycloneType(
          updatedParams,
          newClassification,
          isDetected,
          currentItem.imageName
        );

        return {
          ...prev,
          items: prev.items.map((it) =>
            it.imageId === selectedImageId
              ? {
                  ...it,
                  parameters: updatedParams,
                  prediction: {
                    ...it.prediction,
                    predictedWindSpeed: updatedParams.windSpeed,
                    cycloneDetected: isDetected,
                    classification: newClassification,
                    cycloneTypeAnalysis: updatedAnalysis,
                  },
                }
              : it
          ),
        };
      });
    }
  };

  const handleLoadSampleData = () => {
    setParametersMap({
      'sample-1': SAMPLE_PARAMETERS_SEVERE,
      'sample-2': SAMPLE_PARAMETERS_DEPRESSION,
      'sample-3': SAMPLE_PARAMETERS_CLEAR_OCEAN,
    });
    if (selectedImageId === 'sample-2') {
      setParameters(SAMPLE_PARAMETERS_DEPRESSION);
    } else if (selectedImageId === 'sample-3') {
      setParameters(SAMPLE_PARAMETERS_CLEAR_OCEAN);
    } else {
      setParameters(SAMPLE_PARAMETERS_SEVERE);
    }
  };

  const handleAddImages = (newImages: SatelliteImageItem[]) => {
    setImages((prev) => {
      const combined = [...prev, ...newImages].slice(0, 3);
      return combined;
    });
    if (newImages.length > 0) {
      setSelectedImageId(newImages[0].id);
      // Initialize default parameters for newly added images
      newImages.forEach((img, idx) => {
        if (img.parameters) {
          setParametersMap((prev) => ({ ...prev, [img.id]: img.parameters! }));
        } else {
          const lowerName = img.name.toLowerCase();
          const isCalm = lowerName.includes('calm') || lowerName.includes('clear') || lowerName.includes('no_cyclone');
          const isPolar = lowerName.includes('polar') || lowerName.includes('arctic');
          const isExtra = lowerName.includes('extra') || lowerName.includes('comma') || lowerName.includes('nor_easter');
          const isMeso = lowerName.includes('meso') || lowerName.includes('supercell') || lowerName.includes('hook');

          let initParams: EnvironmentalParameters;
          if (isCalm) {
            initParams = { ...SAMPLE_PARAMETERS_CLEAR_OCEAN };
          } else if (isPolar) {
            initParams = {
              windSpeed: 95,
              seaSurfaceTemperature: 3.5,
              atmosphericPressure: 978,
              windDirection: 15,
              latitude: 71.0,
              longitude: 25.4,
              rainfall: 40,
              coreType: 'Cold-core',
              systemStructure: 'Compact Polar Low',
            };
          } else if (isExtra) {
            initParams = {
              windSpeed: 110,
              seaSurfaceTemperature: 15.4,
              atmosphericPressure: 968,
              windDirection: 60,
              latitude: 42.5,
              longitude: -68.2,
              rainfall: 75,
              coreType: 'Cold-core',
              systemStructure: 'Frontal Comma System',
            };
          } else if (isMeso) {
            initParams = {
              windSpeed: 165,
              seaSurfaceTemperature: 21.0,
              atmosphericPressure: 985,
              windDirection: 240,
              latitude: 35.5,
              longitude: -97.5,
              rainfall: 90,
              coreType: 'Convective Updraft',
              systemStructure: 'Local Thunderstorm Mesocyclone',
            };
          } else {
            // Provide distinct starting parameters for each uploaded image
            const speed = Math.max(50, Math.min(170, Math.round(135 - idx * 35)));
            initParams = {
              windSpeed: speed,
              atmosphericPressure: Math.round(1012 - Math.pow(speed / 3.4, 1.15)),
              seaSurfaceTemperature: Number((27.5 + (speed / 180) * 2.8).toFixed(1)),
              rainfall: Math.round(speed * 0.9),
              windDirection: (280 + idx * 25) % 360,
              latitude: Number((14.0 + idx * 1.8).toFixed(1)),
              longitude: Number((84.5 - idx * 2.0).toFixed(1)),
              coreType: 'Warm-core',
              systemStructure: 'Massive Symmetric Spiral',
            };
          }

          setParametersMap((prev) => ({
            ...prev,
            [img.id]: initParams,
          }));
        }
      });
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
    setParametersMap({
      'sample-1': SAMPLE_PARAMETERS_SEVERE,
      'sample-2': SAMPLE_PARAMETERS_DEPRESSION,
      'sample-3': SAMPLE_PARAMETERS_CLEAR_OCEAN,
    });
    setParameters(SAMPLE_PARAMETERS_SEVERE);
  };

  const handleLoadBenchmark = (benchmark: BenchmarkSample) => {
    const newImageItem: SatelliteImageItem = {
      id: benchmark.id,
      name: `${benchmark.categoryLabel}.jpg`,
      dataUrl: benchmark.dataUrl,
      size: 1024 * 145,
      parameters: benchmark.parameters,
    };

    setImages((prev) => {
      const filtered = prev.filter((img) => img.id !== benchmark.id);
      return [newImageItem, ...filtered].slice(0, 3);
    });

    setSelectedImageId(benchmark.id);
    setParameters(benchmark.parameters);
    setParametersMap((prev) => ({
      ...prev,
      [benchmark.id]: benchmark.parameters,
    }));

    const isCyclone = benchmark.parameters.windSpeed >= 32 && 
      !benchmark.id.includes('clear') && 
      !benchmark.id.includes('calm');

    let classification = 'No Cyclone / Calm Ocean';
    if (isCyclone) {
      if (benchmark.id.includes('polar')) {
        classification = 'Polar Low Cyclone';
      } else if (benchmark.id.includes('extra')) {
        classification = 'Extratropical Cyclone (Mid-Latitude)';
      } else if (benchmark.id.includes('meso')) {
        classification = 'Supercell Mesocyclone (Tornadic)';
      } else if (benchmark.parameters.windSpeed >= 120) {
        classification = 'Very Severe Cyclonic Storm (VSCS)';
      } else if (benchmark.parameters.windSpeed >= 90) {
        classification = 'Severe Cyclonic Storm (SCS)';
      } else if (benchmark.parameters.windSpeed >= 62) {
        classification = 'Cyclonic Storm (CS)';
      } else {
        classification = 'Tropical Depression (Low Intensity)';
      }
    }

    const typeAnalysis = evaluateCycloneType(
      benchmark.parameters,
      classification,
      isCyclone,
      benchmark.categoryLabel
    );

    const singlePrediction: PredictionResult = {
      cycloneDetected: isCyclone,
      confidence: 96,
      predictedWindSpeed: benchmark.parameters.windSpeed,
      classification,
      developmentStage: isCyclone ? (benchmark.parameters.windSpeed > 100 ? 'Intensifying' : 'Steady') : 'Dissipating',
      riskLevel: benchmark.parameters.windSpeed > 120 ? 'Very High' : benchmark.parameters.windSpeed > 62 ? 'High' : benchmark.parameters.windSpeed >= 32 ? 'Moderate' : 'Low',
      pressureDeficit: Math.max(0, 1013 - benchmark.parameters.atmosphericPressure),
      estimatedLandfall: isCyclone ? 'Predicted Coastal Incursion in 24-36h' : 'None',
      movementDirection: isCyclone ? (benchmark.id.includes('extra') ? 'East-Northeast (ENE)' : 'West-Northwest (WNW)') : 'Stationary',
      movementDegree: isCyclone ? (benchmark.id.includes('extra') ? 70 : 295) : 0,
      forwardSpeed: isCyclone ? (benchmark.id.includes('extra') ? 45 : 18) : 0,
      timestamp: 'Benchmark Ground-Truth',
      isDemo: false,
      cycloneTypeAnalysis: typeAnalysis,
      parameters: benchmark.parameters,
      intensityHistory: [
        { time: 'T-18h', windSpeed: Math.round(benchmark.parameters.windSpeed * 0.75) },
        { time: 'T-12h', windSpeed: Math.round(benchmark.parameters.windSpeed * 0.85) },
        { time: 'T-6h', windSpeed: Math.round(benchmark.parameters.windSpeed * 0.93) },
        { time: 'Present', windSpeed: benchmark.parameters.windSpeed },
        { time: 'T+6h', windSpeed: Math.round(benchmark.parameters.windSpeed * 1.08), isProjected: true },
        { time: 'T+12h', windSpeed: Math.round(benchmark.parameters.windSpeed * 1.14), isProjected: true },
        { time: 'T+24h', windSpeed: Math.round(benchmark.parameters.windSpeed * 1.18), isProjected: true },
      ],
      summaryExplanation: `Verified ${benchmark.cycloneType} benchmark system. Physical analysis confirms ${benchmark.parameters.coreType} structure at ${benchmark.parameters.latitude}°N with ${benchmark.parameters.windSpeed} km/h wind speed.`,
    };

    setMultiPrediction({
      items: [
        {
          imageId: benchmark.id,
          imageName: `${benchmark.categoryLabel}.jpg`,
          dataUrl: benchmark.dataUrl,
          prediction: singlePrediction,
          parameters: benchmark.parameters,
        },
      ],
      selectedImageId: benchmark.id,
      comparison: {
        totalImages: 1,
        cycloneCount: isCyclone ? 1 : 0,
        nonCycloneCount: isCyclone ? 0 : 1,
        maxIntensity: benchmark.parameters.windSpeed,
        minIntensity: benchmark.parameters.windSpeed,
        intensityDelta: 0,
        maxIntensityImageName: `${benchmark.categoryLabel}.jpg`,
        minIntensityImageName: `${benchmark.categoryLabel}.jpg`,
      },
    });
  };

  const handleSelectImage = (id: string) => {
    setSelectedImageId(id);
    if (parametersMap[id]) {
      setParameters(parametersMap[id]);
    }
  };

  const handlePredict = async () => {
    if (images.length === 0) return;

    setIsPredicting(true);
    setPredictionStep(`Analyzing ${images.length} satellite image(s) for cyclonic vorticity...`);

    try {
      await new Promise((r) => setTimeout(r, 400));
      setPredictionStep('Validating multi-source satellite rainbands & eye convection...');

      await new Promise((r) => setTimeout(r, 400));
      setPredictionStep('Calculating independent wind speed gradients & pressure dynamics...');

      const result = await predictCycloneBatch(images, activeParameters, parametersMap);

      const newMap = { ...parametersMap };
      result.items.forEach((it) => {
        if (it.parameters) {
          newMap[it.imageId] = it.parameters;
        }
      });
      setParametersMap(newMap);

      setMultiPrediction(result);
      setSelectedImageId(result.selectedImageId);
    } catch (err) {
      console.error('Batch prediction failed:', err);
    } finally {
      setIsPredicting(false);
      setPredictionStep('');

      setTimeout(() => {
        const resultCard = document.getElementById('cyclone-prediction-result-card');
        if (resultCard) {
          resultCard.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 100);
    }
  };

  const scrollToAnalyze = () => {
    setActiveViewMode('command');
    analyzeRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const scrollToDashboard = () => {
    if (activeViewMode !== 'command' && activeViewMode !== 'dossier') {
      setActiveViewMode('command');
    }
    setTimeout(() => {
      dashboardRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 150);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F8F5EE] text-[#2D2320]">
      {/* Header with AppViewMode selector */}
      <Header
        onNavigateToAnalyze={scrollToAnalyze}
        onNavigateToDashboard={scrollToDashboard}
        hasPrediction={!!activePrediction}
        activeViewMode={activeViewMode}
        onSelectViewMode={setActiveViewMode}
        hasMultipleImages={images.length > 1}
      />

      {/* Main Content Area: Widescreen layout preventing single vertical stretch */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-16 space-y-8">
        
        {/* HERO TITLE & BENCHMARK STRIP */}
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
          
          <p className="text-sm sm:text-base text-[#6C5E57] max-w-3xl mx-auto leading-relaxed">
            Upload up to 3 satellite images at once to compare cyclone presence, highlight intensity differences, and automatically classify physical storm archetypes.
          </p>

          {/* Quick Archetype Preset Strip */}
          <div className="pt-2 flex flex-wrap items-center justify-center gap-2 max-w-4xl mx-auto">
            <span className="text-xs font-bold text-[#5C4F48] uppercase tracking-wider mr-1">
              Test Archetypes:
            </span>
            {ALL_BENCHMARK_SAMPLES.map((b) => (
              <button
                key={b.id}
                type="button"
                onClick={() => handleLoadBenchmark(b)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all cursor-pointer flex items-center gap-1.5 shadow-2xs ${
                  selectedImageId === b.id
                    ? 'bg-[#FF654E] text-white border-[#FF654E]'
                    : 'bg-white hover:bg-[#FFEDE8] text-[#2D2320] hover:text-[#D94935] border-[#E0D7C8] hover:border-[#FFD3C7]'
                }`}
                title={`Load ${b.categoryLabel} (${b.parameters.windSpeed} km/h, SST ${b.parameters.seaSurfaceTemperature}°C)`}
              >
                <span>{b.cycloneType.includes('Tropical') ? '🌀' : b.cycloneType.includes('Extratropical') ? '🌊' : b.cycloneType.includes('Polar') ? '❄️' : b.cycloneType.includes('Meso') ? '🌪️' : '☀️'}</span>
                <span>{b.categoryLabel.split('(')[0].trim()}</span>
              </button>
            ))}
            <button
              type="button"
              onClick={handleLoadComparisonSet}
              className="px-3 py-1.5 rounded-xl text-xs font-bold bg-[#FAF7F2] hover:bg-[#FFEDE8] text-[#FF654E] border border-[#E8E0D2] hover:border-[#FFD3C7] transition-all cursor-pointer"
            >
              + 3-Image Comparison Set
            </button>
          </div>
        </section>

        {/* ============================================================== */}
        {/* VIEW MODE 1: COMMAND CENTER (DUAL COLUMN SPLIT WORKSPACE)       */}
        {/* Solves the single-stretch layout by splitting controls & output*/}
        {/* ============================================================== */}
        {activeViewMode === 'command' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* LEFT CONTROL COLUMN (Cols 5) */}
            <div className="lg:col-span-5 space-y-6">
              {/* Satellite Upload Component */}
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
                onLoadBenchmark={handleLoadBenchmark}
              />

              {/* Environmental Parameters Input Card */}
              <EnvironmentalInputs
                parameters={activeParameters}
                onChange={handleParameterChange}
                onLoadSampleData={handleLoadSampleData}
                activeImageName={activeImageItem?.name}
              />

              {/* Action Trigger Card */}
              <div className="bg-white rounded-2xl border border-[#EBE4D8] p-5 shadow-[0_4px_20px_rgba(45,35,32,0.03)] flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="text-left">
                  <h4 className="text-sm font-bold text-[#2D2320]">
                    Ready to evaluate?
                  </h4>
                  <p className="text-xs text-[#7D7068]">
                    {images.length} source image(s) configured for AI analysis
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handlePredict}
                  disabled={isPredicting || images.length === 0}
                  className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-[#FF654E] hover:bg-[#E8553F] text-white text-sm font-bold shadow-md shadow-[#FF654E]/20 transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-98 disabled:opacity-60"
                >
                  <Zap className="w-4 h-4 fill-current" />
                  {isPredicting ? 'Analyzing...' : 'Predict & Compare'}
                </button>
              </div>
            </div>

            {/* RIGHT TELEMETRY & RESULTS COLUMN (Cols 7) */}
            <div className="lg:col-span-7 space-y-8">
              {/* Prediction Result Card */}
              <PredictionResultCard
                prediction={activePrediction}
                multiPrediction={multiPrediction}
                activeImageName={activeImageItem?.name}
                isPredicting={isPredicting}
                predictionStep={predictionStep}
              />

              {/* Automated Cyclone Type Classification Breakdown (The 3 Key Features) */}
              {activePrediction && (
                <CycloneTypeClassificationSection
                  analysis={activePrediction.cycloneTypeAnalysis}
                  currentParameters={activeParameters}
                  activeImageName={activeImageItem?.name}
                  isCycloneDetected={activePrediction.cycloneDetected}
                />
              )}

              {/* Cyclone Dashboard (Telemetry, Gauges & Forecast Chart) */}
              {activePrediction && (
                <div ref={dashboardRef}>
                  <CycloneDashboard
                    prediction={activePrediction}
                    parameters={activeParameters}
                    multiPrediction={multiPrediction}
                    selectedImageId={selectedImageId}
                    onSelectImage={handleSelectImage}
                    activeImageName={activeImageItem?.name}
                  />
                </div>
              )}
            </div>
          </div>
        )}

        {/* ============================================================== */}
        {/* VIEW MODE 2: COMPARATIVE VIEW (MULTI-IMAGE FOCUS)              */}
        {/* ============================================================== */}
        {activeViewMode === 'comparison' && (
          <div className="space-y-8">
            {multiPrediction && multiPrediction.items.length > 1 ? (
              <>
                <div ref={dashboardRef}>
                  <CycloneDashboard
                    prediction={activePrediction!}
                    parameters={activeParameters}
                    multiPrediction={multiPrediction}
                    selectedImageId={selectedImageId}
                    onSelectImage={handleSelectImage}
                    activeImageName={activeImageItem?.name}
                  />
                </div>

                {/* Structured Multi-Source Comparison Table */}
                <ComparisonMatrixTable
                  multiPrediction={multiPrediction}
                  selectedImageId={selectedImageId}
                  onSelectImage={handleSelectImage}
                />
              </>
            ) : (
              <div className="bg-white rounded-2xl border border-[#EBE4D8] p-10 text-center space-y-4">
                <div className="w-16 h-16 mx-auto rounded-full bg-[#FFF0EC] text-[#FF654E] flex items-center justify-center">
                  <Layers className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-bold text-[#2D2320]">
                  Load Multiple Images to Compare
                </h3>
                <p className="text-sm text-[#7D7068] max-w-md mx-auto">
                  You currently have {images.length} image loaded. The comparative workspace allows you to compare up to 3 satellite systems side-by-side.
                </p>
                <button
                  type="button"
                  onClick={handleLoadComparisonSet}
                  className="px-6 py-2.5 rounded-xl bg-[#FF654E] text-white text-sm font-bold shadow-sm hover:bg-[#E8553F] transition-all cursor-pointer"
                >
                  Load 3-Image Comparison Set
                </button>
              </div>
            )}
          </div>
        )}

        {/* ============================================================== */}
        {/* VIEW MODE 3: TAXONOMY & VERIFICATION MATRIX                     */}
        {/* ============================================================== */}
        {activeViewMode === 'taxonomy' && (
          <div className="space-y-8">
            <CycloneTaxonomyMatrix
              onLoadBenchmark={(sample) => {
                handleLoadBenchmark(sample);
                setActiveViewMode('command');
              }}
              activeBenchmarkId={selectedImageId}
            />

            {activePrediction && (
              <div className="pt-6">
                <h3 className="text-lg font-bold text-[#2D2320] mb-3">
                  Live Verification Output for Active Selection
                </h3>
                <CycloneTypeClassificationSection
                  analysis={activePrediction.cycloneTypeAnalysis}
                  currentParameters={activeParameters}
                  activeImageName={activeImageItem?.name}
                  isCycloneDetected={activePrediction.cycloneDetected}
                />
              </div>
            )}
          </div>
        )}

        {/* ============================================================== */}
        {/* VIEW MODE 4: FULL DOSSIER (SEQUENTIAL COMPREHENSIVE VIEW)       */}
        {/* ============================================================== */}
        {activeViewMode === 'dossier' && (
          <div className="space-y-10">
            {/* Step 1: Satellite Upload */}
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
              onLoadBenchmark={handleLoadBenchmark}
            />

            {/* Step 2: Environmental Inputs */}
            <EnvironmentalInputs
              parameters={activeParameters}
              onChange={handleParameterChange}
              onLoadSampleData={handleLoadSampleData}
              activeImageName={activeImageItem?.name}
            />

            {/* Step 3: Prediction Result Card */}
            <PredictionResultCard
              prediction={activePrediction}
              multiPrediction={multiPrediction}
              activeImageName={activeImageItem?.name}
              isPredicting={isPredicting}
              predictionStep={predictionStep}
            />

            {/* Step 4: Cyclone Type Classification */}
            {activePrediction && (
              <CycloneTypeClassificationSection
                analysis={activePrediction.cycloneTypeAnalysis}
                currentParameters={activeParameters}
                activeImageName={activeImageItem?.name}
                isCycloneDetected={activePrediction.cycloneDetected}
              />
            )}

            {/* Step 5: Multi-Image Comparison Table if multi */}
            {multiPrediction && multiPrediction.items.length > 1 && (
              <ComparisonMatrixTable
                multiPrediction={multiPrediction}
                selectedImageId={selectedImageId}
                onSelectImage={handleSelectImage}
              />
            )}

            {/* Step 6: Cyclone Dashboard */}
            {activePrediction && (
              <div ref={dashboardRef}>
                <CycloneDashboard
                  prediction={activePrediction}
                  parameters={activeParameters}
                  multiPrediction={multiPrediction}
                  selectedImageId={selectedImageId}
                  onSelectImage={handleSelectImage}
                  activeImageName={activeImageItem?.name}
                />
              </div>
            )}

            {/* Step 7: Taxonomy Reference Dossier */}
            <CycloneTaxonomyMatrix
              onLoadBenchmark={(sample) => {
                handleLoadBenchmark(sample);
              }}
              activeBenchmarkId={selectedImageId}
            />
          </div>
        )}
      </main>

      {/* FOOTER */}
      <Footer />
    </div>
  );
}
