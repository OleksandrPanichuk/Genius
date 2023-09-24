'use client'

import { useState } from 'react'
import { FieldValues, SubmitHandler, useForm } from 'react-hook-form'
import { BsGithub, BsGoogle } from 'react-icons/bs'

import { Input } from '@nextui-org/input'
import { Button, Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui'
import { AuthSocialButton } from '@/components/screens/auth/auth-social-button'
import { signIn, SignInResponse } from 'next-auth/react'
import { usePathname, useRouter } from 'next/navigation'
import toast from 'react-hot-toast'
import { useMutation } from '@tanstack/react-query'
import axios, { AxiosError } from 'axios'
import { User } from '@prisma/client'
import { z } from 'zod'
import Link from 'next/link'
import { zodResolver } from '@hookform/resolvers/zod'


const signInSchema = z.object({
	email: z.string().email("Provided value is not a valid email address"),
	password: z.string().min(8, "Passowrd should be at least 8 characters long")
})
const signUpSchema = signInSchema.merge(z.object({
	name: z.string().min(1, "Username is too short")
}))


type Variant = 'LOGIN' | 'REGISTER'
export const AuthForm = () => {
	const router = useRouter()
	const pathname = usePathname()
	const variant = (pathname === '/sign-in' ? 'LOGIN' : 'REGISTER') as Variant
	const [isLoading, setIsLoading] = useState<boolean>(false)


	const form = useForm<FieldValues>({
		resolver: variant === 'LOGIN' ? zodResolver(signInSchema) : zodResolver(signUpSchema),
		defaultValues: {
			name: '',
			email: '',
			password: ''
		}
	})

	const { handleSubmit, control } = form

	const { mutateAsync: signUp } = useMutation({
		mutationFn: async (data: FieldValues) => {
			try {
				const { data: userData } = await axios.post('/api/register', data)
				userData.password = data.password
				return userData as User & { password: string }
			} catch (err) {
				throw err
			}
		},
		onSuccess: async (data: User & { password: string }) => {
			return await signIn('credentials', {
				email: data.email,
				password: data.password,
				redirect: false
			}).then(afterSignInAction)
		},
		onError: (error: AxiosError) => {
			if (error.response?.status === 409) {
				return toast.error('User Already Exist')
			}
			return toast.error('Something went wrong')
		}
	})

	const afterSignInAction = (callback: SignInResponse | undefined) => {
		if (callback?.error) {
			return toast.error('Invalid credentials!')
		}

		if (callback?.ok) {
			return router.push('/')
		}
	}
	const onSubmit: SubmitHandler<FieldValues> = async (data) => {
		setIsLoading(true)
		if (variant === 'REGISTER') {
			try {
				await signUp(data)
			} finally {
				setIsLoading(false)
			}
		}
		if (variant === 'LOGIN') {
			signIn('credentials', {
				...data,
				redirect: false
			})
				.then(afterSignInAction)
				.finally(() => setIsLoading(false))
		}
	}

	const socialAction = (action: string) => {
		setIsLoading(true)

		signIn(action, { redirect: false })
			.then(afterSignInAction)
			.finally(() => setIsLoading(false))
	}

	return (
		<div className={'mt-8 sm:mx-auto sm:w-full sm:max-w-md'}>
			<div className={'bg-white px-4 py-8 shadow sm:rounded-lg sm:px-10'}>
				<Form {...form}>
					<form onSubmit={handleSubmit(onSubmit)} className={'space-y-6'}>
						{variant === 'REGISTER' && (
							<FormField control={control} name='name' render={({ field }) => (
								<FormItem>
									<FormControl>
										<Input {...field} placeholder='Username' disabled={isLoading} />
									</FormControl>
									<FormMessage />
								</FormItem>
							)} />
						)}
						<FormField control={control} name='email' render={({ field }) => (
							<FormItem>
								<FormControl>
									<Input {...field} placeholder='Email' type='email' disabled={isLoading} />
								</FormControl>
								<FormMessage />
							</FormItem>
						)} />
						<FormField control={control} name='password' render={({ field }) => (
							<FormItem>
								<FormControl>
									<Input {...field} placeholder='Password' type='password' disabled={isLoading} />
								</FormControl>
								<FormMessage />
							</FormItem>
						)} />
						<div>
							<Button disabled={isLoading} className='w-full' type="submit">
								{variant === 'LOGIN' ? 'Sign in' : 'Register'}
							</Button>
						</div>
					</form>
				</Form>

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
							onClick={() => socialAction('github')}
						/>
						<AuthSocialButton
							icon={BsGoogle}
							onClick={() => socialAction('google')}
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
						{variant === 'LOGIN'
							? 'New to Messenger?'
							: 'Already have an account?'}
					</div>
					{variant === 'LOGIN' && (
						<Link className="underline cursor-pointer" href='/sign-up'>
							 Create an account
						</Link>
					)}
					{variant === 'REGISTER' && (
						<Link className="underline cursor-pointer" href='/sign-in'>
							 Login
						</Link>
					)}
				</div>
			</div>
		</div>
	)
}

