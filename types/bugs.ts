

export interface Bug {
  id: number;
  title: string;
  description?: string;
  status: string;
  type?: string;
  deadline?: string;
  screenshot_url?: string;
  assignees?: { name: string }[];
  // --- ADD THIS SECTION ---
  sentiment?: {
    label: string;
    color: string;
    bg: string;
    icon: React.ReactNode;
  };
}