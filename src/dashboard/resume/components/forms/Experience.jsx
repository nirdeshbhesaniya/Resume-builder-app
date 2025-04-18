import { Button } from '../../../../components/ui/button';
import { Input } from '../../../../components/ui/input';
import React, { useContext, useEffect, useState } from 'react';
import RichTextEditor from '../RichTextEditor';
import { ResumeInfoContext } from '../../../../context/ResumeInfoContext';
import { useParams } from 'react-router-dom';
import { toast } from 'sonner';
import { LoaderCircle } from 'lucide-react';
import { useSupabaseWithClerk } from '../../../../../services/supabaseClient';

const emptyForm = {
  position_title: '',
  company_name: '',
  city: '',
  state: '',
  start_date: '',
  end_date: '',
  work_summary: '',
};

function Experience() {
  const [experienceList, setExperienceList] = useState([]);
  const { setResumeInfo } = useContext(ResumeInfoContext);
  const params = useParams();
  const [loading, setLoading] = useState(false);
  const { getSupabaseClient } = useSupabaseWithClerk();

  useEffect(() => {
    fetchExperience();
  }, []);

  const fetchExperience = async () => {
    const supabase = await getSupabaseClient();
    const { data, error } = await supabase
      .from('experience')
      .select('*')
      .eq('resume_id', params.resumeId);

    if (!error) {
      setExperienceList(data);
      setResumeInfo(prev => ({ ...prev, Experience: data }));
    } else {
      toast.error('Failed to load experiences');
    }
  };

  const handleChange = (index, event) => {
    const updated = [...experienceList];
    updated[index][event.target.name] = event.target.value;
    setExperienceList(updated);
  };

  const handleRichTextEditor = (e, name, index) => {
    const updated = [...experienceList];
    updated[index][name] = e.target.value;
    setExperienceList(updated);
  };

  const AddNewExperience = () => {
    setExperienceList([...experienceList, { ...emptyForm }]);
  };

  const RemoveExperience = () => {
    setExperienceList(prev => prev.slice(0, -1));
  };

  const onSave = async () => {
    setLoading(true);
    try {
      const supabase = await getSupabaseClient();
      await supabase.from('experience').delete().eq('resume_id', params.resumeId);

      const insertData = experienceList.map(item => ({
        ...item,
        resume_id: params.resumeId,
      }));

      const { error } = await supabase.from('experience').insert(insertData);

      if (error) throw error;

      toast.success('Details updated!');
      fetchExperience();
    } catch (err) {
      console.error(err);
      toast.error('Failed to update experiences');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setResumeInfo(prev => ({ ...prev, Experience: experienceList }));
  }, [experienceList]);

  return (
    <div>
      <div className='p-5 sm:p-6 shadow-lg rounded-xl border-t-4 border-t-primary mt-6 bg-white'>
        <h2 className='font-bold text-xl sm:text-2xl mb-1'>Professional Experience</h2>
        <p className='text-sm text-muted-foreground mb-5'>
          Add your previous job experience details below
        </p>

        {experienceList.map((item, index) => (
          <div
            key={index}
            className='grid grid-cols-1 md:grid-cols-2 gap-5 border border-gray-200 p-4 rounded-lg mb-6'
          >
            <div className='w-full'>
              <label className='text-sm font-medium mb-1 block'>Position Title</label>
              <Input
                name='position_title'
                value={item.position_title}
                onChange={e => handleChange(index, e)}
              />
            </div>

            <div className='w-full'>
              <label className='text-sm font-medium mb-1 block'>Company Name</label>
              <Input
                name='company_name'
                value={item.company_name}
                onChange={e => handleChange(index, e)}
              />
            </div>

            <div className='w-full'>
              <label className='text-sm font-medium mb-1 block'>City</label>
              <Input
                name='city'
                value={item.city}
                onChange={e => handleChange(index, e)}
              />
            </div>

            <div className='w-full'>
              <label className='text-sm font-medium mb-1 block'>State</label>
              <Input
                name='state'
                value={item.state}
                onChange={e => handleChange(index, e)}
              />
            </div>

            <div className='w-full'>
              <label className='text-sm font-medium mb-1 block'>Start Date</label>
              <Input
                type='date'
                name='start_date'
                value={item.start_date}
                onChange={e => handleChange(index, e)}
              />
            </div>

            <div className='w-full'>
              <label className='text-sm font-medium mb-1 block'>End Date</label>
              <Input
                type='date'
                name='end_date'
                value={item.end_date}
                onChange={e => handleChange(index, e)}
              />
            </div>

            <div className='col-span-1 md:col-span-2'>
              <label className='text-sm font-medium mb-1 block'>Work Summary</label>
              <RichTextEditor
                index={index}
                defaultValue={item.work_summary}
                onRichTextEditorChange={e =>
                  handleRichTextEditor(e, 'work_summary', index)
                }
              />
            </div>
          </div>
        ))}

        <div className='flex flex-col md:flex-row gap-3 md:items-center md:justify-between mt-6'>
          {/* Button group: Add / Remove */}
          <div className='flex flex-col sm:flex-row gap-3 w-full md:w-auto'>
            <Button
              variant='outline'
              onClick={AddNewExperience}
              className='text-primary w-full sm:w-auto'
            >
              + Add More Experience
            </Button>
            <Button
              variant='outline'
              onClick={RemoveExperience}
              className='text-primary w-full sm:w-auto'
            >
              - Remove
            </Button>
          </div>

          {/* Save button */}
          <div className='w-full md:w-auto'>
            <Button
              onClick={onSave}
              disabled={loading}
              className='w-full md:w-auto'
            >
              {loading ? <LoaderCircle className='animate-spin' /> : 'Save'}
            </Button>
          </div>
        </div>
      </div>
    </div>

  );
}

export default Experience;
