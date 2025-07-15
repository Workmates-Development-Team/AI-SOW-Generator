import { useTheme } from '../../contexts/ThemeContext';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectTrigger, SelectContent, SelectItem } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { X } from 'lucide-react';
import React from 'react';

export interface FormState {
  clientName: string;
  projectDescription: string;
  requirements: string;
  duration: string;
  budget: string;
  supportService: string;
  legalTerms: string;
  deliverables: string;
  terminationClause: string;
  contactInformation: string;
}

interface OptionalField {
  id: keyof FormState;
  label: string;
  placeholder: string;
}

interface OptionalFieldsSelectorProps {
  optionalFields: OptionalField[];
  addedOptionalFields: Array<keyof FormState>;
  availableOptionalFields: OptionalField[];
  form: FormState;
  loading: boolean;
  handleAddOptionalField: (fieldId: keyof FormState) => void;
  handleRemoveOptionalField: (fieldId: keyof FormState) => void;
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  handleTextareaKeyDown: (e: React.KeyboardEvent<HTMLTextAreaElement>) => void;
  handleAutoResize: (e: React.FormEvent<HTMLTextAreaElement>) => void;
}

const OptionalFieldsSelector: React.FC<OptionalFieldsSelectorProps> = ({
  optionalFields,
  addedOptionalFields,
  availableOptionalFields,
  form,
  loading,
  handleAddOptionalField,
  handleRemoveOptionalField,
  handleChange,
  handleTextareaKeyDown,
  handleAutoResize,
}) => {
  const { theme } = useTheme();
  const labelClass = theme === 'light' ? 'text-gray-900' : 'text-white/80';
  const inputClass = theme === 'light' ? 'bg-gray-100 border-gray-300 text-gray-900 placeholder:text-gray-600 focus:border-blue-500' : 'bg-white/10 border-white/20 text-white placeholder:text-white/50 focus:border-white/40';
  const selectTriggerClass = theme === 'light' ? 'bg-gray-100 border-gray-300 text-gray-900 focus:border-blue-500' : 'bg-white/10 border-white/20 text-white focus:border-white/40';
  const selectContentClass = theme === 'light' ? 'bg-white border-gray-300 text-gray-900' : 'bg-white/10 border border-white/20 text-white shadow-xl';
  const selectItemClass = theme === 'light' ? 'text-gray-900 hover:bg-gray-100 focus:bg-gray-100' : 'text-white hover:bg-white/10 focus:bg-white/20';

  return (
    <div className="flex-1 space-y-6 overflow-y-auto min-h-0 pl-10 max-h-[70vh]" style={{ scrollbarGutter: 'stable' }}>
      {addedOptionalFields.map((fieldId) => {
        const field = optionalFields.find(f => f.id === fieldId);
        if (!field) return null;
        return (
          <div key={String(fieldId)} className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor={String(fieldId)} className={`text-sm font-medium ${labelClass}`}>
                {field.label}
              </Label>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => handleRemoveOptionalField(fieldId)}
                className={`${theme === 'light' ? 'text-gray-700 hover:bg-gray-200 focus:bg-gray-300' : 'text-white hover:bg-white/20 focus:bg-white/30'} ml-2`}
                aria-label={`Remove ${field.label}`}
                disabled={loading}
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
            <Textarea
              id={String(fieldId)}
              placeholder={field.placeholder}
              value={form[fieldId]}
              onChange={handleChange}
              onKeyDown={handleTextareaKeyDown}
              onInput={handleAutoResize}
              className={`min-h-[80px] flex-1 ${inputClass}`}
              disabled={loading}
            />
          </div>
        );
      })}
      {availableOptionalFields.length > 0 && (
        <div className="space-y-2">
          <Select onValueChange={(val) => handleAddOptionalField(val as keyof FormState)} disabled={loading}>
            <SelectTrigger className={selectTriggerClass} disabled={loading}>
              <span className={theme === 'light' ? 'text-gray-400' : 'text-white/50'}>Add Optional Field</span>
            </SelectTrigger>
            <SelectContent className={selectContentClass}>
              {availableOptionalFields.map((field) => (
                <SelectItem key={String(field.id)} value={String(field.id)} className={selectItemClass}>
                  {field.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}
    </div>
  );
};

export default OptionalFieldsSelector; 