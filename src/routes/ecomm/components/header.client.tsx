"use client";

import { useMemo } from "react";
import { Link, useLocation, useResolvedPath } from "react-router";

export function LinkWithRedirect({
  to,
  ...props
}: React.ComponentProps<typeof Link>) {
  const location = useLocation();
  const resolvedTo = useResolvedPath(to);
  const withRedirect = useMemo(() => {
    const searchParams = new URLSearchParams(resolvedTo.search);
    searchParams.set("redirect", location.pathname + location.search);
    return {
      ...resolvedTo,
      search: searchParams.toString(),
    };
  }, [resolvedTo, location]);

  return <Link to={withRedirect} {...props} />;
}
