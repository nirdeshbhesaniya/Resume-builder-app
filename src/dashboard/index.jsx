import React, { useEffect, useState } from 'react'
import AddResume from './components/AddResume'
import { useUser } from '@clerk/clerk-react'
import ResumeCardItem from './components/ResumeCardItem'
import { supabase } from '../../services/supabaseClient'
import { Loader2Icon } from 'lucide-react'

function Dashboard() {
  const { user } = useUser()
  const [resumeList, setResumeList] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (user) {
      getResumesList()
    }
  }, [user])

  /**
   * Get resumes list for the current user
   */
  const getResumesList = async () => {
    setLoading(true)

    const { data, error } = await supabase
      .from('resume') // Make sure this matches your table name
      .select('*')
      .eq('userEmail', user?.primaryEmailAddress?.emailAddress)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching resumes:', error.message)
    } else {
      setResumeList(data)
    }

    setLoading(false)
  }

  return (
    <div className='p-10 md:px-20 lg:px-32'>
      <h2 className='font-bold text-3xl'>My Resume</h2>
      <p>Start creating AI resumes for your next job role</p>

      <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-5 mt-10'>
        <AddResume refreshData={getResumesList} />
        {loading ? (
          [1, 2, 3, 4].map((item, index) => (
            <div key={index} className='h-[280px] rounded-lg bg-slate-200 animate-pulse'></div>
          ))
        ) : resumeList.length > 0 ? (
          resumeList.map((resume, index) => (
            <ResumeCardItem key={index} resume={resume} refreshData={getResumesList} />
          ))
        ) : (
          <p className="col-span-full text-gray-500 text-sm">No resumes found. Click the "+" to create one.</p>
        )}
      </div>
    </div>
  )
}

export default Dashboard
