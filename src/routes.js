import React from 'react'

const User = React.lazy(() => import('./views/user/User'))
const Store = React.lazy(() => import('./views/store/Store'))
const Home = React.lazy(() => import('./views/dashboard/dashboard'))
const Medicine = React.lazy(() => import('./views/medicine/Medicine'))
const Ward = React.lazy(() => import('./views/ward/Ward'))
const StockRetrieval = React.lazy(() => import('./views/stock-retrieval/StockRetrieval'))
const StockTransfer = React.lazy(() => import('./views/stock-transfer/StockTransfer'))
const AssignMedicines = React.lazy(() => import('./views/medicine-assign/MedicineAssign'))
const StockInquiry = React.lazy(() => import('./views/stock-inquiry/StockInquiry'))

const routes = [
    { path: '/', exact: true, name: 'Home' , element:Home},
    { path: '/store', name: 'Store', element: Store },
    { path: '/user', name: 'User', element: User },
    { path: '/medicine', name: 'Medicine', element: Medicine },
    { path: '/ward', name: 'Ward', element: Ward },
    { path: '/stock-retrieval', name: 'StockRetrieval', element: StockRetrieval },
    { path: '/stock-transfer', name: 'StockTransfer', element: StockTransfer },
    { path: '/medicine-Issuing', name: 'AssignMedicines', element: AssignMedicines },
    { path: '/stock-inquiries', name: 'StockInquiry', element: StockInquiry },
]

export default routes