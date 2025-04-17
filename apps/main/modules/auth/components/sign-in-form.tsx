"use client"

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AlertCircle, Loader2 } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { signIn } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { cn } from "@/lib/utils";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

const formSchema = z.object({
  email: z.string().email("Please insert a valid email"),
  password: z.string().min(9, "Password too short, 9 chars minimun")
})

type FormValues = z.infer<typeof formSchema>

export const SignInForm = () => {
  const router = useRouter()

  const [loading, setLoading] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: ""
    }
  })

  const onSubmit = async (values: FormValues) => {
    const { email, password } = values

    await signIn.email(
      {
        email,
        password
      },
      {
        onRequest: () => {
          setLoading(true);
        },
        onResponse: () => {
          setLoading(false);
        },
        onError: ({ response }) => {
          toast.error("Erro", { description: <div>{response.status} - {response.statusText}</div> })
          form.setError("root", { message: `${response.status} - ${response.statusText}` })
        },
        onSuccess: () => {
          toast.success("Success", { description: "Email and password correct, welcome back." })
          router.push("/dashboard")
        }
      },
    );
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className={cn(
        "grid gap-6",
      )}>
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input type="email" placeholder="johndoe@email.com" {...field} />
              </FormControl>
              <FormDescription>
                This is your account email
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <div className="flex items-center">
                <FormLabel>Password</FormLabel>
                <Link
                  href="#"
                  className="ml-auto inline-block text-sm underline"
                >
                  Forgot your password?
                </Link>
              </div>
              <FormControl>
                <Input type="password" placeholder="your password" {...field} />
              </FormControl>
              <FormDescription>
                Your account password
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        {form.formState.errors.root &&
          <Alert variant="destructive" className="bg-red-800/20 border-red-900 ">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Authentication error</AlertTitle>
            <AlertDescription>
              {form.formState.errors.root.message}
            </AlertDescription>
          </Alert>}
        <Button type="submit" disabled={loading}>
          {loading ? (
            <Loader2 size={16} className="animate-spin" />
          ) : (
            "Login"
          )}
        </Button>
      </form>
    </Form>
  )
}
