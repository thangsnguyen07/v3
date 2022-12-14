import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'

import App from './App'
import './index.css'
import './libraries.css'
import './tailwind.css'
import { store } from './store'

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('app')
)
