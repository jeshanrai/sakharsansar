"use client";

import { useEffect, useState, type ComponentType } from "react";
import { usePathname } from "next/navigation";
import { OPEN_ORDER_DRAWER, type OpenOrderDetail } from "@/lib/order-drawer";

type DrawerProps = { initialRequest?: OpenOrderDetail };

const loadDrawer = () => import("./OrderDrawer").then((m) => m.default);

/**
 * The one order drawer, for every page, loaded after the page is ready.
 *
 * It used to be mounted by each page on its own, and most of them imported it
 * statically — so its code, and content.json with it, sat in the first load of
 * nearly every route. Here it is a separate chunk that nothing waits for: it is
 * fetched once the browser goes idle, or straight away if somebody presses an
 * order button first, in which case that request is handed over so the drawer
 * opens on the product they asked for.
 *
 * Living in the layout also means every page has one. The navbar's order
 * button used to do nothing at all on the pages that had forgotten to mount it.
 */
export default function OrderDrawerHost() {
  const pathname = usePathname();
  const admin = pathname?.startsWith("/portfolio") ?? false;
  const [Drawer, setDrawer] = useState<ComponentType<DrawerProps> | null>(null);
  const [initialRequest, setInitialRequest] = useState<OpenOrderDetail>();

  useEffect(() => {
    if (Drawer || admin) return;
    let cancelled = false;

    const mount = (request?: OpenOrderDetail) =>
      loadDrawer().then((C) => {
        if (cancelled) return;
        if (request) setInitialRequest(request);
        setDrawer(() => C);
      });

    const onOpen = (e: Event) => mount((e as CustomEvent<OpenOrderDetail>).detail ?? {});
    window.addEventListener(OPEN_ORDER_DRAWER, onOpen);

    // Safari has no requestIdleCallback; a few seconds after hydration is the
    // same idea near enough.
    const idle = window.requestIdleCallback
      ? window.requestIdleCallback(() => mount(), { timeout: 5000 })
      : window.setTimeout(() => mount(), 3000);

    return () => {
      cancelled = true;
      window.removeEventListener(OPEN_ORDER_DRAWER, onOpen);
      if (window.cancelIdleCallback) window.cancelIdleCallback(idle);
      else window.clearTimeout(idle);
    };
  }, [Drawer, admin]);

  if (!Drawer || admin) return null;
  return <Drawer initialRequest={initialRequest} />;
}
