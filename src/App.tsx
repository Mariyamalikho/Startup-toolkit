import React from 'react'
import { Button } from '@/components/ui/Button'
import { H1, H2, H3, H4, P, Lead, Large, Small, Muted } from '@/components/ui/Typography'
import { Input } from '@/components/ui/Input'
import { Label } from '@/components/ui/Label'
import { Textarea } from '@/components/ui/Textarea'
import { Select } from '@/components/ui/Select'
import {
  Card,
  CardHeader,
  CardFooter,
  CardTitle,
  CardDescription,
  CardContent,
} from '@/components/ui/Card'
import { GlassPanel } from '@/components/ui/GlassPanel'
import { ThemeToggle } from '@/components/ui/ThemeToggle'
import {
  Modal,
  ModalTrigger,
  ModalContent,
  ModalHeader,
  ModalTitle,
  ModalDescription,
  ModalFooter,
} from '@/components/ui/Modal'
import { Dialog, DialogTrigger, DialogContent } from '@/components/ui/Dialog'
import { useToast } from '@/components/ui/Toast'
import {
  SkeletonCard,
  SkeletonText,
  SkeletonAvatar,
  SkeletonDashboard,
  SkeletonEmpathyMap,
} from '@/components/ui/Skeleton'
import {
  Spinner,
  LoadingDots,
  LoadingOverlay,
  InlineLoader,
  LoadingButton,
} from '@/components/ui/Spinner'
import {
  EmptyState,
  EmptyProjects,
  EmptySearchResults,
  EmptyTool,
  EmptyError,
} from '@/components/ui/EmptyState'
import { InlineErrorBoundary, useErrorBoundary } from '@/components/ui/ErrorBoundary'

// CrashTester — sandbox demo component that simulates a render error
function CrashTester() {
  const { throwError } = useErrorBoundary()
  return (
    <div className="flex items-center justify-between rounded-xl border border-border bg-muted/30 p-4">
      <div>
        <p className="text-sm font-medium text-foreground">Crash test component</p>
        <p className="text-xs text-muted-foreground mt-0.5">
          Click to simulate a render error caught by the boundary.
        </p>
      </div>
      <Button
        variant="destructive"
        size="sm"
        onClick={() => throwError(new Error('Simulated render crash for testing'))}
      >
        Trigger Error
      </Button>
    </div>
  )
}

function App() {
  const { toast, dismissAll, promise } = useToast()
  const [isLoading, setIsLoading] = React.useState(false)
  const [showOverlay, setShowOverlay] = React.useState(false)

  return (
    <div className="flex min-h-screen flex-col items-center justify-start bg-background p-8 space-y-12 transition-colors duration-300">
      <div className="rounded-2xl bg-surface p-8 shadow-xl border border-border max-w-3xl w-full">
        <div className="flex items-center justify-between mb-4">
          <H1 className="m-0">Component Sandbox</H1>
          <ThemeToggle />
        </div>
        <Lead className="mb-8">
          Preview of all our base components and design tokens in action.
        </Lead>

        <div className="space-y-6">
          <section>
            <H2>Forms & Inputs</H2>
            <div className="mt-4 grid gap-6 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input type="email" id="email" placeholder="name@example.com" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input type="password" id="password" placeholder="Enter your password" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="disabled">Disabled Input</Label>
                <Input id="disabled" disabled placeholder="You can't type here" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="error-input" className="text-red-500">
                  Error Input
                </Label>
                <Input
                  id="error-input"
                  error
                  placeholder="Something went wrong"
                  defaultValue="Invalid data"
                />
                <p className="text-sm text-red-500 font-medium">Please enter a valid value.</p>
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="bio">Biography</Label>
                <Textarea id="bio" placeholder="Tell us a little bit about yourself" />
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="role">Role</Label>
                <Select id="role" defaultValue="developer" aria-label="Select your role">
                  <option value="" disabled>
                    Select your role
                  </option>
                  <option value="developer">Software Developer</option>
                  <option value="designer">Product Designer</option>
                  <option value="manager">Product Manager</option>
                </Select>
              </div>
            </div>
          </section>

          <section>
            <H2 className="mt-8">Typography</H2>
            <P>
              This is a standard paragraph. It demonstrates the default body text style, line
              height, and spacing. When placed consecutively, it automatically applies top margin to
              separate itself from the previous element.
            </P>
            <H3 className="mt-6">Heading 3: Sub-feature</H3>
            <P>
              Here is another paragraph under an H3. Notice how the hierarchy scales down cleanly.
            </P>
            <H4 className="mt-6">Heading 4: Minor Detail</H4>
            <Muted className="mt-2">
              This is muted text, typically used for secondary information or captions.
            </Muted>
            <div className="mt-4 flex gap-4 items-center">
              <Large>Large Text Element</Large>
              <Small>Small Text Element</Small>
            </div>
          </section>

          <section>
            <H2 className="mt-8 mb-6">Cards</H2>
            <div className="grid gap-6 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Project: Eco-Packaging</CardTitle>
                  <CardDescription>Created 2 days ago</CardDescription>
                </CardHeader>
                <CardContent>
                  <P className="text-sm">
                    A sustainable alternative to plastic bubble wrap using biodegradable materials.
                  </P>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Button variant="outline" size="sm">
                    Cancel
                  </Button>
                  <Button size="sm">Deploy</Button>
                </CardFooter>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Task Statistics</CardTitle>
                  <CardDescription>Your weekly progress</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm font-medium">Completed</span>
                      <span className="text-sm text-muted-foreground">12/15</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm font-medium">Pending</span>
                      <span className="text-sm text-muted-foreground">3</span>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button variant="ghost" size="sm" className="w-full">
                    View Details
                  </Button>
                </CardFooter>
              </Card>
            </div>
          </section>

          <section className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-primary to-secondary p-8 mt-8">
            <div className="absolute -top-12 -right-12 w-48 h-48 bg-white/20 rounded-full blur-2xl"></div>
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-black/10 rounded-full blur-xl"></div>

            <H2 className="mb-6 text-white relative z-10 border-white/20">Glassmorphism</H2>

            <div className="grid gap-6 md:grid-cols-2 relative z-10">
              <GlassPanel variant="default" className="p-6">
                <H3 className="text-white mb-2">Default Glass</H3>
                <P className="text-white/80 text-sm">
                  Medium blur with 40% white opacity. Perfect for overlay panels and sidebars over
                  rich backgrounds.
                </P>
              </GlassPanel>

              <GlassPanel variant="light" className="p-6">
                <H3 className="text-white mb-2">Light Glass</H3>
                <P className="text-white/80 text-sm">
                  Subtle blur with 10% white opacity. Great for subtle emphasis over dark or highly
                  saturated backgrounds.
                </P>
              </GlassPanel>
            </div>
          </section>

          <section>
            <H2 className="mt-8 mb-6">Interactive Overlays</H2>
            <div className="p-6 border border-dashed border-border rounded-xl flex justify-center items-center">
              <Modal>
                <ModalTrigger asChild>
                  <Button size="lg">Open Animated Modal</Button>
                </ModalTrigger>
                <ModalContent>
                  <ModalHeader>
                    <ModalTitle>Create New Project</ModalTitle>
                    <ModalDescription>
                      Initialize a new startup project workspace. This will create a local storage
                      record.
                    </ModalDescription>
                  </ModalHeader>
                  <div className="space-y-4 py-4">
                    <div className="space-y-2">
                      <Label htmlFor="project-name">Project Name</Label>
                      <Input id="project-name" placeholder="e.g. Eco-Packaging" />
                    </div>
                  </div>
                  <ModalFooter>
                    <Button variant="outline">Cancel</Button>
                    <Button>Create Workspace</Button>
                  </ModalFooter>
                </ModalContent>
              </Modal>
            </div>
          </section>

          <section>
            <H2 className="mt-8 mb-2">Confirmation Dialogs</H2>
            <P className="text-sm text-muted-foreground mb-6">
              Reusable dialog component with four semantic variants for different confirmation
              contexts.
            </P>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="outline" size="sm">
                    Info Dialog
                  </Button>
                </DialogTrigger>
                <DialogContent
                  variant="default"
                  title="Update Available"
                  description="A new version of Startup Toolkit is ready. Would you like to apply the update now?"
                  confirmLabel="Update Now"
                />
              </Dialog>

              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="destructive" size="sm">
                    Delete Dialog
                  </Button>
                </DialogTrigger>
                <DialogContent
                  variant="destructive"
                  title="Delete Project?"
                  description="This will permanently delete &ldquo;Eco-Packaging&rdquo; and all its data. This action cannot be undone."
                  confirmLabel="Yes, Delete"
                />
              </Dialog>

              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="outline" size="sm">
                    Warning Dialog
                  </Button>
                </DialogTrigger>
                <DialogContent
                  variant="warning"
                  title="Unsaved Changes"
                  description="You have unsaved changes to your Business Model Canvas. Leaving now will discard them."
                  confirmLabel="Leave Anyway"
                  cancelLabel="Stay"
                />
              </Dialog>

              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="outline" size="sm">
                    Success Dialog
                  </Button>
                </DialogTrigger>
                <DialogContent
                  variant="success"
                  title="Export Complete"
                  description="Your Business Model Canvas has been exported as a PDF and is ready to download."
                  confirmLabel="Download PDF"
                  cancelLabel="Close"
                />
              </Dialog>
            </div>
          </section>

          <section>
            <H2 className="mt-8 mb-2">Toast Notifications</H2>
            <P className="text-sm text-muted-foreground mb-6">
              Trigger global toast notifications from anywhere in the app. Auto-dismisses after 4s.
            </P>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <Button
                variant="outline"
                size="sm"
                onClick={() =>
                  toast({
                    variant: 'success',
                    title: 'Project saved',
                    description: 'Your changes have been saved automatically.',
                  })
                }
              >
                Success Toast
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() =>
                  toast({
                    variant: 'error',
                    title: 'Something went wrong',
                    description: 'Could not connect to Supabase. Please retry.',
                  })
                }
              >
                Error Toast
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() =>
                  toast({
                    variant: 'warning',
                    title: 'Unsaved changes',
                    description: 'Navigate away to discard your current edits.',
                  })
                }
              >
                Warning Toast
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() =>
                  toast({
                    variant: 'info',
                    title: 'New milestone reached',
                    description: 'You completed Day 14 of your 90-day plan!',
                  })
                }
              >
                Info Toast
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  const fakeAsync = new Promise<string>((resolve) =>
                    setTimeout(() => resolve('done'), 2000),
                  )
                  promise(fakeAsync, {
                    loading: 'Saving to Supabase…',
                    success: 'Project synced successfully!',
                    error: 'Failed to sync. Please retry.',
                  })
                }}
              >
                Promise Toast
              </Button>
              <Button variant="ghost" size="sm" onClick={dismissAll}>
                Dismiss All
              </Button>
            </div>
          </section>
        </div>
      </div>

      {/* ── Skeleton Section ─────────────────────────────────────── */}
      <div className="rounded-2xl bg-surface p-8 shadow-xl border border-border max-w-3xl w-full">
        <H1 className="mb-1">Loading Skeletons</H1>
        <Lead className="mb-8">Placeholder UI shown while data is being fetched.</Lead>

        <div className="space-y-10">
          {/* Base skeleton shapes */}
          <section>
            <H2 className="mb-4">Base Shapes</H2>
            <div className="flex flex-wrap items-center gap-4">
              <SkeletonAvatar size={10} />
              <SkeletonAvatar size={8} />
              <SkeletonAvatar size={6} />
              <div className="space-y-2 flex-1">
                <SkeletonText lines={2} />
              </div>
            </div>
          </section>

          {/* Project card skeletons */}
          <section>
            <H2 className="mb-4">Project Cards</H2>
            <div className="grid sm:grid-cols-2 gap-4">
              <SkeletonCard />
              <SkeletonCard />
            </div>
          </section>

          {/* Dashboard skeleton */}
          <section>
            <H2 className="mb-4">Dashboard Grid</H2>
            <SkeletonDashboard count={3} />
          </section>

          {/* Empathy map skeleton */}
          <section>
            <H2 className="mb-4">Empathy Map Tool</H2>
            <SkeletonEmpathyMap />
          </section>
        </div>
      </div>

      {/* ── Spinners & Inline Loading Section ─────────────────────── */}
      <div className="rounded-2xl bg-surface p-8 shadow-xl border border-border max-w-3xl w-full">
        <H1 className="mb-1">Spinners & Loading States</H1>
        <Lead className="mb-8">Inline loading indicators for async actions and data fetching.</Lead>

        <div className="space-y-10">
          {/* Spinner sizes */}
          <section>
            <H2 className="mb-4">Spinner Sizes</H2>
            <div className="flex items-center gap-6 flex-wrap">
              <div className="flex flex-col items-center gap-2">
                <Spinner size="xs" variant="default" />
                <Muted className="text-xs">xs</Muted>
              </div>
              <div className="flex flex-col items-center gap-2">
                <Spinner size="sm" variant="default" />
                <Muted className="text-xs">sm</Muted>
              </div>
              <div className="flex flex-col items-center gap-2">
                <Spinner size="md" variant="default" />
                <Muted className="text-xs">md</Muted>
              </div>
              <div className="flex flex-col items-center gap-2">
                <Spinner size="lg" variant="default" />
                <Muted className="text-xs">lg</Muted>
              </div>
              <div className="flex flex-col items-center gap-2">
                <Spinner size="xl" variant="default" />
                <Muted className="text-xs">xl</Muted>
              </div>
            </div>
          </section>

          {/* Loading Dots */}
          <section>
            <H2 className="mb-4">Loading Dots</H2>
            <div className="flex items-center gap-8">
              <div className="flex flex-col items-center gap-2">
                <LoadingDots variant="default" />
                <Muted className="text-xs">default</Muted>
              </div>
              <div className="flex flex-col items-center gap-2">
                <LoadingDots variant="muted" />
                <Muted className="text-xs">muted</Muted>
              </div>
              <div className="bg-foreground rounded-lg px-4 py-2 flex flex-col items-center gap-2">
                <LoadingDots variant="white" />
                <Muted className="text-xs text-white/60">white</Muted>
              </div>
            </div>
          </section>

          {/* Inline Loader */}
          <section>
            <H2 className="mb-4">Inline Loader</H2>
            <div className="flex flex-col gap-3">
              <InlineLoader message="Saving your project…" />
              <InlineLoader message="Syncing to Supabase…" size="md" />
              <InlineLoader message="Exporting to PDF…" size="lg" />
            </div>
          </section>

          {/* Loading Button */}
          <section>
            <H2 className="mb-4">Loading Button</H2>
            <div className="flex flex-wrap gap-3">
              <LoadingButton
                isLoading={isLoading}
                loadingText="Saving…"
                onClick={() => {
                  setIsLoading(true)
                  setTimeout(() => {
                    setIsLoading(false)
                    toast({ variant: 'success', title: 'Project saved!' })
                  }, 2000)
                }}
              >
                Save Project
              </LoadingButton>
              <LoadingButton isLoading={false}>Create Workspace</LoadingButton>
              <LoadingButton isLoading={true} loadingText="Processing…">
                Submit
              </LoadingButton>
            </div>
          </section>

          {/* Loading Overlay */}
          <section>
            <H2 className="mb-4">Loading Overlay</H2>
            <div className="relative rounded-xl border border-dashed border-border p-8 min-h-[120px] flex items-center justify-center">
              {showOverlay ? (
                <LoadingOverlay visible message="Loading project data…" className="rounded-xl" />
              ) : (
                <P className="text-center text-muted-foreground">Content area</P>
              )}
              <Button
                variant="outline"
                size="sm"
                className="absolute bottom-3 right-3"
                onClick={() => {
                  setShowOverlay(true)
                  setTimeout(() => setShowOverlay(false), 2500)
                }}
              >
                Trigger Overlay
              </Button>
            </div>
          </section>
        </div>
      </div>

      {/* ── Empty States Section ────────────────────────────────────── */}
      <div className="rounded-2xl bg-surface p-8 shadow-xl border border-border max-w-3xl w-full">
        <H1 className="mb-1">Empty States</H1>
        <Lead className="mb-8">Shown when lists, canvases, or searches have no data.</Lead>
        <div className="space-y-6">
          <section>
            <H2 className="mb-3">No Projects</H2>
            <div className="rounded-xl border border-border">
              <EmptyProjects onCreateProject={() => {}} />
            </div>
          </section>
          <section>
            <H2 className="mb-3">No Search Results</H2>
            <div className="rounded-xl border border-border">
              <EmptySearchResults query="Eco packaging startup" onClear={() => {}} />
            </div>
          </section>
          <section>
            <H2 className="mb-3">Tool Canvas (Compact)</H2>
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="rounded-xl border border-border">
                <EmptyTool toolName="Empathy Map" size="sm" />
              </div>
              <div className="rounded-xl border border-border">
                <EmptyTool
                  toolName="Business Model Canvas"
                  hint="Click any section to start."
                  size="sm"
                />
              </div>
            </div>
          </section>
          <section>
            <H2 className="mb-3">Error State</H2>
            <div className="rounded-xl border border-border">
              <EmptyError
                message="Could not load your projects. Check your connection and try again."
                onRetry={() => {}}
              />
            </div>
          </section>
          <section>
            <H2 className="mb-3">Custom Empty State</H2>
            <div className="rounded-xl border border-border">
              <EmptyState
                title="No collaborators yet"
                description="Invite teammates to work on this project together."
                actions={[
                  { label: 'Invite teammate', onClick: () => {}, variant: 'default' },
                  { label: 'Learn more', onClick: () => {}, variant: 'ghost' },
                ]}
                size="md"
              />
            </div>
          </section>
        </div>
      </div>

      {/* ── Error Boundary Section ────────────────────────────── */}
      <div className="rounded-2xl bg-surface p-8 shadow-xl border border-border max-w-3xl w-full">
        <H1 className="mb-1">Error Boundary</H1>
        <Lead className="mb-8">
          Catches render errors in subtrees and shows a graceful fallback instead of a white screen.
        </Lead>
        <div className="space-y-6">
          <section>
            <H2 className="mb-3">Inline Error Boundary</H2>
            <P className="text-sm text-muted-foreground mb-4">
              Wraps a specific section. Errors are contained — the rest of the page stays
              functional.
            </P>
            <InlineErrorBoundary>
              <CrashTester />
            </InlineErrorBoundary>
          </section>
        </div>
      </div>

      <div className="rounded-2xl bg-surface p-8 shadow-xl border border-border max-w-3xl w-full text-center">
        <H2 className="mb-4 border-none text-center pb-0">Buttons</H2>
        <Muted className="mb-8">Testing all the variants of our base Button component.</Muted>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
          <Button>Default</Button>
          <Button variant="secondary">Secondary</Button>
          <Button variant="destructive">Destructive</Button>
          <Button variant="outline">Outline</Button>
          <Button variant="ghost">Ghost</Button>
          <Button variant="link">Link</Button>
        </div>

        <div className="flex flex-wrap justify-center gap-4">
          <Button size="sm">Small</Button>
          <Button>Default Size</Button>
          <Button size="lg">Large Size</Button>
        </div>
      </div>
    </div>
  )
}

export default App
