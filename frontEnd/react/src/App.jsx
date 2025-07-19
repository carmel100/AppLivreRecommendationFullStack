
import { BrowserRouter } from "react-router-dom"
import Routes1 from "./routes/Routes1"
import TokenHandler from "./librairies/TokenHandler"

function App() {

 
  return (
    <>
    <BrowserRouter>
        <TokenHandler />
        <Routes1 />     
    </BrowserRouter>
    </>
  )
}

export default App
