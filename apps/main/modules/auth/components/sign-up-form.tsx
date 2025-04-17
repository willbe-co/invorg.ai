"use client"

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AlertCircle, Loader2 } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { signIn, signUp } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { cn } from "@/lib/utils";

const formSchema = z.object({
  name: z.string().min(1, "Name required"),
  email: z.string().email("Please insert a valid email"),
  password: z.string().min(9, "Password too short, 9 chars minimun"),
  repeatPassword: z.string()
}).refine((data) => data.password === data.repeatPassword, {
  message: "Passwords don't match",
  path: ["repeatPassword"]
})

type FormValues = z.infer<typeof formSchema>

export const SignUpForm = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      repeatPassword: ""
    }
  })

  const onSubmit = async (values: FormValues) => {
    const { name, email, password } = values

    await signUp.email({
      email,
      password,
      name,
      callbackURL: "/dashboard",
      fetchOptions: {
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
          toast.success("Success", { description: "Account created successfully" })
          router.push("/dashboard")
        }
      },
    });
  }


  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className={cn(
        "grid gap-6",
      )}>
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input type="text" placeholder="John Doe" {...field} />
              </FormControl>
              <FormDescription>
                Tell us your name
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
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
        <div className="flex gap-3 w-full items-start">
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem className="flex-1">
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input type="password" placeholder="your password" {...field} />
                </FormControl>
                <FormDescription>
                  Choose a password
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="repeatPassword"
            render={({ field }) => (
              <FormItem className="flex-1">
                <FormLabel>Repeat password</FormLabel>
                <FormControl>
                  <Input type="password" placeholder="confirm password" {...field} />
                </FormControl>
                <FormDescription>
                  Confirm password
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
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
            "Sign up"
          )}
        </Button>
      </form>
    </Form>
  )
}
