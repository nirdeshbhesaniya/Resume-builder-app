import React from 'react';

function SkillsPreview({ resumeInfo }) {
  const themeColor = resumeInfo?.themeColor || '#4f46e5'; // default to Indigo-600

  return (
    <div className="my-6">
      <h2
        className="text-center font-bold text-sm mb-2 uppercase tracking-wider"
        style={{ color: themeColor }}
      >
        Skills
      </h2>
      <hr
        className="mb-4"
        style={{ borderColor: themeColor }}
      />

<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
  {resumeInfo?.skills?.map((skill, index) => (
    <div key={index} className="space-y-1">
      <div className="flex justify-between text-xs font-medium print:text-xs">
        <span>{skill.name}</span>
        <span>{`${skill?.rating * 20}%`}</span>
      </div>
      <div className="flex space-x-1">
        {/* Render stars based on rating */}
        {[...Array(5)].map((_, starIndex) => (
          <svg
            key={starIndex}
            xmlns="http://www.w3.org/2000/svg"
            fill={starIndex < skill?.rating ? themeColor : "gray"}
            viewBox="0 0 24 24"
            width="16"
            height="16"
          >
            <path d="M12 17.3l6.3 4.2-4.8-7.4L22 9.3l-7.5-.6L12 2 9.5 8.7 2 9.3l4.5 4.8-4.8 7.4L12 17.3z" />
          </svg>
        ))}
      </div>
    </div>
  ))}
</div>

    </div>
  );
}

export default SkillsPreview;
