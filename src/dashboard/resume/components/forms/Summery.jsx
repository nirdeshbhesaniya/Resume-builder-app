import { Button } from '../../../../components/ui/button'
import { Textarea } from '../../../../components/ui/textarea'
import { ResumeInfoContext } from '../../../../context/ResumeInfoContext'
import React, { useContext, useEffect, useState } from 'react'
import { useParams } from 'react-router-dom';
import { useSupabaseWithClerk } from '../../../../../services/supabaseClient';
import { Brain, LoaderCircle } from 'lucide-react';
import { toast } from 'sonner';
import { AIChatSession } from '../../../../../services/AIModal';

const prompt = `Job Title: {jobTitle}, Based on job title give me a list of summaries for 3 experience levels: Experienced, Mid Level, and Fresher. Each in 3-4 lines in array format, with "summary" and "experience_level" fields in JSON format`;

function Summery({ enabledNext }) {
  const { resumeInfo, setResumeInfo } = useContext(ResumeInfoContext);
  const [summery, setSummery] = useState('');
  const [loading, setLoading] = useState(false);
  const params = useParams();
  const [aiGeneratedSummeryList, setAiGeneratedSummeryList] = useState([]);
  const { getSupabaseClient } = useSupabaseWithClerk()
  useEffect(() => {
    if (summery) {
      setResumeInfo({
        ...resumeInfo,
        summery: summery
      });
    }
  }, [summery]);

  const GenerateSummeryFromAI = async () => {
    try {
      setLoading(true);
      const PROMPT = prompt.replace('{jobTitle}', resumeInfo?.job_title || "Developer");
      const result = await AIChatSession.sendMessage(PROMPT);
      const text = await result.response.text();

      // Extract JSON part using regex
      const match = text.match(/\[.*\]/s);
      if (!match) throw new Error("AI response does not contain valid JSON");

      const json = JSON.parse(match[0]);
      setAiGeneratedSummeryList(json);
    } catch (err) {
      toast.error("Failed to generate AI summary");
      console.error("AI Error:", err);
    } finally {
      setLoading(false);
    }
  };

  const onSave = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const supabase = await getSupabaseClient()
      const { error } = await supabase
        .from('resume')
        .update({ summery }) // or 'summary' if your column is named that
        .eq('resumeId', params?.resumeId);

      if (error) throw error;

      enabledNext(true);
      toast("Summary updated");
    } catch (err) {
      console.error("Save error:", err);
      toast.error("Failed to save summary");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className='p-5 shadow-lg rounded-lg border-t-primary border-t-4 mt-10'>
        <h2 className='font-bold text-lg'>Summary</h2>
        <p>Add Summary for your job title</p>

        <form className='mt-7' onSubmit={onSave}>
          <div className='flex justify-between items-end'>
            <label>Add Summary</label>
            <Button variant="outline" onClick={GenerateSummeryFromAI}
              type="button" size="sm" className="border-primary text-primary flex gap-2">
              <Brain className='h-4 w-4' /> Generate from AI
            </Button>
          </div>

          <Textarea className="mt-5" required
            value={summery || resumeInfo?.summery || ''}
            onChange={(e) => setSummery(e.target.value)}
          />

          <div className='mt-2 flex justify-end'>
            <Button type="submit" disabled={loading}>
              {loading ? <LoaderCircle className='animate-spin' /> : 'Save'}
            </Button>
          </div>
        </form>
      </div>

      {aiGeneratedSummeryList?.length > 0 && (
        <div className='my-5'>
          <h2 className='font-bold text-lg'>Suggestions</h2>
          {aiGeneratedSummeryList.map((item, index) => (
            <div key={index}
              onClick={() => setSummery(item?.summary)}
              className='p-5 shadow-lg my-4 rounded-lg cursor-pointer'>
              <h2 className='font-bold my-1 text-primary'>Level: {item?.experience_level}</h2>
              <p>{item?.summary}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Summery;
