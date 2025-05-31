import type { unstable_ServerRouteObject } from "react-router/rsc";

export default [
  {
    id: "root",
    path: "",
    lazy: () => import("./root"),
    children: [
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
      // {
      //   id: "doc",
      //   path: "docs/*",
      //   lazy: () => import("./routes/docs"),
      //   children: [

      //   ]
      // },
    ],
  },
] as const satisfies unstable_ServerRouteObject[];
