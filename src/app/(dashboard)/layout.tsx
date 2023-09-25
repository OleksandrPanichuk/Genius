import { Navbar } from "@/components/navbar";
import { Sidebar } from "@/components/sidebar/sidebar";
import { checkSubscription, db, getApiLimitCount } from "@/lib";
import { getServerSession } from 'next-auth';
import { User } from '@prisma/client';
import { CrispProvider } from "@/components/providers/crisp-provider";

const DashboardLayout = async ({ children }: React.PropsWithChildren) => {
  const apiLimitCount = await getApiLimitCount();
  const isPro = await checkSubscription();

  const session = await getServerSession()
  let user: User | null = null

  try {
    if (session?.user?.email) {
      user = await db.user.findUnique({
        where: {
          email: session?.user?.email
        }
      })
    }
  } catch (err) {
    console.error(err)
  }



  return <>
    <CrispProvider />
    <div className="relative h-full">
      <div className="hidden h-full md:flex  md:w-72 md:flex-col md:fixed md:inset-y-0 bg-gray-900">
        <Sidebar user={user} isPro={isPro} apiLimitCount={apiLimitCount} />
      </div>
      <main className="md:pl-72 pb-10">
        <Navbar user={user} />
        {children}
      </main>
    </div></>;
};

export default DashboardLayout;
