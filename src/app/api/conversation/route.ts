import { NextResponse } from "next/server";


import { incrementApiLimit, checkApiLimit, checkSubscription, db } from "@/lib";
import { getServerSession } from 'next-auth';
import Replicate from "replicate";

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN!,
});







export async function POST(
  req: Request
) {
  try {
    const session = await getServerSession();
    const body = await req.json();
    const { messages, message } = body;

    if (!session?.user?.email) {
      return new NextResponse("Unauthorized", { status: 401 });
    }


    const user = await db.user.findUnique({
      where: {
        email: session.user.email
      }
    })
    if (!user) {
      return new NextResponse("User not found", { status: 404 });
    }


    if (!messages) {
      return new NextResponse("Messages are required", { status: 400 });
    }

    const freeTrial = await checkApiLimit();
    const isPro = await checkSubscription();

    if (!freeTrial && !isPro) {
      return new NextResponse("Free trial has expired. Please upgrade to pro.", { status: 403 });
    }

    const output: any = await replicate.run(
      "meta/llama-2-13b-chat:f4e2de70d66816a838a89eeeb621910adffb0dd0baba3976c96980970978018d",
      {
        input: {
          prompt: JSON.stringify(["Answer only on the last message with role=user. Do not repeat your previous answers ", messages])
        }
      }
    );

    if (!isPro) {
      await incrementApiLimit();
    }

    return NextResponse.json({
      role: 'system',
      content: output.join('')
    });
  } catch (error) {
    console.log('[CODE_ERROR]', error);
    return new NextResponse("Internal Error", { status: 500 });
  }
};