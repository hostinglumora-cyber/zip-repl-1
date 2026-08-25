import { createRoot } from 'react-dom/client';
import App from './App.jsx';
import './index.css';

import { localDb } from './lib/localDb';

if (!globalThis.__B44_DB__) {
  globalThis.__B44_DB__ = localDb;
}

createRoot(document.getElementById('root')).render(<App />);