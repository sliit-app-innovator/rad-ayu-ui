import React, { Component, Suspense } from 'react'
import { HashRouter, Route, Routes } from 'react-router-dom'
import TimeAgo from 'javascript-time-ago'

import en from 'javascript-time-ago/locale/en.json'
import ru from 'javascript-time-ago/locale/ru.json'
// import './App.css';
import './scss/style.scss'

TimeAgo.addDefaultLocale(en)
TimeAgo.addLocale(ru)

const DefaultLayout = React.lazy(() => import('./layout/DefaultLayout'))
// const Login = React.lazy(() => import('./views/login/Login'))

const loading = (
  <div className="pt-3 text-center">
    <div className="sk-spinner sk-spinner-pulse"></div>
  </div>
)

class App extends Component {
  render() {
    return (
      <HashRouter>
        <Suspense fallback={loading}>
          <Routes>
            {/* <Route exact path="/login" name="Login Page" element={<Login />} /> */}
            <Route>
              <Route path="*" name="Home" element={<DefaultLayout />} />
            </Route>
          </Routes>
        </Suspense>
      </HashRouter>
    );
  }
}

export default App;
