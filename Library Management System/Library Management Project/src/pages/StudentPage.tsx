import StudentList from "@/components/StudentList"
import { Outlet } from "react-router-dom"

const StudentPage = () => {
  return (
    <div>
      <StudentList />

      <Outlet />
    </div>
  )
}

export default StudentPage
