import React, { useContext, useEffect, useState } from 'react';
import { Input } from '../../../../components/ui/input';
import { Button } from '../../../../components/ui/button';
import { LoaderCircle } from 'lucide-react';
import { Rating } from '@smastrom/react-rating';
import '@smastrom/react-rating/style.css';
import { ResumeInfoContext } from '../../../../context/ResumeInfoContext';
import { supabase } from '../../../../../services/supabaseClient';
import { useParams } from 'react-router-dom';
import { toast } from 'sonner';

function Skills() {
  const [skillsList, setSkillsList] = useState([]);
  const { resumeId } = useParams();
  const [loading, setLoading] = useState(false);
  const { resumeInfo, setResumeInfo } = useContext(ResumeInfoContext);

  useEffect(() => {
    fetchSkills();
  }, []);

  const fetchSkills = async () => {
    const { data, error } = await supabase
      .from('skills')
      .select('*')
      .eq('resume_id', resumeId);

    if (error) {
      console.error('Error fetching skills:', error);
      toast.error('Failed to fetch skills.');
    } else {
      setSkillsList(data);
    }
  };

  const handleChange = (index, name, value) => {
    const newEntries = [...skillsList];
    newEntries[index][name] = value;
    setSkillsList(newEntries);
  };

  const addNewSkill = () => {
    setSkillsList([...skillsList, { name: '', rating: 0 }]);
  };

  const removeSkill = () => {
    setSkillsList(skillsList.slice(0, -1));
  };

  const onSave = async () => {
    setLoading(true);

    const { error: deleteError } = await supabase
      .from('skills')
      .delete()
      .eq('resume_id', resumeId);

    if (deleteError) {
      console.error('Error deleting skills:', deleteError);
      toast.error('Failed to delete existing skills.');
      setLoading(false);
      return;
    }

    const skillsToInsert = skillsList.map(skill => ({
      ...skill,
      resume_id: resumeId,
    }));

    const { error: insertError } = await supabase
      .from('skills')
      .insert(skillsToInsert);

    if (insertError) {
      console.error('Error inserting skills:', insertError);
      toast.error('Failed to save skills.');
    } else {
      toast.success('Skills updated successfully!');
    }

    setLoading(false);
  };

  useEffect(() => {
    setResumeInfo({
      ...resumeInfo,
      skills: skillsList,
    });
  }, [skillsList]);

  return (
    <div className='p-5 shadow-lg rounded-lg border-t-primary border-t-4 mt-10'>
      <h2 className='font-bold text-lg'>Skills</h2>
      <p className='text-sm mb-4'>Add Your top professional key skills</p>

      <div className='space-y-4'>
        {skillsList.map((item, index) => (
          <div key={index} className='flex flex-col md:flex-row md:items-center justify-between gap-4 border rounded-lg p-3'>
            <div className='w-full md:w-1/2'>
              <label className='text-xs'>Name</label>
              <Input
                className='w-full'
                value={item.name}
                onChange={(e) => handleChange(index, 'name', e.target.value)}
              />
            </div>
            <div className='md:w-auto'>
              <Rating
                style={{ maxWidth: 120 }}
                value={item.rating}
                onChange={(value) => handleChange(index, 'rating', value)}
              />
            </div>
          </div>
        ))}
      </div>

      <div className='flex flex-col sm:flex-row justify-between items-center mt-4 gap-3'>
        <div className='flex gap-2'>
          <Button variant='outline' onClick={addNewSkill} className='text-primary'>
            + Add More Skill
          </Button>
          <Button variant='outline' onClick={removeSkill} className='text-primary'>
            - Remove
          </Button>
        </div>
        <Button disabled={loading} onClick={onSave} className='w-full sm:w-auto'>
          {loading ? <LoaderCircle className='animate-spin' /> : 'Save'}
        </Button>
      </div>
    </div>
  );
}

export default Skills;
