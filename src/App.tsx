function App() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-4 bg-white text-center">
      <h1 className="text-4xl font-medium text-gray-900">figma-to-react</h1>
      <p className="max-w-md text-gray-500">
        No components generated yet. Run the{' '}
        <code className="rounded bg-gray-100 px-2 py-1 text-sm">
          /figma-to-component
        </code>{' '}
        skill against a Figma frame to generate one into{' '}
        <code className="rounded bg-gray-100 px-2 py-1 text-sm">
          src/components
        </code>
        .
      </p>
    </main>
  )
}

export default App
