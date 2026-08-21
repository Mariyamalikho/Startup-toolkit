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
import { isSupabaseConfigured, checkSupabaseConnection } from '@/lib/supabase'
import { Database, CheckCircle2, XCircle, LogIn, UserPlus, KeyRound } from 'lucide-react'
import { AuthForm } from '@/components/auth/AuthForm'
import { AuthModal } from '@/components/auth/AuthModal'
import { useAuth } from '@/context/AuthContext'
import { UserCheck, LogOut, Layers, Plus, Trash2, RotateCcw } from 'lucide-react'
import { useProjectStore } from '@/store/projectStore'
import { projectService } from '@/services/projectService'
import { Cloud, RefreshCw, Send, Save, Clock } from 'lucide-react'
import { useAutosave } from '@/hooks/useAutosave'





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


// AuthStatusCard — sandbox component demonstrating useAuth() hook state
function AuthStatusCard() {
  const { user, loading, isConfigured, signOut } = useAuth()

  return (
    <div className="rounded-xl border border-border bg-muted/20 p-5 space-y-4">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-foreground flex items-center gap-2">
          <UserCheck className="h-4 w-4 text-primary" />
          Active Session Status
        </span>
        <span className="inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full border border-border bg-surface">
          {loading ? (
            <span className="text-muted-foreground">Checking session…</span>
          ) : user ? (
            <span className="text-emerald-500 font-medium">Authenticated</span>
          ) : (
            <span className="text-muted-foreground">Guest (Unauthenticated)</span>
          )}
        </span>
      </div>

      <div className="text-xs space-y-1 text-muted-foreground">
        <p>
          <strong className="text-foreground">Configured:</strong>{' '}
          {isConfigured ? 'Yes (.env.local)' : 'No (Demo mode active)'}
        </p>
        <p>
          <strong className="text-foreground">User Email:</strong>{' '}
          {user ? user.email : 'None'}
        </p>
      </div>

      {user && (
        <Button variant="outline" size="sm" onClick={signOut}>
          <LogOut className="mr-1.5 h-3.5 w-3.5" />
          Sign Out
        </Button>
      )}
    </div>
  )
}

// ProjectStoreDemo — sandbox component for Zustand projectStore
function ProjectStoreDemo() {
  const {
    projects,
    activeProject,
    loading,
    error,
    setActiveProject,
    reset,
    fetchUserProjects,
    createNewProject,
    deleteUserProject,
  } = useProjectStore()

  return (
    <div className="space-y-4">
      {/* Error alert banner if error occurs */}
      {error && (
        <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-3 text-xs text-red-400">
          <p className="font-semibold">Sync Error:</p>
          <p>{error}</p>
        </div>
      )}

      {/* Active Project Highlight */}
      <div className="rounded-xl border border-primary/20 bg-primary/5 p-4 flex items-center justify-between">
        <div>
          <span className="text-[11px] font-semibold uppercase tracking-wider text-primary">
            Active Workspace Project
          </span>
          <p className="text-sm font-bold text-foreground mt-0.5">
            {activeProject ? activeProject.title : 'No active project selected'}
          </p>
          {activeProject?.description && (
            <p className="text-xs text-muted-foreground mt-0.5">{activeProject.description}</p>
          )}
        </div>
        {activeProject && (
          <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-surface border border-border">
            Progress: {activeProject.progress}%
          </span>
        )}
      </div>

      {/* Project Collection List */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span>Projects in Store ({projects.length})</span>
          {loading && <span className="font-mono text-primary animate-pulse">Syncing with Supabase…</span>}
        </div>
        <div className="grid gap-2 sm:grid-cols-2">
          {projects.map((proj) => (
            <div
              key={proj.id}
              onClick={() => setActiveProject(proj)}
              className={`cursor-pointer rounded-xl border p-3 text-left transition-all ${
                activeProject?.id === proj.id
                  ? 'border-primary bg-surface shadow-sm ring-1 ring-primary'
                  : 'border-border bg-muted/20 hover:border-muted-foreground/40'
              }`}
            >
              <div className="flex items-center justify-between">
                <p className="text-xs font-semibold text-foreground">{proj.title}</p>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation()
                    deleteUserProject(proj.id)
                  }}
                  className="text-muted-foreground hover:text-red-500 p-1"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
              <p className="text-[11px] text-muted-foreground line-clamp-1 mt-1">{proj.industry}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Store Actions */}
      <div className="flex flex-wrap gap-2 pt-2 border-t border-border">
        <LoadingButton
          variant="default"
          size="sm"
          isLoading={loading}
          loadingText="Fetching…"
          onClick={() => fetchUserProjects()}
        >
          <RefreshCw className="mr-1.5 h-3.5 w-3.5" />
          Fetch Supabase Data
        </LoadingButton>

        <LoadingButton
          variant="outline"
          size="sm"
          isLoading={loading}
          loadingText="Creating…"
          onClick={() =>
            createNewProject({
              title: `Venture ${Math.floor(Math.random() * 1000)}`,
              description: 'Created via Zustand store async action.',
              industry: 'AI & Data',
            })
          }
        >
          <Plus className="mr-1.5 h-3.5 w-3.5" />
          Create via Async Store
        </LoadingButton>

        <Button variant="ghost" size="sm" onClick={reset}>
          <RotateCcw className="mr-1.5 h-3.5 w-3.5" />
          Reset Local Seed
        </Button>
      </div>
    </div>
  )
}



// ProjectServiceDemo — sandbox component demonstrating projectService API wrapper
function ProjectServiceDemo() {
  const [fetching, setFetching] = React.useState(false)
  const [creating, setCreating] = React.useState(false)
  const [apiProjects, setApiProjects] = React.useState<any[]>([])
  const { toast } = useToast()

  const handleFetch = async () => {
    setFetching(true)
    try {
      const data = await projectService.fetchProjects()
      setApiProjects(data)
      toast({
        variant: 'success',
        title: 'API Query Successful',
        description: `Retrieved ${data.length} projects via projectService.fetchProjects()`,
      })
    } catch (err: any) {
      toast({
        variant: 'error',
        title: 'API Query Failed',
        description: err.message,
      })
    } finally {
      setFetching(false)
    }
  }

  const handleCreate = async () => {
    setCreating(true)
    try {
      const newProj = await projectService.createProject({
        title: `Venture ${Math.floor(Math.random() * 1000)}`,
        description: 'Created via projectService.createProject() API call.',
        industry: 'CleanTech',
      })
      setApiProjects((prev) => [newProj, ...prev])
      toast({
        variant: 'success',
        title: 'Project Created via API',
        description: `Inserted "${newProj.title}"`,
      })
    } catch (err: any) {
      toast({
        variant: 'error',
        title: 'Project Creation Failed',
        description: err.message,
      })
    } finally {
      setCreating(false)
    }
  }

  return (
    <div className="space-y-4 text-left">
      <div className="flex flex-wrap gap-2">
        <LoadingButton
          variant="default"
          size="sm"
          isLoading={fetching}
          loadingText="Fetching Database…"
          onClick={handleFetch}
        >
          <RefreshCw className="mr-1.5 h-3.5 w-3.5" />
          Fetch Projects API
        </LoadingButton>

        <LoadingButton
          variant="outline"
          size="sm"
          isLoading={creating}
          loadingText="Creating Record…"
          onClick={handleCreate}
        >
          <Send className="mr-1.5 h-3.5 w-3.5" />
          Create Project API
        </LoadingButton>
      </div>

      {apiProjects.length > 0 ? (
        <div className="rounded-xl border border-border bg-muted/20 p-4 space-y-2">
          <p className="text-xs font-semibold text-foreground">API Result Records ({apiProjects.length})</p>
          <div className="space-y-1.5">
            {apiProjects.map((p) => (
              <div key={p.id} className="flex items-center justify-between text-xs bg-surface p-2 rounded-lg border border-border">
                <span className="font-medium text-foreground">{p.title}</span>
                <span className="text-[11px] text-muted-foreground font-mono">{p.industry} • {p.status}</span>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <p className="text-xs text-muted-foreground italic">
          Click "Fetch Projects API" or "Create Project API" to test service methods.
        </p>
      )}
    </div>
  )
}

// AutosaveHookDemo — sandbox component demonstrating useAutosave hook connected to Supabase update API
function AutosaveHookDemo() {
  const { activeProject, updateUserProject } = useProjectStore()

  const [formData, setFormData] = React.useState({
    title: activeProject?.title || 'EcoPack Innovation',
    description: activeProject?.description || 'Biodegradable packaging startup for local food delivery.',
    industry: activeProject?.industry || 'Sustainability',
  })

  // Sync form data whenever active project changes
  React.useEffect(() => {
    if (activeProject) {
      setFormData({
        title: activeProject.title,
        description: activeProject.description || '',
        industry: activeProject.industry || '',
      })
    }
  }, [activeProject?.id])

  const { status, isSaving, error, lastSavedAt, saveNow } = useAutosave({
    data: formData,
    delay: 1000, // 1000ms debounce delay
    onSave: async (dataToSave) => {
      if (activeProject) {
        await updateUserProject(activeProject.id, {
          title: dataToSave.title,
          description: dataToSave.description,
          industry: dataToSave.industry,
        })
      }
    },
  })

  return (
    <div className="space-y-4 text-left">
      {/* Real-time Supabase Autosave Status Banner */}
      <div className="rounded-xl border border-border bg-muted/20 p-4 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Clock className="h-4 w-4 text-muted-foreground" />
          <span className="text-xs font-medium text-foreground">Database Sync Status:</span>
          {status === 'idle' && (
            <span className="text-xs font-semibold px-2 py-0.5 rounded bg-muted text-muted-foreground">
              Idle (Listening for changes)
            </span>
          )}
          {status === 'saving' && (
            <InlineLoader message="Saving to Supabase Database…" size="sm" />
          )}
          {status === 'saved' && (
            <span className="inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-0.5 rounded bg-emerald-500/20 text-emerald-500">
              <CheckCircle2 className="h-3.5 w-3.5" />
              Saved to Supabase ✓
            </span>
          )}
          {status === 'error' && (
            <span className="inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-0.5 rounded bg-red-500/20 text-red-500">
              <XCircle className="h-3.5 w-3.5" />
              Save Error ({error})
            </span>
          )}
        </div>

        {lastSavedAt && (
          <span className="text-[11px] font-mono text-muted-foreground">
            Last saved: {lastSavedAt.toLocaleTimeString()}
          </span>
        )}
      </div>

      {/* Target Active Project Banner */}
      <div className="rounded-lg bg-surface border border-border p-3 text-xs flex items-center justify-between">
        <span className="text-muted-foreground">Target Project:</span>
        <span className="font-semibold text-primary">{activeProject?.title ?? 'Default Demo Project'}</span>
      </div>

      {/* Editable Form Fields */}
      <div className="space-y-3">
        <div>
          <label className="text-xs font-medium text-muted-foreground">Project Title (Debounced 1000ms Auto-Sync)</label>
          <Input
            value={formData.title}
            onChange={(e) => setFormData((prev) => ({ ...prev, title: e.target.value }))}
            className="mt-1"
          />
        </div>

        <div>
          <label className="text-xs font-medium text-muted-foreground">Industry Sector</label>
          <Input
            value={formData.industry}
            onChange={(e) => setFormData((prev) => ({ ...prev, industry: e.target.value }))}
            className="mt-1"
          />
        </div>

        <div>
          <label className="text-xs font-medium text-muted-foreground">Description</label>
          <Textarea
            value={formData.description}
            onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
            rows={2}
            className="mt-1"
          />
        </div>
      </div>

      {/* Manual Immediate Save Trigger */}
      <div className="flex items-center justify-between pt-2 border-t border-border">
        <span className="text-xs text-muted-foreground">
          Type into any field above to automatically sync changes to Supabase database after 1s.
        </span>
        <LoadingButton
          variant="outline"
          size="sm"
          isLoading={isSaving}
          loadingText="Syncing Database…"
          onClick={saveNow}
        >
          <Save className="mr-1.5 h-3.5 w-3.5" />
          Save Now (Force Sync)
        </LoadingButton>
      </div>
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

      {/* ── Supabase Backend Status ──────────────────────────── */}
      <div className="rounded-2xl bg-surface p-8 shadow-xl border border-border max-w-3xl w-full">
        <H1 className="mb-1 flex items-center gap-3">
          <Database className="h-6 w-6 text-primary" />
          Supabase Backend Client
        </H1>
        <Lead className="mb-6">
          Phase 2 backend integration status and credential verification.
        </Lead>

        <div className="rounded-xl border border-border bg-muted/20 p-5 space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-foreground">Client Config Status</span>
            <span className="inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full border border-border bg-surface">
              {isSupabaseConfigured ? (
                <>
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
                  Configured (.env.local)
                </>
              ) : (
                <>
                  <XCircle className="h-3.5 w-3.5 text-amber-500" />
                  Unconfigured (Using Fallback)
                </>
              )}
            </span>
          </div>

          <P className="text-xs text-muted-foreground">
            {isSupabaseConfigured
              ? 'VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY are present.'
              : 'Add your Supabase credentials to .env.local (copied from .env.example) to connect.'}
          </P>

          <Button
            variant="outline"
            size="sm"
            onClick={async () => {
              const res = await checkSupabaseConnection()
              toast({
                variant: res.connected ? 'success' : 'warning',
                title: res.connected ? 'Supabase Connected' : 'Supabase Connection Check',
                description: res.message,
              })
            }}
          >
            Test Connection
          </Button>
        </div>
      </div>

      {/* ── Supabase Auth UI Section ─────────────────────────── */}
      <div className="rounded-2xl bg-surface p-8 shadow-xl border border-border max-w-3xl w-full">
        <H1 className="mb-1 flex items-center gap-3">
          <KeyRound className="h-6 w-6 text-primary" />
          Authentication UI
        </H1>
        <Lead className="mb-8">
          Login & Signup screens with form validation, password visibility toggle, and Supabase integration.
        </Lead>

        <div className="space-y-8">
          {/* Modal Triggers */}
          <section>
            <H2 className="mb-4">Auth Modal Triggers</H2>
            <div className="flex flex-wrap gap-4">
              <AuthModal
                initialMode="login"
                trigger={
                  <Button variant="default">
                    <LogIn className="mr-2 h-4 w-4" />
                    Open Sign In Modal
                  </Button>
                }
              />
              <AuthModal
                initialMode="signup"
                trigger={
                  <Button variant="outline">
                    <UserPlus className="mr-2 h-4 w-4" />
                    Open Create Account Modal
                  </Button>
                }
              />
            </div>
          </section>

          {/* Embedded Auth Form */}
          <section>
            <H2 className="mb-4">Inline Auth Form</H2>
            <div className="max-w-md rounded-2xl border border-border bg-muted/20 p-6 shadow-sm">
              <AuthForm />
            </div>
          </section>

          {/* Live Auth Context State Monitor */}
          <section>
            <H2 className="mb-4">useAuth() Hook State</H2>
            <AuthStatusCard />
          </section>
        </div>
      </div>

      {/* ── Zustand Global Project Store Section ──────────────── */}
      <div className="rounded-2xl bg-surface p-8 shadow-xl border border-border max-w-3xl w-full">
        <H1 className="mb-1 flex items-center gap-3">
          <Layers className="h-6 w-6 text-primary" />
          Zustand Global Project Store
        </H1>
        <Lead className="mb-6">
          Centralized client-side state management for startup projects and active selection.
        </Lead>

        <ProjectStoreDemo />
      </div>

      {/* ── Supabase Project API Service Section ───────────────── */}
      <div className="rounded-2xl bg-surface p-8 shadow-xl border border-border max-w-3xl w-full">
        <H1 className="mb-1 flex items-center gap-3">
          <Cloud className="h-6 w-6 text-primary" />
          Supabase Project API Service
        </H1>
        <Lead className="mb-6">
          Encapsulated database service wrapper (fetch, create, update, delete) with auto-fallback.
        </Lead>

        <ProjectServiceDemo />
      </div>

      {/* ── Debounced Autosave Hook Section ──────────────────── */}
      <div className="rounded-2xl bg-surface p-8 shadow-xl border border-border max-w-3xl w-full">
        <H1 className="mb-1 flex items-center gap-3">
          <Save className="h-6 w-6 text-primary" />
          Debounced `useAutosave` Hook
        </H1>
        <Lead className="mb-6">
          Automatic background save trigger that debounces 1000ms after user typing stops.
        </Lead>

        <AutosaveHookDemo />
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
