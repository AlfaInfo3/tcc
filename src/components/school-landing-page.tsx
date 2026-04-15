"use client";

import { Icon } from "@iconify/react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";

export function SchoolLandingPage() {
  return (
    <div className="min-h-screen bg-background font-sans text-foreground">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto flex h-20 items-center justify-between px-6 lg:px-12">
          <div className="flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-primary/80 text-primary-foreground shadow-lg shadow-primary/30">
              <Icon icon="solar:book-bookmark-bold" className="size-6" />
            </div>
            <span className="text-xl font-heading font-bold tracking-tight">BrightFuture</span>
          </div>
          <nav className="hidden lg:flex items-center gap-8 text-sm font-medium">
            <a href="#" className="text-foreground transition-colors hover:text-primary">
              Home
            </a>
            <a href="#" className="text-foreground/70 transition-colors hover:text-primary">
              Programs
            </a>
            <a href="#" className="text-foreground/70 transition-colors hover:text-primary">
              About
            </a>
            <a href="#" className="text-foreground/70 transition-colors hover:text-primary">
              Admissions
            </a>
            <a href="#" className="text-foreground/70 transition-colors hover:text-primary">
              Contact
            </a>
          </nav>
          <div className="flex items-center gap-4">
            <Button
              size="lg"
              className="shadow-lg shadow-primary/30 bg-gradient-to-r from-primary via-primary to-primary/90 hover:shadow-xl hover:shadow-primary/40 transition-all"
            >
              Apply Now
            </Button>
          </div>
        </div>
      </header>
      <main>
        <section className="relative overflow-hidden bg-gradient-to-br from-primary/5 via-background to-accent/5 pt-24 pb-32 lg:pt-32 lg:pb-40">
          <div className="absolute top-20 right-0 size-[500px] rounded-full bg-primary/10 blur-3xl" />
          <div className="absolute bottom-0 left-0 size-[400px] rounded-full bg-accent/10 blur-3xl" />
          <div className="container relative mx-auto px-6 lg:px-12">
            <div className="grid gap-12 lg:grid-cols-2 lg:gap-16 items-center">
              <div className="space-y-8 max-w-2xl">
                <Badge className="px-4 py-2 text-sm font-semibold bg-primary/10 text-primary border-primary/20 hover:bg-primary/20">
                  Enrollment Open for 2024
                </Badge>
                <h1 className="font-heading text-5xl font-bold tracking-tight lg:text-6xl xl:text-7xl leading-tight">
                  Shape Your Child's{" "}
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-primary/70">
                    Bright Future
                  </span>
                </h1>
                <p className="text-xl text-muted-foreground leading-relaxed">
                  Discover a world-class education that nurtures creativity, critical thinking, and
                  character. Join our community of learners today.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 pt-4">
                  <Button
                    size="lg"
                    className="h-14 px-8 text-base font-semibold shadow-xl shadow-primary/30 bg-gradient-to-r from-primary to-primary/90 hover:shadow-2xl hover:shadow-primary/40 transition-all"
                  >
                    Get Started
                    <Icon icon="solar:arrow-right-bold" className="ml-2 size-5" />
                  </Button>
                  <Button
                    size="lg"
                    variant="outline"
                    className="h-14 px-8 text-base font-semibold border-2"
                  >
                    <Icon icon="solar:play-circle-bold" className="mr-2 size-5 text-primary" />
                    Watch Tour
                  </Button>
                </div>
                <div className="flex items-center gap-6 pt-6">
                  <div className="flex -space-x-4">
                    <Avatar className="size-12 border-4 border-background shadow-md">
                      <AvatarImage src="https://randomuser.me/api/portraits/women/32.jpg" />
                      <AvatarFallback>ST</AvatarFallback>
                    </Avatar>
                    <Avatar className="size-12 border-4 border-background shadow-md">
                      <AvatarImage src="https://randomuser.me/api/portraits/men/54.jpg" />
                      <AvatarFallback>JD</AvatarFallback>
                    </Avatar>
                    <Avatar className="size-12 border-4 border-background shadow-md">
                      <AvatarImage src="https://randomuser.me/api/portraits/women/68.jpg" />
                      <AvatarFallback>MK</AvatarFallback>
                    </Avatar>
                    <div className="flex size-12 items-center justify-center rounded-full border-4 border-background bg-primary text-primary-foreground text-sm font-bold shadow-md">
                      +3K
                    </div>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-foreground">Join 3,000+ families</p>
                    <p className="text-xs text-muted-foreground">Trusted by parents worldwide</p>
                  </div>
                </div>
              </div>
              <div eid="e47" className="relative">
                <div className="absolute -top-8 -right-8 size-80 rounded-full bg-gradient-to-br from-primary/20 to-accent/20 blur-3xl" />
                <div className="absolute top-1/2 -translate-y-1/2 size-64 rounded-full bg-gradient-to-l from-primary/30 to-primary/10 z-20" />
                <Card className="relative overflow-hidden border-none shadow-2xl bg-primary rounded-md">
                  <img
                    alt="Happy students learning"
                    src="https://images.unsplash.com/photo-1427504494785-3a9ca7044f45?w=1200&q=80"
                    className="aspect-[4/3] w-full object-cover"
                  />
                  <div className="absolute bottom-6 left-6 right-6">
                    <Card className="border-none shadow-xl bg-background/95 backdrop-blur">
                      <CardContent className="p-6 flex items-center gap-4">
                        <div className="flex size-14 items-center justify-center rounded-2xl bg-gradient-to-br from-green-500 to-green-600 text-white shadow-lg">
                          <Icon icon="solar:check-circle-bold" className="size-8" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-muted-foreground">Admissions</p>
                          <p className="text-2xl font-bold text-foreground">Now Open!</p>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </Card>
              </div>
            </div>
          </div>
        </section>
        <section className="py-20 border-y bg-gradient-to-b from-muted/30 to-background">
          <div className="container mx-auto px-6 lg:px-12">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
              <div className="text-center space-y-3">
                <div className="inline-flex items-center justify-center size-16 rounded-2xl bg-primary/10 text-primary mb-2">
                  <Icon icon="solar:diploma-bold" className="size-8" />
                </div>
                <h3 className="font-heading text-4xl lg:text-5xl font-bold text-primary">98%</h3>
                <p className="text-sm font-medium text-muted-foreground">College Acceptance</p>
              </div>
              <div className="text-center space-y-3">
                <div className="inline-flex items-center justify-center size-16 rounded-2xl bg-primary/10 text-primary mb-2">
                  <Icon icon="solar:users-group-rounded-bold" className="size-8" />
                </div>
                <h3 className="font-heading text-4xl lg:text-5xl font-bold text-primary">15:1</h3>
                <p className="text-sm font-medium text-muted-foreground">Student-Teacher Ratio</p>
              </div>
              <div className="text-center space-y-3">
                <div className="inline-flex items-center justify-center size-16 rounded-2xl bg-primary/10 text-primary mb-2">
                  <Icon icon="solar:cup-star-bold" className="size-8" />
                </div>
                <h3 className="font-heading text-4xl lg:text-5xl font-bold text-primary">60+</h3>
                <p className="text-sm font-medium text-muted-foreground">Awards Won</p>
              </div>
              <div className="text-center space-y-3">
                <div className="inline-flex items-center justify-center size-16 rounded-2xl bg-primary/10 text-primary mb-2">
                  <Icon icon="solar:star-bold" className="size-8" />
                </div>
                <h3 className="font-heading text-4xl lg:text-5xl font-bold text-primary">20</h3>
                <p className="text-sm font-medium text-muted-foreground">Years Excellence</p>
              </div>
            </div>
          </div>
        </section>
        <section className="py-24 lg:py-32">
          <div className="container mx-auto px-6 lg:px-12">
            <div className="text-center mb-16 max-w-3xl mx-auto space-y-4">
              <Badge className="px-4 py-2 text-sm font-semibold bg-primary/10 text-primary border-primary/20">
                Our Programs
              </Badge>
              <h2 className="font-heading text-4xl lg:text-5xl font-bold tracking-tight">
                Explore Our Academic Excellence
              </h2>
              <p className="text-lg text-muted-foreground">
                Comprehensive programs designed to unlock every student's potential
              </p>
            </div>
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              <Card className="group overflow-hidden border-none shadow-lg hover:shadow-2xl transition-all duration-500 bg-gradient-to-br from-card to-card/50 pt-0">
                <img
                  alt="Elementary Program"
                  src="https://wqnmyfkavrotpmupbtou.supabase.co/storage/v1/object/public/generation-assets/photos/high-schools/landscape/4.webp"
                  className="aspect-[16/10] w-full object-cover rounded-t-2xl"
                />
                <CardHeader className="space-y-3 pt-6">
                  <div className="flex items-center justify-between">
                    <Badge
                      variant="secondary"
                      className="bg-primary/10 text-primary border-primary/20"
                    >
                      Ages 5-11
                    </Badge>
                    <Icon
                      icon="solar:arrow-right-up-linear"
                      className="size-6 text-primary transition-transform group-hover:translate-x-1 group-hover:-translate-y-1"
                    />
                  </div>
                  <CardTitle className="text-2xl">Elementary School</CardTitle>
                  <CardDescription className="text-base">
                    Building strong foundations in literacy, numeracy, and social skills through
                    play-based learning.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="outline" className="text-xs">
                      Reading
                    </Badge>
                    <Badge variant="outline" className="text-xs">
                      Math
                    </Badge>
                    <Badge variant="outline" className="text-xs">
                      Science
                    </Badge>
                    <Badge variant="outline" className="text-xs">
                      Arts
                    </Badge>
                  </div>
                </CardContent>
              </Card>
              <Card className="group overflow-hidden border-none shadow-lg hover:shadow-2xl transition-all duration-500 bg-gradient-to-br from-card to-card/50 pt-0">
                <img
                  alt="Middle School Program"
                  src="https://wqnmyfkavrotpmupbtou.supabase.co/storage/v1/object/public/generation-assets/photos/high-schools/landscape/2.webp"
                  className="aspect-[16/10] w-full object-cover rounded-t-2xl"
                />
                <CardHeader className="space-y-3 pt-6">
                  <div className="flex items-center justify-between">
                    <Badge
                      variant="secondary"
                      className="bg-primary/10 text-primary border-primary/20"
                    >
                      Ages 11-14
                    </Badge>
                    <Icon
                      icon="solar:arrow-right-up-linear"
                      className="size-6 text-primary transition-transform group-hover:translate-x-1 group-hover:-translate-y-1"
                    />
                  </div>
                  <CardTitle className="text-2xl">Middle School</CardTitle>
                  <CardDescription className="text-base">
                    Developing critical thinking and independence with specialized subject teachers
                    and enrichment programs.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="outline" className="text-xs">
                      STEM
                    </Badge>
                    <Badge variant="outline" className="text-xs">
                      Languages
                    </Badge>
                    <Badge variant="outline" className="text-xs">
                      Sports
                    </Badge>
                    <Badge variant="outline" className="text-xs">
                      Music
                    </Badge>
                  </div>
                </CardContent>
              </Card>
              <Card className="group overflow-hidden border-none shadow-lg hover:shadow-2xl transition-all duration-500 bg-gradient-to-br from-card to-card/50 pt-0">
                <img
                  alt="High School Program"
                  src="https://wqnmyfkavrotpmupbtou.supabase.co/storage/v1/object/public/generation-assets/photos/universities/landscape/3.webp"
                  className="aspect-[16/10] w-full object-cover rounded-t-2xl"
                />
                <CardHeader className="space-y-3 pt-6">
                  <div className="flex items-center justify-between">
                    <Badge
                      variant="secondary"
                      className="bg-primary/10 text-primary border-primary/20"
                    >
                      Ages 14-18
                    </Badge>
                    <Icon
                      icon="solar:arrow-right-up-linear"
                      className="size-6 text-primary transition-transform group-hover:translate-x-1 group-hover:-translate-y-1"
                    />
                  </div>
                  <CardTitle className="text-2xl">High School</CardTitle>
                  <CardDescription className="text-base">
                    College prep curriculum with AP courses, leadership opportunities, and career
                    counseling.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="outline" className="text-xs">
                      AP Classes
                    </Badge>
                    <Badge variant="outline" className="text-xs">
                      SAT Prep
                    </Badge>
                    <Badge variant="outline" className="text-xs">
                      Robotics
                    </Badge>
                    <Badge variant="outline" className="text-xs">
                      Debate
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
        <section className="py-24 lg:py-32 bg-gradient-to-br from-primary/5 via-background to-accent/5 relative overflow-hidden">
          <div className="absolute top-0 right-0 size-[600px] rounded-full bg-primary/10 blur-3xl" />
          <div className="container relative mx-auto px-6 lg:px-12">
            <div className="grid gap-12 lg:grid-cols-2 items-center lg:gap-20">
              <div className="relative order-2 lg:order-1">
                <Card className="overflow-hidden border-none shadow-2xl bg-card pt-0">
                  <img
                    alt="Modern classroom"
                    src="https://images.unsplash.com/photo-1509062522246-3755977927d7?w=1200&q=80"
                    className="aspect-[4/3] w-full object-cover rounded-t-2xl"
                  />
                </Card>
                <Card className="absolute -bottom-8 -right-8 border-none shadow-xl bg-background/95 backdrop-blur max-w-xs">
                  <CardContent className="p-6 space-y-3">
                    <div className="flex items-center gap-3">
                      <div className="flex size-12 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-primary/80 text-primary-foreground">
                        <Icon icon="solar:medal-star-bold" className="size-6" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Accredited by</p>
                        <p className="font-bold text-foreground">IB & Cambridge</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
              <div className="space-y-6 order-1 lg:order-2">
                <Badge className="px-4 py-2 text-sm font-semibold bg-primary/10 text-primary border-primary/20">
                  Why Choose Us
                </Badge>
                <h2 className="font-heading text-4xl lg:text-5xl font-bold tracking-tight leading-tight">
                  World-Class Education for Tomorrow's Leaders
                </h2>
                <p className="text-lg text-muted-foreground leading-relaxed">
                  We combine academic rigor with character development, preparing students not just
                  for college, but for life.
                </p>
                <div className="space-y-4 pt-4">
                  <div className="flex gap-4">
                    <div className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                      <Icon icon="solar:diploma-bold" className="size-6" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg mb-1">Certified Teachers</h3>
                      <p className="text-muted-foreground">
                        Expert educators with advanced degrees and ongoing professional development.
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <div className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                      <Icon icon="solar:atom-bold" className="size-6" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg mb-1">STEM Excellence</h3>
                      <p className="text-muted-foreground">
                        State-of-the-art labs and technology integration across all grade levels.
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <div className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                      <Icon icon="solar:global-bold" className="size-6" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg mb-1">Global Perspective</h3>
                      <p className="text-muted-foreground">
                        International curriculum preparing students for success anywhere in the
                        world.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        <section className="py-24 lg:py-32">
          <div className="container mx-auto px-6 lg:px-12">
            <div className="text-center mb-16 max-w-3xl mx-auto space-y-4">
              <Badge className="px-4 py-2 text-sm font-semibold bg-primary/10 text-primary border-primary/20">
                Testimonials
              </Badge>
              <h2 className="font-heading text-4xl lg:text-5xl font-bold tracking-tight">
                Loved by Parents & Students
              </h2>
              <p className="text-lg text-muted-foreground">
                See what our community has to say about their experience
              </p>
            </div>
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              <Card className="border-none shadow-lg bg-gradient-to-br from-card to-card/50">
                <CardContent className="pt-8 space-y-6">
                  <div className="flex gap-1 text-yellow-500">
                    <Icon icon="solar:star-bold" className="size-5" />
                    <Icon icon="solar:star-bold" className="size-5" />
                    <Icon icon="solar:star-bold" className="size-5" />
                    <Icon icon="solar:star-bold" className="size-5" />
                    <Icon icon="solar:star-bold" className="size-5" />
                  </div>
                  <p className="text-muted-foreground leading-relaxed">
                    "BrightFuture has exceeded all our expectations. The teachers are passionate,
                    and my daughter has grown so much academically and personally."
                  </p>
                  <div className="flex items-center gap-4 pt-4">
                    <Avatar className="size-14 border-2 border-primary/20">
                      <AvatarImage src="https://randomuser.me/api/portraits/women/44.jpg" />
                      <AvatarFallback>JM</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-semibold">Jennifer Martinez</p>
                      <p className="text-sm text-muted-foreground">Parent, Grade 7</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card className="border-none shadow-lg bg-gradient-to-br from-card to-card/50">
                <CardContent className="pt-8 space-y-6">
                  <div className="flex gap-1 text-yellow-500">
                    <Icon icon="solar:star-bold" className="size-5" />
                    <Icon icon="solar:star-bold" className="size-5" />
                    <Icon icon="solar:star-bold" className="size-5" />
                    <Icon icon="solar:star-bold" className="size-5" />
                    <Icon icon="solar:star-bold" className="size-5" />
                  </div>
                  <p className="text-muted-foreground leading-relaxed">
                    "The STEM program is outstanding. My son is now pursuing engineering at MIT, and
                    he credits his foundation to BrightFuture."
                  </p>
                  <div className="flex items-center gap-4 pt-4">
                    <Avatar className="size-14 border-2 border-primary/20">
                      <AvatarImage src="https://randomuser.me/api/portraits/men/67.jpg" />
                      <AvatarFallback>DK</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-semibold">David Kim</p>
                      <p className="text-sm text-muted-foreground">Parent, Alumni</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card className="border-none shadow-lg bg-gradient-to-br from-card to-card/50">
                <CardContent className="pt-8 space-y-6">
                  <div className="flex gap-1 text-yellow-500">
                    <Icon icon="solar:star-bold" className="size-5" />
                    <Icon icon="solar:star-bold" className="size-5" />
                    <Icon icon="solar:star-bold" className="size-5" />
                    <Icon icon="solar:star-bold" className="size-5" />
                    <Icon icon="solar:star-bold" className="size-5" />
                  </div>
                  <p className="text-muted-foreground leading-relaxed">
                    "A nurturing environment where every child is valued. The extracurricular
                    programs are diverse and truly enriching."
                  </p>
                  <div className="flex items-center gap-4 pt-4">
                    <Avatar className="size-14 border-2 border-primary/20">
                      <AvatarImage src="https://randomuser.me/api/portraits/women/28.jpg" />
                      <AvatarFallback>SP</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-semibold">Sarah Patel</p>
                      <p className="text-sm text-muted-foreground">Parent, Grade 4</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
        <section className="py-24 lg:py-32 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary to-primary/90" />
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDM0djItaDJ2LTJoLTJ6bTAgNGgtMnYyaDJ2LTJ6bTAtOGgydi0yaC0ydjJ6bS0yLTJoLTJ2Mmgydi0yem0yLTJoMnYtMmgtMnYyem0tMiAwdi0yaC0ydjJoMnptLTQgMGgtMnYyaDJ2LTJ6bTYgNnYtMmgtMnYyaDJ6bS0yIDBoLTJ2Mmgydi0yem0yIDJ2LTJoLTJ2Mmgyem0wIDBoMnYtMmgtMnYyem0yIDB2Mmgydi0yaC0yem0wLTJ2LTJoLTJ2Mmgyem0wLTRoMnYtMmgtMnYyem0tMiAwdi0yaC0ydjJoMnoiLz48L2c+PC9nPjwvc3ZnPg==')] opacity-10" />
          <div className="container relative mx-auto px-6 lg:px-12 text-center text-primary-foreground">
            <div className="max-w-4xl mx-auto space-y-8">
              <Badge className="px-4 py-2 text-sm font-semibold bg-white/20 text-white border-white/30 hover:bg-white/30">
                Start Your Journey
              </Badge>
              <h2 className="font-heading text-4xl lg:text-6xl font-bold tracking-tight leading-tight">
                Ready to Join Our Community?
              </h2>
              <p className="text-xl text-primary-foreground/90 leading-relaxed max-w-2xl mx-auto">
                Schedule a personalized campus tour and discover how BrightFuture can transform your
                child's educational journey.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center pt-6">
                <Button
                  size="lg"
                  variant="secondary"
                  className="h-14 px-8 text-base font-semibold shadow-xl hover:shadow-2xl transition-all"
                >
                  Schedule a Tour
                  <Icon icon="solar:calendar-bold" className="ml-2 size-5" />
                </Button>
                <Button
                  size="lg"
                  className="h-14 px-8 text-base font-semibold bg-white/10 hover:bg-white/20 text-white border-2 border-white/30 shadow-none backdrop-blur"
                >
                  <Icon icon="solar:phone-bold" className="mr-2 size-5" />
                  Contact Admissions
                </Button>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 pt-12 max-w-3xl mx-auto">
                <div className="space-y-2">
                  <div className="inline-flex items-center justify-center size-14 rounded-2xl bg-white/10 backdrop-blur mb-3">
                    <Icon icon="solar:document-bold" className="size-7 text-white" />
                  </div>
                  <p className="font-semibold text-lg">Download Brochure</p>
                  <p className="text-sm text-primary-foreground/80">Get detailed information</p>
                </div>
                <div className="space-y-2">
                  <div className="inline-flex items-center justify-center size-14 rounded-2xl bg-white/10 backdrop-blur mb-3">
                    <Icon icon="solar:chat-round-money-bold" className="size-7 text-white" />
                  </div>
                  <p className="font-semibold text-lg">Financial Aid</p>
                  <p className="text-sm text-primary-foreground/80">Scholarships available</p>
                </div>
                <div className="space-y-2">
                  <div className="inline-flex items-center justify-center size-14 rounded-2xl bg-white/10 backdrop-blur mb-3">
                    <Icon icon="solar:calendar-mark-bold" className="size-7 text-white" />
                  </div>
                  <p className="font-semibold text-lg">Open House</p>
                  <p className="text-sm text-primary-foreground/80">Next event: March 15</p>
                </div>
              </div>
            </div>
          </div>
        </section>
        <section className="py-24 lg:py-32 bg-muted/30">
          <div className="container mx-auto px-6 lg:px-12 max-w-4xl">
            <div className="text-center mb-16 space-y-4">
              <Badge className="px-4 py-2 text-sm font-semibold bg-primary/10 text-primary border-primary/20">
                FAQ
              </Badge>
              <h2 className="font-heading text-4xl lg:text-5xl font-bold tracking-tight">
                Common Questions
              </h2>
            </div>
            <Accordion type="single" className="w-full space-y-4" collapsible>
              <AccordionItem value="item-1" className="border rounded-2xl px-6 bg-card shadow-sm">
                <AccordionTrigger className="text-lg font-semibold hover:no-underline py-6">
                  What is your admission process?
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground leading-relaxed pb-6">
                  Our admission process includes: 1) Submit online application, 2) Schedule entrance
                  assessment, 3) Attend family interview, 4) Receive decision within 2 weeks. We
                  evaluate students holistically, considering academic performance, character, and
                  potential.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-2" className="border rounded-2xl px-6 bg-card shadow-sm">
                <AccordionTrigger className="text-lg font-semibold hover:no-underline py-6">
                  Do you offer financial aid and scholarships?
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground leading-relaxed pb-6">
                  Yes! We offer both merit-based and need-based financial aid. Approximately 30% of
                  our students receive some form of financial assistance. Applications are reviewed
                  confidentially during the admission process.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-3" className="border rounded-2xl px-6 bg-card shadow-sm">
                <AccordionTrigger className="text-lg font-semibold hover:no-underline py-6">
                  What are your class sizes?
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground leading-relaxed pb-6">
                  We maintain a 15:1 student-teacher ratio with average class sizes of 18-20
                  students. This allows for personalized attention while fostering collaborative
                  learning and peer interaction.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-4" className="border rounded-2xl px-6 bg-card shadow-sm">
                <AccordionTrigger className="text-lg font-semibold hover:no-underline py-6">
                  What extracurricular activities are available?
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground leading-relaxed pb-6">
                  We offer 60+ extracurricular activities including sports (soccer, basketball,
                  swimming), arts (drama, music, visual arts), STEM clubs (robotics, coding), and
                  leadership programs (student government, debate team).
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-5" className="border rounded-2xl px-6 bg-card shadow-sm">
                <AccordionTrigger className="text-lg font-semibold hover:no-underline py-6">
                  Is transportation provided?
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground leading-relaxed pb-6">
                  Yes, we provide safe and reliable bus transportation covering major neighborhoods
                  within a 15-mile radius. Routes are designed for convenience with GPS tracking
                  available for parents.
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </section>
      </main>
      <footer className="border-t bg-card py-16">
        <div className="container mx-auto px-6 lg:px-12">
          <div className="grid gap-12 sm:grid-cols-2 lg:grid-cols-5">
            <div className="lg:col-span-2 space-y-6">
              <div className="flex items-center gap-3">
                <div className="flex size-10 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-primary/80 text-primary-foreground shadow-lg shadow-primary/30">
                  <Icon icon="solar:book-bookmark-bold" className="size-6" />
                </div>
                <span className="text-xl font-heading font-bold">BrightFuture</span>
              </div>
              <p className="text-muted-foreground max-w-sm">
                Empowering students to reach their full potential through innovative education and
                character development.
              </p>
              <div className="flex gap-3">
                <a
                  href="#"
                  className="flex size-10 items-center justify-center rounded-xl bg-muted hover:bg-primary hover:text-primary-foreground transition-colors"
                >
                  <Icon icon="solar:facebook-bold" className="size-5" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
