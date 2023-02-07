import React from 'react'
import { useTranslation } from 'react-i18next';

function About() {

  const { t } = useTranslation();

  return (
    <div className="App">
    <header className="App-header">

      <h1>Hola soy {t('about')}</h1>

    </header>
  </div>
  )
}

export default About