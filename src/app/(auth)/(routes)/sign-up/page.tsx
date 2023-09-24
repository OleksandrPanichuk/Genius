import Image from 'next/image'
import {AuthForm} from '@/components/screens/auth/auth-form'
import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'

export default async function SignUp() {
	const session = await getServerSession()
	if (session?.user) {
		return redirect('/')
	}
	return (
		<div
			className={
				'flex min-h-screen flex-col justify-center py-12 sm:px-6 lg:px-8 bg-gray-100'
			}
		>
			<div className={'sm:mx-auto sm:w-full sm:max-w-md'}>
				<Image
					src={'/logo.png'}
					alt={'Logo'}
					height={48}
					width={48}
					className={'mx-auto w-auto'}
				/>
				<h2
					className={
						'mt-6 text-center text-3xl font-bold tracking-tight text-gray-900'
					}
				>
          Create an account
				</h2>
			</div>
			<AuthForm />
		</div>
	)
}