import { it, expect, describe } from 'vitest';
import ProductDetail from '../../src/components/ProductDetail';
import { render, screen } from '@testing-library/react';
import { server } from '../mocks/server';
import { http, HttpResponse } from 'msw';
import { db } from '../mocks/db';
import { Product } from '../../src/entities';

describe('ProductDetail', () => {
  let productId: number;
  let tempProduct: Product;
  beforeAll(() => {
    const product = db.product.create();
    productId = product.id;
    tempProduct = product;
  });

  afterAll(() => {
    db.product.deleteMany({ where: { id: { equals: productId } } });
  });

  it('should render product details', async () => {
    render(<ProductDetail productId={productId} />);

    const productName = await screen.findByText(new RegExp(tempProduct.name));
    const productPrice = await screen.findByText(
      new RegExp(tempProduct.price.toString()),
    );

    expect(productName).toBeInTheDocument();
    expect(productPrice).toBeInTheDocument();
  });

  it('should render the message if product not found', async () => {
    server.use(http.get('/products/:id', () => HttpResponse.json(null)));
    render(<ProductDetail productId={1} />);

    const message = await screen.findByText(/not found/i);

    expect(message).toBeInTheDocument();
  });

  it('should render an error for invalid product id is 0', async () => {
    render(<ProductDetail productId={0} />);

    const error = await screen.findByText(/invalid/i);

    expect(error).toBeInTheDocument();
  });
});
