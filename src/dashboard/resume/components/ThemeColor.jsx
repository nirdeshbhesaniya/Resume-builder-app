import React, { useContext, useState, useEffect } from 'react';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '../../../components/ui/popover';
import { Button } from '../../../components/ui/button';
import { LayoutGrid } from 'lucide-react';
import { ResumeInfoContext } from '../../../context/ResumeInfoContext';
import { useParams } from 'react-router-dom';
import { toast } from 'sonner';
import { supabase } from '../../../../services/supabaseClient'; // Make sure this points to your initialized Supabase client

function ThemeColor() {
  const colors = [
    '#FF5733', '#33FF57', '#3357FF', '#FF33A1', '#A133FF',
    '#33FFA1', '#FF7133', '#71FF33', '#7133FF', '#FF3371',
    '#33FF71', '#3371FF', '#A1FF33', '#33A1FF', '#FF5733',
    '#5733FF', '#33FF5A', '#5A33FF', '#FF335A', '#335AFF'
  ];

  const { resumeInfo, setResumeInfo } = useContext(ResumeInfoContext);
  const [selectedColor, setSelectedColor] = useState();
  const { resumeId } = useParams();

  useEffect(() => {
    if (resumeInfo?.themeColor) {
      setSelectedColor(resumeInfo.themeColor);
    }
  }, [resumeInfo]);

  const onColorSelect = async (color) => {
    setSelectedColor(color);
    setResumeInfo({
      ...resumeInfo,
      themeColor: color
    });

    const { error } = await supabase
      .from('resume') // replace with your table name if different
      .update({ themeColor: color })
      .eq('resumeId', resumeId);

    if (error) {
      console.error('Error updating theme color:', error.message);
      toast.error('Failed to update theme color');
    } else {
      toast.success('Theme Color Updated');
    }
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" size="sm" className="flex gap-2">
          <LayoutGrid className="w-4 h-4" /> Theme
        </Button>
      </PopoverTrigger>
      <PopoverContent>
        <h2 className="mb-2 text-sm font-bold">Select Theme Color</h2>
        <div className="grid grid-cols-5 gap-3">
          {colors.map((item, index) => (
            <div
              key={index}
              onClick={() => onColorSelect(item)}
              className={`h-5 w-5 rounded-full cursor-pointer border hover:border-black
                ${selectedColor === item ? 'border-black' : 'border-transparent'}`}
              style={{ background: item }}
            />
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
}

export default ThemeColor;
