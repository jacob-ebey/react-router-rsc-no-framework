import { ChevronRight } from "lucide-react";
import { NavLink } from "react-router";

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  SidebarGroup,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar";
import { docsPrefix } from "@/global-config";
import type { Docs } from "../lib/docs";
import { getDocs } from "../lib/docs";

import {
  IsActiveSidebarMenuButton,
  IsActiveSidebarMenuSubButton,
} from "./nav.client";

export type DocsNavItem = {
  title: string;
  url: string;
  items?: DocsNavItem[];
};

export async function DocsNav() {
  "use cache";

  const docs = await getDocs({ preload: true });
  const items = await docsToNavItems(docs);

  return (
    <SidebarGroup>
      <SidebarMenu>
        <SidebarMenuItem>
          <IsActiveSidebarMenuButton asChild pathname="/changelog">
            <NavLink to="/changelog" className="font-bold">
              <span>Changelog</span>
            </NavLink>
          </IsActiveSidebarMenuButton>
        </SidebarMenuItem>
        {items.map((item) => (
          <NavItem key={item.title} item={item} />
        ))}
      </SidebarMenu>
    </SidebarGroup>
  );
}

function NavItem({ depth = 0, item }: { depth?: number; item: DocsNavItem }) {
  if (!item.items?.length) {
    if (depth) {
      return (
        <SidebarMenuSubItem>
          <IsActiveSidebarMenuSubButton asChild pathname={item.url}>
            <NavLink to={item.url}>
              <span>{item.title}</span>
            </NavLink>
          </IsActiveSidebarMenuSubButton>
        </SidebarMenuSubItem>
      );
    }
    return (
      <SidebarMenuItem>
        <IsActiveSidebarMenuButton asChild pathname={item.url}>
          <NavLink to={item.url}>
            <span>{item.title}</span>
          </NavLink>
        </IsActiveSidebarMenuButton>
      </SidebarMenuItem>
    );
  }

  if (!depth) {
    return (
      <Collapsible
        key={item.title}
        asChild
        defaultOpen={true}
        className="group/collapsible"
      >
        <SidebarMenuItem>
          <CollapsibleTrigger asChild>
            <SidebarMenuButton tooltip={item.title}>
              <span className="font-bold">{item.title}</span>
              <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
            </SidebarMenuButton>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <SidebarMenuSub>
              {item.items.map((subItem) => (
                <NavItem key={subItem.title} depth={depth + 1} item={subItem} />
              ))}
            </SidebarMenuSub>
          </CollapsibleContent>
        </SidebarMenuItem>
      </Collapsible>
    );
  }

  return (
    <Collapsible
      key={item.title}
      asChild
      defaultOpen={true}
      className="group/collapsible"
    >
      <SidebarMenuSubItem>
        <CollapsibleTrigger asChild>
          <SidebarMenuSubButton>
            <span className="font-bold">{item.title}</span>
            <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
          </SidebarMenuSubButton>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <SidebarMenuSub>
            {item.items.map((subItem) => (
              <NavItem key={subItem.title} depth={depth + 1} item={subItem} />
            ))}
          </SidebarMenuSub>
        </CollapsibleContent>
      </SidebarMenuSubItem>
    </Collapsible>
  );
}

async function docsToNavItems(docs: Docs): Promise<DocsNavItem[]> {
  const loadedDocs = (
    await Promise.all(
      docs.files.map(async (doc) => {
        const loaded = await doc.load();
        const { load: _, ...file } = doc;
        return {
          ...file,
          ...loaded,
        };
      })
    )
  ).filter(
    (doc) => Boolean(doc.attributes?.title) && !Boolean(doc.attributes?.hidden)
  );

  const categories: (DocsNavItem & { order: number })[] = [];
  const categoriesByPrefix = new Map<string, DocsNavItem>();
  const needsSort: (DocsNavItem & { order: number })[] = [];

  for (const doc of loadedDocs) {
    const path = doc.path.replace(/^docs\//, "").replace(/(\/index)?\.md$/, "");
    const category = {
      title: doc.attributes.title!,
      url: `${docsPrefix}${path}`,
      items: [],
      order: doc.attributes.order ?? Number.MAX_SAFE_INTEGER,
    };
    if (doc.path.endsWith("index.md")) {
      if (path === "index") continue;

      categoriesByPrefix.set(`${docsPrefix}${path}`, category);
      if (path.split("/").length < 2) {
        categories.push(category);
      } else {
        needsSort.push(category);
      }
    } else {
      needsSort.push(category);
    }
  }

  needsSort.sort(
    (a, b) =>
      (a.order ?? Number.MAX_SAFE_INTEGER) -
      (b.order ?? Number.MAX_SAFE_INTEGER)
  );

  for (const doc of needsSort) {
    const path = doc.url;
    const segments = path.split("/");
    const category = categoriesByPrefix.get(segments.slice(0, -1).join("/"));

    if (category) {
      category.items = category.items ?? [];
      category.items.push(doc);
    }
  }

  categories.sort(
    (a, b) =>
      (a.order ?? Number.MAX_SAFE_INTEGER) -
      (b.order ?? Number.MAX_SAFE_INTEGER)
  );

  return categories;
}
