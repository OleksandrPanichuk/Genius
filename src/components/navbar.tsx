import { UserButton } from "@/components/user-button";
import { MobileSidebar } from "@/components/sidebar/sidebar-mobile";
import { checkSubscription, getApiLimitCount } from "@/lib";
import { User } from '@prisma/client';

export const Navbar = async ({user}: {user: User | null}) => {
  const apiLimitCount = await getApiLimitCount();
  const isPro = await checkSubscription();
  return <nav className="flex items-center p-4">
    <MobileSidebar user={user} isPro={isPro} apiLimitCount={apiLimitCount} />
    <div className="flex w-full justify-end">
      <UserButton />
    </div>
  </nav>;
};
