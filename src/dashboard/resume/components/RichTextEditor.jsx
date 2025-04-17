import { Button } from '../../../components/ui/button';
import { ResumeInfoContext } from '../../../context/ResumeInfoContext';
import { Brain, LoaderCircle } from 'lucide-react';
import React, { useContext, useState, useEffect } from 'react';
import {
  BtnBold,
  BtnBulletList,
  BtnItalic,
  BtnLink,
  BtnNumberedList,
  BtnStrikeThrough,
  BtnUnderline,
  Editor,
  EditorProvider,
  Separator,
  Toolbar
} from 'react-simple-wysiwyg';
import { AIChatSession } from '../../../../services/AIModal';
import { toast } from 'sonner';

const PROMPT = 'Position title: {positionTitle}. Based on this position title, give me 5-7 bullet points for resume experience (No experience level, no JSON array). Return in HTML using <ul><li>...</li></ul> format.';

function RichTextEditor({ onRichTextEditorChange, index, defaultValue }) {
  const [value, setValue] = useState(defaultValue || '');
  const { resumeInfo } = useContext(ResumeInfoContext);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setValue(defaultValue || '');
  }, [defaultValue]);

  const GenerateSummeryFromAI = async () => {
    const title = resumeInfo?.Experience?.[index]?.position_title;
    if (!title) {
      toast.error('Please Add Position Title');
      return;
    }
  
    setLoading(true);
    try {
      const prompt = PROMPT.replace('{positionTitle}', title);
      const result = await AIChatSession.sendMessage(prompt);
      const rawText = await result.response.text();
  
      let bulletPointsHTML = '';
  
      try {
        const parsed = JSON.parse(rawText);
        if (Array.isArray(parsed.bulletPoints)) {
          // ✅ Style added to ensure dot bullets are shown
          bulletPointsHTML = `<ul style="list-style-type: disc; padding-left: 20px;">${parsed.bulletPoints.map(item => `<li>${item}</li>`).join('')}</ul>`;
        } else {
          throw new Error('bulletPoints is not an array');
        }
      } catch {
        const lines = rawText.split('\n').filter(line => line.trim() !== '');
        bulletPointsHTML = `<ul style="list-style-type: disc; padding-left: 20px;">${lines.map(line => `<li>${line.replace(/^[\-\*]\s*/, '')}</li>`).join('')}</ul>`;
      }
  
      setValue(bulletPointsHTML);
      onRichTextEditorChange({ target: { value: bulletPointsHTML } });
      toast.success('AI generated summary successfully!');
    } catch (error) {
      console.error('Error processing AI response:', error);
      toast.error('AI failed to generate a valid summary.');
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div>
      <div className="flex justify-between items-center mb-2">
        <label className="text-xs font-medium">Summary</label>
        <Button
          variant="outline"
          size="sm"
          onClick={GenerateSummeryFromAI}
          disabled={loading}
          className="flex items-center gap-2 border-primary text-primary"
        >
          {loading ? (
            <LoaderCircle className="animate-spin h-4 w-4" />
          ) : (
            <>
              <Brain className="h-4 w-4" />
              Generate from AI
            </>
          )}
        </Button>
      </div>

      {/* WYSIWYG Editor */}
      <EditorProvider>
        <Editor
          value={value}
          onChange={(e) => {
            setValue(e.target.value);
            onRichTextEditorChange(e);
          }}
        >
          {/* 🟢 Toolbar must be inside Editor */}
          <Toolbar>
            <BtnBold />
            <BtnItalic />
            <BtnUnderline />
            <BtnStrikeThrough />
            <Separator />
            <BtnNumberedList />
            <BtnBulletList />
            <Separator />
            <BtnLink /> 
          </Toolbar>
        </Editor>
      </EditorProvider>

    </div>
  );
}

export default RichTextEditor;
