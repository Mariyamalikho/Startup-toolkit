import { Button } from '@/components/ui/Button'
import { H1, H2, H3, H4, P, Lead, Large, Small, Muted } from '@/components/ui/Typography'
import { Input } from '@/components/ui/Input'
import { Label } from '@/components/ui/Label'

function App() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-start bg-background p-8 space-y-12">
      <div className="rounded-2xl bg-surface p-8 shadow-xl border border-border max-w-3xl w-full">
        <H1 className="mb-4">Component Sandbox</H1>
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
