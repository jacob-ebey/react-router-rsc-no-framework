import * as React from "react";
import { useNavigate } from "react-router";

const context = React.createContext(false);

export function isLinkEvent(event: MouseEvent) {
  if (!(event.target instanceof HTMLElement)) return;
  let a = event.target.closest("a");
  if (a?.hasAttribute("href") && a.host === window.location.host) return a;
  return;
}

export function useDelegatedAnchors(
  nodeRef: React.RefObject<HTMLElement | null>
) {
  let navigate = useNavigate();
  let hasParentPrefetch = React.useContext(context);

  React.useEffect(() => {
    // if you call useDelegatedAnchors as a children of a PrefetchPageAnchors
    // then do nothing
    if (hasParentPrefetch) return;

    let node = nodeRef.current;

    node?.addEventListener("click", handleClick);
    return () => node?.removeEventListener("click", handleClick);

    function handleClick(event: MouseEvent) {
      if (!node) return;

      let anchor = isLinkEvent(event);

      if (!anchor) return;
      if (event.button !== 0) return;
      if (anchor.target && anchor.target !== "_self") return;
      if (event.metaKey || event.altKey || event.ctrlKey || event.shiftKey) {
        return;
      }

      if (anchor.hasAttribute("download")) return;

      let { pathname, search, hash } = anchor;
      navigate(
        { pathname, search, hash },
        {
					preventScrollReset: !!anchor.getAttribute("data-prevent-scroll-reset"),
					viewTransition: anchor.getAttribute("data-view-transition") === "true",
				}
      );

      event.preventDefault();
    }
  }, [hasParentPrefetch, navigate, nodeRef]);
}
