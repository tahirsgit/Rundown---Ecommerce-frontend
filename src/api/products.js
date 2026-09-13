import axios from 'axios';

// Using the free Fake Store API as a stand-in backend for now.
// Once your own Ecommerce backend (Week 9-11) is ready, change this
// one line to your real API base URL - nothing else in the app needs
// to change, because every component only calls the functions below.
const client = axios.create({
  baseURL: 'https://fakestoreapi.com',
  timeout: 8000,
});

export async function fetchProducts() {
  const { data } = await client.get('/products');
  return data;
}

export async function fetchProductById(id) {
  const { data } = await client.get(`/products/${id}`);
  return data;
}

export async function fetchCategories() {
  const { data } = await client.get('/products/categories');
  return data;
}
