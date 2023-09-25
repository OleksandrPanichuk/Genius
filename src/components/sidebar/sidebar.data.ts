import * as LucideReact from "lucide-react";

import * as Bi from 'react-icons/bi'



export const routes = [
  {
    label: 'Dashboard',
    icon: LucideReact.LayoutDashboard,
    href: '/dashboard',
    color: "text-sky-500"
  },
  {
    label: 'Conversation',
    icon: Bi.BiMessage,
    href: '/conversation',
    color: "text-violet-500",
  },
  {
    label: 'Music Generation',
    icon: LucideReact.Music,
    href: '/music',
    color: "text-emerald-500",
  },
  {
    label: 'Text To Speech',
    icon: Bi.BiMicrophone,
    href: "/spikify",
    color: 'text-sky-500'
  },
  {
    label: 'Image Generation',
    icon: LucideReact.ImageIcon,
    color: "text-pink-700",
    href: '/image',
  },
  {
    label: 'Video Generation',
    icon: LucideReact.VideoIcon,
    color: "text-orange-700",
    href: '/video',
  },
  {
    label: 'Code Generation',
    icon: LucideReact.Code,
    color: "text-green-700",
    href: '/code',
  },
  {
    label: 'Settings',
    icon: LucideReact.Settings,
    href: '/settings',
  },
];