"use client"

import * as React from "react"
import { useTheme  } from "next-themes" // Importing to change between dark and light mode
import { Moon, Sun } from "lucide-react" // Creates moon and sun shape 
import { Button } from "../ui/button"

export function Toggle() {
    const { theme, setTheme } = useTheme()

    function toggleTheme() {
        setTheme(theme === "dark" ? "light" : "dark"); // Switches between dark and light mode 
    };

    return (
        <Button
            variant="outline"
            size="icon"
            onClick={toggleTheme}
            aria-label="Toggle theme"
            className="text-primary border-primary hover:bg-primary/10 transition-colors"
            >
            <Sun className="absolute h-[1.2rem] w-[1.2rem] rotate-0 scale-75 transition-all dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-75" />
            <span className="sr-only">Toggle theme</span>
        </Button>

    );
}



