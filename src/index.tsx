import { render } from 'solid-js/web';
import { Router } from '@solidjs/router';
import App from './app';
import './index.css';
import './fonts.css';

render(
  () => (
    <Router>
      <App />
    </Router>
  ),
  document.getElementById('root') as HTMLElement
);