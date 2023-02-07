import React from 'react'
import { useTranslation } from 'react-i18next';


function Home() {

  const { t } = useTranslation();

  return (
    <div className="App">
      <div className="App-header">
        <h1>Hola soy {t('locale')}</h1>
      </div>
    </div>
  )
}

export default Home;