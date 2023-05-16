import Head from 'next/head'

import styles from '../styles/Home.module.css'

import {Product, Header } from '@/components';
import { useState } from 'react';

export async function getServerSideProps() {

  // to be changed, we dont want this to be seen in client side

  const url2 = new URL(process.env.URL || 'http://localhost:3000');
  url2.pathname = '/api/create-cart';

  const cartRes =  await fetch(url2.toString());

  if (!cartRes.ok) {
    console.error(cartRes);
    return { props: {} };
  }

  const cartData = await cartRes.json();

  const url3 = new URL(process.env.URL || 'http://localhost:3000');
  url3.pathname = '/api/categories';

  const categoryRes = await fetch(url3.toString());

  if (!categoryRes.ok) {
    console.error(categoryRes);
    return { props: {} };
  }

  const CategoriesData = await categoryRes.json();



  return {
    props: { 
      categories: CategoriesData,
      cart: cartData, 
    },
  }
}


export default function Home({categories}) {

  const [categoryId, setCategoryId] = useState(categories[0]?.id)

  const handleCategoryClick = (categoryId) => {
    setCategoryId(categoryId)
  }

  const selectedCategory = categories.find((category) => category.id === categoryId);

  console.log(categoryId)

  return (
    <div className={styles.container}>
        <div>
          <Header title={selectedCategory.title} desc={selectedCategory.description} />
        </div>
        <div>
          <div className={styles.titleContainer}>
          {categories.map((category) => (
              <div
                key={category.id}
                className={`${styles.categoryTitle} ${categoryId === category.id ? styles.activeCat : ''}`}
                onClick={() => handleCategoryClick(category.id)}
              >
                {category.title}
              </div>
            ))}
          </div>
          <div className={styles.productsSection}>
              {selectedCategory.products.map((product) => (
                <Product key={product.id} product={product} />
              ))}
          </div>
        </div>

    </div>
  )
}


