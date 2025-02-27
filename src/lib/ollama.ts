const OLLAMA_HOST = import.meta.env.VITE_OLLAMA_HOST || 'http://127.0.0.1:11434';
const DEFAULT_MODEL = import.meta.env.VITE_DEFAULT_MODEL || 'llama3.2';
const DEFAULT_TEMPERATURE = parseFloat(import.meta.env.VITE_DEFAULT_TEMPERATURE || '0.7');
const DEFAULT_SYSTEM_PROMPT = import.meta.env.VITE_DEFAULT_SYSTEM_PROMPT || 'You are a helpful cooking assistant. You provide accurate, clear advice about cooking, recipes, and food preparation.';

export interface OllamaModel {
  name: string;
  modified_at: Date;
  size: number;
}

export interface OllamaModelDetail {
  license: string;
  modelfile: string;
  parameters: string;
  template: string;
  system: string;
}

export interface OllamaResponse {
  model: string;
  created_at: string;
  response: string;
  done: boolean;
}

export const generateChatCompletion = async (
  prompt: string,
  model: string = DEFAULT_MODEL,
  systemPrompt: string = DEFAULT_SYSTEM_PROMPT,
  temperature: number = DEFAULT_TEMPERATURE
): Promise<string> => {
  try {
    const response = await fetch(`${OLLAMA_HOST}/api/generate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model,
        prompt,
        system: systemPrompt,
        temperature,
        stream: false,
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data: OllamaResponse = await response.json();
    return data.response;
  } catch (error) {
    console.error('Error calling Ollama:', error);
    throw error;
  }
};