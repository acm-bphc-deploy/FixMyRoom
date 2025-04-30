import { useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { supabase } from "./supabaseClient"

const RedirectAfterLogin = () => {
  const navigate = useNavigate()

  useEffect(() => {
    const checkUserAndRedirect = async () => {
      const { data: { user }, error } = await supabase.auth.getUser()
      
      if (error || !user) {
        console.error("Error fetching user:", error)
        return
      }

    //warden bhai ka mail daalo idhar
      const adminEmails = [
        "f20231291@hyderabad.bits-pilani.ac.in",
       
      ]

      if (adminEmails.includes(user.email)) {
        navigate("/AdminDashboard")
      } else {
        navigate("/MaintenancePortal")
      }
    }

    checkUserAndRedirect()
  }, [navigate])

  return null
}

export default RedirectAfterLogin
