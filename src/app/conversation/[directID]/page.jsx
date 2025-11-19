'use client'
import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import Style from "../conversation.module.css"

export default function DirectId(){
    const params = useParams()
    const {directID} = params


    const [activeTab,setActiveTab] = useState("friends")
    const [searchQuery, setSearchQuery] = useState("")
    const [findUsers,setFindeUsers] = useState([])
    
    useEffect(()=>{
        async function loadUsers() {
            const res = await fetch("/api/users")
            const data = await res.json() 
            setFindeUsers(data)
        }
        loadUsers()
    }, [])

    const myFriends = ["John", "Pett"]
    const addFriends = ["Anna", "Lisa"]

    const filterList = (list) => 
        list.filter(user => 
            user?.username?.toLowerCase().includes(searchQuery.toLowerCase())
    );
    

 return(
    <div>
        <section className={Style.directSection}>
            <div className={Style.searchFriendsSection}>
                <div className={Style.inputBarContainer}>
                    <input className={Style.inputBar}  
                        type="text" 
                        placeholder="Search..." 
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
            </div>
            <div className={Style.friendTabsBtns}>
                <button onClick={()=> setActiveTab("friends")}>My Friends</button>
                <button onClick={()=> setActiveTab("addFriends")}>Add Frindes</button>
            </div>
            <main className={Style.dispalyUsers}>
                {activeTab === "friends" && (
                    <div>
                        <h2>Friends</h2>
                        {filterList(myFriends).map((friend)=>(
                            <li key={friend}>{friend}</li>
                        ))}

                    </div>
                )}
                {activeTab === "addFriends" && (
                    <div>
                        <h2> Add friends</h2>
                        {filterList(findUsers).map((u,index)=> (
                            <li key={u.id ?? index} >{u.username}</li>
                        ))}
                    </div>
                )}

            </main>
        </section>

    </div>
    
 )
}