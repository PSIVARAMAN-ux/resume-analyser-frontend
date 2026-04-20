const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://resume-api-mn53.onrender.com';

/**
 * Generic fetch wrapper to handle JSON responses and errors centrally.
 */
async function fetchClient<T>(endpoint: string, options: RequestInit = {}, token?: string | null): Promise<T> {
  const headers = new Headers(options.headers || {});
  
  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => null);
    throw new Error(errorData?.detail || `API Request failed with status ${response.status}`);
  }

  return response.json();
}

export interface ApplicationHistory {
  id: number;
  job_title: string;
  match_score: number;
  cover_letter: string;
  created_at: string;
}

/**
 * Endpoint Definitions
 */
/**
 * Endpoint Definitions
 */
export const apiService = {
  // healthCheck stays at root because it is defined outside the api_router in main.py
  healthCheck: () => fetchClient<{ status: string; message: string }>('/health'),
  
  // Add /api to history
  fetchHistory: (token: string) => fetchClient<ApplicationHistory[]>('/api/history', {}, token),

  // Add /api to enhance-jd
  enhanceJD: async (draftText: string) => {
    return fetchClient<{ enhanced_text: string }>('/api/enhance-jd', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ draft_text: draftText }),
    });
  },
  
  generateApplication: async (file: File, jobDescription: string, token: string) => {
    const formData = new FormData();
    formData.append('resume', file);
    formData.append('job_description', jobDescription);
    
    // Add /api to generate
    return fetchClient<{ 
      match_score: number; 
      analysis_summary: string;
      missing_keywords: string[];
      matched_skills: string[];
      suggested_rewrites: {
        original_bullet: string;
        upgraded_bullet: string;
        keyword_added: string;
      }[];
      interview_prep: {
        question: string;
        why_its_asked: string;
        how_to_answer: string;
      }[];
      cover_letter: string; 
    }>('/api/generate', {
      method: 'POST',
      body: formData,
    }, token);
  }
};