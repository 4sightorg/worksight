import { create } from 'zustand';

type SidebarState = {
  activeItem: string;
  setActiveItem: (item: string) => void;
  isOpen: boolean;
  setOpen: (open: boolean) => void;
};

export const useSidebarStore = create<SidebarState>((set) => ({
  activeItem: '',
  setActiveItem: (item) => set({ activeItem: item }),
  isOpen: true,
  setOpen: (open) => set({ isOpen: open }),
}));
