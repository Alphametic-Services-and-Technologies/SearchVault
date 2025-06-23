import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import { Provider } from 'react-redux';
import store from './utils/store.ts';
import SnackProvider from './components/SnackProvider/SnackProvider.tsx';

createRoot(document.getElementById('root')!).render(
   <StrictMode>
      <Provider store={store}>
         <SnackProvider />
         <App />
      </Provider>
   </StrictMode>
);
