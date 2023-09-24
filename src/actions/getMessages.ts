"use server"

import { db } from "@/lib"


type MessageProps = {
  content: string
  role: "user" | "system"
}

export const getMessages = async (userId: string): Promise<MessageProps[] | null> => {
  console.log(1)
  if (!userId) return null
  try {
    const messages = await db.message.findMany({
      where: {
        userId
      }
    })

    return messages.map(message => ({
      content: message.content.replace(/^"|"$/g, ''),
      role: message.role
    }))
  } catch (err) {
    console.log(err)
    return null
  }
}