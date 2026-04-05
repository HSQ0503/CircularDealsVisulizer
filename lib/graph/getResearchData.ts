import { cache } from 'react';
import { deriveGraph, runSensitivityAnalysis } from '@/lib/graph/deriveGraph';
import { getLatestNullModelComparison } from '@/lib/graph/nullModel';

export const getResearchData = cache(async () => {
  const graphData = await deriveGraph('all');
  const nullModel = await getLatestNullModelComparison();
  const sensitivityAnalysis = await runSensitivityAnalysis();

  const loops = graphData.loops;
  const multiPartyCycles = graphData.multiPartyCycles;
  const hubScores = graphData.hubScores;
  const totalDeals = Object.keys(graphData.dealsById).length;
  const totalCompanies = graphData.nodes.length;
  const totalCircularStructures = loops.length + multiPartyCycles.length;

  return {
    graphData,
    nullModel,
    sensitivityAnalysis,
    loops,
    multiPartyCycles,
    hubScores,
    totalDeals,
    totalCompanies,
    totalCircularStructures,
  };
});
