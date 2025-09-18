import { Essay } from '../types';

export interface DataResponse {
  essays: Essay[];
}

const loadEssayContent = async (essay: Essay): Promise<Essay> => {
  if (essay.contentFile) {
    try {
      const response = await fetch(`/data/${essay.contentFile}`, {
        cache: 'default'
      });
      if (response.ok) {
        const content = await response.text();
        return { ...essay, content };
      } else {
        console.warn(`Failed to load content for essay ${essay.id}: ${response.status}`);
      }
    } catch (error) {
      console.error(`Error loading content for essay ${essay.id}:`, error);
    }
  }
  return essay;
};

export const loadData = async (): Promise<DataResponse> => {
  try {
    const response = await fetch('/data/essays.json');
    if (!response.ok) {
      throw new Error(`Failed to load data: ${response.statusText}`);
    }
    const data = await response.json();
    
    // Load content for essays that have contentFile
    const essaysWithContent = await Promise.all(
      data.essays.map((essay: Essay) => loadEssayContent(essay))
    );
    
    return { essays: essaysWithContent };
  } catch (error) {
    console.error('Error loading data:', error);
    // Fallback to empty data if JSON loading fails
    return {
      essays: []
    };
  }
};
