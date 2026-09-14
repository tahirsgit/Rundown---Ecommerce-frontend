import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext.jsx';

export default function Cart() {
  const { items, subtotal, setQuantity, removeItem, clearCart } = useCart();

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-16 text-center">
        <p className="text-graphite/60">Your cart is empty.</p>
        <Link to="/" className="mt-3 inline-block font-medium underline">
          Browse products
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <h1 className="font-display text-xl font-bold">Your cart</h1>

      <ul className="mt-6 divide-y divide-graphite/10">
        {items.map((item) => (
          <li key={item.id} className="flex items-center gap-4 py-4">
            <img src={item.image} alt={item.title} className="h-16 w-16 object-contain" />

            <div className="flex-1">
              <p className="line-clamp-1 text-sm font-medium">{item.title}</p>
              <p className="text-sm text-graphite/50">${item.price.toFixed(2)}</p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setQuantity(item.id, item.quantity - 1)}
                className="h-7 w-7 rounded border border-graphite/20 text-sm hover:bg-graphite/5"
                aria-label={`Decrease quantity of ${item.title}`}
              >
                &minus;
              </button>
              <span className="w-6 text-center text-sm">{item.quantity}</span>
              <button
                onClick={() => setQuantity(item.id, item.quantity + 1)}
                className="h-7 w-7 rounded border border-graphite/20 text-sm hover:bg-graphite/5"
                aria-label={`Increase quantity of ${item.title}`}
              >
                +
              </button>
            </div>

            <p className="w-16 text-right text-sm font-medium">
              ${(item.price * item.quantity).toFixed(2)}
            </p>

            <button
              onClick={() => removeItem(item.id)}
              className="text-graphite/30 hover:text-rust"
              aria-label={`Remove ${item.title}`}
            >
              ✕
            </button>
          </li>
        ))}
      </ul>

      <div className="mt-6 flex items-center justify-between border-t border-graphite/10 pt-4">
        <button onClick={clearCart} className="text-sm text-graphite/50 underline hover:text-rust">
          Clear cart
        </button>
        <div className="text-right">
          <p className="text-sm text-graphite/50">Subtotal</p>
          <p className="font-display text-xl font-bold">${subtotal.toFixed(2)}</p>
        </div>
      </div>

      <button
        onClick={() => alert('Checkout backend is pending ')}
        className="mt-4 w-full rounded-md bg-graphite py-3 text-sm font-medium text-paper transition hover:bg-graphite/85"
      >
        Checkout
      </button>
    </div>
  );
}
