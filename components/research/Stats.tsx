import { getResearchData } from '@/lib/graph/getResearchData';

export async function TotalDeals() {
  const { totalDeals } = await getResearchData();
  return <>{totalDeals}</>;
}

export async function TotalCompanies() {
  const { totalCompanies } = await getResearchData();
  return <>{totalCompanies}</>;
}

export async function TotalCircularStructures() {
  const { totalCircularStructures } = await getResearchData();
  return <>{totalCircularStructures}</>;
}

export async function LoopCount() {
  const { loops } = await getResearchData();
  return <>{loops.length}</>;
}

export async function CycleCount() {
  const { multiPartyCycles } = await getResearchData();
  return <>{multiPartyCycles.length}</>;
}

export async function EdgeCount() {
  const { graphData } = await getResearchData();
  return <>{graphData.edges.length}</>;
}

export async function MeanLoopScore() {
  const { loops } = await getResearchData();
  if (loops.length === 0) return <>N/A</>;
  return <>{(loops.reduce((sum, l) => sum + l.loopScore, 0) / loops.length).toFixed(3)}</>;
}

export async function MeanCycleScore() {
  const { multiPartyCycles } = await getResearchData();
  if (multiPartyCycles.length === 0) return <>N/A</>;
  return <>{(multiPartyCycles.reduce((sum, c) => sum + c.cycleScore, 0) / multiPartyCycles.length).toFixed(3)}</>;
}
