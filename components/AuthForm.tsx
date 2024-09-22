"use client";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { ITEMS } from "@/constants";
import { authForFormSchema } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { Divide, Lasso, Loader2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import CustomInput from "./CustomInput";
import { useRouter } from "next/navigation";
import { signIn, signUp } from "@/lib/actions/user.actions";

const AuthForm = ({ type }: { type: string }) => {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  // const loggedInUser = await getLoggedInUser();

  const formSchema = authForFormSchema(type);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    setIsLoading(true);
    
    try {
      // Sign up with Appwrite & create plaid

      if (type === 'sign-up') { 
        const newUser = await signUp(data);

        setUser(newUser);
      }

      if (type === 'sign-in') {
        const response = await signIn({
          email: data.email,
          password: data.password
        });

        if (response) {
          router.push('/');
        }
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }

    setIsLoading(false);
  }

  return (
    <section className="auth-form">
      <header className="flex flex-col gap-5 md:gap-8">
        <Link href="/" className="cursor-pointer flex items-center gap-1">
          <Image
            src="/icons/logo.svg"
            width={34}
            height={34}
            alt="Horizon logo"
          />
          <h1 className="text-26 font-bold text-black-1 font-ibm-plex-serif ">
            Horizon
          </h1>
        </Link>

        <div className="flex flex-col gap-1 md:gap-3">
          <h1 className="text-24 lg:text-36 font-semibold text-gray-900">
            {user ? "Link Account" : type === "sign-in" ? "Sign In" : "Sign Up"}
            <p className="text-16 font-normal text-gray-600">
              {user
                ? "Link your account to get started"
                : "Please enter your details"}
            </p>
          </h1>
        </div>
      </header>
      {user ? (
        <div className="flex flex-col gap-4"></div>
      ) : (
        <>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              {type === "sign-up" ? (
                <>
                  <div className="flex gap-4">
                    <CustomInput
                      control={form.control}
                      name="firstName"
                      type="text"
                      label="First Name"
                      placeholder="John"
                    />
                    <CustomInput
                      control={form.control}
                      name="lastName"
                      type="text"
                      label="Last Name"
                      placeholder="Doe"
                    />
                  </div>
                  <CustomInput
                    control={form.control}
                    type="text"
                    placeholder="Enter your specific address"
                    name="address"
                    label="Address"
                    />
                  <CustomInput
                    control={form.control}
                    type="text"
                    placeholder="Enter your city"
                    name="city"
                    label="City"
                    />
                    <div className="flex gap-4">
                    <CustomInput
                      control={form.control}
                      name="state"
                      type="text"
                      label="State"
                      placeholder="ex: NY"
                    />
                    <CustomInput
                      control={form.control}
                      name="code"
                      type="text"
                      label="Postal Code"
                      placeholder="ex: 11101"
                    />
                  </div>
                    <div className="flex gap-4">
                    <CustomInput
                      control={form.control}
                      name="dateofbirth"
                      type="text"
                      label="Date of Birth"
                      placeholder="yyyy-mm-dd"
                    />
                    <CustomInput
                      control={form.control}
                      name="ssn"
                      type="text"
                      label="SSN"
                      placeholder="ex: 1234"
                    />
                    </div>
                    <CustomInput
                    control={form.control}
                    type="text"
                    placeholder="Enter your email"
                    name="email"
                    label="Email"
                  />

                  <CustomInput
                    control={form.control}
                    type="password"
                    placeholder="Enter your password"
                    name="password"
                    label="Password"
                  />
                </>
              ) : (
                <>
                  <CustomInput
                    control={form.control}
                    type="text"
                    placeholder="Enter your email"
                    name="email"
                    label="Email"
                  />

                  <CustomInput
                    control={form.control}
                    type="password"
                    placeholder="Enter your password"
                    name="password"
                    label="Password"
                  />
                </>
              )}

              <div className="flex flex-col gap-4">
                <Button type="submit" disabled={isLoading} className="form-btn">
                  {isLoading ? (
                    <>
                      <Loader2 size={20} className="animate-spin" /> &nbsp;
                      Loading...
                    </>
                  ) : type === "sign-in" ? (
                    "Sign In"
                  ) : (
                    "Sign Up"
                  )}
                </Button>
              </div>
            </form>
          </Form>

          <footer className="flex justify-center gap-1">
            <p className="text-14 font-normal text-gray-600">
              {type === "sign-in"
                ? "Don't have an account?"
                : "Already have an account?"}
            </p>

            <Link
              href={type === "sign-in" ? "/sign-up" : "/sign-in"}
              className="form-link"
            >
              {type === "sign-in" ? "Sign Up" : "Sign In"}
            </Link>
          </footer>
        </>
      )}
    </section>
  );
};

export default AuthForm;
