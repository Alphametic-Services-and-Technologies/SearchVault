import type { Model } from '../types/model.type';

export const models: Model[] = [
   {
      name: 'OpenAI',
      description: 'This will expose your data online to OpenAI',
      model: 'openai',
   },
   {
      name: 'Llama3.2',
      description: 'This LLM is hosted locally and your data stays private',
      model: 'local',
   },
   {
      name: 'Mistral',
      description: 'This LLM is hosted locally and your data stays private',
      label: 'Coming Soon',
      model: '',
   },
   {
      name: 'Gemma',
      description: 'This LLM is hosted locally and your data stays private',
      label: 'Coming Soon',
      model: '',
   },
];
