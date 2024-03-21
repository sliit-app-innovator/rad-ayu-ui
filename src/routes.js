import React from 'react'

const User = React.lazy(() => import('./views/user/User'))
const Store = React.lazy(() => import('./views/store/Store'))
const Medicine = React.lazy(() => import('./views/medicine/Medicine'))

const routes = [
    { path: '/', exact: true, name: 'Home' },
    { path: '/store', name: 'Store', element: Store },
    { path: '/user', name: 'User', element: User },
    { path: '/medicine', name: 'User', element: Medicine },
]

export default routes