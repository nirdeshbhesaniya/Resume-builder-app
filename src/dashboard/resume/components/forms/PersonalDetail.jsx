import { Button } from '../../../../components/ui/button';
import { Input } from '../../../../components/ui/input';
import { ResumeInfoContext } from '../../../../context/ResumeInfoContext';
import { LoaderCircle } from 'lucide-react';
import React, { useContext, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { toast } from 'sonner';
import { supabase } from '../../../../../services/supabaseClient'; // adjust path if needed

function PersonalDetail({ enabledNext }) {
    const params = useParams();
    
    const { resumeInfo, setResumeInfo } = useContext(ResumeInfoContext);
    console.log("Resume Info Context:", resumeInfo);
    
    const [formData, setFormData] = useState({});
    const [loading, setLoading] = useState(false);

    // Load existing data from Supabase
    useEffect(() => {
        const fetchPersonalDetail = async () => {
          if (resumeInfo?.firstName) {
            // If already loaded in context, use that
            setFormData({
              firstName: resumeInfo.firstName,
              lastName: resumeInfo.lastName,
              jobTitle: resumeInfo.jobTitle,
              address: resumeInfo.address,
              phone: resumeInfo.phone,
              email: resumeInfo.email,
            });
            enabledNext(true);
            return;
          }
      
          const { data, error } = await supabase
            .from('personaldetail')
            .select('*')
            .eq('resume_id', params.resumeId)
            .maybeSingle();
      
          if (error) {
            console.error("Personal detail fetch error:", error);
            toast.error('Error fetching personal detail');
            return;
          }
      
          if (data) {
            const mappedData = {
              firstName: data.first_name,
              lastName: data.last_name,
              jobTitle: data.job_title,
              address: data.address,
              phone: data.phone,
              email: data.email,
            };
            setFormData(mappedData);
            setResumeInfo({ ...resumeInfo, ...mappedData });
            enabledNext(true);
          }
        };
      
        fetchPersonalDetail();
      }, []);
      

    const handleInputChange = (e) => {
        enabledNext(false);
        const { name, value } = e.target;

        const updated = { ...formData, [name]: value };
        setFormData(updated);
        setResumeInfo({ ...resumeInfo, [name]: value });
    };

    const onSave = async (e) => {
        e.preventDefault();
        setLoading(true);

        const dataToSave = {
            resume_id: params.resumeId,
            first_name: formData?.firstName,
            last_name: formData?.lastName,
            job_title: formData?.jobTitle,
            address: formData?.address,
            phone: formData?.phone,
            email: formData?.email,
        };

        const { error } = await supabase
            .from('personaldetail')
            .upsert(dataToSave, { onConflict: ['resume_id'] });

        if (error) {
            console.error('Save error:', error);
            toast.error('Failed to save details');
        } else {
            toast.success('Details updated');
            enabledNext(true);
        }

        setLoading(false);
    };

    return (
        <div className="p-5 shadow-lg rounded-lg border-t-primary border-t-4 mt-10">
            <h2 className="font-bold text-lg">Personal Detail</h2>
            <p>Get Started with the basic information</p>

            <form onSubmit={onSave}>
                <div className="grid grid-cols-2 mt-5 gap-3">
                    <div>
                        <label className="text-sm">First Name</label>
                        <Input name="firstName" required value={formData.firstName || ''} onChange={handleInputChange} />
                    </div>
                    <div>
                        <label className="text-sm">Last Name</label>
                        <Input name="lastName" required value={formData.lastName || ''} onChange={handleInputChange} />
                    </div>
                    <div className="col-span-2">
                        <label className="text-sm">Job Title</label>
                        <Input name="jobTitle" required value={formData.jobTitle || ''} onChange={handleInputChange} />
                    </div>
                    <div className="col-span-2">
                        <label className="text-sm">Address</label>
                        <Input name="address" required value={formData.address || ''} onChange={handleInputChange} />
                    </div>
                    <div>
                        <label className="text-sm">Phone</label>
                        <Input name="phone" required value={formData.phone || ''} onChange={handleInputChange} />
                    </div>
                    <div>
                        <label className="text-sm">Email</label>
                        <Input name="email" required value={formData.email || ''} onChange={handleInputChange} />
                    </div>
                </div>
                <div className="mt-3 flex justify-end">
                    <Button type="submit" disabled={loading}>
                        {loading ? <LoaderCircle className="animate-spin" /> : 'Save'}
                    </Button>
                </div>
            </form>
        </div>
    );
}

export default PersonalDetail;
