import { useState, useCallback, useRef } from 'react';
import type { AnalysisState, Ecosystem, AnalysisResult } from '../types';
import { fetchPackageData } from '../utils/api';
import { classify } from '../utils/classification';
import { detectEcosystem } from '../utils/ecosystem';

export function usePackageAnalysis() {
  const [state, setState] = useState<AnalysisState>({ status: 'idle' });
  const abortRef = useRef<AbortController | null>(null);

  const search = useCallback(async (packageName: string) => {
    const trimmed = packageName.trim();
    if (!trimmed) return;

    // Abort any in-flight request
    if (abortRef.current) {
      abortRef.current.abort();
    }
    const controller = new AbortController();
    abortRef.current = controller;

    setState({ status: 'loading' });

    const ecosystem: Ecosystem = detectEcosystem(trimmed);

    try {
      const data = await fetchPackageData(trimmed, ecosystem);

      if (controller.signal.aborted) return;

      const ratio = data.githubStars > 0
        ? data.monthlyDownloads / data.githubStars
        : data.monthlyDownloads > 0
          ? Infinity
          : 0;

      const classification = classify(ratio, data.githubStars, data.monthlyDownloads);

      const result: AnalysisResult = {
        ...data,
        ratio: Number.isFinite(ratio) ? Math.round(ratio * 10) / 10 : ratio,
        classification,
      };

      setState({ status: 'success', data: result });
    } catch (err) {
      if (controller.signal.aborted) return;
      const message = err instanceof Error ? err.message : 'An unexpected error occurred';
      setState({ status: 'error', error: message });
    }
  }, []);

  return { state, search };
}
