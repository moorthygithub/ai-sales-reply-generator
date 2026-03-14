import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Sparkles } from "lucide-react";
import { REPLY_TONES } from "../constants/tones";



interface ToneSelectorProps {
  value: string;
  onChange: (val: string) => void;
  disabled?: boolean;
}

export default function ToneSelector({ value, onChange, disabled }: ToneSelectorProps) {
  return (
    <div className="space-y-1.5">
      <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
        <Sparkles className="h-3 w-3 text-indigo-500" />
        AI Reply Tone
      </label>
      <Select value={value} onValueChange={onChange} disabled={disabled}>
        <SelectTrigger className="w-full bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 shadow-sm transition-colors focus:ring-indigo-500">
          <SelectValue placeholder="Select a tone" />
        </SelectTrigger>
        <SelectContent>
          {REPLY_TONES.map((t) => (
            <SelectItem key={t.value} value={t.value} className="cursor-pointer">
              {t.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
