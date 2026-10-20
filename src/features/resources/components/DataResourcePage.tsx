import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { FilePlus, FolderPlus, Trash2 } from "lucide-react";

import { PanelLayout } from "@/components/layout/PanelLayout";
import { FlowerMenu } from "@/components/layout/FlowerMenu";
import { FileItem } from "@/components/ui/files";
import { FolderTree } from "./FolderTree";
import {
  createResourceCardFile,
  createResourceCategory,
  deleteResourceFile,
  fetchResourceCategories,
  fetchResourceFiles,
} from "../api/resources.api";

// CUSTOMIZE: this page's FlowerMenu actions are specific to Data Resource —
// per roadmap 12.11, FlowerMenu config is per-page, not global.
export function DataResourcePage() {
  const queryClient = useQueryClient();
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null);

  const categoriesQuery = useQuery({ queryKey: ["resource-categories"], queryFn: fetchResourceCategories });
  const filesQuery = useQuery({
    queryKey: ["resource-files", selectedCategoryId],
    queryFn: () => fetchResourceFiles(selectedCategoryId),
  });

  const addFolderMutation = useMutation({
    mutationFn: (name: string) => createResourceCategory(name, selectedCategoryId),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["resource-categories"] }),
  });

  const addFileMutation = useMutation({
    mutationFn: (name: string) =>
      createResourceCardFile({ name, category_id: selectedCategoryId, description: "" }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["resource-files", selectedCategoryId] }),
  });

  const deleteFileMutation = useMutation({
    mutationFn: deleteResourceFile,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["resource-files", selectedCategoryId] }),
  });

  return (
    <PanelLayout
      kicker="Resources — Data Resource"
      title="File & Folder"
      left={{
        name: "Folder",
        content: categoriesQuery.data ? (
          <FolderTree
            categories={categoriesQuery.data}
            selectedId={selectedCategoryId}
            onSelect={setSelectedCategoryId}
          />
        ) : null,
      }}
      bottom={{
        name: "Filter",
        content: (
          <p className="text-xs text-muted-foreground">
            Menampilkan {filesQuery.data?.length ?? 0} file di{" "}
            {selectedCategoryId
              ? categoriesQuery.data?.find((c) => c.id === selectedCategoryId)?.name
              : "root"}
            .
          </p>
        ),
      }}
    >
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          {filesQuery.isLoading ? "Memuat…" : `${filesQuery.data?.length ?? 0} file`}
        </p>
        <FlowerMenu
          triggerLabel="Aksi Data Resource"
          togglerSize={40}
          menuItems={[
            {
              key: "add-folder",
              icon: FolderPlus,
              label: "Tambah Folder",
              onSelect: () => {
                const name = window.prompt("Nama folder baru:");
                if (name?.trim()) addFolderMutation.mutate(name.trim());
              },
            },
            {
              key: "add-file",
              icon: FilePlus,
              label: "Tambah File",
              onSelect: () => {
                const name = window.prompt("Nama file baru:");
                if (name?.trim()) addFileMutation.mutate(name.trim());
              },
            },
          ]}
        />
      </div>

      <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-3">
        {filesQuery.data?.map((file) => (
          <div key={file.id} className="group relative">
            <FileItem>{file.name}</FileItem>
            <button
              type="button"
              onClick={() => deleteFileMutation.mutate(file.id)}
              aria-label="Hapus file"
              className="absolute right-1 top-1 hidden rounded p-1 text-muted-foreground hover:text-destructive group-hover:block"
            >
              <Trash2 size={14} />
            </button>
          </div>
        ))}
      </div>
    </PanelLayout>
  );
}
