import Header from '../../../components/custom/Header';
import { Button } from '../../../components/ui/button';
import { ResumeInfoContext } from '../../../context/ResumeInfoContext';
import ResumePreview from '../../../dashboard/resume/components/ResumePreview';
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { supabase } from '../../../../services/supabaseClient';
import { RWebShare } from 'react-web-share';

function ViewResume() {
  const [resumeInfo, setResumeInfo] = useState(null);
  const { resumeId } = useParams();

  useEffect(() => {
    fetchResumeInfo();
  }, []);

  const fetchResumeInfo = async () => {
    try {
      // 1. Fetch main resume info
      const { data: resumeData, error: resumeError } = await supabase
        .from('resume')
        .select('*')
        .eq('resumeId', resumeId)
        .single();
  
      if (resumeError) {
        console.error('Resume fetch error:', resumeError);
        return;
      }
      // 1.1 Fetch PersonalDetail

      const { data: personalData } = await supabase
        .from('personaldetail')
        .select('*')
        .eq('resume_id', resumeId)
        .single();
      
      // 2. Fetch education
      const { data: educationData } = await supabase
        .from('education')
        .select('*')
        .eq('resume_id', resumeId);
  
      // 3. Fetch experience
      const { data: experienceData } = await supabase
        .from('experience')
        .select('*')
        .eq('resume_id', resumeId);
  
      // 4. Fetch skills
      const { data: skillsData } = await supabase
        .from('skills')
        .select('*')
        .eq('resume_id', resumeId);
  
      // 5. Combine into one object
      const fullResume = {
        ...resumeData,
        ...personalData,
        education: educationData || [],
        Experience: experienceData || [],
        skills: skillsData || [],
      };
  
      setResumeInfo(fullResume);
    } catch (err) {
      console.error('Unexpected error:', err);
    }
  };
  

  const HandleDownload = () => {
    window.print();
  };

  return (
    <ResumeInfoContext.Provider value={{ resumeInfo, setResumeInfo }}>
      <div id="no-print">
        <Header />

        <div className="my-10 mx-10 md:mx-20 lg:mx-36">
          <h2 className="text-center text-2xl font-medium">
            Congrats! Your Ultimate AI-generated Resume is ready!
          </h2>
          <p className="text-center text-gray-400">
            Now you can download your resume or share the unique resume URL with friends and family.
          </p>
          <div className="flex justify-between px-44 my-10">
            <Button onClick={HandleDownload}>Download</Button>

            <RWebShare
              data={{
                text: 'Hello Everyone, This is my resume. Please open the URL to see it.',
                url: `${import.meta.env.VITE_BASE_URL}/my-resume/${resumeId}/view`,
                title: `${resumeInfo?.first_name || ''} ${resumeInfo?.last_name || ''} resume`,
              }}
              onClick={() => console.log('Shared successfully!')}
            >
              <Button>Share</Button>
            </RWebShare>
          </div>
        </div>
      </div>

      <div className="my-10 mx-10 md:mx-20 lg:mx-36">
        <div id="print-area">
          <ResumePreview />
        </div>
      </div>
    </ResumeInfoContext.Provider>
  );
}

export default ViewResume;
