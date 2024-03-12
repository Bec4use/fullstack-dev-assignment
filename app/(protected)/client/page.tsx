"use client";

import { UserInfo } from "@/components/user-info";
import { useCurrentUser } from "@/hook/use-current-user";


const ClientPage = () => {
    const user = useCurrentUser();
    
    return ( 
        <div>
            <UserInfo 
            label={"📟 Client components"} 
            user={user}
            />
        </div>
     );
}
 
export default ClientPage;