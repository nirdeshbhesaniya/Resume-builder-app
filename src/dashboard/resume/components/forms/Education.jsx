import { Button } from '../../../../components/ui/button'
import { Input } from '../../../../components/ui/input'
import { Textarea } from '../../../../components/ui/textarea'
import { ResumeInfoContext } from '../../../../context/ResumeInfoContext'
import { LoaderCircle } from 'lucide-react'
import React, { useContext, useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { toast } from 'sonner'
import { useSupabaseWithClerk } from '../../../../../services/supabaseClient'

function Education() {
  const [loading, setLoading] = useState(false)
  const { resumeInfo, setResumeInfo } = useContext(ResumeInfoContext)
  const params = useParams()
  const { getSupabaseClient } = useSupabaseWithClerk()
  const [educationalList, setEducationalList] = useState([
    {
      university_name: '',
      degree: '',
      major: '',
      start_date: '',
      end_date: '',
      description: ''
    }
  ])

  useEffect(() => {
    fetchEducation()
  }, [])

  const fetchEducation = async () => {
    const supabase = await getSupabaseClient()
    const { data, error } = await supabase
      .from('education')
      .select('*')
      .eq('resume_id', params.resumeId)

    if (error) {
      console.error(error)
      toast.error('Failed to fetch education details')
    } else {
      setEducationalList(data.length > 0 ? data : educationalList)
    }
  }

  const handleChange = (event, index) => {
    const { name, value } = event.target
    const updated = [...educationalList]
    updated[index][name] = value
    setEducationalList(updated)
  }

  const AddNewEducation = () => {
    setEducationalList([
      ...educationalList,
      {
        university_name: '',
        degree: '',
        major: '',
        start_date: '',
        end_date: '',
        description: ''
      }
    ])
  }

  const RemoveEducation = () => {
    if (educationalList.length > 1) {
      setEducationalList(educationalList.slice(0, -1))
    }
  }

  const onSave = async () => {
    setLoading(true)
    const supabase = await getSupabaseClient()
    try {
      // Clear old records
      await supabase.from('education').delete().eq('resume_id', params.resumeId)

      const toInsert = educationalList.map((item) => ({
        ...item,
        resume_id: params.resumeId
      }))

      const { error } = await supabase.from('education').insert(toInsert)

      if (error) throw error

      toast.success('Education details updated!')
    } catch (error) {
      console.error(error)
      toast.error('Server error. Please try again!')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    setResumeInfo({
      ...resumeInfo,
      education: educationalList
    })
  }, [educationalList])

  return (
    <div className="p-4 sm:p-5 shadow-lg rounded-lg border-t-primary border-t-4 mt-10">
      <h2 className="font-bold text-lg">Education</h2>
      <p className="text-sm text-muted-foreground mb-4">Add your educational details</p>

      <div className="space-y-5">
        {educationalList.map((item, index) => (
          <div
            key={index}
            className="grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-4 border p-4 rounded-lg"
          >
            <div className="col-span-1 sm:col-span-2">
              <label className="text-sm font-medium">University Name</label>
              <Input
                name="university_name"
                onChange={(e) => handleChange(e, index)}
                value={item.university_name}
              />
            </div>

            <div>
              <label className="text-sm font-medium">Degree</label>
              <Input
                name="degree"
                onChange={(e) => handleChange(e, index)}
                value={item.degree}
              />
            </div>

            <div>
              <label className="text-sm font-medium">Major</label>
              <Input
                name="major"
                onChange={(e) => handleChange(e, index)}
                value={item.major}
              />
            </div>

            <div>
              <label className="text-sm font-medium">Start Date</label>
              <Input
                type="date"
                name="start_date"
                onChange={(e) => handleChange(e, index)}
                value={item.start_date}
              />
            </div>

            <div>
              <label className="text-sm font-medium">End Date</label>
              <Input
                type="date"
                name="end_date"
                onChange={(e) => handleChange(e, index)}
                value={item.end_date}
              />
            </div>

            <div className="col-span-1 sm:col-span-2">
              <label className="text-sm font-medium">Description</label>
              <Textarea
                name="description"
                onChange={(e) => handleChange(e, index)}
                value={item.description}
              />
            </div>
          </div>
        ))}
      </div>

      <div className="flex flex-col sm:flex-row justify-between gap-3 mt-6">
        <div className="flex gap-2 flex-col sm:flex-row">
          <Button variant="outline" onClick={AddNewEducation} className="text-primary">
            + Add More Education
          </Button>
          <Button
            variant="outline"
            onClick={RemoveEducation}
            className="text-primary"
            disabled={educationalList.length === 1}
          >
            - Remove
          </Button>
        </div>
        <Button disabled={loading} onClick={onSave}>
          {loading ? <LoaderCircle className="animate-spin" /> : 'Save'}
        </Button>
      </div>
    </div>
  )
}

export default Education
