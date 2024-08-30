'use client'

import React, { useState, useEffect, startTransition } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Instagram, Mail, X, Heart, Camera } from "lucide-react"
import confetti from 'canvas-confetti'
import { submitForm } from "./actions"


export default function Home() {
  const [isContactFormVisible, setIsContactFormVisible] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const [easterEggActivated, setEasterEggActivated] = useState(false)
  const [easterEggClicks, setEasterEggClicks] = useState(0)

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768)
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  const toggleContactForm = () => {
    setIsContactFormVisible(!isContactFormVisible)
  }

  const handleSubmit = async (formData: FormData) => {
    startTransition(async () => {
      try {
        await submitForm(formData)
        setFormStatus('success')
      } catch (error) {
        setFormStatus('error')
      }
    })
  }

  const handleEasterEggClick = () => {
    setEasterEggClicks(prev => prev + 1)
    if (easterEggClicks === 4) { // Activate on 5th click
      setEasterEggActivated(true)
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      })
    }
  }

  const modalVariants = isMobile
    ? {
        initial: { y: "100%" },
        animate: { y: 0 },
        exit: { y: "100%" },
        transition: { type: "spring", damping: 25, stiffness: 500 }
      }
    : {
        initial: { opacity: 0, scale: 0.9 },
        animate: { opacity: 1, scale: 1 },
        exit: { opacity: 0, scale: 0.9 },
        transition: { duration: 0.3 }
      }

  return (
    <div className="min-h-screen bg-black text-white flex flex-col justify-between">
      {/* Header */}
      <header className="p-4 md:p-6 flex justify-between items-center">
        <h1 className="text-2xl font-light tracking-wider">ATILLA ALSAN</h1>
        <button
          onClick={handleEasterEggClick}
          className="text-gray-400 hover:text-white transition-colors"
          aria-label="Easter egg button"
        >
          <Camera size={24} />
        </button>
      </header>

      {/* Main Content */}
      <main className="flex-grow flex flex-col items-center justify-center p-4 space-y-8">
        {/* Featured Image */}
        <div className="w-full max-w-2xl aspect-[3/2] relative overflow-hidden">
          <img
            src="/placeholder.svg?height=800&width=1200"
            alt="Featured photograph"
            className="object-cover w-full h-full"
          />
          <AnimatePresence>
            {easterEggActivated && (
              <motion.div
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0 }}
                transition={{ duration: 0.5 }}
                className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-70"
              >
                <div className="text-center">
                  <Heart className="w-16 h-16 text-red-500 mx-auto mb-4" />
                  <p className="text-2xl font-light">I love you, sweetheart!</p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Minimal Navigation */}
        <nav className="flex space-x-4 text-sm font-light">
          <a href="#work" className="hover:underline">WORK</a>
          <a href="#about" className="hover:underline">ABOUT</a>
          <button onClick={toggleContactForm} className="hover:underline">CONTACT</button>
        </nav>
      </main>

      {/* Footer */}
      <footer className="p-4 md:p-6 flex justify-between items-center text-xs font-light">
        <p>© 2024 Atilla Alsan</p>
        <div className="flex space-x-4">
          <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="hover:text-gray-400 transition-colors">
            <Instagram size={18} />
          </a>
          <a href="mailto:alex@example.com" aria-label="Email" className="hover:text-gray-400 transition-colors">
            <Mail size={18} />
          </a>
        </div>
      </footer>

      {/* Contact Form Modal */}
      <AnimatePresence>
        {isContactFormVisible && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
            onClick={toggleContactForm}
          >
            <motion.div
              variants={modalVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              className="w-full max-w-2xl aspect-[3/2] bg-white text-black rounded-2xl overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="h-full flex flex-col">
                <div className="flex justify-between items-center p-4 border-b">
                  <h2 className="text-2xl font-light">GET IN TOUCH</h2>
                  <button 
                    onClick={toggleContactForm}
                    className="text-gray-600 hover:text-black transition-colors"
                    aria-label="Close contact form"
                  >
                    <X size={24} />
                  </button>
                </div>
                <form action={handleSubmit} className="flex-grow flex flex-col p-6 space-y-4">
                  <div className="space-y-1 flex-grow">
                    <label htmlFor="name" className="text-sm font-medium text-gray-700">Name</label>
                    <Input 
                      id="name"
                      type="text" 
                      placeholder="Your name" 
                      className="w-full border-gray-300 rounded-md shadow-sm focus:border-black focus:ring-black transition-colors"
                    />
                  </div>
                  <div className="space-y-1 flex-grow">
                    <label htmlFor="email" className="text-sm font-medium text-gray-700">Email</label>
                    <Input 
                      id="email"
                      type="email" 
                      placeholder="Your email" 
                      className="w-full border-gray-300 rounded-md shadow-sm focus:border-black focus:ring-black transition-colors"
                    />
                  </div>
                  <div className="space-y-1 flex-grow">
                    <label htmlFor="message" className="text-sm font-medium text-gray-700">Message</label>
                    <Textarea 
                      id="message"
                      placeholder="Your message" 
                      className="w-full h-full border-gray-300 rounded-md shadow-sm focus:border-black focus:ring-black transition-colors resize-none"
                    />
                  </div>
                  <Button type="submit" className="w-full bg-black text-white hover:bg-gray-800 transition-colors">
                    SEND
                  </Button>
                </form>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

function setFormStatus(arg0: string) {
  throw new Error('Function not implemented.')
}
