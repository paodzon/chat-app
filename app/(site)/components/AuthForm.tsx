"use client";

import axios from "axios";
import Button from "@/components/Button";
import Input from "@/components/input/Input";
import { useState, useCallback, useEffect } from "react";
import { useForm, FieldValues, SubmitHandler } from "react-hook-form";
import AuthSocialButton from "./AuthSocialButton";
import { BsGithub, BsGoogle } from "react-icons/bs";
import { ToastContainer, toast } from 'react-toastify';
import { signIn, useSession } from 'next-auth/react';
import { useRouter } from "next/navigation";


enum AuthUser {
  LOGIN,
  REGISTER,
}
type Variant = AuthUser.LOGIN | AuthUser.REGISTER;

const AuthForm = () => {
  const [variant, setVariant] = useState<Variant>(AuthUser.LOGIN);
  const [isLoading, setIsLoading] = useState(false);
  const session = useSession();
  const router = useRouter();

  const toggleVariant = useCallback(() => {
    if (variant === AuthUser.LOGIN) {
      setVariant(AuthUser.REGISTER);
    } else {
      setVariant(AuthUser.LOGIN);
    }
  }, [variant]);

  useEffect(() =>{
    if(session.status === 'authenticated'){
      router.push('/users')
    }
  }, [session?.status, router])

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FieldValues>({
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  });



  const onSubmit: SubmitHandler<FieldValues> = async (data) => {
    setIsLoading(true);
  
    if (variant === AuthUser.REGISTER) {

      try{
        const response = await axios.post("/api/register", data);
        signIn('credentials', data);
        toast.success('Registration success', {
          position: "top-center",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "dark",
          });
        return response;
      }catch(error){
        toast.error('Something went wrong', {
          position: "top-center",
          theme: "dark",
          });
        return error
      }finally{
        setIsLoading(false);
      }
    }
    if (variant === AuthUser.LOGIN) {
      signIn('credentials', {...data, redirect:false}).then((callback) => {
        if(callback?.error){
          toast.error('Invalid credentials', {
            position: "top-center",
            theme: "dark",
          });
        }
        if(callback?.ok && !callback?.error){
          router.push('/users');
          toast.success('Login Success', {position:"top-center", theme:"dark"});
        }
      }).finally(() => setIsLoading(false));
    }
  };

  const socialAction = (action: string) => {
    setIsLoading(true);
    
    signIn(action, {redirect:false}).then((callback) => {
      if(callback?.error){
        toast.error('Something went wrong', {
          position: "top-center",
          theme: "dark",
        });
      }
      if(callback?.ok && !callback?.error){
        router.push('/users');
        toast.success('Login Success', {position:"top-center", theme:"dark"});
      }
    }).finally(() => setIsLoading(false));
  };

  return (
    <div className="mt-8 sm: mx-auto sm:w-full sm:max-w-md">
      <div className="bg-white px-4 py-8 shadow sm:rounded-lg sm:px-10">
        <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
          {variant === AuthUser.REGISTER && (
            <Input
              id={"name"}
              label="Name"
              register={register}
              errors={errors}
              disabled={isLoading}
            />
          )}
          <Input
            id={"email"}
            label="Email"
            type="email"
            register={register}
            errors={errors}
            disabled={isLoading}
          />
          <Input
            id={"password"}
            label="Password"
            type="password"
            register={register}
            errors={errors}
            disabled={isLoading}
          />
          <div>
            <Button disabled={isLoading} fullWidth={true} type="submit">
              {variant === AuthUser.LOGIN ? "Sign In" : "Register"}
            </Button>
          </div>
        </form>

        <div className="mt-6">
          <div className="relative">
            <div
              className="
                absolute 
                inset-0 
                flex 
                items-center
              "
            >
              <div className="w-full border-t border-gray-300" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="bg-white px-2 text-gray-500">
                Or continue with
              </span>
            </div>
          </div>

          <div className="mt-6 flex gap-2">
            <AuthSocialButton
              icon={BsGithub}
              onClick={() => socialAction("github")}
            />
            <AuthSocialButton
              icon={BsGoogle}
              onClick={() => socialAction("google")}
            />
          </div>
        </div>
        <div
          className="
            flex 
            gap-2 
            justify-center 
            text-sm 
            mt-6 
            px-2 
            text-gray-500
          "
        >
          <div>
            {variant === AuthUser.LOGIN
              ? "New to Messenger?"
              : "Already have an account?"}
          </div>
          <div onClick={toggleVariant} className="underline cursor-pointer">
            {variant === AuthUser.LOGIN ? "Create an account" : "Login"}
          </div>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
};

export default AuthForm;
