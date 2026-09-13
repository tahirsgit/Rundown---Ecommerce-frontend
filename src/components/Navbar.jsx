import { Link, NavLink } from 'react-router-dom';
import { useCart } from '../context/CartContext.jsx';

export default function Navbar() {
  const { itemCount } = useCart();

  return (
    <header className="border-b border-graphite/10 bg-paper/95 backdrop-blur">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-4">
        <Link to="/" className="font-display text-lg font-bold tracking-tight">
          Rundown
        </Link>

        <nav className="flex items-center gap-6 text-sm font-medium">
          <NavLink
            to="/"
            className={({ isActive }) =>
              isActive ? 'text-graphite' : 'text-graphite/50 hover:text-graphite'
            }
            end
          >
            Shop
          </NavLink>
          <NavLink
            to="/cart"
            className={({ isActive }) =>
              `relative ${isActive ? 'text-graphite' : 'text-graphite/50 hover:text-graphite'}`
            }
          >
            Cart
            {itemCount > 0 && (
              <span className="ml-1.5 rounded-full bg-rust px-2 py-0.5 text-xs font-semibold text-paper">
                {itemCount}
              </span>
            )}
          </NavLink>
        </nav>
      </div>
    </header>
  );
}
