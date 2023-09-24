"use client"
import { Avatar } from "@nextui-org/avatar";
import { useSession } from "next-auth/react";

export const UserAvatar = () => {
  const { data: session } = useSession()

  return (
    <Avatar className="h-8 w-8" src={session?.user?.image ?? undefined} />
  );
};