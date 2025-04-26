import React from 'react';

// Define Tool type including optional badge
export type Tool = {
  id: string;
  title: string;
  description: string;
  icon: React.ElementType;
  href: string;
  badge?: "Coming Soon" | "Coming Next" | "Featured";
  status?: "active" | "coming_soon";
}; 