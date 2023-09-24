import Replicate from 'replicate'
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";


import { incrementApiLimit, checkApiLimit, checkSubscription } from "@/lib";

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN!,
});



export async function POST(
  req: Request
) {
  try {
    const session = await getServerSession()

    const body = await req.json();
    const { message, language } = body;

    if (!session?.user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    if (!message) {
      return new NextResponse("Message is required", { status: 400 });
    }

    const freeTrial = await checkApiLimit();
    const isPro = await checkSubscription();

    if (!freeTrial && !isPro) {
      return new NextResponse("Free trial has expired. Please upgrade to pro.", { status: 403 });
    }

    const response = await replicate.run(
      "sigil-wen/xtts:408deaff0c9ba77846ce43a9b797fa9d08ce1a70830ad74c0774c55fd3aabce5",
      {
        input: {
          text: message,
          language: language,
          speaker_wav: 'https://replicate.delivery/pbxt/JYDf6xQfT7cOYljjNXbXxgauFQ1ZXJZf5GLNsth7FhsMU7IO/yosun-voice-acting.wav'
        }
      }
    );

    console.log(response)

    if (!isPro) {
      await incrementApiLimit();
    }

    return NextResponse.json(response);
  } catch (error) {
    console.log('[MUSIC_ERROR]', error);
    return new NextResponse("Internal Error", { status: 500 });
  }
};