import { useState } from "react";
import { useSession, signIn, signOut } from 'next-auth/react';

import Button from "../components/Button";

const Index = () => {
  // hooks
  const { data: session, status } = useSession();
  const [loader, setLoader] = useState(false);

  // functions
  const handleSignOut = () => {
    if (!loader) {
      setLoader(!loader);
      signOut();
    }
  }

  const handleSignIn = () => {
    if (!loader) {
      setLoader(!loader);
      signIn('twitter');
    }
  }  

  // rendering
  // if loading case
  if (status === 'loading') return (<div> Loading... </div>);

  // if there is a session case
  if(session) {
    return (<>
      Signed in as {session.user.email} <br/>
      <Button label="Logout" onClick={handleSignOut} loader={loader}>
        Sign out
      </Button>
    </>)
  }
  // default case
  return (<>
    Not signed in <br/>
    <Button label="Login with Twitter" onClick={handleSignIn} loader={loader}>
      Sign in
    </Button>    
  </>)
}

export default Index;
