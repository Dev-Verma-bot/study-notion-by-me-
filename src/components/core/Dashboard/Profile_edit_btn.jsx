import React from "react";

const Profile_edit_btn= ({children,Onclick})=>{
    return(
       <button onClick={Onclick}>
        {children}
       </button>
    );
}
export default Profile_edit_btn;