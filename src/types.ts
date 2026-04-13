export type Ecosystem = 'npm' | 'pypi';

export type Classification = 'hype' | 'healthy' | 'hidden-infrastructure' | 'niche';

export interface PackageData {
  packageName: string;
  ecosystem: Ecosystem;
  githubStars: number;
  monthlyDownloads: number;
}

export interface AnalysisResult extends PackageData {
  ratio: number;
  classification: Classification;
}

export type AnalysisState =
  | { status: 'idle' }
  | { status: 'loading' }
  | { status: 'success'; data: AnalysisResult }
  | { status: 'error'; error: string };
