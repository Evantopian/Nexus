export type ColorPalette = {
    primary: string;
    primaryHover: string;
    primaryForeground: string;
    secondary: string;
    secondaryHover: string;
    secondaryForeground: string;
    accent: string;
    accentHover: string;
    accentForeground: string;
    background: string;
    foreground: string;
    muted: string;
    mutedForeground: string;
    border: string;
    success: string;
    successForeground: string;
    destructive: string;
    destructiveForeground: string;
  };
  
  export const defaultPalette: ColorPalette = {
    primary: "bg-indigo-600",
    primaryHover: "hover:bg-indigo-700",
    primaryForeground: "text-white",
    secondary: "bg-slate-800",
    secondaryHover: "hover:bg-slate-700",
    secondaryForeground: "text-slate-200",
    accent: "bg-emerald-400",
    accentHover: "hover:bg-emerald-500",
    accentForeground: "text-white",
    background: "bg-slate-900",
    foreground: "text-white",
    muted: "bg-slate-800/60",
    mutedForeground: "text-slate-300",
    border: "border-slate-700",
    success: "bg-green-500",
    successForeground: "text-white",
    destructive: "bg-red-500",
    destructiveForeground: "text-white",
  };
  
  // Alternative palettes
  export const cyberpunkPalette: ColorPalette = {
    primary: "bg-yellow-500",
    primaryHover: "hover:bg-yellow-600",
    primaryForeground: "text-black",
    secondary: "bg-purple-900",
    secondaryHover: "hover:bg-purple-800",
    secondaryForeground: "text-purple-100",
    accent: "bg-cyan-400",
    accentHover: "hover:bg-cyan-500",
    accentForeground: "text-black",
    background: "bg-gray-900",
    foreground: "text-gray-100",
    muted: "bg-purple-900/60",
    mutedForeground: "text-purple-200",
    border: "border-purple-700",
    success: "bg-green-500",
    successForeground: "text-black",
    destructive: "bg-red-500",
    destructiveForeground: "text-white",
  };
  
  export const fantasyPalette: ColorPalette = {
    primary: "bg-amber-600",
    primaryHover: "hover:bg-amber-700",
    primaryForeground: "text-white",
    secondary: "bg-emerald-800",
    secondaryHover: "hover:bg-emerald-700",
    secondaryForeground: "text-emerald-100",
    accent: "bg-purple-400",
    accentHover: "hover:bg-purple-500",
    accentForeground: "text-white",
    background: "bg-slate-800",
    foreground: "text-amber-50",
    muted: "bg-emerald-800/60",
    mutedForeground: "text-amber-200",
    border: "border-emerald-700",
    success: "bg-green-600",
    successForeground: "text-white",
    destructive: "bg-red-600",
    destructiveForeground: "text-white",
  };
  
  export const futuristicPalette: ColorPalette = {
    primary: "bg-blue-500",
    primaryHover: "hover:bg-blue-600",
    primaryForeground: "text-white",
    secondary: "bg-gray-800",
    secondaryHover: "hover:bg-gray-700",
    secondaryForeground: "text-gray-200",
    accent: "bg-teal-400",
    accentHover: "hover:bg-teal-500",
    accentForeground: "text-white",
    background: "bg-gray-900",
    foreground: "text-gray-100",
    muted: "bg-gray-800/60",
    mutedForeground: "text-gray-300",
    border: "border-gray-700",
    success: "bg-green-500",
    successForeground: "text-white",
    destructive: "bg-red-500",
    destructiveForeground: "text-white",
  };
  
  // Current active palette
  export const activePalette = defaultPalette;