import { Navbar } from "@/components/navbar";
import { Sidebar } from "@/components/sidebar/sidebar";
import { checkSubscription, getApiLimitCount } from "@/lib";
import { CrispProvider } from "@/components/providers/crisp-provider";

const DashboardLayout = async ({ children }: React.PropsWithChildren) => {
  const apiLimitCount = await getApiLimitCount();
  const isPro = await checkSubscription();

  

  return <>
    <CrispProvider />
    <div className="relative h-full">
      <div className="hidden h-full md:flex  md:w-72 md:flex-col md:fixed md:inset-y-0 bg-gray-900">
        <Sidebar  isPro={isPro} apiLimitCount={apiLimitCount} />
      </div>
      <main className="md:pl-72 pb-10">
        <Navbar />
        {children}
      </main>
    </div></>;
};

export default DashboardLayout;
