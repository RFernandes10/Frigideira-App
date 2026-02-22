import request from 'supertest';
import app from '../app';
import { prisma } from '../lib/prisma';

describe('Products API', () => {
  it('should list all products', async () => {
    const response = await request(app).get('/api/products');
    
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('products');
    expect(Array.isArray(response.body.products)).toBe(true);
    
    if (response.body.products.length > 0) {
      expect(response.body.products[0]).toHaveProperty('id');
      expect(response.body.products[0]).toHaveProperty('name');
      expect(response.body.products[0]).toHaveProperty('price');
      expect(response.body.products[0]).toHaveProperty('category');
    }
  });

  it('should filter products by category', async () => {
    const response = await request(app).get('/api/products?category=prato');
    
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('products');
    expect(Array.isArray(response.body.products)).toBe(true);
    
    // Todos os itens retornados devem ser da categoria 'prato'
    response.body.products.forEach((product: any) => {
      expect(product.category).toBe('prato');
    });
  });
});
