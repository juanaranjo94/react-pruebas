import { BrowserRouter as Router, Route } from 'react-router-dom';
import './App.css';
import Menu from './component/Menu';
import Home from './component/Home';
import About from './component/About';
import Topics from './component/Topics';
import Menuu from './component/Menuu';
import Contacts from './component/Contacts';
import React, { Suspense } from 'react';


function App () {

  const lang = '/:locale(en|es)?';
  

  return (
    <Suspense fallback="loading">
      <Router >
          <Menuu>
            <Route path={lang} component={Menu} />
            <Route exact path={lang} component={Home} />
            <Route path={`${lang}/contacts`} component={Contacts} />
            <Route path={`${lang}/about`} component={About} />
            <Route path={`${lang}/topics`} component={Topics} />
          </Menuu>
      </Router>
    </Suspense>
  )
};

export default App;
