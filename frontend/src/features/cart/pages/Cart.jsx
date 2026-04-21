import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router';
import { useDispatch, useSelector } from 'react-redux';
import AppNavbar from '../../../components/AppNavbar';
import { useCart } from '../hook/useCart';
import { setCart } from '../state/cart.slice';

const Cart = () => {
  const { handleGetCart } = useCart();
  const dispatch = useDispatch();
  const cart = useSelector((state) => state.cart.cart);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCart = async () => {
      try {
        await handleGetCart();
      } catch (error) {
        console.error('Failed to fetch cart:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCart();
  }, []);

  const items = useMemo(() => {
    if (!cart?.items) return [];
    return cart.items;
  }, [cart]);

  const subtotal = useMemo(() => {
    return items.reduce((sum, item) => {
      const amount = Number(item?.price?.Amount || 0);
      const qty = Number(item?.quantity || 0);
      return sum + amount * qty;
    }, 0);
  }, [items]);

  const currency = items[0]?.price?.Currency || 'INR';

  const getItemStock = (item) => {
    const parsed = Number(item?.variant?.stock ?? item?.stock);
    if (Number.isFinite(parsed) && parsed > 0) return parsed;
    return Number(item?.quantity || 1);
  };

  const updateItemQuantity = (itemIndex, nextQty) => {
    if (!cart?.items) return;
    const stock = getItemStock(cart.items[itemIndex]);
    const boundedQty = Math.max(1, Math.min(nextQty, stock || 1));

    const nextItems = cart.items.map((item, idx) => {
      if (idx !== itemIndex) return item;
      return { ...item, quantity: boundedQty };
    });

    dispatch(setCart({ ...cart, items: nextItems }));
  };

  return (
    <div className="min-h-screen bg-[#FAF7F2] text-[#2C2C2B] selection:bg-[#1F1E1D] selection:text-[#FAF7F2]">
      <AppNavbar backTo="/" className="sticky" />

      <main className="px-6 md:px-12 lg:px-20 pt-10 pb-24 max-w-[1800px] mx-auto">
        <div className="border-b border-[#EBE5DB] pb-8 mb-10">
          <p className="text-[10px] tracking-[0.3em] uppercase text-[#807B75] mb-3">Bag</p>
          <h1 className="text-5xl md:text-6xl font-serif italic text-[#1F1E1D] leading-tight">
            Your <span className="font-light">Cart</span>
          </h1>
        </div>

        {loading ? (
          <div className="w-full flex items-center justify-center py-32">
            <p className="text-sm uppercase tracking-[0.2em] text-[#B5AC9E] animate-pulse font-serif italic">
              Loading your selections...
            </p>
          </div>
        ) : items.length === 0 ? (
          <div className="w-full flex flex-col items-center justify-center py-24 text-center border border-[#EBE5DB] rounded-3xl bg-[#F4EFE6]/50">
            <p className="text-5xl font-serif italic text-[#C2BCB1] mb-4">Empty.</p>
            <p className="text-xs uppercase tracking-widest text-[#B5AC9E] mb-10">
              Your cart has no pieces yet.
            </p>
            <Link
              to="/"
              className="relative px-8 py-4 rounded-[40px_30px_35px_50px] border border-[#1F1E1D] text-[#1F1E1D] font-serif italic text-sm overflow-hidden group transition-all duration-500 hover:shadow-md"
            >
              <span className="relative z-10 group-hover:text-white transition-colors duration-500">
                Continue Shopping
              </span>
              <div className="absolute inset-0 bg-[#1F1E1D] transform origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-500 ease-in-out rounded-[40px_30px_35px_50px]" />
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 xl:gap-12">
            <section className="xl:col-span-2 flex flex-col gap-5">
              {items.map((item, idx) => {
                const stock = getItemStock(item);
                const qty = Number(item?.quantity || 1);
                const canDecrease = qty > 1;
                const canIncrease = stock > 0 && qty < stock;

                return (
                <article
                  key={`${item.product?._id || item.product}-${item.variant?._id || item.variant}-${idx}`}
                  className="rounded-2xl border border-[#EBE5DB] bg-[#F4EFE6]/40 p-5 md:p-6"
                >
                  <div className="flex gap-4 md:gap-6">
                    <div className="w-24 h-28 md:w-28 md:h-36 rounded-xl overflow-hidden bg-[#EBE5DB] shrink-0">
                      {item?.variant?.Images?.[0]?.url || item?.product?.images?.[0]?.url ? (
                        <img
                          src={item?.variant?.Images?.[0]?.url || item?.product?.images?.[0]?.url}
                          alt={item?.product?.Title || 'Cart Item'}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-[10px] uppercase tracking-widest text-[#B5AC9E]">
                          No Image
                        </div>
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <h2 className="font-serif italic text-2xl text-[#1F1E1D] leading-tight mb-2 line-clamp-1">
                        {item?.product?.Title || 'Untitled Piece'}
                      </h2>
                      <div className="flex items-center gap-3 mb-3">
                        <button
                          type="button"
                          onClick={() => updateItemQuantity(idx, qty - 1)}
                          disabled={!canDecrease}
                          className="w-8 h-8 rounded-full border border-[#1F1E1D] text-[#1F1E1D] disabled:opacity-30 disabled:cursor-not-allowed hover:bg-[#1F1E1D] hover:text-white transition-colors"
                          aria-label="Decrease quantity"
                        >
                          -
                        </button>
                        <p className="text-xs uppercase tracking-[0.2em] text-[#807B75] min-w-16 text-center">
                          Qty: {qty}
                        </p>
                        <button
                          type="button"
                          onClick={() => updateItemQuantity(idx, qty + 1)}
                          disabled={!canIncrease}
                          className="w-8 h-8 rounded-full border border-[#1F1E1D] text-[#1F1E1D] disabled:opacity-30 disabled:cursor-not-allowed hover:bg-[#1F1E1D] hover:text-white transition-colors"
                          aria-label="Increase quantity"
                        >
                          +
                        </button>
                        <span className="text-[10px] uppercase tracking-[0.2em] text-[#B5AC9E]">
                          Stock: {stock}
                        </span>
                      </div>

                      {item?.variant?.Attributes && (
                        <div className="flex flex-wrap gap-2 mb-4">
                          {Object.entries(item.variant.Attributes).map(([key, value]) => (
                            <span
                              key={key}
                              className="bg-white px-2.5 py-1 text-[9px] uppercase tracking-widest text-[#5C5853] rounded-full border border-[#D1CCC2]"
                            >
                              {key}: <span className="font-medium text-[#1F1E1D]">{value}</span>
                            </span>
                          ))}
                        </div>
                      )}

                      <p className="text-lg text-[#1F1E1D] font-light">
                        {item?.price?.Currency || currency} {Number(item?.price?.Amount || 0).toLocaleString()}
                      </p>
                    </div>
                  </div>
                </article>
                );
              })}
            </section>

            <aside className="xl:col-span-1">
              <div className="rounded-3xl border border-[#EBE5DB] bg-[#F4EFE6]/50 p-6 md:p-8 sticky top-24">
                <h3 className="font-serif italic text-3xl text-[#1F1E1D] mb-8">Summary</h3>

                <div className="space-y-4 text-sm">
                  <div className="flex justify-between text-[#807B75]">
                    <span>Items</span>
                    <span>{items.length}</span>
                  </div>
                  <div className="flex justify-between text-[#807B75]">
                    <span>Subtotal</span>
                    <span>
                      {currency} {subtotal.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between text-[#807B75]">
                    <span>Shipping</span>
                    <span>Calculated at checkout</span>
                  </div>
                </div>

                <div className="border-t border-[#E0D8CC] mt-6 pt-6 flex justify-between items-center">
                  <span className="text-xs uppercase tracking-[0.2em] text-[#807B75]">Total</span>
                  <span className="font-serif text-2xl text-[#1F1E1D]">
                    {currency} {subtotal.toLocaleString()}
                  </span>
                </div>

                <button
                  className="mt-8 w-full relative h-14 rounded-[40px_30px_35px_50px] border border-[#1F1E1D] text-white font-serif italic text-lg overflow-hidden group transition-all duration-500 hover:shadow-lg bg-[#1F1E1D]"
                >
                  <span className="relative z-10 block transition-transform duration-500 group-hover:scale-105">
                    Checkout
                  </span>
                  <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-20 transition-opacity duration-700 rounded-[40px_30px_35px_50px]" />
                </button>
              </div>
            </aside>
          </div>
        )}
      </main>
    </div>
  );
};

export default Cart;
