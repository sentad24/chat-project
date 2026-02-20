'use client'
import style from "./navbar.module.css"
import { useEffect, useState, useRef} from "react"


export default function Navbar({currentUser}) {
    const [user, setUser] = useState(currentUser || null)
    const [open, setOpen] = useState(false)
    const [openEdit, setOpenEdit] = useState(false)
    const [editAvatar, setEditavatar] = useState([])
    const [selectedAvatar, setSelectedAvatar] = useState(null)
    const [saving, setSaving] = useState(false)

    const dropdownRef= useRef(null)

    useEffect(()=>{
        async function fetchMe() {
            const res = await fetch("/api/me")
            if(!res.ok) return
            const data = await res.json()
            setUser(data.user)     
        }
        fetchMe()
    }, [])

    useEffect(()=> {
        async function fetchAvatar(){
            const res = await fetch("/api/avatars")
            const data = await res.json()

            setEditavatar(data.avatars)
        }
        fetchAvatar()
    },[])

    useEffect(()=>{
        function handleClickOutside(e) {
            if(dropdownRef.current && !dropdownRef.current.contains(e.target)) {
                setOpen(false)
                setOpenEdit(false)
            }
        }
        document.addEventListener("mousedown", handleClickOutside)
        return ()=> document.removeEventListener("mousedown", handleClickOutside)
    }, [])
    
    async function handleSetAvatar() {
        if (!selectedAvatar) return;
        setSaving(true);
    
        const res = await fetch("/api/avatars", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ avatar_public_id: selectedAvatar }),
        });
    
        setSaving(false);
    
        if (res.ok) {
          const userRes = await fetch("/api/me");
          const data = await userRes.json();
          if (data.user) setUser(data.user);
          setOpenEdit(false);
          setOpen(false);
          setSelectedAvatar(null);
        }
      }
   
    async function handleLogout() {
        await fetch("/api/auth/logout", {
            method: "POST",
        })
        window.location.href = "/"
    }


    if(!user) return null

    return(
       <div>
        <nav> 
            <div className={style.container}>
            <div className={style.nav}>
                <div className={style.logo}>
                    Restdi
                </div>
                <div className={style.userMenu} ref={dropdownRef}>
                    <div className={style.userInfo} onClick={() => setOpen(prev => !prev)}>
                        <div className={style.avatarContainer}>
                            {user.avatar_public_id ? (
                                <img
                                    src={`https://res.cloudinary.com/dmfxx37gi/image/upload/w_64,h_64,c_fill/${user.avatar_public_id}`}
                                    alt="Avatar"
                                    width={40}
                                    height={40}
                                    style={{"borderRadius" : "50%"}}
                                />
                            ) : (
                                <span>
                                    {user.username?.charAt(0)?.toUpperCase() || "?"}
                                </span>
                            )}
                        </div>

                        <h5>{user.username}</h5>
                    </div>
                    {open && (
                        <div className={style.dropdown}>
                            <button className={style.dropdownBtns}>Profile</button>
                            <button className={style.dropdownBtns} onClick={()=> setOpenEdit(prev=>!prev)}>Edit</button>
                            <button className={style.logoutBtn} onClick={()=> handleLogout()}>Logout</button>
                        </div>
                    )}
                    {openEdit&& (
                        <div className={style.editContainer}>
                           
                            <div className={style.choeseAvatarContainer}> 
                               {editAvatar.map((id) => (
                                <img 
                                    key={id}
                                    src={`https://res.cloudinary.com/dmfxx37gi/image/upload/w_50,h_50,c_fill/${id}.png`}
                                    alt="avatar"
                                    className={style.avatars}
                                    onClick={()=> setSelectedAvatar(id)}
                                    style={{
                                        border:selectedAvatar === id ? "1px solid #6eb3d1": "none",
                                        cursor: "pointer"
                                    }}
                                    >
                                </img>
                                ))}
                            </div>
                            <div className={style.editContainerBtns}>
                                <button className={style.editContainerBtn} onClick={handleSetAvatar}>Set</button>
                                <button className={style.editContainerBtn} onClick={()=>setOpenEdit(false)}>Close</button>
                            </div>
                        </div>
                    )}
                
                </div>
              

            </div>
        </div></nav>
        
        </div>
    )
}