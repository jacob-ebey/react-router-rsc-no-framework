import type { unstable_ServerRouteObject } from "react-router/rsc";

export default [
  {
    id: "root",
    path: "",
    lazy: () => import("./root.tsx"),
    children: [
      {
        id: "home",
        index: true,
        lazy: () => import("./home/route.tsx"),
      },
      {
        id: "about",
        path: "about",
        lazy: () => import("./about/route.tsx"),
      },
    ],
  },
] satisfies unstable_ServerRouteObject[];
