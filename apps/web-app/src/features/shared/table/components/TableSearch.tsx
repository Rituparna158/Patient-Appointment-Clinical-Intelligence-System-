import { Input } from "@/components/ui/input"

interface Props {
  value: string
  onChange: (value: string) => void
  placeholder?: string
}

export function TableSearch({
  value,
  onChange,
  placeholder,
}: Props) {
  return (
    <Input
      placeholder={placeholder ?? "Search..."}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="max-w-sm"
    />
  )
}