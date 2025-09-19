import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Edit } from 'lucide-react';

interface EditableFieldProps {
  value: any;
  onEdit: (value: any) => void;
  type?: string;
  className?: string;
  placeholder?: string;
  multiline?: boolean;
  selectOptions?: string[] | null;
  displayValue?: string | null;
}

export function EditableInputField({
  value,
  onEdit,
  type = "text",
  className = "",
  placeholder = "Click to edit",
  multiline = false,
  selectOptions = null,
  displayValue = null,
}: EditableFieldProps) {
  const [isEditing, setIsEditing] = useState(false);
  const displayText = displayValue || value;

  if (isEditing) {
    return selectOptions ? (
      <Select value={value} onValueChange={onEdit}>
        <SelectTrigger className={className}>
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {selectOptions.map((option) => (
            <SelectItem key={option} value={option}>
              {option}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    ) : multiline ? (
      <Textarea
        value={value}
        onChange={(e) => onEdit(e.target.value)}
        onBlur={() => setIsEditing(false)}
        className={className}
        placeholder={placeholder}
        autoFocus
      />
    ) : (
      <Input
        type={type}
        value={value}
        onChange={(e) => onEdit(e.target.value)}
        onBlur={() => setIsEditing(false)}
        className={className}
        placeholder={placeholder}
        autoFocus
      />
    );
  }

  return (
    <div
      className={`${className} cursor-pointer hover:bg-blue-50 hover:border-blue-200 border border-transparent rounded px-2 py-1 transition-colors group inline-flex items-center gap-1 min-w-0`}
      onClick={() => setIsEditing(true)}
      title="Click to edit"
    >
      <span className="truncate">
        {displayText || (
          <span className="text-slate-400 italic">{placeholder}</span>
        )}
      </span>
      <Edit className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0" />
    </div>
  );
}