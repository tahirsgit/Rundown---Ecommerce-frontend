import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { CartProvider, useCart } from './CartContext.jsx';

const sampleProduct = { id: 1, title: 'Test Mug', price: 10, image: 'mug.png' };

// A tiny harness component so we can exercise the hook through real
// React state updates rather than calling the reducer directly.
function CartHarness() {
  const { items, itemCount, subtotal, addItem, removeItem, setQuantity } = useCart();

  return (
    <div>
      <p data-testid="count">{itemCount}</p>
      <p data-testid="subtotal">{subtotal}</p>
      <button onClick={() => addItem(sampleProduct)}>add</button>
      <button onClick={() => setQuantity(1, 3)}>set-three</button>
      <button onClick={() => removeItem(1)}>remove</button>
      <ul>
        {items.map((item) => (
          <li key={item.id}>{item.title} x{item.quantity}</li>
        ))}
      </ul>
    </div>
  );
}

function renderWithProvider() {
  return render(
    <CartProvider>
      <CartHarness />
    </CartProvider>
  );
}

describe('CartContext', () => {
  it('adds an item and increments quantity on repeat add', () => {
    renderWithProvider();

    fireEvent.click(screen.getByText('add'));
    expect(screen.getByTestId('count').textContent).toBe('1');

    fireEvent.click(screen.getByText('add'));
    expect(screen.getByTestId('count').textContent).toBe('2');
    expect(screen.getByText('Test Mug x2')).toBeInTheDocument();
  });

  it('computes subtotal from price * quantity', () => {
    renderWithProvider();

    fireEvent.click(screen.getByText('add'));
    fireEvent.click(screen.getByText('set-three'));

    expect(screen.getByTestId('subtotal').textContent).toBe('30');
  });

  it('removes an item entirely', () => {
    renderWithProvider();

    fireEvent.click(screen.getByText('add'));
    fireEvent.click(screen.getByText('remove'));

    expect(screen.getByTestId('count').textContent).toBe('0');
  });
});
