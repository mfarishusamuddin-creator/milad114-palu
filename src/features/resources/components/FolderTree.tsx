import { Files, FolderItem, FolderPanel, FolderTrigger, SubFiles } from "@/components/ui/files";
import type { ResourceCategory } from "../api/resources.api";

interface FolderTreeProps {
  categories: ResourceCategory[];
  selectedId: string | null;
  onSelect: (id: string) => void;
}

function Node({
  category,
  categories,
  onSelect,
}: {
  category: ResourceCategory;
  categories: ResourceCategory[];
  onSelect: (id: string) => void;
}) {
  const children = categories.filter((c) => c.parent_id === category.id);
  return (
    <FolderItem value={category.id}>
      <FolderTrigger onClick={() => onSelect(category.id)}>{category.name}</FolderTrigger>
      {children.length > 0 && (
        <FolderPanel>
          <SubFiles>
            {children.map((child) => (
              <Node key={child.id} category={child} categories={categories} onSelect={onSelect} />
            ))}
          </SubFiles>
        </FolderPanel>
      )}
    </FolderItem>
  );
}

export function FolderTree({ categories, onSelect }: FolderTreeProps) {
  const roots = categories.filter((c) => !c.parent_id);
  return (
    <Files defaultOpen={[]}>
      {roots.map((cat) => (
        <Node key={cat.id} category={cat} categories={categories} onSelect={onSelect} />
      ))}
    </Files>
  );
}
