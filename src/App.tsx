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

function App() {
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
