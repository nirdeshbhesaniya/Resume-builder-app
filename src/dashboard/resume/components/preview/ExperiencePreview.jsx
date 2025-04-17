import React from 'react';

function ExperiencePreview({ resumeInfo }) {
  if (!resumeInfo?.Experience || resumeInfo.Experience.length === 0) return null;
  

  return (
    <div className='my-6'>
      <h2
        className='text-center font-bold text-sm mb-2'
        style={{ color: resumeInfo?.themeColor }}
      >
        Professional Experience
      </h2>
      <hr style={{ borderColor: resumeInfo?.themeColor }} />

      {resumeInfo.Experience.map((experience, index) => (
        <div key={index} className='my-5'>
          <h2
            className='text-sm font-bold'
            style={{ color: resumeInfo?.themeColor }}
          >
            {experience.position_title}
          </h2>
          <h2 className='text-xs flex justify-between'>
            <span>
              {experience.company_name}, {experience.city}, {experience.state}
            </span>
            <span>
              {experience.start_date} to {experience.end_date || 'Present'}
            </span>
          </h2>
          <div
            className='text-xs my-2'
            dangerouslySetInnerHTML={{ __html: experience.work_summary }}
          />
        </div>
      ))}
    </div>
  );
}

export default ExperiencePreview;
