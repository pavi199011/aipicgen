
export interface User {
  id: string;
  username?: string;
}

export interface ImageItem {
  id: string;
  image_url: string;
  prompt: string;
  model: string;
  created_at: string;
  user_id: string;
  username: string | null;
}

export interface SearchFiltersProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  selectedUser: string;
  onUserChange: (value: string) => void;
  users?: User[];
  usersLoading: boolean;
  onRefresh: () => void;
  isLoading: boolean;
}

export interface SelectionControlsProps {
  selectedCount: number;
  totalCount: number;
  onToggleAll: () => void;
  onDelete: () => void;
  isDeleting: boolean;
}

export interface ImageGridProps {
  images?: ImageItem[];
  isLoading: boolean;
  selectedImages: string[];
  onImageSelect: (id: string) => void;
}

export interface DeleteConfirmDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
  selectedCount: number;
  isDeleting: boolean;
}
