import { db } from "@/lib";
import { getServerSession } from "next-auth";

const DAY_IN_MS = 86_400_000;

export const checkSubscription = async () => {
  try {
    const session = await getServerSession()

    if (!session?.user?.email) {
      return false;
    }

    const user = await db.user.findUnique({
      where: {
        email: session.user.email
      }
    })
    if (!user) return false

    const userSubscription = await db.userSubscription.findUnique({
      where: {
        userId: user.id
      },
      select: {
        stripeSubscriptionId: true,
        stripeCurrentPeriodEnd: true,
        stripeCustomerId: true,
        stripePriceId: true,
      },
    })

    if (!userSubscription) {
      return false;
    }

    const isValid =
      userSubscription.stripePriceId &&
      userSubscription.stripeCurrentPeriodEnd?.getTime()! + DAY_IN_MS > Date.now()

    return !!isValid;
  } catch (err) {
    console.log(err)
    return false
  }
};