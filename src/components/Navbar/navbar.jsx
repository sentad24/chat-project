'use client'
import style from "./navbar.module.css"

export default function Navbar() {
    return(
       <div>
        <nav> 
            <div className={style.container}>
            <div className={style.nav}>
                <div className={style.logo}>
                    Restdi
                </div>
                <div className={style.userInfo}>
                    <h5>{user.username}</h5>
                </div>

            </div>
        </div></nav>
        
        </div>
    )
}