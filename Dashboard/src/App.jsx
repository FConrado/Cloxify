import Header from "./Components/Header"
import Corpo from "./Components/Corpo"
import { getUser } from "./services/timeService"  
import { useEffect, useState } from "react";

function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      const userData = await getUser();
      setUser(userData);
    };

    fetchUser();
  }, []);

  return (
    <div>
      <Header user={user?.name}></Header>
      <Corpo></Corpo>
    </div>
  )
}

export default App