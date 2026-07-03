type ExampleProps = {
  label: string
  onClick?: () => void
}

export function Example({ label, onClick }: ExampleProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="rounded-md bg-purple-600 px-4 py-2 text-white hover:bg-purple-700"
    >
      {label}
    </button>
  )
}
