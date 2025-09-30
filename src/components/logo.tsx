import { Library } from "lucide-react";

export function Logo() {
  return (
    <div className="flex items-center gap-2" aria-label="Deogiri e-Granthalaya Home">
      <div className="bg-primary text-primary-foreground p-2 rounded-lg">
        <Library className="h-5 w-5" />
      </div>
      <span className="font-headline text-lg font-semibold min-w-max">
        Deogiri e-Granthalaya
      </span>
    </div>
  );
}
