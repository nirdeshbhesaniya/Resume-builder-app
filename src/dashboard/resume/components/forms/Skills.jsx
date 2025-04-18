import React, { useContext, useEffect, useState } from 'react';
import { Input } from '../../../../components/ui/input';
import { Button } from '../../../../components/ui/button';
import { LoaderCircle } from 'lucide-react';
import { Rating } from '@smastrom/react-rating';
import '@smastrom/react-rating/style.css';
import { ResumeInfoContext } from '../../../../context/ResumeInfoContext';
import { useSupabaseWithClerk } from '../../../../../services/supabaseClient';
import { useParams } from 'react-router-dom';
import { toast } from 'sonner';

function Skills() {
  const [skillsList, setSkillsList] = useState([
    { name: '', rating: 0 }
  ]);
  const { resumeId } = useParams();
  const [loading, setLoading] = useState(false);
  const { resumeInfo, setResumeInfo } = useContext(ResumeInfoContext);
  const { getSupabaseClient } = useSupabaseWithClerk();

  useEffect(() => {
    fetchSkills();
  }, []);

  const fetchSkills = async () => {
    const supabase = await getSupabaseClient();
    const { data, error } = await supabase
      .from('skills')
      .select('*')
      .eq('resume_id', resumeId);

    if (error) {
      console.error('Error fetching skills:', error);
      toast.error('Failed to fetch skills.');
    } else {
      setSkillsList(data.length > 0 ? data : [{ name: '', rating: 0 }]);
    }
  };

  const handleChange = (index, name, value) => {
    const updated = [...skillsList];
    updated[index][name] = value;
    setSkillsList(updated);
  };

  const addNewSkill = () => {
    setSkillsList([...skillsList, { name: '', rating: 0 }]);
  };

  const removeSkill = () => {
    if (skillsList.length > 1) {
      setSkillsList(skillsList.slice(0, -1));
    }
  };

  const onSave = async () => {
    setLoading(true);
    const supabase = await getSupabaseClient();

    try {
      // Delete old skills
      const { error: deleteError } = await supabase
        .from('skills')
        .delete()
        .eq('resume_id', resumeId);

      if (deleteError) throw deleteError;

      // Insert updated skills
      const skillsToInsert = skillsList.map(skill => ({
        ...skill,
        resume_id: resumeId
      }));

      const { error: insertError } = await supabase
        .from('skills')
        .insert(skillsToInsert);

      if (insertError) throw insertError;

      toast.success('Skills updated successfully!');
    } catch (err) {
      console.error('Error saving skills:', err);
      toast.error('Failed to save skills.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setResumeInfo({
      ...resumeInfo,
      skills: skillsList
    });
  }, [skillsList]);

  return (
    <div className='p-5 shadow-lg rounded-lg border-t-primary border-t-4 mt-10'>
      <h2 className='font-bold text-lg'>Skills</h2>
      <p className='text-sm mb-4'>Add your top professional key skills</p>

      <div className='space-y-4'>
        {skillsList.map((item, index) => (
          <div
            key={index}
            className='flex flex-col md:flex-row md:items-center justify-between gap-4 border rounded-lg p-3'
          >
            <div className='w-full md:w-1/2'>
              <label className='text-xs'>Name</label>
              <Input
                value={item.name}
                onChange={(e) => handleChange(index, 'name', e.target.value)}
              />
            </div>
            <div className='md:w-auto'>
              <label className='text-xs block mb-1'>Rating</label>
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
          <Button
            variant='outline'
            onClick={removeSkill}
            className='text-primary'
            disabled={skillsList.length === 1}
          >
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
