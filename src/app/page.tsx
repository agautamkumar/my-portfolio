'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { ThemeToggle } from '@/components/theme-toggle'
import { 
  Brain, 
  Code2, 
  Database, 
  Server, 
  Cloud, 
  Layers, 
  Zap,
  Mail,
  Github,
  Linkedin,
  Twitter,
  ExternalLink,
  Terminal,
  Cpu,
  Globe,
  Sparkles,
  ArrowRight,
  Send,
  Menu,
  X,
  Award,
  GraduationCap,
  Users,
  Rocket,
  Chrome,
  Tv,
  Inbox,
  Eye,
  Calendar,
  User,
  Lock,
  Trash2
} from 'lucide-react'

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { ScrollArea } from '@/components/ui/scroll-area'

// Types for contact messages
interface ContactMessage {
  id: string
  name: string
  email: string
  message: string
  read: boolean
  createdAt: string
}

// Admin Modal Component with Password Protection
function AdminModal({ open, onOpenChange }: { open: boolean; onOpenChange: (open: boolean) => void }) {
  const [messages, setMessages] = useState<ContactMessage[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [loginForm, setLoginForm] = useState({ email: '', password: '' })
  const [loginError, setLoginError] = useState<string | null>(null)
  const [loggingIn, setLoggingIn] = useState(false)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoggingIn(true)
    setLoginError(null)
    
    try {
      // Create Basic Auth header using btoa (browser-compatible)
      const credentials = btoa(`${loginForm.email}:${loginForm.password}`)
      
      const response = await fetch('/api/contact', {
        headers: {
          'Authorization': `Basic ${credentials}`
        }
      })
      
      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Invalid credentials')
      }
      
      const data = await response.json()
      setMessages(data.messages || [])
      setIsAuthenticated(true)
      setError(null)
    } catch (err) {
      setLoginError(err instanceof Error ? err.message : 'Login failed')
    } finally {
      setLoggingIn(false)
    }
  }

  const fetchMessages = async () => {
    setLoading(true)
    setError(null)
    try {
      const credentials = btoa(`${loginForm.email}:${loginForm.password}`)
      const response = await fetch('/api/contact', {
        headers: {
          'Authorization': `Basic ${credentials}`
        }
      })
      if (!response.ok) throw new Error('Failed to fetch messages')
      const data = await response.json()
      setMessages(data.messages || [])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load messages')
    } finally {
      setLoading(false)
    }
  }

  // Reset state when modal closes
  useEffect(() => {
    if (!open) {
      setIsAuthenticated(false)
      setMessages([])
      setLoginForm({ email: '', password: '' })
      setLoginError(null)
      setError(null)
    }
  }, [open])

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const handleLogout = () => {
    setIsAuthenticated(false)
    setMessages([])
    setLoginForm({ email: '', password: '' })
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[80vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Lock className="w-5 h-5 text-emerald-400" />
            {isAuthenticated ? 'Message Inbox' : 'Admin Login'}
          </DialogTitle>
          <DialogDescription>
            {isAuthenticated 
              ? `View all contact form submissions (${messages.length} messages)`
              : 'Enter your credentials to access the admin panel'
            }
          </DialogDescription>
        </DialogHeader>
        
        {!isAuthenticated ? (
          // Login Form
          <form onSubmit={handleLogin} className="space-y-4 py-4">
            {loginError && (
              <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-sm flex items-center gap-2">
                <X className="w-4 h-4" />
                {loginError}
              </div>
            )}
            <div className="space-y-2">
              <label htmlFor="admin-email" className="text-sm font-medium">Email</label>
              <Input
                id="admin-email"
                type="email"
                placeholder="admin@example.com"
                value={loginForm.email}
                onChange={(e) => setLoginForm({ ...loginForm, email: e.target.value })}
                required
                className="bg-muted/50"
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="admin-password" className="text-sm font-medium">Password</label>
              <Input
                id="admin-password"
                type="password"
                placeholder="••••••••"
                value={loginForm.password}
                onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
                required
                className="bg-muted/50"
              />
            </div>
            <Button 
              type="submit" 
              className="w-full bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white"
              disabled={loggingIn}
            >
              {loggingIn ? (
                <span className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  Authenticating...
                </span>
              ) : (
                <>
                  <Lock className="w-4 h-4 mr-2" />
                  Login
                </>
              )}
            </Button>
          </form>
        ) : (
          // Messages View
          <ScrollArea className="h-[60vh] pr-4">
            <div className="flex justify-end mb-4">
              <Button variant="outline" size="sm" onClick={handleLogout}>
                <X className="w-4 h-4 mr-1" />
                Logout
              </Button>
            </div>
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <div className="w-8 h-8 border-2 border-emerald-500/30 border-t-emerald-500 rounded-full animate-spin"></div>
              </div>
            ) : error ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <div className="w-12 h-12 rounded-full bg-red-500/10 flex items-center justify-center mb-4">
                  <X className="w-6 h-6 text-red-400" />
                </div>
                <p className="text-red-400">{error}</p>
                <Button variant="outline" size="sm" className="mt-4" onClick={fetchMessages}>
                  Try Again
                </Button>
              </div>
            ) : messages.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
                  <Inbox className="w-8 h-8 text-muted-foreground" />
                </div>
                <h3 className="font-semibold mb-1">No messages yet</h3>
                <p className="text-muted-foreground text-sm">Messages will appear here when someone contacts you</p>
              </div>
            ) : (
              <div className="space-y-3">
                {messages.map((msg) => (
                  <Card key={msg.id} className={`bg-muted/30 border-border hover:border-emerald-500/30 transition-all duration-300 ${!msg.read ? 'border-l-2 border-l-emerald-500' : ''}`}>
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-grow min-w-0">
                          <div className="flex items-center gap-2 mb-2">
                            <User className="w-4 h-4 text-emerald-400" />
                            <span className="font-semibold">{msg.name}</span>
                            {!msg.read && (
                              <Badge variant="secondary" className="text-xs bg-emerald-500/20 text-emerald-400">New</Badge>
                            )}
                          </div>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                            <Mail className="w-3 h-3" />
                            <a href={`mailto:${msg.email}`} className="hover:text-emerald-400 transition-colors">
                              {msg.email}
                            </a>
                          </div>
                          <div className="flex items-center gap-2 text-xs text-muted-foreground mb-3">
                            <Calendar className="w-3 h-3" />
                            {formatDate(msg.createdAt)}
                          </div>
                          <p className="text-sm bg-background/50 p-3 rounded-lg border border-border">
                            {msg.message}
                          </p>
                        </div>
                      </div>
                      <div className="flex gap-2 mt-3 pt-3 border-t border-border">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="text-xs"
                          onClick={() => window.location.href = `mailto:${msg.email}`}
                        >
                          <Mail className="w-3 h-3 mr-1" />
                          Reply
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </ScrollArea>
        )}
      </DialogContent>
    </Dialog>
  )
}

// Custom hook for scroll-triggered animations
function useScrollAnimation(threshold = 0.1) {
  const ref = useRef<HTMLDivElement>(null)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
        }
      },
      { threshold }
    )

    const currentRef = ref.current
    if (currentRef) {
      observer.observe(currentRef)
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef)
      }
    }
  }, [threshold])

  return { ref, isVisible }
}

// Animated counter hook
function useAnimatedCounter(end: number, duration: number = 2000, start: boolean = false) {
  const [count, setCount] = useState(0)

  useEffect(() => {
    if (!start) return

    let startTime: number | null = null
    const step = (timestamp: number) => {
      if (!startTime) startTime = timestamp
      const progress = Math.min((timestamp - startTime) / duration, 1)
      setCount(Math.floor(progress * end))
      if (progress < 1) {
        requestAnimationFrame(step)
      }
    }
    requestAnimationFrame(step)
  }, [end, duration, start])

  return count
}

// Particle component for background - CSS only, no random values
function Particles() {
  // Pre-defined positions for deterministic rendering (avoiding hydration issues)
  const particlePositions = [
    { left: 10, top: 20, delay: 0, duration: 8 },
    { left: 25, top: 45, delay: 1, duration: 10 },
    { left: 40, top: 15, delay: 2, duration: 7 },
    { left: 55, top: 70, delay: 0.5, duration: 12 },
    { left: 70, top: 35, delay: 1.5, duration: 9 },
    { left: 85, top: 60, delay: 3, duration: 11 },
    { left: 15, top: 80, delay: 2.5, duration: 8 },
    { left: 30, top: 10, delay: 0.8, duration: 10 },
    { left: 60, top: 50, delay: 1.2, duration: 7 },
    { left: 90, top: 25, delay: 2.2, duration: 9 },
    { left: 5, top: 55, delay: 0.3, duration: 11 },
    { left: 45, top: 85, delay: 1.8, duration: 8 },
    { left: 75, top: 5, delay: 3.2, duration: 10 },
    { left: 20, top: 65, delay: 0.6, duration: 12 },
    { left: 50, top: 30, delay: 2.8, duration: 7 },
    { left: 80, top: 75, delay: 1.4, duration: 9 },
    { left: 35, top: 40, delay: 0.2, duration: 11 },
    { left: 65, top: 90, delay: 3.5, duration: 8 },
    { left: 95, top: 45, delay: 1.6, duration: 10 },
    { left: 12, top: 95, delay: 2.4, duration: 9 },
  ]

  return (
    <div className="particles">
      {particlePositions.map((particle, i) => (
        <div
          key={i}
          className="particle"
          style={{
            left: `${particle.left}%`,
            top: `${particle.top}%`,
            animationDelay: `${particle.delay}s`,
            animationDuration: `${particle.duration}s`,
            opacity: 0.15 + (i % 5) * 0.05,
          }}
        />
      ))}
    </div>
  )
}

// Navigation Component
function Navigation() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const navLinks = [
    { href: '#about', label: 'About' },
    { href: '#skills', label: 'Skills' },
    { href: '#experience', label: 'Experience' },
    { href: '#projects', label: 'Projects' },
    { href: '#education', label: 'Education' },
    { href: '#contact', label: 'Contact' },
  ]

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
      isScrolled 
        ? 'bg-background/80 backdrop-blur-xl border-b border-border shadow-lg shadow-emerald-500/5' 
        : 'bg-transparent'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <a href="#" className="flex items-center gap-2 group">
            <div className="relative">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-white font-bold text-lg transform group-hover:scale-110 transition-transform duration-300">
                G
              </div>
              <div className="absolute -inset-1 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-lg blur opacity-40 group-hover:opacity-70 transition-opacity duration-300"></div>
            </div>
            <span className="font-bold text-lg hidden sm:block group-hover:text-emerald-400 transition-colors duration-300">Gautam Kumar</span>
          </a>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-6">
            {navLinks.map((link, index) => (
              <a
                key={link.href}
                href={link.href}
                className="relative text-muted-foreground hover:text-foreground transition-all duration-300 text-sm font-medium group"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                {link.label}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-emerald-500 to-teal-500 group-hover:w-full transition-all duration-300"></span>
              </a>
            ))}
            <ThemeToggle />
            <Button 
              size="sm" 
              className="bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white border-0 shadow-lg shadow-emerald-500/25 hover:shadow-emerald-500/40 transition-all duration-300 hover:scale-105" 
              onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
            >
              <Mail className="w-4 h-4 mr-2" />
              Hire Me
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex items-center gap-2 md:hidden">
            <ThemeToggle />
            <button
              className="p-2 hover:bg-muted rounded-lg transition-colors"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <div className={`md:hidden overflow-hidden transition-all duration-300 ${isMobileMenuOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}>
          <div className="py-4 border-t border-border">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="block py-2 text-muted-foreground hover:text-foreground hover:pl-2 transition-all duration-300"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {link.label}
              </a>
            ))}
            <Button size="sm" className="bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white border-0 mt-4 w-full shadow-lg shadow-emerald-500/25" onClick={() => { setIsMobileMenuOpen(false); document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' }); }}>
              <Mail className="w-4 h-4 mr-2" />
              Hire Me
            </Button>
          </div>
        </div>
      </div>
    </nav>
  )
}

// Hero Section
function HeroSection() {
  const [typedText, setTypedText] = useState('')
  const fullText = 'AI-First Technical Lead'
  
  useEffect(() => {
    let index = 0
    const timer = setInterval(() => {
      setTypedText(fullText.slice(0, index + 1))
      index++
      if (index === fullText.length) clearInterval(timer)
    }, 80)
    return () => clearInterval(timer)
  }, [])

  return (
    <section className="min-h-screen flex items-center justify-center relative overflow-hidden pt-16">
      {/* Animated Background */}
      <div className="absolute inset-0 -z-10">
        {/* Main gradient orbs */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-emerald-500/30 rounded-full blur-3xl animate-pulse-glow"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-teal-500/30 rounded-full blur-3xl animate-pulse-glow delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-to-r from-emerald-500/10 to-teal-500/10 rounded-full blur-3xl"></div>
        
        {/* Floating elements */}
        <div className="absolute top-20 left-10 w-20 h-20 border border-emerald-500/20 rounded-xl animate-float opacity-40"></div>
        <div className="absolute top-40 right-20 w-16 h-16 border border-teal-500/20 rounded-full animate-float-delayed opacity-40"></div>
        <div className="absolute bottom-40 left-20 w-24 h-24 border border-cyan-500/20 rounded-2xl animate-float opacity-40 delay-500"></div>
        <div className="absolute bottom-20 right-40 w-12 h-12 bg-emerald-500/10 rounded-lg animate-float-delayed opacity-60"></div>
      </div>

      {/* Particles */}
      <Particles />

      {/* Grid Pattern */}
      <div className="absolute inset-0 -z-10 bg-[linear-gradient(rgba(16,185,129,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(16,185,129,0.03)_1px,transparent_1px)] bg-[size:64px_64px]"></div>

      {/* Radial gradient overlay */}
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_center,transparent_0%,background_70%)]"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
        {/* Availability Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-emerald-500/10 to-teal-500/10 border border-emerald-500/20 mb-8 animate-fade-in-down backdrop-blur-sm hover:border-emerald-500/40 transition-colors duration-300">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          <Sparkles className="w-4 h-4 text-emerald-400" />
          <span className="text-sm text-emerald-400 font-medium">Available for New Opportunities</span>
        </div>

        {/* Main Heading */}
        <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
          <span className="block text-foreground animate-fade-in-up">Hello, I&apos;m Gautam</span>
          <span className="block bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400 bg-clip-text text-transparent min-h-[1.2em] animate-fade-in-up delay-200">
            {typedText}
            <span className="animate-blink">|</span>
          </span>
        </h1>

        {/* Description */}
        <p className="text-xl sm:text-2xl text-muted-foreground max-w-3xl mx-auto mb-8 leading-relaxed animate-fade-in-up delay-300">
          <span className="text-foreground font-semibold">7+ years</span> of expertise in{' '}
          <span className="text-emerald-400 font-semibold">MERN Stack</span> and serverless architectures. 
          Leading teams to build scalable, production-grade applications.
        </p>

        {/* Key Highlights */}
        <div className="flex flex-wrap justify-center gap-4 mb-8 animate-fade-in-up delay-400">
          {[
            { icon: Users, text: '4+ Years Team Leadership' },
            { icon: Rocket, text: '11+ MERN Applications' },
            { icon: Award, text: 'Employee of the Quarter (3x)' },
          ].map((item, i) => (
            <Badge 
              key={item.text} 
              variant="secondary" 
              className="px-4 py-2 text-sm bg-background/50 border border-border hover:border-emerald-500/50 hover:bg-emerald-500/5 transition-all duration-300 cursor-default hover:scale-105"
            >
              <item.icon className="w-4 h-4 mr-2 text-emerald-400" />
              {item.text}
            </Badge>
          ))}
        </div>

        {/* CTA Buttons */}
        <div className="flex flex-wrap justify-center gap-4 mb-12 animate-fade-in-up delay-500">
          <Button 
            size="lg" 
            className="bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white border-0 h-12 px-8 shadow-lg shadow-emerald-500/30 hover:shadow-emerald-500/50 transition-all duration-300 hover:scale-105 group" 
            onClick={() => document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' })}
          >
            View My Work
            <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
          </Button>
          <Button 
            size="lg" 
            variant="outline" 
            className="h-12 px-8 border-emerald-500/30 hover:bg-emerald-500/10 hover:border-emerald-500/50 transition-all duration-300 hover:scale-105" 
            onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
          >
            <Mail className="w-5 h-5 mr-2" />
            Get In Touch
          </Button>
        </div>

        {/* Tech Stack Preview */}
        <div className="flex flex-wrap justify-center gap-3 animate-fade-in-up delay-600">
          {['React.js', 'Node.js', 'MongoDB', 'Express', 'TypeScript', 'AWS'].map((tech, i) => (
            <Badge 
              key={tech} 
              variant="secondary" 
              className="px-4 py-2 text-sm bg-background/50 border border-border hover:border-emerald-500/50 hover:bg-emerald-500/5 transition-all duration-300 cursor-default hover:scale-110 hover:-translate-y-1" 
              style={{ animationDelay: `${i * 100 + 600}ms` }}
            >
              {tech}
            </Badge>
          ))}
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 rounded-full border-2 border-muted-foreground flex justify-center pt-2 hover:border-emerald-400 transition-colors cursor-pointer" onClick={() => document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' })}>
          <div className="w-1.5 h-3 bg-muted-foreground rounded-full animate-scroll"></div>
        </div>
      </div>
    </section>
  )
}

// About Section
function AboutSection() {
  const { ref, isVisible } = useScrollAnimation()
  const yearsCount = useAnimatedCounter(7, 1500, isVisible)
  const projectsCount = useAnimatedCounter(11, 1500, isVisible)
  const teamYearsCount = useAnimatedCounter(4, 1500, isVisible)

  const highlights = [
    { icon: Users, label: 'Team Leadership', desc: '4+ years leading technical teams', value: teamYearsCount },
    { icon: Code2, label: 'Years Experience', desc: 'Building production-grade applications', value: yearsCount },
    { icon: Rocket, label: 'MERN Apps', desc: 'Successfully delivered projects', value: projectsCount },
    { icon: Cloud, label: 'AWS Expert', desc: 'Lambda, EC2, S3, DynamoDB & more' },
  ]

  return (
    <section id="about" className="py-24 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-1/3 h-full bg-gradient-to-l from-emerald-500/5 to-transparent -z-10"></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div ref={ref} className={`grid lg:grid-cols-2 gap-12 items-center ${isVisible ? 'animate-fade-in-up' : 'opacity-0'}`}>
          {/* Left - Image/Visual */}
          <div className="relative">
            <div className="aspect-square max-w-md mx-auto relative">
              {/* Decorative rotating border */}
              <div className="absolute -inset-4 rounded-3xl border border-emerald-500/20 animate-spin-slow"></div>
              <div className="absolute -inset-8 rounded-3xl border border-teal-500/10 animate-spin-slow" style={{ animationDirection: 'reverse', animationDuration: '40s' }}></div>
              
              {/* Main card */}
              <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/20 to-teal-500/20 rounded-3xl rotate-6 animate-float"></div>
              <div className="absolute inset-0 bg-gradient-to-br from-teal-500/20 to-cyan-500/20 rounded-3xl -rotate-6 animate-float-delayed"></div>
              <div className="relative bg-gradient-to-br from-background to-muted rounded-3xl border border-border p-8 h-full flex items-center justify-center card-shine hover:border-emerald-500/30 transition-colors duration-500">
                <div className="text-center">
                  {/* Animated avatar */}
                  <div className="relative w-32 h-32 mx-auto mb-6">
                    <div className="absolute inset-0 rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 animate-pulse-glow"></div>
                    <div className="relative w-full h-full rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center">
                      <Terminal className="w-16 h-16 text-white" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="text-3xl font-bold text-foreground">Gautam Kumar</div>
                    <div className="text-muted-foreground">AI-First Technical Lead</div>
                    <div className="text-emerald-400 font-medium">{isVisible ? yearsCount : 0}+ Years of Excellence</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right - Content */}
          <div className={`space-y-6 ${isVisible ? 'animate-fade-in-right delay-200' : 'opacity-0'}`}>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 mb-4">
              <span className="text-sm text-emerald-400 font-medium">About Me</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold">
              Building Scalable Solutions with{' '}
              <span className="bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">MERN Stack</span> Expertise
            </h2>
            <p className="text-lg text-muted-foreground leading-relaxed">
              I&apos;m a Software Engineering Lead with over 7 years of experience specializing in the MERN stack 
              and serverless architectures. Currently leading the core team at Tier5 Technology, where I oversee 
              software engineers, manage project delivery, and ensure seamless deployments in production environments.
            </p>
            <p className="text-lg text-muted-foreground leading-relaxed">
              My expertise spans full-stack development, team leadership, and cloud infrastructure. I&apos;ve successfully 
              delivered 11+ MERN stack applications, from Chrome extensions to enterprise CRM platforms.
            </p>

            {/* Highlights Grid */}
            <div className="grid sm:grid-cols-2 gap-4 pt-4">
              {highlights.map((item, index) => (
                <div 
                  key={item.label} 
                  className="flex items-start gap-3 p-4 rounded-xl bg-muted/50 hover:bg-muted border border-transparent hover:border-emerald-500/20 transition-all duration-300 group hover:scale-[1.02] hover:shadow-lg hover:shadow-emerald-500/5"
                  style={{ animationDelay: `${index * 100 + 300}ms` }}
                >
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-emerald-500/20 to-teal-500/20 flex items-center justify-center flex-shrink-0 group-hover:from-emerald-500/30 group-hover:to-teal-500/30 group-hover:scale-110 transition-all duration-300">
                    <item.icon className="w-5 h-5 text-emerald-400" />
                  </div>
                  <div>
                    <div className="font-semibold text-foreground group-hover:text-emerald-400 transition-colors">
                      {item.value !== undefined ? `${item.value}+` : item.label}
                    </div>
                    <div className="text-sm text-muted-foreground">{item.value !== undefined ? item.label : item.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

// Skills Section
function SkillsSection() {
  const { ref, isVisible } = useScrollAnimation()

  const skillCategories = [
    {
      title: 'Languages',
      icon: Code2,
      skills: [
        { name: 'JavaScript', level: 95 },
        { name: 'TypeScript', level: 90 },
        { name: 'Python', level: 75 },
        { name: 'Bash', level: 80 },
        { name: 'C++', level: 65 },
      ]
    },
    {
      title: 'Web Frameworks',
      icon: Globe,
      skills: [
        { name: 'React.js', level: 95 },
        { name: 'Node.js', level: 95 },
        { name: 'Express.js', level: 92 },
        { name: 'Sails.js', level: 85 },
        { name: 'Next.js', level: 85 },
      ]
    },
    {
      title: 'Database & ORM',
      icon: Database,
      skills: [
        { name: 'MongoDB', level: 95 },
        { name: 'Mongoose', level: 93 },
        { name: 'Redis', level: 85 },
        { name: 'DynamoDB', level: 80 },
        { name: 'RDS/PostgreSQL', level: 75 },
      ]
    },
    {
      title: 'AI-First Development',
      icon: Brain,
      skills: [
        { name: 'Multi LLM Integration', level: 92 },
        { name: 'AI-Orchestrated Coding', level: 90 },
        { name: 'Cursor IDE', level: 95 },
        { name: 'Claude Code', level: 92 },
        { name: 'Vibe Coding', level: 88 },
      ]
    },
  ]

  const otherSkills = [
    'AWS (EC2, Lambda, S3, SQS, SNS)', 'Docker', 'Git', 'GitLab', 'GitHub Actions', 'Jenkins',
    'Chrome Extensions', 'Microservices', 'Serverless Architecture', 
    'Event-Driven Design', 'REST APIs', 'Team Leadership', 'Sprint Management'
  ]

  return (
    <section id="skills" className="py-24 bg-muted/30 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-1/2 left-0 w-1/2 h-1/2 bg-gradient-to-r from-emerald-500/5 to-transparent -translate-y-1/2 -z-10"></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div ref={ref} className={`text-center mb-16 ${isVisible ? 'animate-fade-in-up' : 'opacity-0'}`}>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 mb-4">
            <span className="text-sm text-emerald-400 font-medium">Technical Skills</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            My <span className="bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">Tech Stack</span> Expertise
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            A comprehensive toolkit honed over 7+ years of building scalable, production-grade applications.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {skillCategories.map((category, catIndex) => (
            <Card 
              key={category.title} 
              className={`bg-background/50 backdrop-blur border-border hover:border-emerald-500/30 transition-all duration-500 card-shine hover-lift ${isVisible ? 'animate-fade-in-up' : 'opacity-0'}`}
              style={{ animationDelay: `${catIndex * 150}ms` }}
            >
              <CardHeader className="pb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500/20 to-teal-500/20 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <category.icon className="w-6 h-6 text-emerald-400" />
                  </div>
                  <CardTitle className="text-xl">{category.title}</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {category.skills.map((skill, index) => (
                  <div key={skill.name} className="group">
                    <div className="flex justify-between mb-1.5">
                      <span className="font-medium text-sm group-hover:text-emerald-400 transition-colors">{skill.name}</span>
                      <span className="text-sm text-muted-foreground">{skill.level}%</span>
                    </div>
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full transition-all duration-1000 ease-out relative overflow-hidden"
                        style={{ 
                          width: isVisible ? `${skill.level}%` : '0%',
                          transitionDelay: `${catIndex * 150 + index * 100}ms`
                        }}
                      >
                        {/* Shimmer effect on hover */}
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Additional Skills Tags */}
        <div className={`mt-12 text-center ${isVisible ? 'animate-fade-in-up delay-600' : 'opacity-0'}`}>
          <h3 className="text-lg font-semibold mb-4">Other Technologies & Skills</h3>
          <div className="flex flex-wrap justify-center gap-2">
            {otherSkills.map((skill, i) => (
              <Badge 
                key={skill} 
                variant="outline" 
                className="px-3 py-1.5 hover:bg-emerald-500/10 hover:border-emerald-500/50 transition-all duration-300 cursor-default hover:scale-110"
                style={{ animationDelay: `${i * 50 + 600}ms` }}
              >
                {skill}
              </Badge>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

// Experience Section
function ExperienceSection() {
  const { ref, isVisible } = useScrollAnimation()

  const experiences = [
    {
      role: 'Senior Software Developer & Team Lead',
      company: 'Tier5 Technology Private Limited',
      period: 'Dec 2018 - Present',
      description: 'Leading and managing the company\'s core team of software engineers, overseeing performance, development, and project delivery.',
      achievements: [
        'Lead the core team of software engineers, ensuring timely project delivery',
        'Managed 11+ MERN Stack applications from concept to deployment',
        'Oversee deployment process in live production environments',
        'Manage sprints and task distribution to maintain project momentum',
        'Developed reusable, efficient code for both backend and frontend components',
        'Lead server setup and configuration for new and ongoing projects',
      ],
      tech: ['React.js', 'Node.js', 'MongoDB', 'AWS Lambda', 'EC2', 'Docker'],
    },
  ]

  return (
    <section id="experience" className="py-24 relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute right-0 top-1/4 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl -z-10"></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div ref={ref} className={`text-center mb-16 ${isVisible ? 'animate-fade-in-up' : 'opacity-0'}`}>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 mb-4">
            <span className="text-sm text-emerald-400 font-medium">Career Journey</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            Professional <span className="bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">Experience</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            A track record of leading teams and delivering impactful solutions.
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          {experiences.map((exp, index) => (
            <Card 
              key={exp.role + exp.company} 
              className={`bg-background/50 backdrop-blur border-border hover:border-emerald-500/30 transition-all duration-500 hover:shadow-xl hover:shadow-emerald-500/10 card-shine ${isVisible ? 'animate-fade-in-up delay-200' : 'opacity-0'}`}
            >
              <CardHeader>
                <div className="flex flex-wrap items-center gap-2 mb-2">
                  <Badge className="bg-gradient-to-r from-emerald-500 to-teal-500 text-white border-0 animate-gradient">{exp.period}</Badge>
                </div>
                <CardTitle className="text-2xl group-hover:text-emerald-400 transition-colors">{exp.role}</CardTitle>
                <CardDescription className="text-emerald-400 font-medium text-lg">{exp.company}</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">{exp.description}</p>
                <ul className="space-y-2 mb-4">
                  {exp.achievements.map((achievement, i) => (
                    <li 
                      key={i} 
                      className="flex items-start gap-2 text-sm hover:translate-x-1 transition-transform duration-200"
                      style={{ transitionDelay: `${i * 50}ms` }}
                    >
                      <Zap className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                      <span>{achievement}</span>
                    </li>
                  ))}
                </ul>
                <div className="flex flex-wrap gap-2">
                  {exp.tech.map((t, i) => (
                    <Badge 
                      key={t} 
                      variant="secondary" 
                      className="text-xs hover:bg-emerald-500/20 hover:text-emerald-400 transition-colors"
                    >
                      {t}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}

// Projects Section
function ProjectsSection() {
  const { ref, isVisible } = useScrollAnimation()

  const projects = [
    {
      title: 'Friender - Social Media Marketing Automation',
      description: 'A comprehensive social media marketing automation platform using MERN stack with AWS Lambda and EC2 for serverless architecture.',
      icon: Users,
      role: 'Team Lead & Node.js Developer',
      metrics: { architecture: 'Serverless', platform: 'AWS', feature: 'Real-time' },
      achievements: [
        'Led development using MERN stack with AWS Lambda and EC2',
        'Achieved significant reduction in response times through optimization',
        'Built analytics dashboard tracking engagement and conversions',
        'Implemented intelligent task scheduler for automated posts',
      ],
      tech: ['React.js', 'Node.js', 'MongoDB', 'AWS Lambda', 'EC2', 'Chrome Extension'],
      featured: true,
    },
    {
      title: 'Kyubi - CRM Platform',
      description: 'A software platform designed to automate and build dynamic Chrome extensions with white-labelling solutions.',
      icon: Layers,
      role: 'Team Lead',
      metrics: { type: 'CRM', architecture: 'Monolithic', platform: 'EC2' },
      achievements: [
        'Led full-stack development using MERN stack',
        'Deployed on EC2 with monolithic architecture',
        'Provided white-labelling solutions for clients',
      ],
      tech: ['React.js', 'Node.js', 'MongoDB', 'EC2'],
      featured: false,
    },
    {
      title: 'Let Story Drive',
      description: 'A Chrome extension to automate Facebook stories, enabling automatic message sending based on user poll responses.',
      icon: Chrome,
      role: 'Full Stack Developer',
      metrics: { type: 'Chrome Extension', platform: 'EC2', feature: 'Automation' },
      achievements: [
        'Developed Chrome extension from scratch',
        'Built entire project including backend and frontend',
        'Hosted on AWS EC2 for efficient performance',
      ],
      tech: ['React.js', 'Node.js', 'MongoDB', 'Chrome Extension', 'EC2'],
      featured: false,
    },
    {
      title: 'Biggest Fan',
      description: 'A Chrome extension to automate engagement on Facebook live streams, increasing interaction and visibility.',
      icon: Tv,
      role: 'Creator',
      metrics: { type: 'Chrome Extension', platform: 'JavaScript', impact: 'Charity' },
      achievements: [
        'Built entirely in JavaScript during personal time',
        'Generated donations for underprivileged children',
        'Successfully increased live stream engagement',
      ],
      tech: ['JavaScript', 'Chrome Extension', 'Facebook API'],
      featured: false,
    },
    {
      title: 'Affiliate Platform',
      description: 'A software platform to manage affiliate users and sales with separate dashboards for users and admins.',
      icon: Server,
      role: 'Developer',
      metrics: { type: 'Sales CRM', users: 'Multi-role', platform: 'SaaS' },
      achievements: [
        'Built and self-managed the entire platform',
        'Implemented separate dashboards for users and admins',
        'Scaled platform for efficient performance',
      ],
      tech: ['Sails.js', 'Node.js', 'React.js', 'MongoDB', 'Python'],
      featured: false,
    },
    {
      title: 'Red Belt Gyms',
      description: 'A comprehensive gym management platform with course offerings and product management features.',
      icon: Database,
      role: 'Backend Developer',
      metrics: { type: 'Gym Management', platform: 'SaaS', feature: 'Dashboard' },
      achievements: [
        'Developed backend services for gym management',
        'Designed and optimized dashboard service',
        'Built scalable backend infrastructure',
      ],
      tech: ['Node.js', 'MongoDB', 'Express.js'],
      featured: false,
    },
  ]

  return (
    <section id="projects" className="py-24 bg-muted/30 relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute left-0 bottom-0 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl -z-10"></div>
      <div className="absolute right-0 top-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl -z-10"></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div ref={ref} className={`text-center mb-16 ${isVisible ? 'animate-fade-in-up' : 'opacity-0'}`}>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 mb-4">
            <span className="text-sm text-emerald-400 font-medium">Featured Work</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            Notable <span className="bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">Projects</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            A selection of 11+ projects I&apos;ve delivered, showcasing expertise in MERN stack and cloud architectures.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project, index) => (
            <Card 
              key={project.title} 
              className={`group bg-background/50 backdrop-blur border-border hover:border-emerald-500/30 transition-all duration-500 overflow-hidden flex flex-col card-shine hover-lift ${isVisible ? 'animate-fade-in-up' : 'opacity-0'}`}
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <CardHeader className="pb-4">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500/20 to-teal-500/20 flex items-center justify-center group-hover:scale-110 group-hover:rotate-3 transition-all duration-300">
                    <project.icon className="w-6 h-6 text-emerald-400" />
                  </div>
                  {project.featured && (
                    <Badge className="bg-gradient-to-r from-emerald-500 to-teal-500 text-white border-0 text-xs animate-gradient">
                      Featured
                    </Badge>
                  )}
                </div>
                <CardTitle className="text-lg group-hover:text-emerald-400 transition-colors duration-300">{project.title}</CardTitle>
                <CardDescription className="text-sm">{project.description}</CardDescription>
                <Badge variant="outline" className="w-fit text-xs mt-2 group-hover:border-emerald-500/50 transition-colors">{project.role}</Badge>
              </CardHeader>
              <CardContent className="flex-grow flex flex-col">
                {/* Metrics */}
                <div className="grid grid-cols-3 gap-2 mb-4 p-2 rounded-lg bg-muted/50 group-hover:bg-muted transition-colors">
                  {Object.entries(project.metrics).map(([key, value]) => (
                    <div key={key} className="text-center">
                      <div className="text-sm font-bold text-foreground">{value}</div>
                      <div className="text-xs text-muted-foreground capitalize">{key}</div>
                    </div>
                  ))}
                </div>
                {/* Achievements */}
                <ul className="text-sm text-muted-foreground mb-4 flex-grow">
                  {project.achievements.slice(0, 2).map((achievement, i) => (
                    <li key={i} className="flex items-start gap-1.5 mb-1">
                      <Zap className="w-3 h-3 text-emerald-400 flex-shrink-0 mt-1" />
                      <span className="text-xs">{achievement}</span>
                    </li>
                  ))}
                </ul>
                {/* Tech Stack */}
                <div className="flex flex-wrap gap-1.5 mt-auto">
                  {project.tech.slice(0, 4).map((t) => (
                    <Badge key={t} variant="secondary" className="text-xs hover:bg-emerald-500/20 transition-colors">{t}</Badge>
                  ))}
                  {project.tech.length > 4 && (
                    <Badge variant="outline" className="text-xs">+{project.tech.length - 4}</Badge>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}

// Education Section
function EducationSection() {
  const { ref, isVisible } = useScrollAnimation()

  const education = [
    {
      degree: 'B.Tech in Computer Science Engineering',
      institution: 'Centurion University, Paralakhemundi, Odisha',
      period: '2014 - 2018',
      score: 'CGPA: 7.64',
    },
    {
      degree: 'Higher Secondary (12th)',
      institution: 'Sri Chaitanya, Vishakapatnam',
      period: '2014',
      score: '83.3%',
    },
    {
      degree: 'Secondary School (10th)',
      institution: 'Vignan Vidyalayam School, Vishakapatnam',
      period: '2012',
      score: 'CGPA: 7.4',
    },
  ]

  const awards = [
    {
      title: 'Employee of the Quarter',
      description: 'Received award continuously for 3 quarters at Tier5 Technology',
      icon: Award,
    },
    {
      title: 'Above and Beyond',
      description: 'Multiple appreciation badges for quality work delivery and team handling',
      icon: Sparkles,
    },
  ]

  return (
    <section id="education" className="py-24 relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute right-0 top-1/2 w-72 h-72 bg-emerald-500/10 rounded-full blur-3xl -translate-y-1/2 -z-10"></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div ref={ref} className="grid lg:grid-cols-2 gap-12">
          {/* Education */}
          <div className={isVisible ? 'animate-fade-in-left' : 'opacity-0'}>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 mb-4">
              <span className="text-sm text-emerald-400 font-medium">Education</span>
            </div>
            <h2 className="text-3xl font-bold mb-8">
              Academic <span className="bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">Background</span>
            </h2>

            <div className="space-y-4">
              {education.map((edu, index) => (
                <Card 
                  key={edu.degree} 
                  className={`bg-background/50 backdrop-blur border-border hover:border-emerald-500/30 transition-all duration-300 hover-lift card-shine ${index === 0 ? 'border-emerald-500/30' : ''}`}
                  style={{ animationDelay: `${index * 150}ms` }}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500/20 to-teal-500/20 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                        <GraduationCap className="w-6 h-6 text-emerald-400" />
                      </div>
                      <div className="flex-grow">
                        <div className="flex flex-wrap items-center gap-2 mb-1">
                          <Badge variant="outline" className="text-xs">{edu.period}</Badge>
                          <Badge variant="secondary" className="text-xs">{edu.score}</Badge>
                        </div>
                        <h3 className="font-semibold text-foreground">{edu.degree}</h3>
                        <p className="text-sm text-muted-foreground">{edu.institution}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Awards */}
          <div className={isVisible ? 'animate-fade-in-right delay-200' : 'opacity-0'}>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 mb-4">
              <span className="text-sm text-emerald-400 font-medium">Recognition</span>
            </div>
            <h2 className="text-3xl font-bold mb-8">
              Awards & <span className="bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">Achievements</span>
            </h2>

            <div className="space-y-4">
              {awards.map((award, index) => (
                <Card 
                  key={award.title} 
                  className="bg-background/50 backdrop-blur border-border hover:border-emerald-500/30 transition-all duration-300 hover-lift card-shine"
                  style={{ animationDelay: `${index * 150 + 200}ms` }}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500/20 to-teal-500/20 flex items-center justify-center flex-shrink-0">
                        <award.icon className="w-6 h-6 text-emerald-400" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-foreground mb-1">{award.title}</h3>
                        <p className="text-sm text-muted-foreground">{award.description}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

// Contact Section
function ContactSection() {
  const { ref, isVisible } = useScrollAnimation()
  const [formData, setFormData] = useState({ name: '', email: '', message: '' })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)

  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError(null)

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to send message')
      }

      setIsSubmitted(true)
      setFormData({ name: '', email: '', message: '' })

      // Reset success message after 5 seconds
      setTimeout(() => setIsSubmitted(false), 5000)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to send message. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <section id="contact" className="py-24 bg-muted/30 relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute left-0 top-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl -z-10"></div>
      <div className="absolute right-0 bottom-0 w-72 h-72 bg-teal-500/10 rounded-full blur-3xl -z-10"></div>
      <Particles />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div ref={ref} className="grid lg:grid-cols-2 gap-12">
          {/* Left - Info */}
          <div className={isVisible ? 'animate-fade-in-left' : 'opacity-0'}>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 mb-4">
              <span className="text-sm text-emerald-400 font-medium">Get In Touch</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold mb-6">
              Let&apos;s Build Something <span className="bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">Amazing</span> Together
            </h2>
            <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
              I&apos;m always open to discussing new opportunities, innovative projects, or just having a chat about technology and software development. Feel free to reach out!
            </p>

            <div className="space-y-4 mb-8">
              <div className="flex items-center gap-4 p-4 rounded-xl bg-background/50 border border-border hover:border-emerald-500/30 transition-all duration-300 group hover:scale-[1.02]">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500/20 to-teal-500/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Mail className="w-5 h-5 text-emerald-400" />
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">Email</div>
                  <div className="font-medium">gautamkumar1023@gmail.com</div>
                </div>
              </div>
              <div className="flex items-center gap-4 p-4 rounded-xl bg-background/50 border border-border hover:border-emerald-500/30 transition-all duration-300 group hover:scale-[1.02]">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500/20 to-teal-500/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Globe className="w-5 h-5 text-emerald-400" />
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">Location</div>
                  <div className="font-medium">India (Remote Available)</div>
                </div>
              </div>
            </div>

            {/* Social Links */}
            <div className="flex gap-4">
              {[
                { icon: Github, label: 'GitHub', href: '#' },
                { icon: Linkedin, label: 'LinkedIn', href: '#' },
                { icon: Twitter, label: 'Twitter', href: '#' },
              ].map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  className="w-12 h-12 rounded-xl bg-muted hover:bg-emerald-500/10 border border-border hover:border-emerald-500/30 flex items-center justify-center transition-all duration-300 group hover:scale-110 hover:-translate-y-1"
                  aria-label={social.label}
                >
                  <social.icon className="w-5 h-5 text-muted-foreground group-hover:text-emerald-400 transition-colors" />
                </a>
              ))}
            </div>
          </div>

          {/* Right - Form */}
          <Card className={`bg-background/50 backdrop-blur border-border hover:border-emerald-500/20 transition-all duration-500 ${isVisible ? 'animate-fade-in-right delay-200' : 'opacity-0'}`}>
            <CardHeader>
              <CardTitle>Send a Message</CardTitle>
              <CardDescription>I&apos;ll get back to you within 24 hours.</CardDescription>
            </CardHeader>
            <CardContent>
              {isSubmitted ? (
                <div className="flex flex-col items-center justify-center py-12 text-center animate-fade-in-up">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center mb-4">
                    <Sparkles className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">Message Sent!</h3>
                  <p className="text-muted-foreground">Thank you for reaching out. I&apos;ll get back to you soon!</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  {/* Error Message */}
                  {error && (
                    <div className="p-4 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-sm flex items-center gap-2 animate-fade-in-up">
                      <div className="w-5 h-5 rounded-full bg-red-500/20 flex items-center justify-center flex-shrink-0">
                        <X className="w-3 h-3" />
                      </div>
                      {error}
                    </div>
                  )}
                  <div className="group">
                    <label htmlFor="name" className="text-sm font-medium mb-2 block group-hover:text-emerald-400 transition-colors">Name</label>
                    <Input
                      id="name"
                      placeholder="Your name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      required
                      className="bg-muted/50 border-border focus:border-emerald-500/50 transition-colors"
                    />
                  </div>
                  <div className="group">
                    <label htmlFor="email" className="text-sm font-medium mb-2 block group-hover:text-emerald-400 transition-colors">Email</label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="your@email.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      required
                      className="bg-muted/50 border-border focus:border-emerald-500/50 transition-colors"
                    />
                  </div>
                  <div className="group">
                    <label htmlFor="message" className="text-sm font-medium mb-2 block group-hover:text-emerald-400 transition-colors">Message</label>
                    <Textarea
                      id="message"
                      placeholder="Tell me about your project or opportunity..."
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      required
                      rows={5}
                      className="bg-muted/50 border-border focus:border-emerald-500/50 transition-colors resize-none"
                    />
                  </div>
                  <Button 
                    type="submit" 
                    size="lg" 
                    className="w-full bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white border-0 shadow-lg shadow-emerald-500/25 hover:shadow-emerald-500/40 transition-all duration-300 group" 
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <span className="flex items-center gap-2">
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                        Sending...
                      </span>
                    ) : (
                      <>
                        Send Message
                        <Send className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                      </>
                    )}
                  </Button>
                </form>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  )
}

// Footer Component
function Footer({ onOpenAdmin }: { onOpenAdmin: () => void }) {
  return (
    <footer className="border-t border-border bg-muted/30 py-8 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/5 via-transparent to-teal-500/5 -z-10"></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 group">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-white font-bold text-sm group-hover:scale-110 transition-transform duration-300">
              G
            </div>
            <span className="font-semibold group-hover:text-emerald-400 transition-colors">Gautam Kumar Ampolu</span>
          </div>
          <div className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} All rights reserved. Built with{' '}
            <span className="text-emerald-400">React</span> & <span className="text-teal-400">Next.js</span>
          </div>
          <div className="flex gap-4 items-center">
            <button 
              onClick={onOpenAdmin}
              className="text-sm text-muted-foreground hover:text-emerald-400 transition-colors flex items-center gap-1"
            >
              <Lock className="w-3 h-3" />
              Admin
            </button>
            <a href="#" className="text-sm text-muted-foreground hover:text-emerald-400 transition-colors">Privacy</a>
            <a href="#" className="text-sm text-muted-foreground hover:text-emerald-400 transition-colors">Terms</a>
          </div>
        </div>
      </div>
    </footer>
  )
}

// Main Page Component
export default function Home() {
  const [isAdminOpen, setIsAdminOpen] = useState(false)

  return (
    <main className="min-h-screen flex flex-col bg-background text-foreground">
      <Navigation />
      <HeroSection />
      <AboutSection />
      <SkillsSection />
      <ExperienceSection />
      <ProjectsSection />
      <EducationSection />
      <ContactSection />
      <Footer onOpenAdmin={() => setIsAdminOpen(true)} />
      <AdminModal open={isAdminOpen} onOpenChange={setIsAdminOpen} />
    </main>
  )
}
