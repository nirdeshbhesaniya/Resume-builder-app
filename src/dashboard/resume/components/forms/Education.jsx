import { Button } from '../../../../components/ui/button'
import { Input } from '../../../../components/ui/input'
import { Textarea } from '../../../../components/ui/textarea'
import { ResumeInfoContext } from '../../../../context/ResumeInfoContext'
import { LoaderCircle } from 'lucide-react'
import React, { useContext, useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { toast } from 'sonner'
import { supabase } from '../../../../../services/supabaseClient'

function Education() {
  const [loading, setLoading] = useState(false)
  const { resumeInfo, setResumeInfo } = useContext(ResumeInfoContext)
  const params = useParams()
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
    setEducationalList(educationalList.slice(0, -1))
  }

  const onSave = async () => {
    setLoading(true)
    try {
      // Delete existing entries for the resume
      await supabase.from('education').delete().eq('resume_id', params.resumeId)

      // Insert new ones
      const toInsert = educationalList.map((item) => ({
        ...item,
        resume_id: params.resumeId
      }))
      const { error } = await supabase.from('education').insert(toInsert)

      if (error) throw error

      toast.success('Details updated!')
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
    <div className='p-5 shadow-lg rounded-lg border-t-primary border-t-4 mt-10'>
      <h2 className='font-bold text-lg'>Education</h2>
      <p>Add Your educational details</p>

      <div>
        {educationalList.map((item, index) => (
          <div key={index} className='grid grid-cols-2 gap-3 border p-3 my-5 rounded-lg'>
            <div className='col-span-2'>
              <label>University Name</label>
              <Input
                name='university_name'
                onChange={(e) => handleChange(e, index)}
                value={item.university_name}
              />
            </div>
            <div>
              <label>Degree</label>
              <Input
                name='degree'
                onChange={(e) => handleChange(e, index)}
                value={item.degree}
              />
            </div>
            <div>
              <label>Major</label>
              <Input
                name='major'
                onChange={(e) => handleChange(e, index)}
                value={item.major}
              />
            </div>
            <div>
              <label>Start Date</label>
              <Input
                type='date'
                name='start_date'
                onChange={(e) => handleChange(e, index)}
                value={item.start_date}
              />
            </div>
            <div>
              <label>End Date</label>
              <Input
                type='date'
                name='end_date'
                onChange={(e) => handleChange(e, index)}
                value={item.end_date}
              />
            </div>
            <div className='col-span-2'>
              <label>Description</label>
              <Textarea
                name='description'
                onChange={(e) => handleChange(e, index)}
                value={item.description}
              />
            </div>
          </div>
        ))}
      </div>

      <div className='flex justify-between'>
        <div className='flex gap-2'>
          <Button variant='outline' onClick={AddNewEducation} className='text-primary'>
            + Add More Education
          </Button>
          <Button variant='outline' onClick={RemoveEducation} className='text-primary'>
            - Remove
          </Button>
        </div>
        <Button disabled={loading} onClick={onSave}>
          {loading ? <LoaderCircle className='animate-spin' /> : 'Save'}
        </Button>
      </div>
    </div>
  )
}

export default Education
