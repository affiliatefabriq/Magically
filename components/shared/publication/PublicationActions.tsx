"use client";

import { useState } from "react";
import { EllipsisVertical, MoreHorizontal, Pencil, Trash } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useDeletePublication, useUpdatePublication } from "@/hooks/usePublications";

interface PublicationActionsProps {
  publicationId: string;
  initialContent: string;
}

export const PublicationActions = ({ publicationId, initialContent }: PublicationActionsProps) => {
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [content, setContent] = useState(initialContent);

  const updatePublication = useUpdatePublication();
  const deletePublication = useDeletePublication();

  // --- РЕДАКТИРОВАНИЕ ---
  const handleUpdate = () => {
    if (!content.trim()) {
      toast.error("Введите текст публикации");
      return;
    }

    updatePublication.mutate(
      { publicationId, content },
      {
        onSuccess: () => {
          setEditOpen(false);
        },
      }
    );
  };

  // --- УДАЛЕНИЕ ---
  const handleDelete = () => {
    deletePublication.mutate(publicationId, {
      onSuccess: () => {
        setDeleteOpen(false);
      },
    });
  };

  return (
    <div className="flex items-center">
      {/* Dropdown menu */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon">
            <EllipsisVertical className="size-5" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={() => setEditOpen(true)}>
            <Pencil className="size-4 mr-2" /> Редактировать
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setDeleteOpen(true)} className="text-destructive">
            <Trash className="size-4 mr-2" /> Удалить
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* --- Диалог редактирования --- */}
      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="mt-4">Редактировать публикацию</DialogTitle>
          </DialogHeader>

          <div className="flex flex-col gap-4 py-2">
            <Textarea
              placeholder="Введите текст публикации..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="min-h-[60px]"
            />
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setEditOpen(false)} className="btn-outline">
              Отмена
            </Button>
            <Button onClick={handleUpdate} disabled={updatePublication.isPending} className="btn-solid">
              {updatePublication.isPending ? "Сохраняем..." : "Сохранить"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* --- Диалог удаления --- */}
      <Dialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Удалить публикацию?</DialogTitle>
          </DialogHeader>

          <p className="text-sm text-muted-foreground">Это действие необратимо. Публикация будет удалена навсегда.</p>

          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteOpen(false)}>
              Отмена
            </Button>
            <Button variant="destructive" onClick={handleDelete} disabled={deletePublication.isPending}>
              {deletePublication.isPending ? "Удаляем..." : "Удалить"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
