"use client";

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { LANGUAGES } from "@/lib/languages";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function LanguageSelector({ value, onChange }: any) {
  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger className="w-50">
        <SelectValue placeholder="Select Language" />
      </SelectTrigger>
      <SelectContent>
        {LANGUAGES.map((lang) => (
          <SelectItem key={lang.key} value={lang.key}>
            {lang.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}