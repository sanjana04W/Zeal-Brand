import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

declare global {
  var __ZEAL_PRODUCTS__: any[] | undefined;
}

const dataFilePath = path.join(process.cwd(), 'src', 'lib', 'products.json');

function getProducts() {
  if (globalThis.__ZEAL_PRODUCTS__) {
    return globalThis.__ZEAL_PRODUCTS__;
  }
  try {
    const fileContents = fs.readFileSync(dataFilePath, 'utf8');
    globalThis.__ZEAL_PRODUCTS__ = JSON.parse(fileContents);
  } catch {
    globalThis.__ZEAL_PRODUCTS__ = [];
  }
  return globalThis.__ZEAL_PRODUCTS__ || [];
}

function saveProducts(products: any[]) {
  globalThis.__ZEAL_PRODUCTS__ = products;
  try {
    fs.writeFileSync(dataFilePath, JSON.stringify(products, null, 2));
  } catch (err) {
    console.warn('Serverless read-only filesystem warning, products stored in server memory:', err);
  }
}

// GET /api/products
export async function GET() {
  try {
    const products = getProducts();
    return NextResponse.json(products);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to read products data' }, { status: 500 });
  }
}

// POST /api/products (Create new product)
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, price, mainCategory, subCategory, styleCategory, inStock, image, badge } = body;

    if (!name || price === undefined || !mainCategory) {
      return NextResponse.json({ error: 'Name, price, and main category are required' }, { status: 400 });
    }

    const products = getProducts();
    const newId = String(Date.now());

    const newProduct = {
      id: newId,
      name,
      price: Number(price),
      image: image || '/Images/tshirts/bow1.jpg',
      category: subCategory || mainCategory,
      mainCategory,
      subCategory: subCategory || 'Basic T-Shirts',
      styleCategory: styleCategory || 'Graphic T-Shirts',
      badge: badge || null,
      inStock: inStock !== undefined ? Boolean(inStock) : true,
    };

    products.unshift(newProduct);
    saveProducts(products);

    return NextResponse.json({ message: 'Product created successfully', product: newProduct }, { status: 201 });
  } catch (error) {
    console.error('Error creating product:', error);
    return NextResponse.json({ error: 'Failed to create product' }, { status: 500 });
  }
}

// PUT /api/products (Update existing product)
export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { id, name, price, category, mainCategory, subCategory, styleCategory, inStock } = body;

    if (!id) {
      return NextResponse.json({ error: 'Product ID is required' }, { status: 400 });
    }

    const products = getProducts();

    const productIndex = products.findIndex((p: any) => String(p.id) === String(id));
    if (productIndex === -1) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    // Update the product
    products[productIndex] = {
      ...products[productIndex],
      ...(name !== undefined && { name }),
      ...(price !== undefined && { price: Number(price) }),
      ...(category !== undefined && { category }),
      ...(mainCategory !== undefined && { mainCategory }),
      ...(subCategory !== undefined && { subCategory }),
      ...(styleCategory !== undefined && { styleCategory }),
      ...(inStock !== undefined && { inStock: Boolean(inStock) })
    };

    // Recalculate original price if there's a discount badge
    const badge = products[productIndex].badge;
    if (badge && typeof badge === 'string' && badge.startsWith('-') && price !== undefined) {
      const discount = parseInt(badge.replace('-', '').replace('%', ''));
      if (!isNaN(discount) && discount > 0) {
        products[productIndex].originalPrice = Math.round(price / (1 - discount / 100));
      }
    }

    saveProducts(products);

    return NextResponse.json({ message: 'Product updated successfully', product: products[productIndex] });
  } catch (error) {
    console.error('Error updating product:', error);
    return NextResponse.json({ error: 'Failed to update product data' }, { status: 500 });
  }
}

// DELETE /api/products?id=XYZ
export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Product ID is required' }, { status: 400 });
    }

    let products = getProducts();
    const initialLength = products.length;
    products = products.filter((p: any) => String(p.id) !== String(id));

    if (products.length === initialLength) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    saveProducts(products);

    return NextResponse.json({ message: 'Product deleted successfully' });
  } catch (error) {
    console.error('Error deleting product:', error);
    return NextResponse.json({ error: 'Failed to delete product' }, { status: 500 });
  }
}
