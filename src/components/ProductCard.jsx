import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext.jsx';

export default function ProductCard({ product }) {
  const { addItem } = useCart();

  return (
    <div className="group flex flex-col overflow-hidden rounded-lg border border-graphite/10 bg-white transition hover:shadow-md">
      <Link to={`/product/${product.id}`} className="block bg-white p-6">
        <img
          src={product.image}
          alt={product.title}
          className="mx-auto h-40 w-full object-contain transition group-hover:scale-105"
        />
      </Link>

      <div className="flex flex-1 flex-col gap-2 border-t border-graphite/10 p-4">
        <Link to={`/product/${product.id}`}>
          <h3 className="line-clamp-2 text-sm font-medium leading-snug hover:underline">
            {product.title}
          </h3>
        </Link>
        <p className="mt-auto font-display text-lg font-semibold">
          ${product.price.toFixed(2)}
        </p>
        <button
          onClick={() => addItem(product)}
          className="mt-1 rounded-md bg-graphite px-3 py-2 text-sm font-medium text-paper transition hover:bg-graphite/85"
        >
          Add to cart
        </button>
      </div>
    </div>
  );
}
