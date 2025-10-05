# Phase 3: Marketing Website - Component Research

**Created**: 2025-10-05
**Status**: Complete
**Phase**: PHASE 3 (T036-T050)

## Overview

This document provides comprehensive research on all shadcn/ui components required for the Phase 3 Marketing Website implementation. It includes installation commands, component APIs, usage examples, and integration patterns specific to marketing website use cases.

---

## Table of Contents

1. [Installation Commands](#installation-commands)
2. [Core shadcn Components](#core-shadcn-components)
3. [Aceternity Marketing Components](#aceternity-marketing-components)
4. [Form Components & Validation](#form-components--validation)
5. [Integration Patterns](#integration-patterns)
6. [Best Practices](#best-practices)
7. [Common Marketing Patterns](#common-marketing-patterns)

---

## Installation Commands

### Install All Core Components at Once

```bash
# Core shadcn components (17 components)
npx shadcn@latest add @shadcn/navigation-menu @shadcn/card @shadcn/badge @shadcn/avatar @shadcn/accordion @shadcn/tabs @shadcn/table @shadcn/form @shadcn/input @shadcn/textarea @shadcn/select @shadcn/label @shadcn/button @shadcn/hover-card @shadcn/tooltip @shadcn/separator @shadcn/breadcrumb
```

### Install Aceternity Marketing Components

```bash
# Aceternity animated components (5 components)
npx shadcn@latest add @aceternity/hero-parallax @aceternity/hero-highlight @aceternity/animated-testimonials @aceternity/3d-card @aceternity/card-stack
```

### Install Individual Components

```bash
# Layout & Navigation
npx shadcn@latest add @shadcn/navigation-menu
npx shadcn@latest add @shadcn/separator
npx shadcn@latest add @shadcn/breadcrumb

# Content Display
npx shadcn@latest add @shadcn/card
npx shadcn@latest add @shadcn/badge
npx shadcn@latest add @shadcn/avatar
npx shadcn@latest add @shadcn/accordion
npx shadcn@latest add @shadcn/tabs
npx shadcn@latest add @shadcn/table

# Forms & Inputs
npx shadcn@latest add @shadcn/form
npx shadcn@latest add @shadcn/input
npx shadcn@latest add @shadcn/textarea
npx shadcn@latest add @shadcn/select
npx shadcn@latest add @shadcn/label
npx shadcn@latest add @shadcn/button

# Interactive Elements
npx shadcn@latest add @shadcn/hover-card
npx shadcn@latest add @shadcn/tooltip
```

---

## Core shadcn Components

### 1. Navigation Menu

**Purpose**: Main site navigation with dropdown support
**Dependencies**: `@radix-ui/react-navigation-menu`
**Use Cases**: Header navigation, mega menus

#### Component API

```tsx
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu"
```

#### Key Props

- `viewport`: boolean - Show/hide viewport (default: true)
- `defaultValue`: string - Default active menu item
- `orientation`: "horizontal" | "vertical" - Menu orientation

#### Usage Example - Marketing Header

```tsx
export function MarketingNav() {
  return (
    <NavigationMenu>
      <NavigationMenuList>
        <NavigationMenuItem>
          <NavigationMenuTrigger>Features</NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="grid gap-3 p-6 md:w-[400px] lg:w-[500px] lg:grid-cols-[.75fr_1fr]">
              <li className="row-span-3">
                <NavigationMenuLink asChild>
                  <a className="flex h-full w-full select-none flex-col justify-end rounded-md bg-gradient-to-b from-muted/50 to-muted p-6 no-underline outline-hidden focus:shadow-md" href="/features">
                    <div className="mb-2 mt-4 text-lg font-medium">
                      Fleet Management
                    </div>
                    <p className="text-sm leading-tight text-muted-foreground">
                      Real-time tracking, geofencing, maintenance, and analytics
                    </p>
                  </a>
                </NavigationMenuLink>
              </li>
              <ListItem href="/features/tracking" title="Vehicle Tracking">
                GPS tracking and real-time location monitoring
              </ListItem>
              <ListItem href="/features/geofencing" title="Geofencing">
                Custom zones and automated alerts
              </ListItem>
              <ListItem href="/features/maintenance" title="Maintenance">
                Preventive maintenance scheduling
              </ListItem>
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>

        <NavigationMenuItem>
          <NavigationMenuLink asChild className={navigationMenuTriggerStyle()}>
            <Link href="/pricing">Pricing</Link>
          </NavigationMenuLink>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  )
}
```

#### Accessibility Features

- Full keyboard navigation with arrow keys
- `aria-expanded` on dropdown triggers
- `aria-current="page"` for active links
- Screen reader announcements

---

### 2. Card

**Purpose**: Versatile container for content sections
**Dependencies**: None
**Use Cases**: Feature cards, pricing cards, blog posts, team members

#### Component API

```tsx
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
```

#### Usage Example - Feature Card

```tsx
export function FeatureCard({ icon, title, description, link }: FeatureCardProps) {
  return (
    <Card className="transition-all hover:shadow-lg">
      <CardHeader>
        <div className="mb-2 text-primary">{icon}</div>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <ul className="space-y-2">
          <li className="flex items-center gap-2">
            <CheckIcon className="h-4 w-4 text-green-500" />
            <span>Real-time updates</span>
          </li>
          <li className="flex items-center gap-2">
            <CheckIcon className="h-4 w-4 text-green-500" />
            <span>Automated alerts</span>
          </li>
        </ul>
      </CardContent>
      {link && (
        <CardFooter>
          <Button variant="link" asChild>
            <Link href={link.href}>{link.text} →</Link>
          </Button>
        </CardFooter>
      )}
    </Card>
  )
}
```

#### Usage Example - Pricing Card

```tsx
export function PricingCard({ plan, price, features, popular }: PricingCardProps) {
  return (
    <Card className={cn("relative", popular && "border-primary shadow-xl")}>
      {popular && (
        <Badge className="absolute -top-3 left-1/2 -translate-x-1/2">
          Most Popular
        </Badge>
      )}
      <CardHeader>
        <CardTitle>{plan}</CardTitle>
        <div className="mt-4">
          <span className="text-4xl font-bold">${price}</span>
          <span className="text-muted-foreground">/month</span>
        </div>
      </CardHeader>
      <CardContent>
        <ul className="space-y-3">
          {features.map((feature, i) => (
            <li key={i} className="flex items-center gap-2">
              <CheckIcon className="h-4 w-4 text-primary" />
              <span>{feature}</span>
            </li>
          ))}
        </ul>
      </CardContent>
      <CardFooter>
        <Button className="w-full" variant={popular ? "default" : "outline"}>
          Choose {plan}
        </Button>
      </CardFooter>
    </Card>
  )
}
```

---

### 3. Badge

**Purpose**: Small status indicators and labels
**Dependencies**: `@radix-ui/react-slot`
**Use Cases**: Plan indicators, feature tags, categories

#### Component API

```tsx
import { Badge } from "@/components/ui/badge"

// Variants: "default" | "secondary" | "destructive" | "outline"
```

#### Usage Examples

```tsx
// Plan indicator
<Badge variant="default">Most Popular</Badge>

// Feature tag
<Badge variant="secondary">New</Badge>

// Blog category
<Badge variant="outline">Fleet Management</Badge>

// Status
<Badge className="bg-green-100 text-green-800">Active</Badge>
```

---

### 4. Accordion

**Purpose**: Expandable FAQ sections
**Dependencies**: `@radix-ui/react-accordion`
**Use Cases**: FAQ, feature details

#### Component API

```tsx
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
```

#### Key Props

- `type`: "single" | "multiple" - Allow one or multiple items open
- `collapsible`: boolean - Allow closing all items
- `defaultValue`: string - Default open item

#### Usage Example - FAQ Section

```tsx
export function PricingFAQ() {
  return (
    <div className="mx-auto max-w-3xl">
      <h2 className="mb-8 text-center text-3xl font-bold">
        Frequently Asked Questions
      </h2>
      <Accordion type="single" collapsible className="w-full">
        <AccordionItem value="item-1">
          <AccordionTrigger>What's included in the free trial?</AccordionTrigger>
          <AccordionContent>
            The 30-day free trial includes full access to all Pro features,
            including real-time tracking, geofencing, maintenance scheduling,
            and advanced analytics. No credit card required.
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="item-2">
          <AccordionTrigger>Can I change plans later?</AccordionTrigger>
          <AccordionContent>
            Yes! You can upgrade or downgrade your plan at any time.
            Changes take effect immediately, and we'll prorate any charges.
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="item-3">
          <AccordionTrigger>What payment methods do you accept?</AccordionTrigger>
          <AccordionContent>
            We accept all major credit cards (Visa, MasterCard, American Express),
            PayPal, and bank transfers for annual subscriptions.
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  )
}
```

---

### 5. Tabs

**Purpose**: Content organization and switching
**Dependencies**: `@radix-ui/react-tabs`
**Use Cases**: Pricing toggle (monthly/yearly), feature categories

#### Component API

```tsx
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"
```

#### Usage Example - Pricing Toggle

```tsx
export function PricingToggle() {
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly')

  return (
    <div className="space-y-8">
      <Tabs defaultValue="monthly" onValueChange={(v) => setBillingCycle(v as any)}>
        <TabsList className="grid w-full max-w-md mx-auto grid-cols-2">
          <TabsTrigger value="monthly">Monthly</TabsTrigger>
          <TabsTrigger value="yearly">
            Yearly
            <Badge className="ml-2" variant="secondary">Save 20%</Badge>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="monthly" className="mt-8">
          <div className="grid gap-6 md:grid-cols-3">
            <PricingCard plan="Basic" price={29} features={basicFeatures} />
            <PricingCard plan="Pro" price={99} features={proFeatures} popular />
            <PricingCard plan="Enterprise" price={299} features={enterpriseFeatures} />
          </div>
        </TabsContent>

        <TabsContent value="yearly" className="mt-8">
          <div className="grid gap-6 md:grid-cols-3">
            <PricingCard plan="Basic" price={23} features={basicFeatures} />
            <PricingCard plan="Pro" price={79} features={proFeatures} popular />
            <PricingCard plan="Enterprise" price={239} features={enterpriseFeatures} />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
```

---

### 6. Table

**Purpose**: Data presentation and comparison
**Dependencies**: None
**Use Cases**: Pricing comparison, feature matrix

#### Component API

```tsx
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
```

#### Usage Example - Feature Comparison

```tsx
export function PricingComparison() {
  return (
    <div className="overflow-x-auto">
      <Table>
        <TableCaption>Compare plans and features</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[250px]">Feature</TableHead>
            <TableHead className="text-center">Trial</TableHead>
            <TableHead className="text-center">Basic</TableHead>
            <TableHead className="text-center">Pro</TableHead>
            <TableHead className="text-center">Enterprise</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow>
            <TableCell className="font-medium">Real-time Tracking</TableCell>
            <TableCell className="text-center">
              <CheckIcon className="mx-auto h-5 w-5 text-green-500" />
            </TableCell>
            <TableCell className="text-center">
              <CheckIcon className="mx-auto h-5 w-5 text-green-500" />
            </TableCell>
            <TableCell className="text-center">
              <CheckIcon className="mx-auto h-5 w-5 text-green-500" />
            </TableCell>
            <TableCell className="text-center">
              <CheckIcon className="mx-auto h-5 w-5 text-green-500" />
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell className="font-medium">Number of Vehicles</TableCell>
            <TableCell className="text-center">Up to 5</TableCell>
            <TableCell className="text-center">Up to 25</TableCell>
            <TableCell className="text-center">Up to 100</TableCell>
            <TableCell className="text-center">Unlimited</TableCell>
          </TableRow>
          <TableRow>
            <TableCell className="font-medium">Advanced Analytics</TableCell>
            <TableCell className="text-center">
              <XIcon className="mx-auto h-5 w-5 text-gray-300" />
            </TableCell>
            <TableCell className="text-center">
              <XIcon className="mx-auto h-5 w-5 text-gray-300" />
            </TableCell>
            <TableCell className="text-center">
              <CheckIcon className="mx-auto h-5 w-5 text-green-500" />
            </TableCell>
            <TableCell className="text-center">
              <CheckIcon className="mx-auto h-5 w-5 text-green-500" />
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </div>
  )
}
```

---

### 7. Avatar

**Purpose**: User photos and profile images
**Dependencies**: `@radix-ui/react-avatar`
**Use Cases**: Team members, testimonials, blog authors

#### Component API

```tsx
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar"
```

#### Usage Example - Team Member

```tsx
export function TeamMember({ name, role, image }: TeamMemberProps) {
  const initials = name.split(' ').map(n => n[0]).join('')

  return (
    <Card>
      <CardContent className="pt-6 text-center">
        <Avatar className="mx-auto h-24 w-24">
          <AvatarImage src={image} alt={name} />
          <AvatarFallback>{initials}</AvatarFallback>
        </Avatar>
        <h3 className="mt-4 font-semibold">{name}</h3>
        <p className="text-sm text-muted-foreground">{role}</p>
      </CardContent>
    </Card>
  )
}
```

#### Usage Example - Testimonial

```tsx
export function Testimonial({ quote, author }: TestimonialProps) {
  return (
    <Card>
      <CardContent className="pt-6">
        <p className="mb-4 italic">"{quote}"</p>
        <div className="flex items-center gap-3">
          <Avatar>
            <AvatarImage src={author.avatar} alt={author.name} />
            <AvatarFallback>{author.initials}</AvatarFallback>
          </Avatar>
          <div>
            <p className="font-medium">{author.name}</p>
            <p className="text-sm text-muted-foreground">
              {author.title}, {author.company}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
```

---

### 8. Button

**Purpose**: Call-to-action and interactive elements
**Dependencies**: `@radix-ui/react-slot`
**Use Cases**: CTAs, form submissions, navigation

#### Component API

```tsx
import { Button } from "@/components/ui/button"

// Variants: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link"
// Sizes: "default" | "sm" | "lg" | "icon"
```

#### Usage Examples

```tsx
// Primary CTA
<Button size="lg" className="text-lg">
  Request Demo
</Button>

// Secondary CTA
<Button variant="outline" size="lg">
  Learn More
</Button>

// Link button
<Button variant="link" asChild>
  <Link href="/pricing">View Pricing →</Link>
</Button>

// Icon button
<Button size="icon" variant="ghost">
  <MenuIcon />
</Button>
```

---

### 9. Hover Card

**Purpose**: Contextual information on hover
**Dependencies**: `@radix-ui/react-hover-card`
**Use Cases**: Feature details, team bios

#### Component API

```tsx
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card"
```

#### Usage Example

```tsx
export function FeatureLink({ feature }: FeatureProps) {
  return (
    <HoverCard>
      <HoverCardTrigger asChild>
        <Button variant="link">{feature.name}</Button>
      </HoverCardTrigger>
      <HoverCardContent className="w-80">
        <div className="space-y-2">
          <h4 className="font-semibold">{feature.name}</h4>
          <p className="text-sm text-muted-foreground">
            {feature.description}
          </p>
          <div className="flex gap-2">
            <Badge variant="secondary">{feature.category}</Badge>
          </div>
        </div>
      </HoverCardContent>
    </HoverCard>
  )
}
```

---

### 10. Tooltip

**Purpose**: Contextual help and guidance
**Dependencies**: `@radix-ui/react-tooltip`
**Use Cases**: Help text, feature explanations

#### Component API

```tsx
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
```

#### Usage Example

```tsx
export function PricingFeature({ name, description }: FeatureProps) {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <span className="flex items-center gap-1">
            {name}
            <HelpCircleIcon className="h-4 w-4 text-muted-foreground" />
          </span>
        </TooltipTrigger>
        <TooltipContent>
          <p className="max-w-xs">{description}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}
```

---

### 11. Separator

**Purpose**: Visual section dividers
**Dependencies**: `@radix-ui/react-separator`
**Use Cases**: Content sections, footer

#### Component API

```tsx
import { Separator } from "@/components/ui/separator"

// Orientation: "horizontal" | "vertical"
```

#### Usage Example

```tsx
export function Footer() {
  return (
    <footer className="border-t">
      <div className="container py-12">
        <div className="grid gap-8 md:grid-cols-4">
          {/* Footer content */}
        </div>
        <Separator className="my-8" />
        <div className="flex justify-between">
          <p className="text-sm text-muted-foreground">
            © 2025 Fleet Management. All rights reserved.
          </p>
          <div className="flex gap-4">
            {/* Social icons */}
          </div>
        </div>
      </div>
    </footer>
  )
}
```

---

### 12. Breadcrumb

**Purpose**: Navigation context
**Dependencies**: `@radix-ui/react-slot`
**Use Cases**: Page hierarchy (if needed)

#### Component API

```tsx
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
```

---

## Form Components & Validation

### Form Component

**Purpose**: Form validation wrapper
**Dependencies**: `@radix-ui/react-label`, `@radix-ui/react-slot`, `@hookform/resolvers`, `zod`, `react-hook-form`

#### Component API

```tsx
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
```

### Contact Form Example

```tsx
const contactFormSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  company: z.string().optional(),
  subject: z.string().min(1, "Please select a subject"),
  message: z.string().min(10, "Message must be at least 10 characters").max(1000),
})

type ContactFormValues = z.infer<typeof contactFormSchema>

export function ContactForm() {
  const form = useForm<ContactFormValues>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: {
      name: "",
      email: "",
      company: "",
      subject: "",
      message: "",
    },
  })

  async function onSubmit(data: ContactFormValues) {
    try {
      // Submit form data
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })

      if (response.ok) {
        toast.success("Message sent successfully!")
        form.reset()
      }
    } catch (error) {
      toast.error("Failed to send message. Please try again.")
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name *</FormLabel>
              <FormControl>
                <Input placeholder="John Doe" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email *</FormLabel>
              <FormControl>
                <Input type="email" placeholder="john@example.com" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="subject"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Subject *</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a subject" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="general">General Inquiry</SelectItem>
                  <SelectItem value="sales">Sales</SelectItem>
                  <SelectItem value="support">Support</SelectItem>
                  <SelectItem value="partnership">Partnership</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="message"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Message *</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Tell us about your inquiry..."
                  className="min-h-[120px]"
                  {...field}
                />
              </FormControl>
              <FormDescription>
                {field.value.length}/1000 characters
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" size="lg" className="w-full" disabled={form.formState.isSubmitting}>
          {form.formState.isSubmitting ? "Sending..." : "Send Message"}
        </Button>
      </form>
    </Form>
  )
}
```

### Demo Request Form Example

```tsx
const demoFormSchema = z.object({
  fullName: z.string().min(2, "Name is required"),
  email: z.string().email("Invalid email address"),
  company: z.string().min(2, "Company name is required"),
  phone: z.string().regex(/^[\d\s\-\+\(\)]+$/, "Invalid phone number").optional().or(z.literal("")),
  fleetSize: z.enum(["1-10", "11-50", "51-100", "101-500", "500+"], {
    required_error: "Please select your fleet size",
  }),
  industry: z.string().optional(),
  requirements: z.string().max(500).optional(),
})

type DemoFormValues = z.infer<typeof demoFormSchema>

export function DemoRequestForm() {
  const form = useForm<DemoFormValues>({
    resolver: zodResolver(demoFormSchema),
  })

  async function onSubmit(data: DemoFormValues) {
    // Handle demo request
    console.log(data)
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid gap-6 md:grid-cols-2">
          <FormField
            control={form.control}
            name="fullName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Full Name *</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email *</FormLabel>
                <FormControl>
                  <Input type="email" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="company"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Company *</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="phone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Phone</FormLabel>
                <FormControl>
                  <Input type="tel" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="fleetSize"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Fleet Size *</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select fleet size" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="1-10">1-10 vehicles</SelectItem>
                    <SelectItem value="11-50">11-50 vehicles</SelectItem>
                    <SelectItem value="51-100">51-100 vehicles</SelectItem>
                    <SelectItem value="101-500">101-500 vehicles</SelectItem>
                    <SelectItem value="500+">500+ vehicles</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="industry"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Industry</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select industry" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="transportation">Transportation</SelectItem>
                    <SelectItem value="logistics">Logistics</SelectItem>
                    <SelectItem value="construction">Construction</SelectItem>
                    <SelectItem value="utilities">Utilities</SelectItem>
                    <SelectItem value="government">Government</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="requirements"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Additional Requirements</FormLabel>
              <FormControl>
                <Textarea className="min-h-[100px]" {...field} />
              </FormControl>
              <FormDescription>
                Tell us about your specific needs (optional)
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" size="lg" className="w-full">
          Request Demo
        </Button>
      </form>
    </Form>
  )
}
```

---

## Aceternity Marketing Components

### 1. Hero Parallax

**Purpose**: Dynamic hero section with parallax scrolling
**Dependencies**: `motion` (Framer Motion)
**Use Cases**: Homepage hero

#### Component API

```tsx
import { HeroParallax } from "@/components/ui/hero-parallax"

interface Product {
  title: string
  link: string
  thumbnail: string
}
```

#### Usage Example

```tsx
const products = [
  {
    title: "Real-time Tracking",
    link: "/features/tracking",
    thumbnail: "/images/tracking-dashboard.png",
  },
  {
    title: "Geofencing",
    link: "/features/geofencing",
    thumbnail: "/images/geofencing.png",
  },
  // Add 8-12 products for best visual effect
]

export function HomepageHero() {
  return (
    <HeroParallax products={products}>
      <h1 className="text-4xl md:text-6xl font-bold">
        Modern Fleet Management
      </h1>
      <p className="mt-4 text-xl text-muted-foreground">
        Track, manage, and optimize your fleet in real-time
      </p>
    </HeroParallax>
  )
}
```

---

### 2. Hero Highlight

**Purpose**: Highlighted hero text with animations
**Dependencies**: `mini-svg-data-uri`, `motion`
**Use Cases**: Hero sections with emphasis

#### Component API

```tsx
import { HeroHighlight, Highlight } from "@/components/ui/hero-highlight"
```

#### Usage Example

```tsx
export function HeroSection() {
  return (
    <HeroHighlight>
      <h1 className="text-4xl md:text-6xl font-bold text-center">
        Transform your fleet with{" "}
        <Highlight className="text-primary">
          intelligent tracking
        </Highlight>
        {" "}and analytics
      </h1>
    </HeroHighlight>
  )
}
```

---

### 3. Animated Testimonials

**Purpose**: Customer testimonial carousel with animations
**Dependencies**: `@tabler/icons-react`, `motion`
**Use Cases**: Social proof, customer quotes

#### Component API

```tsx
import { AnimatedTestimonials } from "@/components/ui/animated-testimonials"

interface Testimonial {
  quote: string
  name: string
  designation: string
  src: string
}
```

#### Usage Example

```tsx
const testimonials = [
  {
    quote: "This platform has completely transformed how we manage our fleet. Real-time tracking and automated maintenance alerts have saved us countless hours.",
    name: "Sarah Johnson",
    designation: "Fleet Manager at TransportCo",
    src: "/images/testimonials/sarah.jpg",
  },
  {
    quote: "The analytics dashboard provides insights we never had before. We've reduced fuel costs by 20% in just three months.",
    name: "Michael Chen",
    designation: "Operations Director at LogisticsPro",
    src: "/images/testimonials/michael.jpg",
  },
  {
    quote: "Easy to use, powerful features, and excellent customer support. Highly recommended for any fleet operation.",
    name: "Emily Rodriguez",
    designation: "CEO at DeliveryFirst",
    src: "/images/testimonials/emily.jpg",
  },
]

export function TestimonialsSection() {
  return (
    <section className="py-20">
      <h2 className="mb-12 text-center text-3xl font-bold">
        What Our Customers Say
      </h2>
      <AnimatedTestimonials testimonials={testimonials} autoplay={true} />
    </section>
  )
}
```

---

### 4. 3D Card

**Purpose**: Interactive cards with 3D hover effects
**Dependencies**: None
**Use Cases**: Feature showcase, product highlights

#### Component API

```tsx
import { CardContainer, CardBody, CardItem } from "@/components/ui/3d-card"
```

#### Usage Example

```tsx
export function Feature3DCard({ feature }: FeatureProps) {
  return (
    <CardContainer className="inter-var">
      <CardBody className="relative group/card hover:shadow-2xl border-black/[0.1] w-full h-auto rounded-xl p-6 border">
        <CardItem translateZ="50" className="text-xl font-bold">
          {feature.title}
        </CardItem>
        <CardItem
          as="p"
          translateZ="60"
          className="text-sm text-muted-foreground mt-2"
        >
          {feature.description}
        </CardItem>
        <CardItem translateZ="100" className="w-full mt-4">
          <Image
            src={feature.image}
            height={400}
            width={600}
            className="w-full rounded-xl object-cover"
            alt={feature.title}
          />
        </CardItem>
        <div className="flex justify-between items-center mt-6">
          <CardItem
            translateZ={20}
            as={Link}
            href={feature.link}
            className="text-sm font-medium text-primary"
          >
            Learn more →
          </CardItem>
        </div>
      </CardBody>
    </CardContainer>
  )
}
```

---

### 5. Card Stack

**Purpose**: Stacked content presentation
**Dependencies**: `motion`
**Use Cases**: Feature highlights, benefits

#### Component API

```tsx
import { CardStack } from "@/components/ui/card-stack"

interface Card {
  id: number
  name: string
  designation: string
  content: React.ReactNode
}
```

---

## Integration Patterns

### 1. Layout Structure

```tsx
// apps/marketing/app/[locale]/layout.tsx
import { Header } from "@/components/marketing/Header"
import { Footer } from "@/components/marketing/Footer"

export default function MarketingLayout({
  children,
  params: { locale },
}: {
  children: React.ReactNode
  params: { locale: string }
}) {
  return (
    <div className="flex min-h-screen flex-col">
      <Header locale={locale} />
      <main className="flex-1">{children}</main>
      <Footer locale={locale} />
    </div>
  )
}
```

### 2. Internationalization with Components

```tsx
import { useTranslations } from 'next-intl'

export function PricingPage() {
  const t = useTranslations('pricing')

  return (
    <div>
      <h1>{t('title')}</h1>
      <Tabs defaultValue="monthly">
        <TabsList>
          <TabsTrigger value="monthly">{t('billing.monthly')}</TabsTrigger>
          <TabsTrigger value="yearly">{t('billing.yearly')}</TabsTrigger>
        </TabsList>
        {/* ... */}
      </Tabs>
    </div>
  )
}
```

### 3. Responsive Grid Patterns

```tsx
// Feature grid
<div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
  {features.map((feature) => (
    <FeatureCard key={feature.id} {...feature} />
  ))}
</div>

// Pricing grid
<div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
  {plans.map((plan) => (
    <PricingCard key={plan.id} {...plan} />
  ))}
</div>

// Team grid
<div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
  {team.map((member) => (
    <TeamMember key={member.id} {...member} />
  ))}
</div>
```

### 4. Loading States

```tsx
export function DemoForm() {
  const [isSubmitting, setIsSubmitting] = useState(false)

  return (
    <form onSubmit={handleSubmit}>
      {/* Form fields */}
      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? (
          <>
            <Loader2Icon className="mr-2 h-4 w-4 animate-spin" />
            Submitting...
          </>
        ) : (
          "Request Demo"
        )}
      </Button>
    </form>
  )
}
```

### 5. Error Handling

```tsx
export function ContactForm() {
  const form = useForm<ContactFormValues>({
    resolver: zodResolver(contactFormSchema),
  })

  async function onSubmit(data: ContactFormValues) {
    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        throw new Error('Failed to send message')
      }

      toast({
        title: "Success!",
        description: "Your message has been sent.",
      })

      form.reset()
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to send message. Please try again.",
      })
    }
  }

  return (
    <Form {...form}>
      {/* Form implementation */}
    </Form>
  )
}
```

---

## Best Practices

### 1. Accessibility

**Keyboard Navigation**
```tsx
// Ensure all interactive elements are keyboard accessible
<Button onKeyDown={(e) => e.key === 'Enter' && handleAction()}>
  Action
</Button>

// Use semantic HTML
<nav aria-label="Main navigation">
  <NavigationMenu />
</nav>
```

**ARIA Labels**
```tsx
// Icon-only buttons
<Button size="icon" aria-label="Open menu">
  <MenuIcon />
</Button>

// Form fields
<FormField
  control={form.control}
  name="email"
  render={({ field }) => (
    <FormItem>
      <FormLabel htmlFor="email">Email</FormLabel>
      <FormControl>
        <Input id="email" aria-required="true" {...field} />
      </FormControl>
      <FormMessage aria-live="polite" />
    </FormItem>
  )}
/>
```

**Focus Management**
```tsx
// Visible focus indicators
<Button className="focus-visible:ring-2 focus-visible:ring-primary">
  Click me
</Button>
```

### 2. Performance

**Code Splitting**
```tsx
// Lazy load heavy components
const AnimatedTestimonials = dynamic(
  () => import('@/components/ui/animated-testimonials'),
  { loading: () => <TestimonialsSkeleton /> }
)
```

**Image Optimization**
```tsx
import Image from 'next/image'

<Image
  src="/hero-image.png"
  alt="Fleet Management Dashboard"
  width={1200}
  height={600}
  priority // For above-the-fold images
  quality={85}
/>
```

**Memoization**
```tsx
const MemoizedFeatureCard = React.memo(FeatureCard)

export function FeaturesGrid({ features }) {
  return (
    <div className="grid gap-6 md:grid-cols-3">
      {features.map((feature) => (
        <MemoizedFeatureCard key={feature.id} {...feature} />
      ))}
    </div>
  )
}
```

### 3. Responsive Design

**Mobile-First Approach**
```tsx
// Start with mobile, add breakpoints
<Card className="p-4 md:p-6 lg:p-8">
  <CardTitle className="text-xl md:text-2xl lg:text-3xl">
    {title}
  </CardTitle>
</Card>
```

**Responsive Grids**
```tsx
// Automatically responsive
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
  {items.map((item) => <Item key={item.id} {...item} />)}
</div>
```

**Mobile Navigation**
```tsx
// Hide desktop nav on mobile, show mobile menu
<div className="hidden lg:flex">
  <NavigationMenu />
</div>
<div className="lg:hidden">
  <MobileMenu />
</div>
```

### 4. Type Safety

**Component Props**
```tsx
interface PricingCardProps {
  plan: string
  price: number
  features: string[]
  popular?: boolean
  billingCycle: 'monthly' | 'yearly'
}

export function PricingCard({
  plan,
  price,
  features,
  popular = false,
  billingCycle
}: PricingCardProps) {
  // Implementation
}
```

**Form Schemas**
```tsx
const formSchema = z.object({
  email: z.string().email(),
  fleetSize: z.enum(['1-10', '11-50', '51-100', '101-500', '500+']),
})

type FormValues = z.infer<typeof formSchema>
```

---

## Common Marketing Patterns

### 1. Hero Section with CTA

```tsx
export function HeroSection() {
  const t = useTranslations('home.hero')

  return (
    <section className="relative overflow-hidden py-20 md:py-32">
      <div className="container">
        <div className="mx-auto max-w-3xl text-center">
          <Badge className="mb-4" variant="secondary">
            {t('badge')}
          </Badge>
          <h1 className="text-4xl font-bold tracking-tight md:text-6xl lg:text-7xl">
            {t('title')}
          </h1>
          <p className="mt-6 text-lg text-muted-foreground md:text-xl">
            {t('description')}
          </p>
          <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:justify-center">
            <Button size="lg" asChild>
              <Link href="/demo">{t('cta.primary')}</Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href="/features">{t('cta.secondary')}</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}
```

### 2. Feature Grid

```tsx
export function FeaturesSection() {
  const features = [
    {
      icon: <MapPinIcon className="h-10 w-10" />,
      title: "Real-time Tracking",
      description: "Monitor your fleet's location in real-time with GPS tracking",
    },
    // ... more features
  ]

  return (
    <section className="py-20">
      <div className="container">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold md:text-4xl">
            Everything you need to manage your fleet
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Powerful features to streamline your operations
          </p>
        </div>

        <div className="mt-16 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, i) => (
            <Card key={i} className="border-none shadow-lg">
              <CardHeader>
                <div className="mb-4 text-primary">{feature.icon}</div>
                <CardTitle>{feature.title}</CardTitle>
                <CardDescription>{feature.description}</CardDescription>
              </CardHeader>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
```

### 3. Social Proof Section

```tsx
export function SocialProofSection() {
  return (
    <section className="border-y bg-muted/50 py-16">
      <div className="container">
        <p className="mb-8 text-center text-sm font-medium text-muted-foreground">
          TRUSTED BY LEADING COMPANIES
        </p>
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4 lg:grid-cols-6">
          {logos.map((logo) => (
            <div key={logo.name} className="flex items-center justify-center opacity-50 grayscale transition hover:opacity-100 hover:grayscale-0">
              <Image
                src={logo.src}
                alt={logo.name}
                width={120}
                height={40}
                className="h-10 w-auto"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
```

### 4. CTA Section

```tsx
export function CTASection() {
  return (
    <section className="py-20">
      <div className="container">
        <Card className="border-primary/20 bg-gradient-to-br from-primary/5 to-primary/10">
          <CardContent className="p-8 md:p-12">
            <div className="mx-auto max-w-2xl text-center">
              <h2 className="text-3xl font-bold md:text-4xl">
                Ready to transform your fleet management?
              </h2>
              <p className="mt-4 text-lg text-muted-foreground">
                Join thousands of companies using our platform
              </p>
              <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:justify-center">
                <Button size="lg">
                  Start Free Trial
                </Button>
                <Button size="lg" variant="outline">
                  Schedule Demo
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  )
}
```

### 5. FAQ Section

```tsx
export function FAQSection() {
  const faqs = [
    {
      question: "What's included in the free trial?",
      answer: "The 30-day free trial includes full access to all Pro features...",
    },
    // ... more FAQs
  ]

  return (
    <section className="py-20">
      <div className="container">
        <div className="mx-auto max-w-3xl">
          <h2 className="mb-12 text-center text-3xl font-bold">
            Frequently Asked Questions
          </h2>
          <Accordion type="single" collapsible className="w-full">
            {faqs.map((faq, i) => (
              <AccordionItem key={i} value={`item-${i}`}>
                <AccordionTrigger className="text-left">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  )
}
```

---

## Additional Resources

### Alternative Components from Other Registries

While the requirements focus on @shadcn and @aceternity, the following registries are also available:

- **@originui**: Extended UI component variants
- **@cult**: Additional component library
- **@kibo**: Additional component library
- **@reui**: Additional component library

You can search these registries for alternative implementations:

```bash
# Search for components
npx shadcn@latest search button @originui
npx shadcn@latest search card @cult
```

### Component Dependencies Summary

**Radix UI Dependencies** (automatically installed):
- `@radix-ui/react-navigation-menu`
- `@radix-ui/react-avatar`
- `@radix-ui/react-accordion`
- `@radix-ui/react-tabs`
- `@radix-ui/react-select`
- `@radix-ui/react-label`
- `@radix-ui/react-slot`
- `@radix-ui/react-hover-card`
- `@radix-ui/react-tooltip`
- `@radix-ui/react-separator`

**Form Dependencies** (for validation):
- `react-hook-form`
- `@hookform/resolvers`
- `zod`

**Animation Dependencies**:
- `motion` (Framer Motion) - for Aceternity components
- `mini-svg-data-uri` - for hero-highlight
- `@tabler/icons-react` - for animated-testimonials

---

## Next Steps

1. **Install Core Components**: Run the installation commands for all required components
2. **Set Up Form Validation**: Install react-hook-form and zod for form handling
3. **Create Base Components**: Build reusable marketing components (CTASection, FeatureCard, etc.)
4. **Implement Layouts**: Create Header and Footer components using navigation-menu
5. **Build Pages**: Implement each page following the patterns documented above
6. **Add Internationalization**: Integrate next-intl with all components
7. **Test Accessibility**: Verify WCAG 2.1 Level AA compliance
8. **Optimize Performance**: Implement lazy loading and image optimization

---

## Conclusion

This research document provides all necessary information to implement the Phase 3 marketing website using shadcn/ui components. All components are production-ready, accessible, and optimized for marketing use cases. The examples and patterns provided are specifically tailored for the fleet management platform's marketing needs.

**Key Takeaways**:
- 17 core shadcn components + 5 Aceternity marketing components
- Complete form validation setup with react-hook-form and zod
- Responsive, accessible, and performant implementation patterns
- Ready-to-use code examples for all major marketing sections
- Full TypeScript support with type-safe props and schemas

For implementation guidance, refer to the specific component sections and integration patterns above.
