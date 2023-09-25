"use server"
import { db } from "@/lib";
import { MAX_FREE_COUNTS } from "@/constants";
import { getServerSession } from "next-auth";

export const incrementApiLimit = async () => {
  const session = await getServerSession();

  if (!session?.user?.email) {
    return;
  }

  const userApiLimit = await db.user.findUnique({
    where: { email: session.user.email },
  });

  if (userApiLimit) {
    await db.user.update({
      where: { email: session.user.email },
      data: { count: userApiLimit.count + 1 },
    });
  } else {
    await db.user.create({
      data: { email: session?.user?.email, count: 1 },
    });
  }
};

export const checkApiLimit = async () => {
  const session = await getServerSession()

  if (!session?.user?.email) {
    return false;
  }

  const userApiLimit = await db.user.findUnique({
    where: { email: session.user.email },
  });

  if (!userApiLimit || userApiLimit.count < MAX_FREE_COUNTS) {
    return true;
  } else {
    return false;
  }
};

export const getApiLimitCount = async () => {
  try {
    const session = await getServerSession()


    if (!session?.user?.email) {
      return 0;
    }

    const userApiLimit = await db.user.findUnique({
      where: {
        email: session.user.email
      }
    });

    if (!userApiLimit) {
      return 0;
    }

    return userApiLimit.count;
  } catch (err) {
    console.log(err)
    return 0
  }
}