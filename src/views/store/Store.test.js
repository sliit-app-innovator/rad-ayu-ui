import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import StoreForm from './Store';


import App from './App';

test('renders learn react link', async () => {
    render(<App />);
    await screen.findByText(/learn react/i);
    const linkElement = screen.getByText(/learn react/i);
    expect(linkElement).toBeInTheDocument();
});
