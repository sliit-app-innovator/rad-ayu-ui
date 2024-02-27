import React from 'react'

const User = React.lazy(() => import('./views/User'))

const routes = [
    { path: '/', exact: true, name: 'Home' },
    { path: '/user', name: 'User', element: User },
]

export default routes