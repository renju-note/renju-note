import 'firebase/analytics'
import firebase from 'firebase/app'
import { StrictMode } from 'react'
import ReactDOM from 'react-dom'
import App from './components/App'
import './index.css'
import * as serviceWorker from './serviceWorker'

fetch('/__/firebase/init.json').then(async response => {
  firebase.initializeApp(await response.json())
  firebase.analytics()
})

ReactDOM.render(
  <StrictMode>
    <App />
  </StrictMode>,
  document.getElementById('root')
)

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister()
