import React, { useEffect } from 'react'
import { CFooter } from '@coreui/react'
import './footer.css'
const { version } = require('../../package.json')

const AppFooter = () => {
    return (
        <CFooter className="f1">
            <div>
                <a href="#" target="_blank" rel="noopener noreferrer">
                    <span className="ms-1">&copy;AYU</span>
                </a>
                <span> | Version {version}</span>
            </div>
            <div className="ms-auto">
                <span className="me-1">Powered by  </span>
                <a href="#" target="_blank" rel="noopener noreferrer">
                    AppInovators
                </a>
            </div>
        </CFooter>
    )
}

export default React.memo(AppFooter)
