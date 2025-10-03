import { Library } from "lucide-react";

export function Logo() {
  return (
    <div className="flex items-center gap-2" aria-label="Deogiri Library Management Home">
      <div className="bg-primary text-primary-foreground p-2 rounded-lg">
        <Library className="h-5 w-5" />
      </div>
      <span className="font-headline text-lg md:text-2xl font-semibold min-w-max transition-opacity duration-200 group-data-[collapsible=icon]:opacity-0 group-data-[collapsible=icon]:w-0">
        Deogiri Library Management
      </span>
    </div>
  );
}
