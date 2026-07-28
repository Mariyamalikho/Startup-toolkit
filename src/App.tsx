import { Button } from '@/components/ui/Button'

function App() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background p-4">
      <div className="rounded-2xl bg-surface p-8 shadow-xl border border-border max-w-2xl w-full text-center">
        <h1 className="text-4xl font-bold text-foreground mb-4">Button Component</h1>
        <p className="text-muted-foreground mb-8 text-lg">
          Testing all the variants of our base Button component.
        </p>

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
