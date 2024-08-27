'use client'

import { useState, useRef, useEffect, useTransition } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Menu } from "lucide-react"
import { submitForm } from "./actions"

const useSmoothScroll = () => {
  const scrollTo = (elementId: string) => {
    const element = document.getElementById(elementId)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }
  return scrollTo
}

export default function Home() {
  const scrollTo = useSmoothScroll()
  const [activeSection, setActiveSection] = useState('')
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const aboutRef = useRef<HTMLElement>(null)
  const galleryRef = useRef<HTMLElement>(null)
  const contactRef = useRef<HTMLElement>(null)

  const [isPending, startTransition] = useTransition()
  const [formStatus, setFormStatus] = useState<'idle' | 'success' | 'error'>('idle')

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id)
          }
        })
      },
      { threshold: 0.5 }
    )

    if (aboutRef.current) observer.observe(aboutRef.current)
    if (galleryRef.current) observer.observe(galleryRef.current)
    if (contactRef.current) observer.observe(contactRef.current)

    return () => observer.disconnect()
  }, [])

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

  const handleNavClick = (section: string) => {
    scrollTo(section)
    setIsMenuOpen(false)
  }

  return (
    <div className="min-h-screen bg-[#F5F5F5] text-black border-8 border-black">
      {/* Header */}
      <header className="flex flex-col md:flex-row justify-between items-center p-4 bg-[#FFD700] border-b-8 border-black sticky top-0 z-50">
        <div className="flex justify-between items-center w-full md:w-auto">
          <h1 className="text-4xl font-bold">Atilla</h1>
          <button 
            className="md:hidden border-4 border-black p-2"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <Menu size={24} />
          </button>
        </div>
        <nav className={`${isMenuOpen ? 'block' : 'hidden'} md:block w-full md:w-auto mt-4 md:mt-0`}>
          <ul className="flex flex-col md:flex-row border-4 border-black">
            {['about', 'gallery', 'contact'].map((section) => (
              <li key={section} className="border-b-4 last:border-b-0 md:border-b-0 md:border-r-4 md:last:border-r-0 border-black">
                <button
                  onClick={() => handleNavClick(section)}
                  className={`w-full px-4 py-2 hover:bg-[#FF1493] hover:text-white ${
                    activeSection === section ? 'bg-[#FF1493] text-white' : ''
                  }`}
                >
                  {section.charAt(0).toUpperCase() + section.slice(1)}
                </button>
              </li>
            ))}
          </ul>
        </nav>
      </header>


      {/* About Section */}
      <section id="about" ref={aboutRef} className="py-16 px-4 md:px-8 bg-[#4B0082] text-white border-b-8 border-black">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center gap-8">
          <div className="md:w-1/2 space-y-6">
            <h3 className="text-4xl md:text-5xl font-bold inline-block border-4 border-white p-2">ABOUT ME</h3>
            <p className="text-lg md:text-xl border-l-4 border-[#FF1493] pl-4">
            Fullstack Developer. Microsoft tech specialist. I work with Azure, PowerApps, and C#.</p>
            <Button className="bg-[#FF1493] hover:bg-[#FF69B4] text-white font-bold py-2 px-4 text-lg border-4 border-white">
              View Portfolio
            </Button>
          </div>
          <div className="md:w-1/2 mt-8 md:mt-0">
            <div className="relative border-8 border-black bg-white p-4 transform rotate-3 hover:rotate-0 transition-transform duration-300">
              <div className="absolute inset-0 bg-black opacity-10"></div>
              <div className="relative">
                <Image
                  src="/placeholder.svg?height=600&width=600&text=Photographer"
                  alt="Photographer Portrait"
                  width={600}
                  height={600}
                  className="object-cover w-full h-full filter contrast-125 saturate-75"
                />
                <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMDAiIGhlaWdodD0iMzAwIj48ZmlsdGVyIGlkPSJhIiB4PSIwIiB5PSIwIj48ZmVUdXJidWxlbmNlIHR5cGU9ImZyYWN0YWxOb2lzZSIgYmFzZUZyZXF1ZW5jeT0iLjc1IiBzdGl0Y2hUaWxlcz0ic3RpdGNoIi8+PGZlQ29sb3JNYXRyaXggdHlwZT0ic2F0dXJhdGUiIHZhbHVlcz0iMCIvPjwvZmlsdGVyPjxyZWN0IHdpZHRoPSIzMDAiIGhlaWdodD0iMzAwIiBmaWx0ZXI9InVybCgjYSkiIG9wYWNpdHk9IjAuMDUiLz48L3N2Zz4=')] opacity-50"></div>
              </div>
              <div className="absolute top-0 left-0 w-4 h-4 border-t-4 border-l-4 border-black"></div>
              <div className="absolute top-0 right-0 w-4 h-4 border-t-4 border-r-4 border-black"></div>
              <div className="absolute bottom-0 left-0 w-4 h-4 border-b-4 border-l-4 border-black"></div>
              <div className="absolute bottom-0 right-0 w-4 h-4 border-b-4 border-r-4 border-black"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Gallery Preview */}
      <section id="gallery" ref={galleryRef} className="py-16 px-4 md:px-8 border-b-8 border-black">
        <h3 className="text-4xl md:text-5xl font-bold mb-8 text-center inline-block border-4 border-black p-2">GALLERY</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="relative overflow-hidden border-4 border-black">
              <Image
                src={`/placeholder.svg?height=400&width=600&text=Image${i}`}
                alt={`Gallery Image ${i}`}
                width={600}
                height={400}
                className="object-cover w-full h-full transform hover:scale-105 transition-transform duration-300"
              />
            </div>
          ))}
        </div>
        <div className="text-center mt-8">
          <Button className="bg-[#4B0082] hover:bg-[#6A0DAD] text-white font-bold py-2 px-4 text-lg border-4 border-black">
            View All
          </Button>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" ref={contactRef} className="py-16 px-4 md:px-8 bg-[#FFD700] border-b-8 border-black">
        <div className="max-w-4xl mx-auto">
          <h3 className="text-4xl md:text-5xl font-bold mb-8 inline-block border-4 border-black p-2">GET IN TOUCH</h3>
          <form action={handleSubmit} className="space-y-4">
            <input
              type="text"
              name="name"
              placeholder="Name"
              required
              className="w-full p-2 border-4 border-black"
            />
            <input
              type="email"
              name="email"
              placeholder="Email"
              required
              className="w-full p-2 border-4 border-black"
            />
            <textarea
              name="message"
              placeholder="Message"
              required
              rows={4}
              className="w-full p-2 border-4 border-black"
            ></textarea>
            <Button 
              type="submit"
              disabled={isPending}
              className="bg-[#FF1493] hover:bg-[#FF69B4] text-white font-bold py-2 px-4 text-lg w-full border-4 border-black disabled:opacity-50"
            >
              {isPending ? 'Sending...' : 'Send Message'}
            </Button>
          </form>
          {formStatus === 'success' && (
            <div className="mt-4 p-4 bg-green-500 text-white border-4 border-black">
              Thank you for your message! We will get back to you soon.
            </div>
          )}
          {formStatus === 'error' && (
            <div className="mt-4 p-4 bg-red-500 text-white border-4 border-black">
              Oops! Something went wrong. Please try again later.
            </div>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-black text-white py-8 px-4">
        <div className="max-w-4xl mx-auto flex flex-col md:flex-row justify-between items-center">
          <p className="mb-4 md:mb-0">&copy; 2024 Atilla Alsan</p>
          <div className="flex flex-col md:flex-row">
            <a href="https://x.com/alsan_atilla" className="hover:text-[#FFD700] px-4 py-2 border-4 border-white mb-2 md:mb-0 md:mr-2">Twitter</a>
            <a href="https://github.com/alsanatilla" className="hover:text-[#FFD700] px-4 py-2 border-4 border-white mb-2 md:mb-0 md:mr-2">Github</a>
          </div>
        </div>
      </footer>
    </div>
  )
}