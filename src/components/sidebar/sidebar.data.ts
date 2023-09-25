import * as LucideReact from "lucide-react";

import * as Bi from 'react-icons/bi'



export const routes = [
  {
    label: 'Conversation',
    icon: Bi.BiMessage,
    href: '/conversation',
    color: "text-violet-500",
    bgColor: "bg-violet-500/10",
  },
  {
    label: 'Music Generation',
    icon: LucideReact.Music,
    href: '/music',
    color: "text-emerald-500",
    bgColor: "bg-emerald-500/10",
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
    bgColor: "bg-pink-700/10",
    href: '/image',
  },
  {
    label: 'Video Generation',
    icon: LucideReact.VideoIcon,
    color: "text-orange-700",
    bgColor: "bg-orange-700/10",
    href: '/video',
  },
  {
    label: 'Code Generation',
    icon: LucideReact.Code,
    color: "text-green-700",
    bgColor: "bg-green-700/10",
    href: '/code',
  },
];