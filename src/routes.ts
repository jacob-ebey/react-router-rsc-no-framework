import type { unstable_ServerRouteObject } from "react-router/rsc";

export default [
  {
    id: "root",
    path: "",
    lazy: () => import("./root"),
    children: [
      {
        id: "home",
        index: true,
        lazy: () => import("./routes/home"),
      },
      {
        id: "login",
        path: "login",
        lazy: () => import("./routes/login"),
      },
      {
        id: "signup",
        path: "signup",
        lazy: () => import("./routes/signup"),
      },
      {
        id: "docs",
        path: "docs",
        lazy: () => import("./routes/docs"),
        children: [
          {
            id: "docs.home",
            index: true,
            lazy: () => import("./routes/docs.home"),
          },
          {
            id: "docs.changelog",
            path: "changelog",
            lazy: () => import("./routes/docs.changelog"),
          },
          {
            id: "docs.doc",
            path: "*",
            lazy: () => import("./routes/docs.doc"),
          },
        ],
      },
    ],
  },
] as const satisfies unstable_ServerRouteObject[];
