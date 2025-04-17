import React, { useContext } from 'react';
import { ResumeInfoContext } from '../../../context/ResumeInfoContext';
import PersonalDetailPreview from '../components/preview/PersonalDetailPreview';
import SummeryPreview from '../components/preview/SummeryPreview';
import EducationalPreview from '../components/preview/EducationalPreview';
import SkillsPreview from '../components/preview/SkillsPreview';
import ExperiencePreview from '../components/preview/ExperiencePreview';

const ResumePreview = () => {
    const { resumeInfo } = useContext(ResumeInfoContext);

   

    return (
        <div
            className='shadow-lg h-full p-14 border-t-[20px]'
            style={{
                borderColor: resumeInfo?.themeColor || '#000000',
            }}
        >
            <PersonalDetailPreview resumeInfo={resumeInfo} />
            <SummeryPreview resumeInfo={resumeInfo} />
            {resumeInfo?.Experience?.length > 0 && <ExperiencePreview resumeInfo={resumeInfo} />}
            {resumeInfo?.education?.length > 0 && <EducationalPreview resumeInfo={resumeInfo} />}
            {resumeInfo?.skills?.length > 0 && <SkillsPreview resumeInfo={resumeInfo} />}
        </div>
    );
};

export default ResumePreview;
