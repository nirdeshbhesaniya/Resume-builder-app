import React, { useEffect, useState } from 'react';
import FormSection from '../../components/FormSection';
import ResumePreview from '../../components/ResumePreview';
import { ResumeInfoContext } from '../../../../context/ResumeInfoContext';
import { useParams } from 'react-router-dom';
import { useSupabaseWithClerk } from '../../../../../services/supabaseClient';

const EditResume = () => {
  const { resumeId } = useParams();
  const [resumeInfo, setResumeInfo] = useState(null);
  const { getSupabaseClient } = useSupabaseWithClerk();

  useEffect(() => {
    const fetchResumeData = async () => {
      const supabase = await getSupabaseClient(); // ✅ FIX: await here

      // Fetch themeColor from resume table
      const { data: resumeData, error: resumeError } = await supabase
        .from('resume')
        .select('*')
        .eq('resumeId', resumeId)
        .single();

      if (resumeError) {
        console.error('Resume fetch error:', resumeError);
        return;
      }

      // Fetch personal details from personaldetail table
      const { data: personalData, error: personalError } = await supabase
        .from('personaldetail')
        .select('*')
        .eq('resume_id', resumeId)
        .single();

      if (personalError) {
        console.error('Personal detail fetch error:', personalError);
        return;
      }

      // Combine both into one resumeInfo object
      const combinedInfo = {
        ...personalData,
        ...resumeData,
      };

      setResumeInfo(combinedInfo);
    };

    fetchResumeData();
  }, [resumeId]);

  return (
    <ResumeInfoContext.Provider value={{ resumeInfo, setResumeInfo }}>
      <div className="grid grid-cols-1 md:grid-cols-2 p-10 gap-10">
        <FormSection />
        <ResumePreview />
      </div>
    </ResumeInfoContext.Provider>
  );
};

export default EditResume;
