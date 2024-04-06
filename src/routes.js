import React from 'react'

const User = React.lazy(() => import('./views/user/User'))
const Store = React.lazy(() => import('./views/store/Store'))
const Medicine = React.lazy(() => import('./views/medicine/Medicine'))
const Ward = React.lazy(() => import('./views/ward/Ward'))
const StockRetrieval = React.lazy(() => import('./views/stock-retrieval/StockRetrieval'))
const StockTransfer = React.lazy(() => import('./views/stock-retrieval/StockRetrieval'))
const AssignMedicines = React.lazy(() => import('./views/medicine-assign/MedicineAssign'))

const routes = [
    { path: '/', exact: true, name: 'Home' },
    { path: '/store', name: 'Store', element: Store },
    { path: '/user', name: 'User', element: User },
    { path: '/medicine', name: 'Medicine', element: Medicine },
    { path: '/ward', name: 'Ward', element: Ward },
    { path: '/stock-retrieval', name: 'StockRetrieval', element: StockRetrieval },
    { path: '/stock-retrieval', name: 'StockTransfer', element: StockTransfer },
    { path: '/medicine-Issuing', name: 'AssignMedicines', element: AssignMedicines },
]

export default routes