/**
 * Opening the order drawer, without importing it.
 *
 * This used to live in OrderDrawer.tsx, so every button that opened the drawer
 * imported the drawer itself — the navbar included. The navbar renders on all
 * pages, which put the whole checkout (its form, its copy in two languages and
 * all of content.json) into the JavaScript every visitor downloads before the
 * page can respond, whether or not they ever press "Order".
 *
 * Now the buttons only raise an event. OrderDrawerHost, mounted once in the
 * root layout, listens for it and fetches the drawer's code in the background
 * after the page is idle — or at once, if the first click beats it there.
 */
export const OPEN_ORDER_DRAWER = "open-order-drawer";

export type OpenOrderDetail = { productName?: string };

export function openOrderDrawer(productName?: string) {
  if (typeof window === "undefined") return;
  window.dispatchEvent(
    new CustomEvent<OpenOrderDetail>(OPEN_ORDER_DRAWER, { detail: { productName } }),
  );
}
