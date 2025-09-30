"use client"

import {
  DropdownMenuItem,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu"
import { useApp } from "@/contexts/app-provider"

export const RoleSwitcher = () => {
    const { role, setRole } = useApp();

    return (
        <>
            <DropdownMenuLabel>Switch Role (Demo)</DropdownMenuLabel>
            <DropdownMenuItem onSelect={() => setRole('student')} className={role === 'student' ? 'bg-accent' : ''}>Student</DropdownMenuItem>
            <DropdownMenuItem onSelect={() => setRole('librarian')} className={role === 'librarian' ? 'bg-accent' : ''}>Librarian</DropdownMenuItem>
            <DropdownMenuItem onSelect={() => setRole('admin')} className={role === 'admin' ? 'bg-accent' : ''}>Admin</DropdownMenuItem>
        </>
    )
}
