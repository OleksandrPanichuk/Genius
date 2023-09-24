import { UserButton } from "@/components/user-button";
import { MobileSidebar } from "@/components/sidebar/sidebar-mobile";
import { checkSubscription, getApiLimitCount } from "@/lib";

export const Navbar = async () => {
  const apiLimitCount = await getApiLimitCount();
  const isPro = await checkSubscription();
  return <nav className="flex items-center p-4">
    <MobileSidebar isPro={isPro} apiLimitCount={apiLimitCount} />
    <div className="flex w-full justify-end">
      <UserButton />
    </div>
  </nav>;
};
