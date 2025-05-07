import './App.css'
import Header from './components/Header'
import PokemonPoll from './components/PokemonPoll'

function App() {

  return (
    <>
      <Header />
      <div className="content-wrapper">
        <PokemonPoll />
      </div>
    </>
  )
}

export default App
