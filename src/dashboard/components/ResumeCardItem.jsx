import { Loader2Icon, MoreVertical } from 'lucide-react'
import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
} from "@/components/ui/alert-dialog"
import { useSupabaseWithClerk } from "../../../services/supabaseClient"
import { toast } from 'sonner'

function ResumeCardItem({ resume, refreshData }) {
  const navigation = useNavigate()
  const [openAlert, setOpenAlert] = useState(false)
  const [loading, setLoading] = useState(false)
  const { getSupabaseClient } = useSupabaseWithClerk()

  const onDelete = async () => {
    setLoading(true)
    const supabase = await getSupabaseClient()

    try {
      // 1. Delete related tables first
      const relatedTables = ['experience', 'education', 'skills', 'personaldetail']

      for (const table of relatedTables) {
        const { error } = await supabase
          .from(table)
          .delete()
          .eq('resume_id', resume.resumeId)

        if (error) {
          console.error(`Error deleting from ${table}:`, error)
          throw new Error(`Failed to delete ${table}`)
        }
      }

      // 2. Now delete the resume
      const { error: resumeError } = await supabase
        .from('resume')
        .delete()
        .match({ resumeId: resume.resumeId })

      if (resumeError) {
        console.error('Error deleting resume:', resumeError)
        toast.error('Failed to delete resume!')
      } else {
        toast.success('Resume deleted successfully!')
        refreshData()
      }

    } catch (err) {
      console.error('Deletion error:', err)
      toast.error('Resume deletion failed. Check logs.')
    }

    setLoading(false)
    setOpenAlert(false)
  }

  return (
    <div className="">
      <Link to={'/dashboard/resume/' + resume.resumeId + "/edit"}>
        <div className="p-14 bg-gradient-to-b from-pink-100 via-purple-200 to-blue-200 h-[280px] rounded-t-lg border-t-4"
          style={{ borderColor: resume?.themeColor }}>
          <div className="flex items-center justify-center h-[180px]">
            <img src="/cv.png" width={80} height={80} />
          </div>
        </div>
      </Link>

      <div className="border p-3 flex justify-between text-white rounded-b-lg shadow-lg"
        style={{ background: resume?.themeColor }}>
        <h2 className="text-sm text-gray-900 font-bold">{resume.title}</h2>
        <DropdownMenu>
          <DropdownMenuTrigger>
            <MoreVertical className="h-4 w-4 cursor-pointer text-gray-900" />
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem onClick={() => navigation('/dashboard/resume/' + resume.resumeId + "/edit")}>Edit</DropdownMenuItem>
            <DropdownMenuItem onClick={() => navigation('/my-resume/' + resume.resumeId + "/view")}>View</DropdownMenuItem>
            <DropdownMenuItem onClick={() => navigation('/my-resume/' + resume.resumeId + "/view")}>Download</DropdownMenuItem>
            <DropdownMenuItem onClick={() => setOpenAlert(true)}>Delete</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <AlertDialog open={openAlert}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently delete your resume
                and remove your data from our servers.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel onClick={() => setOpenAlert(false)}>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={onDelete} disabled={loading}>
                {loading ? <Loader2Icon className="animate-spin" /> : 'Delete'}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  )
}

export default ResumeCardItem
