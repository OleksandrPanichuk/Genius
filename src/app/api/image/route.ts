
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";


import { incrementApiLimit, checkApiLimit, checkSubscription } from "@/lib";
import Replicate from "replicate";



const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN!,
});

export async function POST(
  req: Request
) {
  try {
    const session = await getServerSession()
    const body = await req.json();
    const { prompt, amount = 1, resolution = "512x512" } = body;

    if (!session?.user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }



    if (!prompt) {
      return new NextResponse("Prompt is required", { status: 400 });
    }

    if (!amount) {
      return new NextResponse("Amount is required", { status: 400 });
    }

    if (!resolution) {
      return new NextResponse("Resolution is required", { status: 400 });
    }

    const freeTrial = await checkApiLimit();
    const isPro = await checkSubscription();

    if (!freeTrial && !isPro) {
      return new NextResponse("Free trial has expired. Please upgrade to pro.", { status: 403 });
    }


    const params = resolution.split('x')

    const response = await replicate.run(
      "stability-ai/stable-diffusion:ac732df83cea7fff18b8472768c88ad041fa750ff7682a21affe81863cbe77e4",
      {
        input: {
          prompt,
          width: parseInt(params[0], 10),
          height: parseInt(params[1], 10),
          num_outputs: parseInt(amount, 10)
        }
      }
    );

    if (!isPro) {
      await incrementApiLimit();
    }

    return NextResponse.json(response);
  } catch (error) {
    console.log('[IMAGE_ERROR]', error);
    return new NextResponse("Internal Error", { status: 500 });
  }
};