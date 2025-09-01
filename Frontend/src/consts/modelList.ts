import type { Model } from '../types/model.type';

export const models: Model[] = [
   {
      name: 'OpenAI',
      description: 'This will expose your data online to OpenAI',
      model: 'gpt-3.5-turbo',
   },
   {
      name: 'Llama3.2',
      description: 'This LLM is hosted locally and your data stays private',
      model: 'llama3.2',
   },
   {
      name: 'Mistral',
      description: 'This LLM is hosted locally and your data stays private',
      model: 'mistral',
   },
   {
      name: 'Gemma',
      description: 'This LLM is hosted locally and your data stays private',
      label: 'Coming Soon',
      model: '',
   },
];
