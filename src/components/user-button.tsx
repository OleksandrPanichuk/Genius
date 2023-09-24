"use client"
import { Popover, PopoverContent, PopoverTrigger } from '@nextui-org/popover'
import { Avatar } from '@nextui-org/avatar'
import { LogOut } from "lucide-react";
import { signOut, useSession } from "next-auth/react";
import { Divider } from '@nextui-org/divider';


export const UserButton = () => {
  const { data: session } = useSession()
  return <Popover>
    <PopoverTrigger>
      <Avatar src={session?.user?.image ?? undefined} name={session?.user?.name ?? 'A'} />
    </PopoverTrigger>
    <PopoverContent className='py-2 space-y-2'>
      <div className=''>
        <h2 className='text-lg text-zinc-800 font-bold'>{session?.user?.name}</h2>
        <p className='text-sm text-zinc-500'>{session?.user?.email}</p>
      </div>
      <Divider />
      <button className='text-base px-3 py-2 rounded-md text-zinc-700 flex  w-full items-center gap-x-1 hover:bg-zinc-50 hover:shadow-md transition-all' onClick={() => signOut()}>
        <LogOut className='w-4 h-4' />
        Log Out
      </button>
    </PopoverContent>
  </Popover>;
};
