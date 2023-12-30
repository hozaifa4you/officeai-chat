"use client";
import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { MessageCircleMore, Send, X } from "lucide-react";
import { useForm } from "react-hook-form";

import { Button } from "../ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";
import { Form } from "../ui/form";
import { Input } from "../ui/input";

export interface MessagesType {
  message: string;
  senderId: string;
  receiverId: string;
}

const FormSchema = z.object({
  message: z.string().min(2, {
    message: "Username must be at least 2 characters.",
  }),
});

const ChatWidget = () => {
  const [isDisplay, setIsDisplay] = useState<boolean>(false);
  const [messages, setMessages] = useState<MessagesType[]>([]);
  const user = { id: "1" };

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      message: "",
    },
  });

  function onSubmit(data: z.infer<typeof FormSchema>) {
    console.log(data);

    setMessages((prevMsg) => [
      ...prevMsg,
      {
        message: data.message,
        receiverId: crypto.randomUUID(),
        senderId: user?.id as string,
      },
    ]);

    form.reset();
  }

  if (isDisplay)
    return (
      <div className="w-[320px] h-[400px] bg-white rounded-sm fixed right-5 bottom-5 shadow-md">
        <div className="w-full h-full relative">
          {/* TODO: header */}
          <div className="flex justify-between bg-blue-600 rounded-ss-xl rounded-se-xl">
            <div className="px-3 py-4">
              <h2 className="text-xl font-semibold text-white">
                Chat with OfficeAI
              </h2>
              <p className="text-xs text-white">
                Fill the form and start with OfficeAI.
              </p>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsDisplay(false)}
              className="rounded-md w-7 h-7 hover:bg-transparent"
            >
              <X className="w-5 h-5 text-white" />
            </Button>
          </div>
          {/* TODO: message body */}
          <div className="p-1">
            {messages.map(({ message, receiverId, senderId }, index) => (
              <p
                key={index}
                className={`mb-1 ${
                  senderId === user?.id ? "text-right" : "text-left"
                }`}
              >
                <span
                  className={`text-sm rounded-sm px-2 py-1 font-light ${
                    senderId === user?.id
                      ? "text-right bg-indigo-100"
                      : "text-left bg-[whitesmoke]"
                  }`}
                >
                  {message}
                </span>
              </p>
            ))}
          </div>
          <div className="absolute bottom-0 left-0 right-0">
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="flex w-full items-center"
              >
                <div className="flex w-full max-w-sm items-center">
                  <Input
                    className="focus:outline-none focus-visible:ring-0 h-8 rounded-none"
                    type="text"
                    placeholder="Enter text here"
                    {...form.register("message", { required: true })}
                  />
                  <Button
                    size="icon"
                    type="submit"
                    className="h-8 w-8 rounded-none"
                  >
                    <Send className="w-5 h-5" />
                  </Button>
                </div>
              </form>
            </Form>
          </div>
        </div>
      </div>
    );

  if (!isDisplay)
    return (
      <div className="fixed top-[85vh] right-2">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                className="text-blue-600 shadow-lg w-12 h-12"
                onClick={() => setIsDisplay(true)}
              >
                <MessageCircleMore className="h-8 w-8" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Chat with OfficeAI</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
    );
};

export default ChatWidget;
