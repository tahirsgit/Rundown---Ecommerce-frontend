import { useEffect, useState } from 'react';
import { fetchProducts, fetchCategories } from '../api/products.js';
import ProductCard from '../components/ProductCard.jsx';

export default function Home() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [activeCategory, setActiveCategory] = useState('all');
  const [status, setStatus] = useState('loading'); // 'loading' | 'ready' | 'error'

  // Fetch once on mount. Empty dependency array = run only on first render.
  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const [productData, categoryData] = await Promise.all([
          fetchProducts(),
          fetchCategories(),
        ]);
        if (!cancelled) {
          setProducts(productData);
          setCategories(categoryData);
          setStatus('ready');
        }
      } catch (err) {
        if (!cancelled) setStatus('error');
      }
    }

    load();
    // Cleanup: if the component unmounts mid-fetch, ignore the result.
    return () => {
      cancelled = true;
    };
  }, []);

  const visibleProducts =
    activeCategory === 'all'
      ? products
      : products.filter((p) => p.category === activeCategory);

  if (status === 'loading') {
    return <p className="px-4 py-12 text-center text-graphite/50">Loading products…</p>;
  }

  if (status === 'error') {
    return (
      <p className="px-4 py-12 text-center text-rust">
        Couldn't load products right now. Please refresh.
      </p>
    );
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-8">
      <div className="mb-6 flex flex-wrap gap-2">
        <button
          onClick={() => setActiveCategory('all')}
          className={`rounded-full px-4 py-1.5 text-sm font-medium capitalize transition ${
            activeCategory === 'all'
              ? 'bg-graphite text-paper'
              : 'bg-white text-graphite/60 hover:text-graphite'
          }`}
        >
          All
        </button>
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => setActiveCategory(category)}
            className={`rounded-full px-4 py-1.5 text-sm font-medium capitalize transition ${
              activeCategory === category
                ? 'bg-graphite text-paper'
                : 'bg-white text-graphite/60 hover:text-graphite'
            }`}
          >
            {category}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        {visibleProducts.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
}
