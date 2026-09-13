import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { fetchProductById } from '../api/products.js';
import { useCart } from '../context/CartContext.jsx';

export default function ProductDetail() {
  const { id } = useParams(); // reads the ":id" segment from the route
  const [product, setProduct] = useState(null);
  const [status, setStatus] = useState('loading');
  const { addItem } = useCart();

  useEffect(() => {
    let cancelled = false;
    setStatus('loading');

    fetchProductById(id)
      .then((data) => {
        if (!cancelled) {
          setProduct(data);
          setStatus('ready');
        }
      })
      .catch(() => {
        if (!cancelled) setStatus('error');
      });

    return () => {
      cancelled = true;
    };
  }, [id]); // re-fetch whenever the id in the URL changes

  if (status === 'loading') {
    return <p className="px-4 py-12 text-center text-graphite/50">Loading…</p>;
  }

  if (status === 'error' || !product) {
    return (
      <div className="px-4 py-12 text-center">
        <p className="text-rust">Couldn't find that product.</p>
        <Link to="/" className="mt-2 inline-block underline">
          Back to shop
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      <Link to="/" className="text-sm text-graphite/50 hover:text-graphite">
        &larr; Back to shop
      </Link>

      <div className="mt-4 grid gap-8 sm:grid-cols-2">
        <div className="rounded-lg border border-graphite/10 bg-white p-8">
          <img src={product.image} alt={product.title} className="mx-auto h-64 object-contain" />
        </div>

        <div className="flex flex-col gap-4">
          <span className="w-fit rounded-full bg-citrus/40 px-3 py-1 text-xs font-medium capitalize">
            {product.category}
          </span>
          <h1 className="font-display text-2xl font-bold leading-tight">{product.title}</h1>
          <p className="font-display text-2xl font-semibold">${product.price.toFixed(2)}</p>
          <p className="text-sm leading-relaxed text-graphite/70">{product.description}</p>
          <button
            onClick={() => addItem(product)}
            className="mt-2 w-fit rounded-md bg-graphite px-5 py-2.5 text-sm font-medium text-paper transition hover:bg-graphite/85"
          >
            Add to cart
          </button>
        </div>
      </div>
    </div>
  );
}
