export type PageScope = "admin" | "public";

export interface PageRow {
  id: string;
  slug: string;
  title: string;
  html_content: string;
  scope: PageScope;
  is_published: boolean;
  sort_order: number;
  is_home: boolean;
  created_at: string;
  updated_at: string;
}

export interface PageMeta {
  id: string;
  slug: string;
  title: string;
  scope: PageScope;
  is_published: boolean;
  sort_order: number;
  is_home: boolean;
}
