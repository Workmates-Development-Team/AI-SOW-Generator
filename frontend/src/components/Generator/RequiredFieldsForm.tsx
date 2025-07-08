import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import React from 'react';
import type { FormState } from './OptionalFieldsSelector';

interface RequiredFieldsFormProps {
  form: FormState;
  loading: boolean;
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  handleTextareaKeyDown: (e: React.KeyboardEvent<HTMLTextAreaElement>) => void;
  handleAutoResize: (e: React.FormEvent<HTMLTextAreaElement>) => void;
}

const RequiredFieldsForm: React.FC<RequiredFieldsFormProps> = ({
  form,
  loading,
  handleChange,
  handleTextareaKeyDown,
  handleAutoResize,
}) => {
  return (
    <div className="flex-1 space-y-6 overflow-y-auto min-h-0 pr-10 pr-2" style={{ scrollbarGutter: 'stable' }}>
      <label htmlFor="clientName" className="block text-sm font-medium text-white/80">
        Client Name
      </label>
      <Input
        id="clientName"
        type="text"
        placeholder="Enter the client's name"
        value={form.clientName}
        onChange={handleChange}
        className="text-base bg-white/10 border-white/20 text-white placeholder:text-white/50 focus:border-white/40 resize-none"
        disabled={loading}
        required
        autoComplete="off"
        spellCheck={false}
      />
      <label htmlFor="projectDescription" className="block text-sm font-medium text-white/80">
        Project Description
      </label>
      <Textarea
        id="projectDescription"
        placeholder="Describe your project for the SOW"
        value={form.projectDescription}
        onChange={handleChange}
        onKeyDown={handleTextareaKeyDown}
        onInput={handleAutoResize}
        className="min-h-[80px] text-base bg-white/10 border-white/20 text-white placeholder:text-white/50 focus:border-white/40"
        disabled={loading}
        required
      />
      <label htmlFor="requirements" className="block text-sm font-medium text-white/80">
        Client Requirements
      </label>
      <Textarea
        id="requirements"
        placeholder="List any specific client requirements"
        value={form.requirements}
        onChange={handleChange}
        onKeyDown={handleTextareaKeyDown}
        onInput={handleAutoResize}
        className="min-h-[80px] text-base bg-white/10 border-white/20 text-white placeholder:text-white/50 focus:border-white/40"
        disabled={loading}
      />
      <label htmlFor="duration" className="block text-sm font-medium text-white/80">
        Project Duration
      </label>
      <Textarea
        id="duration"
        placeholder="e.g. 3 months, Q1 2025, etc."
        value={form.duration}
        onChange={handleChange}
        onInput={handleAutoResize}
        className="min-h-[80px] text-base bg-white/10 border-white/20 text-white placeholder:text-white/50 focus:border-white/40"
        disabled={loading}
      />
      <label htmlFor="budget" className="block text-sm font-medium text-white/80">
        Budget
      </label>
      <Textarea
        id="budget"
        placeholder="e.g. $10,000, 5 lakh INR, etc."
        value={form.budget}
        onChange={handleChange}
        onInput={handleAutoResize}
        className="min-h-[80px] text-base bg-white/10 border-white/20 text-white placeholder:text-white/50 focus:border-white/40"
        disabled={loading}
      />
    </div>
  );
};

export default RequiredFieldsForm; 