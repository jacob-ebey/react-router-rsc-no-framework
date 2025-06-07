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
        lazy: () => import("./routes/landing"),
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
        id: "chat.api",
        path: "api/chat",
        lazy: () => import("./routes/chat/api"),
      },
      {
        id: "chat",
        path: "chat",
        lazy: () => import("./routes/chat/layout"),
        children: [
          {
            id: "chat.route",
            path: ":chatId?",
            lazy: () => import("./routes/chat/chat"),
          },
        ],
      },
      {
        id: "trellix",
        path: "trellix",
        lazy: () => import("./routes/trellix/layout"),
        children: [
          {
            id: "trellix.home",
            index: true,
            lazy: () => import("./routes/trellix/home"),
          },
          {
            id: "trellix.board",
            path: ":id",
            lazy: () => import("./routes/trellix/board"),
          },
        ],
      },
      {
        id: "ecomm",
        path: "ecomm",
        lazy: () => import("./routes/ecomm/layout"),
        children: [
          {
            id: "ecomm.home",
            index: true,
            lazy: () => import("./routes/ecomm/home"),
          },
        ],
      },
      {
        id: "docs",
        lazy: () => import("./routes/docs/layout"),
        children: [
          {
            id: "docs.home",
            path: "home",
            lazy: () => import("./routes/docs/home"),
          },
          {
            id: "docs.changelog",
            path: "changelog",
            lazy: () => import("./routes/docs/changelog"),
          },
          {
            id: "docs.doc",
            path: "*",
            lazy: () => import("./routes/docs/doc"),
          },
        ],
      },
    ],
  },
] as const satisfies unstable_ServerRouteObject[];
