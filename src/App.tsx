import './App.css'

function App() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 p-4">
      <div className="rounded-2xl bg-white p-8 shadow-xl border border-gray-100 max-w-md w-full text-center">
        <div className="mb-6 flex justify-center">
          <div className="h-16 w-16 rounded-xl bg-[var(--primary)] flex items-center justify-center text-white text-2xl font-bold shadow-lg">
            ST
          </div>
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Startup Toolkit</h1>
        <p className="text-gray-500 mb-8">Transform real-world problems into startup ideas through guided innovation.</p>
        
        <button className="w-full rounded-xl bg-[var(--primary)] px-6 py-3 text-white font-medium hover:bg-[var(--secondary)] transition-colors shadow-md hover:shadow-lg active:scale-95 duration-200">
          Get Started
        </button>
      </div>
    </div>
  )
}

export default App
