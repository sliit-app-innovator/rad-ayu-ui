import React from 'react'

const User = React.lazy(() => import('./views/user/User'))
const Store = React.lazy(() => import('./views/store/Store'))

const routes = [
    { path: '/', exact: true, name: 'Home' },
    { path: '/store', name: 'Store', element: Store },
    { path: '/user', name: 'User', element: User },
]

export default routes