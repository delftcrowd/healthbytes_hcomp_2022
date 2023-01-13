import { ThemeProvider } from '@mui/material'
import { App } from 'App'
import MySnackbar from 'components/atoms/MySnackbar'
import theme from 'components/utils/CustomTheme'
import React from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import { store } from 'store/store'
import './styles.css'

// const composeEnhancer = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose

ReactDOM.render(
  <Provider store={store}>
    <ThemeProvider theme={theme}>
      <React.StrictMode>
        <App />
        <MySnackbar />
      </React.StrictMode>
    </ThemeProvider>
  </Provider>,
  document.getElementById("root")
)

// If you want your app to work offline and load faster, you can change unregister() to register() below.
// Note this comes with some pitfalls. Learn more about service workers: https://bit.ly/CRA-PWA
// serviceWorker.unregister()

// If you want to start measuring performance in your app, pass a function to log results
// (for example: reportWebVitals(console.log)) or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
// reportWebVitals()
