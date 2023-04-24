import React from 'react';
import { createRoot } from 'react-dom/client';
import Popup from './Popup';
import './index.css';
import '../../utilsForAll/i18n';

const root = createRoot(window.document.querySelector('#app-container'));
root.render(<Popup />);

if (module.hot) module.hot.accept();
