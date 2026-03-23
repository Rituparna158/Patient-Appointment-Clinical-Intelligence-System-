import { Input } from "@/components/ui/input"
import { useEffect, useState } from "react"
import { TABLE_TEXT } from "@/constants/table.constants"
import type { TableSearchProps } from "../../types/TableSearch.types"

export function TableSearch({ value, onChange }: TableSearchProps) {

  const [local, setLocal] = useState(value)

  useEffect(() => {
    setLocal(value)
  }, [value])

  useEffect(() => {

    const timer = setTimeout(() => {
      onChange(local)
    }, 400)

    return () => clearTimeout(timer)

  }, [local, onChange])

  return (

    <Input
      value={local}
      onChange={(e) => setLocal(e.target.value)}
      placeholder={TABLE_TEXT.SEARCH_PLACEHOLDER}
      className="table-search"
    />

  )
}
