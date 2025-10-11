import { useState } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import * as z from 'zod'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Button,
  Input,
  Label,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Badge,
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
  Checkbox,
} from '@fleet/ui-web'
import { MapPin, TrendingUp, Clock, DollarSign, Zap } from 'lucide-react'

const routeOptimizerSchema = z.object({
  origin: z.string().min(1, 'Origin is required'),
  destination: z.string().min(1, 'Destination is required'),
  vehicleType: z.string().min(1, 'Vehicle type is required'),
  priority: z.enum(['fastest', 'shortest', 'fuel-efficient', 'balanced']),
  avoidTolls: z.boolean().default(false),
  avoidHighways: z.boolean().default(false),
  avoidFerries: z.boolean().default(false),
})

type RouteOptimizerData = z.infer<typeof routeOptimizerSchema>

const mockOptimizedRoutes = [
  {
    id: 'r1',
    name: 'Fastest Route',
    distance: 145,
    duration: 135,
    fuelCost: 28.50,
    tollCost: 12.00,
    savings: 0,
    efficiency: 85,
    highlights: ['Uses highways', 'Light traffic'],
  },
  {
    id: 'r2',
    name: 'Most Fuel Efficient',
    distance: 152,
    duration: 155,
    fuelCost: 24.80,
    tollCost: 8.00,
    savings: 7.70,
    efficiency: 95,
    highlights: ['Avoids steep grades', 'Optimal speed zones'],
  },
  {
    id: 'r3',
    name: 'Shortest Distance',
    distance: 138,
    duration: 148,
    fuelCost: 26.20,
    tollCost: 15.00,
    savings: 2.30,
    efficiency: 88,
    highlights: ['Direct route', 'Toll roads'],
  },
]

export function RouteOptimizer() {
  const [optimizedRoutes, setOptimizedRoutes] = useState<typeof mockOptimizedRoutes | null>(null)
  const [isOptimizing, setIsOptimizing] = useState(false)

  const form = useForm<RouteOptimizerData>({
    resolver: zodResolver(routeOptimizerSchema),
    defaultValues: {
      origin: '',
      destination: '',
      vehicleType: '',
      priority: 'balanced',
      avoidTolls: false,
      avoidHighways: false,
      avoidFerries: false,
    },
  })

  const onSubmit = async (data: RouteOptimizerData) => {
    setIsOptimizing(true)
    console.log('Optimizing route:', data)

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000))

    setOptimizedRoutes(mockOptimizedRoutes)
    setIsOptimizing(false)
  }

  const handleSelectRoute = (routeId: string) => {
    console.log('Selected route:', routeId)
    // Handle route selection
  }

  return (
    <div className="space-y-6">
      {/* Optimizer Form */}
      <Card>
        <CardHeader>
          <CardTitle>Route Optimizer</CardTitle>
          <CardDescription>Find the most efficient route for your delivery</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <FormField
                  control={form.control}
                  name="origin"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Origin</FormLabel>
                      <FormControl>
                        <Input placeholder="Chicago, IL" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="destination"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Destination</FormLabel>
                      <FormControl>
                        <Input placeholder="Milwaukee, WI" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <FormField
                  control={form.control}
                  name="vehicleType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Vehicle Type</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select vehicle" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="truck">Truck</SelectItem>
                          <SelectItem value="van">Van</SelectItem>
                          <SelectItem value="sedan">Sedan</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="priority"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Priority</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select priority" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="fastest">Fastest Time</SelectItem>
                          <SelectItem value="shortest">Shortest Distance</SelectItem>
                          <SelectItem value="fuel-efficient">Most Fuel Efficient</SelectItem>
                          <SelectItem value="balanced">Balanced</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="space-y-3">
                <FormField
                  control={form.control}
                  name="avoidTolls"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel>Avoid tolls</FormLabel>
                      </div>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="avoidHighways"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel>Avoid highways</FormLabel>
                      </div>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="avoidFerries"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel>Avoid ferries</FormLabel>
                      </div>
                    </FormItem>
                  )}
                />
              </div>

              <Button type="submit" className="w-full" disabled={isOptimizing}>
                {isOptimizing ? (
                  <>
                    <Zap className="mr-2 h-4 w-4 animate-pulse" />
                    Optimizing Routes...
                  </>
                ) : (
                  <>
                    <Zap className="mr-2 h-4 w-4" />
                    Optimize Route
                  </>
                )}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      {/* Optimized Routes Results */}
      {optimizedRoutes && (
        <div className="space-y-4">
          <div>
            <h3 className="text-lg font-semibold">Optimized Routes</h3>
            <p className="text-sm text-muted-foreground">Compare different route options</p>
          </div>

          {optimizedRoutes.map((route) => (
            <Card key={route.id} className="hover:border-primary cursor-pointer transition-colors">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <CardTitle className="text-lg">{route.name}</CardTitle>
                    {route.efficiency >= 90 && (
                      <Badge variant="secondary">Recommended</Badge>
                    )}
                  </div>
                  <Button onClick={() => handleSelectRoute(route.id)}>
                    Select Route
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-4 mb-4">
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <div className="text-sm text-muted-foreground">Distance</div>
                      <div className="font-semibold">{route.distance} km</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <div className="text-sm text-muted-foreground">Duration</div>
                      <div className="font-semibold">{route.duration} min</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <DollarSign className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <div className="text-sm text-muted-foreground">Total Cost</div>
                      <div className="font-semibold">${(route.fuelCost + route.tollCost).toFixed(2)}</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <TrendingUp className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <div className="text-sm text-muted-foreground">Efficiency</div>
                      <div className="font-semibold">{route.efficiency}%</div>
                    </div>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 mb-4">
                  {route.highlights.map((highlight, index) => (
                    <Badge key={index} variant="outline">{highlight}</Badge>
                  ))}
                </div>

                <div className="flex items-center justify-between text-sm">
                  <div className="flex gap-4">
                    <span className="text-muted-foreground">Fuel: ${route.fuelCost.toFixed(2)}</span>
                    <span className="text-muted-foreground">Tolls: ${route.tollCost.toFixed(2)}</span>
                  </div>
                  {route.savings > 0 && (
                    <div className="text-green-600 font-medium">
                      Save ${route.savings.toFixed(2)}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
