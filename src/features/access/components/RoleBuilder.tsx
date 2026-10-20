import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import {
  createRole,
  fetchPermissions,
  fetchRolePermissionIds,
  fetchRoles,
  type PermissionRow,
  saveRolePermissions,
} from "../api/roles-admin.api";

export function RoleBuilder() {
  const queryClient = useQueryClient();
  const rolesQuery = useQuery({ queryKey: ["roles-admin"], queryFn: fetchRoles });

  const [explicitRoleId, setExplicitRoleId] = useState<string | null>(null);
  const [newRoleName, setNewRoleName] = useState("");

  // Derived during render, not synced via effect: if nothing was explicitly
  // clicked yet, default to the first non-system role once roles load.
  const selectedRoleId =
    explicitRoleId ?? rolesQuery.data?.find((r) => !r.is_superadmin)?.id ?? rolesQuery.data?.[0]?.id ?? null;
  const selectedRole = rolesQuery.data?.find((r) => r.id === selectedRoleId) ?? null;

  const createRoleMutation = useMutation({
    mutationFn: createRole,
    onSuccess: (role) => {
      queryClient.invalidateQueries({ queryKey: ["roles-admin"] });
      queryClient.invalidateQueries({ queryKey: ["assignable-roles"] });
      setNewRoleName("");
      setExplicitRoleId(role.id);
    },
  });

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap gap-2">
        {rolesQuery.data?.map((role) => (
          <button
            key={role.id}
            type="button"
            onClick={() => setExplicitRoleId(role.id)}
            className={cn(
              "rounded-full border px-3 py-1.5 font-mono text-xs uppercase tracking-wide transition-colors",
              selectedRoleId === role.id
                ? "border-ring bg-foreground/10 text-foreground"
                : "border-border text-muted-foreground hover:text-foreground",
            )}
          >
            {role.name}
            {role.is_superadmin && " (sistem)"}
          </button>
        ))}
      </div>

      <div className="flex items-end gap-2">
        <div className="flex flex-1 flex-col gap-1.5">
          <Label htmlFor="new-role-name">Role Baru</Label>
          <Input
            id="new-role-name"
            value={newRoleName}
            onChange={(e) => setNewRoleName(e.target.value)}
            placeholder="mis. Project Manager"
          />
        </div>
        <Button
          type="button"
          variant="outline"
          disabled={!newRoleName.trim() || createRoleMutation.isPending}
          onClick={() => createRoleMutation.mutate(newRoleName.trim())}
        >
          Tambah
        </Button>
      </div>

      {selectedRole?.is_superadmin ? (
        <p className="text-sm text-muted-foreground">
          Role sistem — aksesnya selalu penuh, tidak bisa diatur lewat sini.
        </p>
      ) : (
        selectedRoleId && <RolePermissionEditor key={selectedRoleId} roleId={selectedRoleId} />
      )}
    </div>
  );
}

/** Mounted with key={roleId} by the parent — switching roles remounts this
 * fresh, so local checkbox edits never need to be reset via an effect. */
function RolePermissionEditor({ roleId }: { roleId: string }) {
  const queryClient = useQueryClient();
  const permissionsQuery = useQuery({ queryKey: ["permissions-admin"], queryFn: fetchPermissions });
  const rolePermissionsQuery = useQuery({
    queryKey: ["role-permissions-admin", roleId],
    queryFn: () => fetchRolePermissionIds(roleId),
  });

  const [edited, setEdited] = useState<Set<string> | null>(null);
  const checked = edited ?? new Set(rolePermissionsQuery.data ?? []);

  const saveMutation = useMutation({
    mutationFn: () => saveRolePermissions(roleId, [...checked]),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["role-permissions-admin", roleId] }),
  });

  function toggle(permissionId: string) {
    setEdited((prev) => {
      const base = prev ?? new Set(rolePermissionsQuery.data ?? []);
      const next = new Set(base);
      if (next.has(permissionId)) next.delete(permissionId);
      else next.add(permissionId);
      return next;
    });
  }

  const groupedPermissions = (permissionsQuery.data ?? []).reduce<Record<string, PermissionRow[]>>(
    (acc, p) => {
      (acc[p.module] ??= []).push(p);
      return acc;
    },
    {},
  );

  return (
    <div className="flex flex-col gap-5">
      {Object.entries(groupedPermissions).map(([module, perms]) => (
        <div key={module}>
          <p className="mb-2 font-mono text-[11px] uppercase tracking-[0.15em] text-muted-foreground">
            {module}
          </p>
          <div className="flex flex-wrap gap-4">
            {perms.map((perm) => (
              <label key={perm.id} className="flex items-center gap-2 text-sm text-foreground">
                <input
                  type="checkbox"
                  checked={checked.has(perm.id)}
                  onChange={() => toggle(perm.id)}
                  className="h-4 w-4 rounded border-border accent-foreground"
                />
                {perm.action}
              </label>
            ))}
          </div>
        </div>
      ))}

      <Button
        type="button"
        disabled={saveMutation.isPending}
        onClick={() => saveMutation.mutate()}
        className="w-fit"
      >
        {saveMutation.isPending ? "Menyimpan…" : "Simpan Permission"}
      </Button>
      {saveMutation.isSuccess && <p className="text-xs text-emerald-400">Tersimpan.</p>}
    </div>
  );
}
