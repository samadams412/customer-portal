"use client"

import * as React from "react"
import { useTheme  } from "next-themes" // Importing to change between dark and light mode
import { Moon, Sun } from "lucide-react" // Creates moon and sun shape 

export function Toggle() {
    const { theme, setTheme } = useTheme()

    function toggleT() {
        setTheme(theme === "dark" ? "light" : "dark"); // Switches between dark and light mode 
    };

    return (
        <button 
            aria-label="Toggle theme"
            onClick={toggleT}
            className="inline-flex h-5 w-5 items-center justify-center rounded-sm border border-blue-600 dark:border-white"> {/* Boarder around sun/moon icon */}
            <Sun className="absolute text-sm scale-50 rotate-0 transition-all dark:scale-0 dark:-rotate-90 " /> {/* Represents button for light mode */}
            <Moon className="absolute text-sm scale-0 rotate-90 transition-all dark:scale-50 dark:rotate-0 dark:text-blue-400" /> {/* Represents button for dark mode */}
            
            <span className="sr-only">Toggle theme</span>
        </button>
    );
}



