import { useEffect } from 'react';
import { useStore } from '@nanostores/react';
import { itemsInCart } from '@/store';
import { CartCookiesClient } from '@/utils';

export const CartCounter = () => {
  const $itemsInCart = useStore(itemsInCart);

  useEffect(() => {
    const cart = CartCookiesClient.getCart();
    itemsInCart.set(cart.length);
  }, []);

  return (
    <a href="/cart" className="relative inline-block">
      {$itemsInCart > 0 && (
        <span className="absolute -top-2 -right-2 flex justify-center items-center bg-blue-600 text-white text-xs rounded-full w-5 h-5">
          {$itemsInCart}
        </span>
      )}
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="1.5em"
        height="1.5em"
        viewBox="0 0 56 56"
      >
        <path
          fill="black"
          d="M.953 6.719c0 .96.797 1.781 1.735 1.781h7.921l3.75 25.734c.493 3.328 2.25 5.414 5.649 5.414H47.36c.913 0 1.71-.75 1.71-1.757c0-1.008-.797-1.758-1.71-1.758H20.406c-1.336 0-2.156-.938-2.367-2.367l-.375-2.461h29.742c3.422 0 5.18-2.11 5.672-5.461l1.875-12.399a7 7 0 0 0 .094-.89c0-1.125-.844-1.899-2.133-1.899h-38.25l-.469-2.976c-.234-1.805-.89-2.72-3.28-2.72H2.687c-.937 0-1.734.822-1.734 1.76M18.04 47.242c0 2.133 1.688 3.797 3.82 3.797a3.766 3.766 0 0 0 3.797-3.797a3.78 3.78 0 0 0-3.797-3.797c-2.132 0-3.82 1.688-3.82 3.797m21.914 0c0 2.133 1.711 3.797 3.82 3.797c2.133 0 3.82-1.664 3.82-3.797c0-2.11-1.687-3.797-3.82-3.797c-2.109 0-3.82 1.688-3.82 3.797"
        ></path>
      </svg>
    </a>
  );
};
