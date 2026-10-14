import React from 'react';
import ReactDOM from 'react-dom/client';
import { LazyMotion, MotionConfig, domAnimation } from 'framer-motion';
import App from './App';
import SmoothScroll from './components/SmoothScroll';
import './index.css';

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error('Could not find root element to mount to');
}

// LazyMotion + the `m` component keeps only the animation features the site
// uses (no drag/layout engine) in the main bundle.
ReactDOM.createRoot(rootElement).render(
  <React.StrictMode>
    <MotionConfig reducedMotion="user">
      <LazyMotion features={domAnimation}>
        <SmoothScroll>
          <App />
        </SmoothScroll>
      </LazyMotion>
    </MotionConfig>
  </React.StrictMode>
);
