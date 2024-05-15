import React from 'react';
import { CCard, CCardBody, CCardHeader, CProgress } from '@coreui/react';

const FastMovingItems = ({ items }) => {
    // Determine the maximum quantity for scaling the progress bars
    const maxQuantity = Math.max(...items.map(item => item.quantity));

    return (
        <CCard className="mb-4 shadow-sm" style={{ border: 'none' }}>
            
            <CCardBody>
                <div className="table-responsive">
                    <table className="table">
                        <thead>
                            <tr>
                                <th>#</th>
                                <th>Item Name</th>
                                <th>Quantity</th>
                                <th>Progress</th>
                            </tr>
                        </thead>
                        <tbody>
                            {items.map((item, index) => (
                                <tr key={index}>
                                    <td>{index + 1}</td>
                                    <td>{item.name}</td>
                                    <td>{item.quantity}</td>
                                    <td>
                                        <CProgress 
                                            color={item.quantity === maxQuantity ? 'success' : 'info'}
                                            value={(item.quantity / maxQuantity) * 100}
                                            showValue
                                        />
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </CCardBody>
        </CCard>
    );
};

export default FastMovingItems;