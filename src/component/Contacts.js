import React from 'react'

function Contacts(props) {



  return (
    <div className='App'>
        <div className='App-header'>
            <h1>Contacts</h1>
            <p>El idioma es {props.lang}</p>
        </div>
    </div>
  )
}

export default Contacts