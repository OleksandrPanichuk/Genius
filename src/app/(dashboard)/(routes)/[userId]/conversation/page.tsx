"use client"
import { BotAvatar, Button, Empty, Form, FormControl, FormField, FormItem, Heading, Loader, UserAvatar } from "@/components/ui";
import { Input } from "@nextui-org/input";
import { MessageSquare } from "lucide-react";
import { z } from "zod";
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { useState } from "react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib";
import { useProModal } from "@/hooks/use-pro-modal";
import axios from "axios";
import toast from "react-hot-toast";
import { useQuery } from "@tanstack/react-query";
import { getMessages } from "@/actions/getMessages";

const formSchema = z.object({
  prompt: z.string().min(1, {
    message: "Prompt is required."
  }),
});

export interface MessageProps {
  role: 'system' | 'user'
  content: string
}

const Conversation = ({ params }: { params: { userId: string } }) => {
  const router = useRouter();
  const proModal = useProModal();
  const [messages, setMessages] = useState<MessageProps[]>([]);


  useQuery({
    queryFn: async (): Promise<MessageProps[] | null> => {
      return await getMessages(params.userId)
    },
    queryKey: ['messages'],
    onSuccess: (data: MessageProps[] | null) => {
      if (data) {
        setMessages(data)
      }
    }
  })

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      prompt: ""
    }
  });

  const isLoading = form.formState.isSubmitting;

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const userMessage: MessageProps = { role: "user", content: values.prompt };
      const newMessages = [...messages, userMessage];

      const response = await axios.post('/api/conversation', { messages: newMessages, message: userMessage });
      setMessages((current) => [...current, userMessage, response.data]);

      form.reset();
    } catch (error: any) {
      if (error?.response?.status === 403) {
        proModal.onOpen();
      } else {
        toast.error("Something went wrong.");
      }
    } finally {
      router.refresh();
    }
  }
  return <div>
    <Heading title="Conversation"
      description="Our most advanced conversation model."
      icon={MessageSquare}
      iconColor="text-violet-500"
      bgColor="bg-violet-500/10" />
    <div className="px-4 lg:px-8">
      <div>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="
                rounded-lg 
                border 
                w-full 
                p-4 
                px-3 
                md:px-6 
                focus-within:shadow-sm
                grid
                grid-cols-12
                gap-2
              "
          >
            <FormField
              name="prompt"
              render={({ field }) => (
                <FormItem className="col-span-12 lg:col-span-10">
                  <FormControl className="m-0 p-0">
                    <Input
                      className="border-0 outline-none focus-visible:ring-0 focus-visible:ring-transparent"
                      disabled={isLoading}
                      placeholder="How do I calculate the radius of a circle?"
                      {...field}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            <Button className="col-span-12 lg:col-span-2 w-full" type="submit" disabled={isLoading} size="icon">
              Generate
            </Button>
          </form>
        </Form>
      </div>
      <div className="space-y-4 mt-4">
        {isLoading && (
          <div className="p-8 rounded-lg w-full flex items-center justify-center bg-muted">
            <Loader />
          </div>
        )}
        {messages.length === 0 && !isLoading && (
          <Empty label="No conversation started." />
        )}
        <div className="flex flex-col-reverse gap-y-4">
          {messages.map((message: any) => (
            <div
              key={message.content}
              className={cn(
                "py-4 px-8 w-full flex items-start gap-x-8 rounded-lg",
                message.role === "user" ? "bg-white border border-black/10" : "bg-muted",
              )}
            >
              {message.role === "user" ? <UserAvatar /> : <BotAvatar />}
              <p className="text-sm">
                {message.content}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  </div>;
};

export default Conversation;
