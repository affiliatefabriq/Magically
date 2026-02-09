'use client';

import { useState } from 'react';
import { EllipsisVertical, Pencil, Trash } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Textarea } from '@/components/ui/textarea';
import {
  useDeletePublication,
  useUpdatePublication,
} from '@/hooks/usePublications';

interface PublicationActionsProps {
  publicationId: string;
  initialContent: string;
}

export const PublicationActions = ({
  publicationId,
  initialContent,
}: PublicationActionsProps) => {
  const t = useTranslations('Components.PublicationActions');

  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [content, setContent] = useState(initialContent);

  const updatePublication = useUpdatePublication();
  const deletePublication = useDeletePublication();

  const handleUpdate = () => {
    if (!content.trim()) {
      toast.error(t('enter'));
      return;
    }

    updatePublication.mutate(
      { publicationId, content },
      {
        onSuccess: () => {
          setEditOpen(false);
        },
      },
    );
  };

  const handleDelete = () => {
    deletePublication.mutate(publicationId, {
      onSuccess: () => {
        setDeleteOpen(false);
      },
    });
  };

  return (
    <div className="flex items-center">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon">
            <EllipsisVertical className="size-5" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={() => setEditOpen(true)}>
            <Pencil className="size-4 mr-2" /> {t('edit')}
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => setDeleteOpen(true)}
            className="text-destructive"
          >
            <Trash className="size-4 mr-2" /> {t('delete.title')}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent className="max-w-7xl">
          <DialogHeader>
            <DialogTitle className="mt-4">{t('title')}</DialogTitle>
          </DialogHeader>

          <div className="flex flex-col gap-4 py-2">
            <Textarea
              placeholder={t('enter')}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="min-h-15"
            />
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setEditOpen(false)}
              className="btn-outline"
            >
              {t('cancel')}
            </Button>
            <Button
              onClick={handleUpdate}
              disabled={updatePublication.isPending}
              className="btn-solid"
            >
              {updatePublication.isPending
                ? t('button.saving')
                : t('button.save')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t('confirm')}</DialogTitle>
          </DialogHeader>

          <p className="text-sm text-muted-foreground">{t('confirmText')}</p>

          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteOpen(false)}>
              {t('cancel')}
            </Button>
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={deletePublication.isPending}
            >
              {deletePublication.isPending
                ? t('delete.deleting')
                : t('delete.title')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
