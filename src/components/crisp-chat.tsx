"use client"
import { useEffect } from "react"
import { Crisp } from 'crisp-sdk-web'
export const CrispChat = () => {
  useEffect(() => {
    Crisp.configure("3e3b1058-6f4d-4da3-83b2-b68217fd3b5d")
  }, [])


  return null
}