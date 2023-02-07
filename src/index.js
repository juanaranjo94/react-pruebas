import React from 'react';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { Router } from "react-router";
import { createBrowserHistory } from "history";
import "./I18n";

import "bootstrap/dist/js/bootstrap.min.js";
import "bootstrap/dist/css/bootstrap.min.css";

import { render } from 'react-snapshot';

    //----WITH REACT-SNAPSHOT---
    render(
      <Router history={createBrowserHistory()}>
        
           <App />
        
      </Router>,
      document.getElementById('root')
    );
    
    reportWebVitals();