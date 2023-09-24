"use client"
import { NextUIProvider as NextUIRootProvider } from '@nextui-org/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { SessionProvider } from 'next-auth/react'
import { Toaster } from 'react-hot-toast'
import { ModalProvider } from './modal-provider'

const client = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false
    }
  }
})

export const Provider = ({ children }: React.PropsWithChildren) => {
  return <QueryClientProvider client={client}>
    <SessionProvider>
      <NextUIRootProvider>
        <Toaster />
        <ModalProvider />
        {children}
      </NextUIRootProvider>
    </SessionProvider>
  </QueryClientProvider>

}