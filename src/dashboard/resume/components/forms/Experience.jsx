import { Button } from '../../../../components/ui/button';
import { Input } from '../../../../components/ui/input';
import React, { useContext, useEffect, useState } from 'react';
import RichTextEditor from '../RichTextEditor';
import { ResumeInfoContext } from '../../../../context/ResumeInfoContext';
import { useParams } from 'react-router-dom';
import { toast } from 'sonner';
import { LoaderCircle } from 'lucide-react';
import { supabase } from '../../../../../services/supabaseClient';

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
  const { resumeInfo, setResumeInfo } = useContext(ResumeInfoContext);
  const params = useParams();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchExperience();
  }, []);

  const fetchExperience = async () => {
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

  // 🔁 This syncs updates to the preview in real time
  useEffect(() => {
    setResumeInfo(prev => ({ ...prev, Experience: experienceList }));

    
  }, [experienceList]);

  return (
    <div>
      <div className='p-5 shadow-lg rounded-lg border-t-primary border-t-4 mt-10'>
        <h2 className='font-bold text-lg'>Professional Experience</h2>
        <p>Add your previous job experience</p>

        {experienceList.map((item, index) => (
          <div key={index} className='grid grid-cols-2 gap-3 border p-3 my-5 rounded-lg'>
            <div>
              <label className='text-xs'>Position Title</label>
              <Input
                name='position_title'
                value={item.position_title}
                onChange={e => handleChange(index, e)}
              />
            </div>
            <div>
              <label className='text-xs'>Company Name</label>
              <Input
                name='company_name'
                value={item.company_name}
                onChange={e => handleChange(index, e)}
              />
            </div>
            <div>
              <label className='text-xs'>City</label>
              <Input
                name='city'
                value={item.city}
                onChange={e => handleChange(index, e)}
              />
            </div>
            <div>
              <label className='text-xs'>State</label>
              <Input
                name='state'
                value={item.state}
                onChange={e => handleChange(index, e)}
              />
            </div>
            <div>
              <label className='text-xs'>Start Date</label>
              <Input
                type='date'
                name='start_date'
                value={item.start_date}
                onChange={e => handleChange(index, e)}
              />
            </div>
            <div>
              <label className='text-xs'>End Date</label>
              <Input
                type='date'
                name='end_date'
                value={item.end_date}
                onChange={e => handleChange(index, e)}
              />
            </div>
            <div className='col-span-2'>
              <label className='text-xs'>Summary</label>
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

        <div className='flex justify-between'>
          <div className='flex gap-2'>
            <Button variant='outline' onClick={AddNewExperience} className='text-primary'>
              + Add More Experience
            </Button>
            <Button variant='outline' onClick={RemoveExperience} className='text-primary'>
              - Remove
            </Button>
          </div>
          <Button disabled={loading} onClick={onSave}>
            {loading ? <LoaderCircle className='animate-spin' /> : 'Save'}
          </Button>
        </div>
      </div>
    </div>
  );
}

export default Experience;
