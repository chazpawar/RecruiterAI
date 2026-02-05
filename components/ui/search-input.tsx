"use client"

import { Search } from "lucide-react"
import { Input } from "./input"
import { cn } from "@/lib/utils"

interface SearchInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  placeholder?: string
}

const SearchInput = ({
  placeholder = "Search...",
  value,
  onChange,
  className,
  ...props
}: SearchInputProps) => {
  return (
    <div className="relative w-96">
      <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
      <Input
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className={cn("pl-8", className)}
        {...props}
      />
    </div>
  )
}

export default SearchInput
