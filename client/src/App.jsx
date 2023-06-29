import './App.css'
import DevicesTable from './components/DevicesTable'
import GatewaysTable from './components/GatewaysTable'

function App() {

  return (
    <div className="App">
      <header className="mainHeader">
        <h1>Gateways and Devices Managment</h1>
        <h2><span>by</span> Ramón Ochoa</h2>
      </header>
      <main>
        <GatewaysTable />
        <DevicesTable />
      </main>
    </div>
  )
}

export default App
